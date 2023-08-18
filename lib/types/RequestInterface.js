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
const ExpressService = require("../services");
const ContentType = require("../statictypes/ContentType");
const Route = require("./Route");
const ValidationTypes = require("./ValidationTypes");

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

  content_type = ContentType.UNSET;
  current_locale = null;
  ValidationError = ValidationTypes.ValidationError;

  /**
   *  @type {Buffer}
   *  @doc protected variable
   */
  _body = Buffer.alloc(0);
  
  /**
   *  @type {*}
   *  @doc protected variable
   */
  _body_hash = null;

  /**
   *  @type {import("./FileType")[]}
   *  @doc protected variable
   */
  _files = new Array();

  /**
   * @type {import("./ValidationSchema")[]}
   * @doc protected variable
   */
  _validations = new Array();

  /**
   * @type {Map<String, any>}
   * @doc protected variable
   */
  _validData = new Map();

  /**
   * @type {import("./ValidationError")[]}
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
    this.content_type = ContentType.GET_CONTENT_TYPE(this.headers()["content-type"]);
    this.current_locale = instance.localeService.allowed_locales.find(s => s === this.queries().get("locale")) || instance.localeService.allowed_locales[0];
  }

  addValidation (validation) {
    if(validation instanceof ValidationTypes.ValidationSchema === true) {
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

  validDataObj () {
    let obj = {};
    this._validData.forEach((v, k) => obj[k] = v);
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
    return this._files.map(i => i.build());
  }

  /**
   * @returns {Number} 0 | -1 for error;
   */
  async validateIncomingData() {
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
  getUnknownBody(rowData) {
    //console.log("You have not implemeneted method 'getUnknownBody'");
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
    // console.log(this.content_type)
    if(this._body_hash !== null) return this._body_hash; // ! improve performance about 1s per 1m loops
    switch (this.content_type) {
      case ContentType.APPLICATION_JSON:
        this._body_hash = this.getJsonBody(await this.genericBody()); break;
      case ContentType.APPLICATION_JAVASCRIPT:
        this._body_hash = this.getJavascriptBody(await this.genericBody()); break;
      case ContentType.APPLICATION_XML:
        this._body_hash = this.getXmlBody(await this.genericBody()); break;
      case ContentType.TEXT_HTML:
        this._body_hash = this.getHtmlBody(await this.genericBody()); break;
      case ContentType.TEXT_PLAIN:
        this._body_hash = (await this.genericBody()).toString(); break;
      case ContentType.APPLICATION_XWWWFORM_URLENCODED:
        this._body_hash = this.getFormUrlEncoded(await this.genericBody()); break;
      case ContentType.FORMDATA:
        this._body_hash = await this.getFormDataBody(); break;
      case ContentType.UNKNOWN:
        this._body_hash = this.getUnknownBody(await this.genericBody()); break;
      default:
        this._body_hash = this.getDefaultBody(await this.genericBody()); break;
    }
    // console.log(this._body_hash)
    return this._body_hash
  }

  /**
   * 
   * @returns 
   */
  body_hash ()
  {
    return this._body_hash;
  }

  /**
   * @param {String | Buffer} rowData
   * @returns {Object | Object[]}
   */
  getJsonBody(rowData) 
  {
    try { return JSON.parse(rowData.toString()); } catch(err) { return { error: err.toString() }; }
  }

  /**
   * @param {String | Buffer} rowData
   * @returns {Object | Object[]}
   */
  async getFormDataBody(rowData) 
  {
    if(this.bodyFetched) return;
    const formDataService = new ExpressService.FormDataService({ req: this });
    return await formDataService.memory_read();
  }

  /**
   * This is default implemetation of form url encoded body data type. It can handle many cases but not all of them
   * 
   * @param {String | Buffer} rowData
   * @returns {Object | Object[]}
   */
  getFormUrlEncoded(rowData) {
    if(!rowData || rowData === "") return new Object();
    const formUrlEncodedObject = new Object();
    rowData.split('&').map(i => i.trim().split("=")).filter(f => f.length > 1).map(i => formUrlEncodedObject[i[0]] = i[1]);
    return formUrlEncodedObject;
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

  /**
   * 
   * @param {String} key
   * @returns {String | null} 
   */
  getText (key)
  {
    return this.instance.localeService.get(this.current_locale, key);
  }

  /**
   * @returns {*}
   */
  getStateObj() 
  {
    let tmpObj = {}
    this.state.forEach((v, k) => tmpObj[k] = v);
    return tmpObj;
  }
  
};
