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
 * 
 * here the primary class of TurboExpress framework - TurboServer class;
 * 
 */

const http = require("http");
const Router = require("./Router");
const cluster = require("cluster");
const RequestInterface = require("./types/RequestInterface");
const ResponseInterface = require("./types/ResponseInterface");
const { matching_route, matching_nonexact_route } = require("./utils");
const Route = require("./types/Route");
const Middleware= require("./types/Middleware");
const RequestMethods = require("./statictypes/RequestMethods");
const ServerCallback = require("./ServerCallback");
const static_middleware = require("./middlewares/static_middleware");
const attachment_middleware = require("./middlewares/attachment_middleware");
const ValidationSchema = require("./types/ValidationSchema");
const ValidationMethodType = require("./enum/ValidationMethodType");
const validation_middleware = require("./middlewares/validation_middleware");
const runmethod_middleware = require("./middlewares/runmethod_middleware");
const buildform_middleware = require("./middlewares/buildform_middleware");
const authentication_middleware = require("./middlewares/authentication_middleware");
const cors_middleware = require("./middlewares/cors_middleware");


module.exports = class TurboServer
{
  static Router = Router;
  static ValidationSchema = ValidationSchema;
  static ValidationMethodType = ValidationMethodType;

  /**
   * @typedef {Object} StaticOptions
   * @property {String} folder - default /public
   * @property {Boolean} cache - default false
   * 
   * @param {StaticOptions} StaticOptions 
   * @returns 
   */
  static Static (StaticOptions={})
  {
    return static_middleware.bind({ folder: StaticOptions.folder || "/public", cache: StaticOptions.cache || false })
  }

  /**
   * @typedef {Object} CorsOptions
   * @property {String} folder - default /public
   * @property {Boolean} cache - default false
   * 
   * @param {CorsOptions} CorsOptions 
   * @returns 
   */
  static Cors (CorsOptions)
  {
    return cors_middleware.bind({

    })
  }

  /**
   * @typedef {Object} AttachmentOptions
   * @property {String} folder - default /storage
   * @property {Boolean} memory - default true
   * @property {Boolean} as_middleware - default true
   * 
   * @param {AttachmentOptions} AttachmentOptions 
   * @returns 
   */
  static Upload (AttachmentOptions={})
  {
    return attachment_middleware.bind({ 
      folder: AttachmentOptions.folder || "/storage", memory: AttachmentOptions.memory || true, as_middleware: AttachmentOptions.as_middleware || true 
    })
  }

  /**
   * Add validations to request instance and executes the validateData method of the same instance.
   * If there is an error, it throws the response with that error.
   * 
   * @typedef  {Object} ValidationOptions
   * @property {ValidationSchema[]}  validations
   * 
   * @param {ValidationOptions} ValidationOptions 
   * @returns 
   */
  static Validation (ValidationOptions={})
  {
    return validation_middleware.bind({ 
      validations: ValidationOptions.validations
    })
  }

  /**
   * @typedef   {Object}  ExeMethodType
   * @property  {string}  belong
   * @property  {string}  methodname
   * @property  {*}       inject
   * @property  {boolean} isAsync
   * 
   * @typedef  {Object} RunMethodOptions
   * @property {ExeMethodType[]}  exe
   * 
   * @param {RunMethodOptions} RunMethodOptions 
   * @returns 
   */
  static RunMethod (RunMethodOptions={})
  {
    return runmethod_middleware.bind({ 
      exe: RunMethodOptions.exe
    })
  }

  /**
   * 
   * @typedef  {Object} AuthenticationOptions
   * 
   * @param {AuthenticationOptions} AuthenticationOptions 
   * @returns 
   */
  static Authentication (AuthenticationOptions={})
  {
    return authentication_middleware.bind({ 
      
    })
  }

  /**
   * @typedef   {Object}  BuildFormOptions
   * 
   * @param {BuildFormOptions} BuildFormOptions 
   * @returns 
   */
  static BuildForm (BuildFormOptions={})
  {
    return buildform_middleware.bind({ 
      
    })
  }



  /** @type{http.Server}    */ #server;

  // spliting the list of routes base on method, so later have less items in list to search for each connection
  /** @type{Route[]}       */ __get_routes = [];       
  /** @type{Route[]}       */ __post_routes = [];
  /** @type{Route[]}       */ __put_routes = [];
  /** @type{Route[]}       */ __delete_routes = [];
  /** @type{Route[]}       */ __head_routes = [];
  /** @type{Route[]}       */ __patch_routes = [];
  /** @type{Route[]}       */ __options_routes = [];
  /** @type{Route[]}       */ __link_routes = [];
  /** @type{Route[]}       */ __unlink_routes = [];
  /** @type{Route[]}       */ __view_routes = [];
  /** @type{Route[]}       */ __lock_routes = [];
  /** @type{Route[]}       */ __unlock_routes = [];
  /** @type{Route[]}       */ __copy_routes = [];
  /** @type{Route[]}       */ __purge_routes = [];
  /** @type{Route[]}       */ __propfind_routes = [];

  /** @type{Middleware[]}   */ __middlewares_begin = [];
  /** @type{Middleware[]}   */ __middlewares_end = [];
  
  // * interfaces
  /** @type{RequestInterface}                              */     Request;
  /** @type{ResponseInterface}                             */     Response;

  /** @type {Map<String, Object>}                          */     appState         =   new Map();
  /** @type {Map<String, import("mongoose").Model}         */     models           =   new Map();
  /** @type {Map<String, import("mongoose").Model}         */     sqlModels        =   new Map(); // TODO later

  /**
   * @param {Number} CLUSTERSLENGTH
   * @doc - here on constructor will be created a server instance;
   * createServer method of http class will get the primary servercallback and bind this of current instance;
   * the method listen of current instance should be invoked to listen on some port;
   */
  constructor (CLUSTERSLENGTH)
  {
    if (cluster.isMaster) {
      for (let i = 0; i < CLUSTERSLENGTH; i++) { cluster.fork() }
    } else {
      global["TurboExpress"] = new Object();
      global["TurboExpressCaching"] = new Object();
      this.#server = http.createServer(ServerCallback.bind(this));
      this.Request = RequestInterface;
      this.Response = ResponseInterface;
    }
  }

  get(path, ...callbacks){if(!cluster.isMaster) {this.__get_routes.push(new Route(path, RequestMethods.GET, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  post(path, ...callbacks){if(!cluster.isMaster) {this.__post_routes.push(new Route(path, RequestMethods.POST, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  put(path, ...callbacks){if(!cluster.isMaster) {this.__put_routes.push(new Route(path, RequestMethods.PUT, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  delete(path, ...callbacks){if(!cluster.isMaster) {this.__delete_routes.push(new Route(path, RequestMethods.DELETE, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  head(path, ...callbacks){if(!cluster.isMaster) {this.__head_routes.push(new Route(path, RequestMethods.HEAD, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  patch(path, ...callbacks){if(!cluster.isMaster) {this.__patch_routes.push(new Route(path, RequestMethods.PATCH, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  options(path, ...callbacks){if(!cluster.isMaster) {this.__options_routes.push(new Route(path, RequestMethods.OPTIONS, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  link(path, ...callbacks){if(!cluster.isMaster) {this.__link_routes.push(new Route(path, RequestMethods.LINK, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  unlink(path, ...callbacks){if(!cluster.isMaster) {this.__unlink_routes.push(new Route(path, RequestMethods.UNLINK, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  view(path, ...callbacks){if(!cluster.isMaster) {this.__view_routes.push(new Route(path, RequestMethods.VIEW, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  lock(path, ...callbacks){if(!cluster.isMaster) {this.__lock_routes.push(new Route(path, RequestMethods.LOCK, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  unlock(path, ...callbacks){if(!cluster.isMaster) {this.__unlock_routes.push(new Route(path, RequestMethods.UNLOCK, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  copy(path, ...callbacks){if(!cluster.isMaster) {this.__copy_routes.push(new Route(path, RequestMethods.COPY, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  purge(path, ...callbacks){if(!cluster.isMaster) {this.__purge_routes.push(new Route(path, RequestMethods.PURGE, callbacks, this.__middlewares_begin, this.__middlewares_end));}}
  propfind(path, ...callbacks){if(!cluster.isMaster) {this.__propfind_routes.push(new Route(path, RequestMethods.PROPFIND, callbacks, this.__middlewares_begin, this.__middlewares_end));}}

  use(path, ...callbackOrRouter)
  {
    if(callbackOrRouter[0] instanceof Router === true) {
      callbackOrRouter[0].inject(path, this);
    } else {
      this.__middlewares_begin.push(new Middleware(path, callbackOrRouter));
    }
  }

  useEndMiddleware (path, ...callbacks)
  {
    this.__middlewares_end.push(new Middleware(path, callbacks));
  }



  /**
   * todo method for deleting routes in runtime.
   * can be used inside controllers - dynamic change routes from: example: server admin panel
   * 
   * @param {String} method 
   * @param {String} path 
   */
  deleteRoute (method, path) {

  }

  /**
   * todo method for find route in runtime.
   * can be used inside controllers - dynamic change routes from: example: server admin panel
   * 
   * @param {String} method 
   * @param {String} path 
   */
  getRoute (method, path) {

  }




  logRoutes ()
  {
    let arr = [...this.__get_routes, ...this.__post_routes, ...this.__put_routes, ...this.__delete_routes];
    console.table(arr);
  }

  listen (port, cb)
  {
    /** will listen not on master cluster ... */
    if(!cluster.isMaster) {
      this.#server.listen(port, cb ? cb : () => console.log("server is running"))
    } 
  }

}