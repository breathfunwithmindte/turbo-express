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

module.exports = class RunMethodType 
{

  /**
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
