/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @MikeKarypidis
 * @project - TurboExpress
 * @name ValidationError
 * @namespace TurboExpress::types::ValidationError
 * @license - MIT
 * @copyright - ©2022 PerfectEvolution Corporation;
 * @author - Mike Karypidis
 * @version - 1.0.0
 * @link - https://turboserverjs.org
 * @github - https://github.com/breathfunwithmindte/turbo-server.git
 *
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 * 
 * 
 */

/** @Type */
module.exports = class ValidationError
{

  /** @type {String}                  */ namespace;
  /** @type {String}                  */ property;
  /** @type {*}                       */ value;
  /** @type {String[]}                */ errors = new Array();

  /**
   * 
   * @param {String} path
   * @param {Function[]} callbacks
   */
  constructor(namespace, property) 
  {
    this.namespace = namespace;
    this.property = property;
    this.value = null;
  }

  /**
   * @param {String} error 
   */
  addError (error)
  {
    this.errors.push(error);
  }

  setValue(value) {
    if(value === undefined) this.value = null;
    this.value = value;
  }


};
