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

const { matching_route_middlewares } = require("../utils")
const Middleware = require("./Middleware")

module.exports = class Route 
{

  /**
   * @doc all this properties will be used once to find if middleware is matching the route.
   * if it does then the callbacks will be pushed at the begining of the route.callbacks
   * 
   * @useMinLength actually if path endwith /* that group all of these middlewares in their own category
   * on server callback will be executed 2 matching functions
   * 
   * 1rst one is exact that mean it will try to match route that not end with /* and has the same length of path parts;
   * 
   * if the first not find something, only then it will go to the next function
   * in the second function, here is where useMinLength = true group is used.
   * 
   * 
   */

  /**
   * @typedef {Object} DynamicPathPart;
   * @property {Number} index;
   * @property {String} property;
   */

  /** @type {String}                  */  path
  /** @type {String}                  */  method
  /** @type {String[]}                */  path_parts
  /** @type {DynamicPathPart[]}       */  dynamic_path_parts
  /** @type {Boolean}                 */  useMinlength
  /** @type {Number}                  */  size
  /** @type {Function[]}              */  callbacks = [] 
  /** @type {String[]}                */  current_path_parts = [];  

  /**
   * todo validation check and warn for wrong type;
   * @param {String} path 
   * @param {Function[]} callbacks 
   * @param {Middleware[]} middlewares
   * @param {Middleware[]} middlewares_end
   */
  constructor(path, method, callbacks, middlewares, middlewares_end) {
    this.path = path;
    this.method = method;
    this.path_parts = path.split("/").filter(f => f !== "");
    this.dynamic_path_parts = this.#setDynamicPathParts();
    this.useMinlength = path.endsWith("/*");
    this.size = path.endsWith("/*") ? this.path_parts.length - 1 : this.path_parts.length;
    this.useMiddlewares(middlewares)
    callbacks.map(c => {
      if(c instanceof Function) return this.callbacks.push(c);
      throw new Error("Callback should be instance of function");
    })
    this.useMiddlewares(middlewares_end)
    //console.log(this)
  }

  setCurrentPathParts (current_path_parts) { this.current_path_parts = current_path_parts; }
  getCurrentPathParts () { return this.current_path_parts; }

  #setDynamicPathParts ()
  {
    let tmpArr = []
    for (let i = 0; i < this.path_parts.length; i++) {
      if(this.path_parts[i].startsWith(":")) { tmpArr.push({ index: i, property: this.path_parts[i].substring(1, this.path_parts[i].length) }) }
    }
    return tmpArr;
  }

  /**
   * @param {Middleware[]} middlewares 
   */
  useMiddlewares (middlewares)
  {
    matching_route_middlewares(this.path_parts, this.useMinlength, this.size, middlewares).map(m => m.callbacks.map(mc => this.callbacks.push(mc)))
  }

}