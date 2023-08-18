/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @MikeKarypidis
 * @project - TurboExpress
 * @name Middleware
 * @namespace TurboExpress::ServerCallback
 * @license - MIT
 * @copyright - ©2022 PerfectEvolution Corporation;
 * @author - Mike Karypidis
 * @version - 1.0.0
 * @link - https://turboserverjs.org
 * @github - https://github.com/breathfunwithmindte/turbo-server.git
 *
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 */

module.exports = class Middleware 
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


  /** @type {String}                  */ path;
  /** @type {String[]}                */ path_parts;
  /** @type {Boolean}                 */ useMinlength;
  /** @type {Number}                  */ size;
  /** @type {Function[]}              */ callbacks = new Array();

  /**
   * todo validation check and warn for wrong type;
   * @param {String} path
   * @param {Function[]} callbacks
   */
  constructor(path, callbacks) 
  {
    this.path = path;
    this.path_parts = path.split("/").filter((f) => f !== "");
    this.useMinlength = path.endsWith("/*");
    this.size = path.endsWith("/*")
      ? this.path_parts.length - 1
      : this.path_parts.length;
    this.callbacks = callbacks || [];
  }
};
