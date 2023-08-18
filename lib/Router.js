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
const RequestInterface = require("./types/RequestInterface");
const ResponseInterface = require("./types/ResponseInterface");
const { matching_route, matching_nonexact_route } = require("./utils");
const Route = require("./types/Route");
const Middleware = require("./types/Middleware");
const RequestMethods = require("./statictypes/RequestMethods");
const ServerCallback = require("./ServerCallback");
const static_middleware = require("./middlewares/static_middleware");
const TurboServer = require("./TurboServer");

module.exports = class Router 
{
  /**
   * @typedef {Object} RouterMiddleware
   * @property {String} path
   * @property {Function[]} callbacks
   * 
   * @typedef {Object} RouterRoute
   * @property {String} path;
   * @property {Function[]} callbacks;
   * @property {String} method
   */

  /** @type {String} path */
  path = "";

  /** @type{RouterRoute[]} routes */
  routes = new Array();

  /** @type{RouterMiddleware[]} middlewares */
  middlewares = new Array();

  /** @type{Middleware[]} __middlewares_begin  */
   __middlewares_begin = new Array(); // final middlewares - actually will be set after the final path is passed;

  /** @param {string | null} path */
  constructor (path) { this.path = path || ""; }

  get(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.GET }) }
  post(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.POST }) }
  put(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.PUT }) }
  delete(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.DELETE }) }
  head(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.HEAD }) }
  patch(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.PATCH }) }
  options(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.OPTIONS }) }
  link(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.LINK }) }
  unlink(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.UNLINK }) }
  view(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.VIEW }) }
  lock(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.LOCK }) }
  unlock(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.UNLOCK }) }
  copy(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.COPY }) }
  purge(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.PURGE }) }
  propfind(path, ...callbacks){ this.routes.push({ path: path, callbacks: callbacks, method: RequestMethods.PROPFIND }) }

  use(path, ...callbackOrRouter) 
  {
    this.middlewares.push({path: path, callbacks: callbackOrRouter});
    if (callbackOrRouter instanceof Router) throw new Error("Router use cannot accept another instance of Router.");
  }

  /**
   * This method transfer routes/middlewares from router to the main application instance.
   * 
   * @binding routers/middlewares to the main application;
   * @param {String} path
   * @param {TurboServer} self
   */
  inject (path, self)
  {
    this.__middlewares_begin = this.middlewares.map(m => new Middleware(this.path + path + m.path, m.callbacks));
    const rm = new RequestMethods();
    rm.forEach((method) => {
        const rts = this.routes.filter(f => f.method === method);
        rts.map(froute => self[`__${method}_routes`].push(new Route(this.path + path + froute.path, method, froute.callbacks, this.__middlewares_begin, [])))
    })
  }

};
