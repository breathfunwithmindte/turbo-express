/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @MikeKarypidis
 * @project - TurboServer
 * @name TurboServer
 * @license - MIT
 * @copyright - ©2022 PerfectEvolution Corporation;
 * @author - Mike Karypidis
 * @version - 1.0.0
 * @link - https://turboserverjs.org
 * @github - https://github.com/breathfunwithmindte/turbo-server.git
 * 
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 */

/**
 * @typedef {Object} BasicAuth
 * @property {String} user
 * @property {String} pass
 *
 * @typedef {http.IncomingMessage} incme
 */

const http = require("http");
const FileType = require("./FileType");
const Route = require("./Route");
const ValidationSchema = require("./ValidationSchema");


/** @interface */
module.exports = class RequestInterface 
{
  /** @type {http.IncomingMessage}                    */ IncomingMessage;
  /** @type {Route}                                   */ current;
  /** @type {import("../TurboServer")}                */ instance;
  /** @type {Map<String, import("mongoose").Model>}   */ models;

  /**
   *  @type {Map<String, *>}
   *  @doc protected variable
   *  usually it will be Map<String, String>
   *  but also can be <String, Number> or <String, Boolean>
   */
  _params;

  /**
   *  @type {Buffer}
   *  @doc protected variable
   */
  _body = Buffer.alloc(0);

  /**
   *  @type {FileType[]}
   *  @doc protected variable
   */
  _files = new Array();

  /**
   * @type {ValidationSchema[]}
   * @doc protected variable
   */
  _validations = new Array();

  /**
   * @type {Map<String, any>}
   * @doc protected variable
   */
  validData = new Map();

  /**
   * @type {ValidationSchema[]}
   * @doc protected variable
   */
  _validation_errors = new Array();

  /**
   * @type {Boolean}
   * @doc protected variable
   */
  bodyFetched = false;

  /**
   * @param {http.IncomingMessage} req
   * @param {Route} current
   * @param {import("../TurboServer")} instance
   */
  constructor(req, current, instance) 
  {
    this.current = current;
    this.IncomingMessage = req;
    this.state = new Map();
    this.instance = instance;
    this.models = instance.models;
  }

  addValidation (validation) {
    if(validation instanceof ValidationSchema === true) {
      this._validations.push(validation);
    }
  }

  async execute_validation (res, injectedData, next) {
    const r = await this.validateIncomingData();
    if(r === -1) return res.status(400).json({ errors: this._validation_errors })
    next();
  }

  runmethod_addvalidation (res, injectedData, next) {
    this.addValidation(injectedData.validation);
    next()
  }

  getAppState () {
    return this.instance.appState;
  }

  validateDataObj () {
    let obj = {};
    this.validData.forEach((v, k) => obj[k] = v);
    return obj;
  }


  /**
   * 
   * @param {String} name 
   * @returns {import("mongoose").Model}
   */
  getModel (name) {
    return this.models.get(name) || null;
  }

  files () {
    
  }

  /**
   * @returns {Number} 0 | -1 for error;
   */
  async validateIncomingData() {
    await this.body();
    for (let index = 0; index < this._validations.length; index++) await this._validations[index].validate(this);
    if(this._validation_errors.length > 0) return -1;
    return 0;
  }

  // ! methods not implemented //

  /** @require_implemetation  @returns {String} token */
  getBearerAuth() {
    console.log("You have not implemeneted method 'getBearerAuth'");
  }
  /** @require_implemetation @returns {BasicAuth} {user:str, pass:str} */
  getBasicAuth() {
    console.log("You have not implemeneted method 'getBasicAuth'");
  }
  /** @require_implemetation @returns {Object}  */
  getBearerJWTData() {
    console.log("You have not implemeneted method 'getBearerJWTData'");
  }
  /** @require_implemetation @returns {Number} 0 ok or -1 for error */
  validateFormdata() {
    console.log("You have not implemeneted method 'validateFormdata'");
  }

  /**
   * @interface_method
   * @param {String | Buffer} rowData
   * @returns {String} xml string
   */
  getXmlBody(rowData) {
    console.log("You have not implemeneted method 'getXmlBody'");
    return rowData;
  }

  /**
   * @interface_method
   * @doc - you can override this method;
   * @param {String | Buffer} rowData
   * @returns {Object | Object[]}
   */
  getFormUrlEncoded(rowData) {
    console.log("You have not implemeneted method 'getFormUrlEncoded'");
    return rowData;
  }

  /**
   * @interface_method
   * @doc - you can override this method;
   * @param {String | Buffer} rowData
   * @returns {*} default is string
   */
  getDefaultBody(rowData) {return rowData.toString()}

  // ? implemented methods //

  async genericBody() 
  {
    if(this.bodyFetched === true) return this._body.toString(); // on 1 milion loops -> gain ~100ms performance;
    return new Promise((resolve, reject) => {
      let data = [];
      this.IncomingMessage.on("data", (e) => {
        data.push(e);
      });
      this.IncomingMessage.on("end", (e) => {
        this.bodyFetched = true;
        this._body = Buffer.concat(data);
        resolve(this._body.toString());
      });
    });
  }

  /**
   * @doc some methods are not implmenent by default
   * @returns {*} base on headers["content-type"]
   */
  async body() 
  {
    switch (this.headers()["content-type"]) {
      case "application/json":
        return this.getJsonBody(await this.genericBody());
      case "application/javascript":
        return this.getJavascriptBody(await this.genericBody());
      case "application/xml":
        return this.getXmlBody(await this.genericBody());
      case "text/html":
        return this.getHtmlBody(await this.genericBody());
      case "text/plain":
        return (await this.genericBody()).toString();
      case "application/x-www-form-urlencoded":
        return this.getFormUrlEncoded(await this.genericBody());
      default:
        return this.getDefaultBody(await this.genericBody());
        break;
    }
  }

  /**
   * @param {String | Buffer} rowData
   * @returns {Object | Object[]}
   */
  getJsonBody(rowData) 
  {
    return JSON.parse(rowData.toString());
  }

  /**
   * @param {String | Buffer} rowData
   * @returns {String}
   */
  getHtmlBody(rowData) 
  {
    return rowData.toString();
  }

  /**
   * @doc - you can override this method;
   * @param {String | Buffer} rowData
   * @returns {String} string of javascript code;
   */
  getJavascriptBody(rowData) 
  {
    return rowData.toString();
  }

  /**
   * @doc - the first time this function is running, will cache the params for next use;
   * @returns {Map<String, Object>}
   */
  params() 
  {
    if (this._params) return this._params; // ! this line improving performance 2-3x times per 1000 lopping params();
    this._params = new Map();
    this.current.dynamic_path_parts.map((i) => {
      this._params.set(i.property, this.current.current_path_parts[i.index]);
    });
    return this._params;
  }

  /**
   * @doc - the first time this function is running, will cache the params for next use;
   * @returns {Object} Object
   */
  paramsObj() 
  {
    let returnObj = new Object();
    if (this._params) { // ! this line improving performance 2-3x times per 1000 lopping params();
      this._params.forEach((v, k) => returnObj[k] = v);
      return returnObj; 
    }
    this._params = new Map();
    this.current.dynamic_path_parts.map((i) => {
      this._params.set(i.property, this.current.current_path_parts[i.index]);
    });
    this._params.forEach((v, k) => returnObj[k] = v);
    return returnObj; 
  }

  /** @returns {URLSearchParams} URLSearchParams */
  queries() 
  {
    return new URLSearchParams(this.IncomingMessage.url.split("?")[1] || "");
  }

  /** @returns {Object} Object */
  queriesObj ()
  {
    let queriesObj = new Object()
    new URLSearchParams(this.IncomingMessage.url.split("?")[1] || "").forEach((v, k) => {
      if(queriesObj[k]) {        
        if(queriesObj[k] instanceof Array === true) {
          queriesObj[k].push(v);
        } else {
          queriesObj[k] = [queriesObj[k], v];
        }
      } else {
        queriesObj[k] = v
      }
    });
    return queriesObj;
  }

  /** @returns {http.IncomingMessage.headers} http.IncomingMessage.headers */
  headers() 
  {
    return this.IncomingMessage.headers;
  }

  /** @returns {String}  */
  method() 
  {
    return this.current.method;
  }

  /** @returns {String}  */
  httpVersion() 
  {
    return this.IncomingMessage.httpVersion;
  }

  /** @returns {String}  */
  remoteAddress() 
  {
    return this.IncomingMessage.socket.remoteAddress;
  }

  /** @returns {Number}  */
  remotePort() 
  {
    return this.IncomingMessage.socket.remotePort;
  }

  /** @returns {String}  */
  localAddress() 
  {
    return this.IncomingMessage.socket.localAddress;
  }

  /** @returns {Number}  */
  localPort() 
  {
    return this.IncomingMessage.socket.localPort;
  }

  /** @returns {String}  */
  localPort() 
  {
    return this.IncomingMessage.socket.localPort;
  }

  /** @returns {String}  */
  url() 
  {
    return this.IncomingMessage.url;
  }

  /**
   * @param {String} key
   * @param {*} value
   * @returns {void}
   */
  setState(key, value) 
  {
    this.state.set(key, value);
  }

  /**
   * @param {String} key
   * @returns {* | null}
   */
  useState(key) 
  {
    return this.state.get(key) || null;
  }
  
};
