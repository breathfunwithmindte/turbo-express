/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @MikeKarypidis
 * @project - TurboExpress
 * @name ValidationSchema
 * @namespace TurboExpress::types::ValidationSchema
 * @license - MIT
 * @copyright - ©2022 PerfectEvolution Corporation;
 * @author - Mike Karypidis
 * @version - 1.0.0
 * @link - https://turboserverjs.org
 * @github - https://github.com/breathfunwithmindte/turbo-server.git
 *
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 * 
 * For each property, we are set a new validation schema instance;
 * 
 */

const ValidationMethodType = require("../enum/ValidationMethodType");
const RequestInterface = require("./RequestInterface");
const ValidationError = require("./ValidationError");

/**
 * @typedef {Object} ValidationType
 * @property {String} name;
 * @property {String} value;
 */

/** @Type */
module.exports = class ValidationSchema
{

  /** @type {String}                  */ namespace;
  /** @type {String}                  */ property;
  /** @type {ValidationType[]}        */ validations;
  /** @type {Boolean}                 */ is_required;
  /** @type {*}                       */ default_value;

  /**
   * @param {String}              property - is required
   * @param {ValidationType[]}    validations - is required
   * @param {Boolean}             is_required - default false
   * @param {*}                   default_value
   * @param {String}              namespace - default is body
   */
  constructor(property, validations, is_required=true, default_value=null, namespace="body") 
  {
    this.namespace = namespace;
    this.default_value = default_value;
    this.validations = validations instanceof Array === true ? validations : [];
    if(typeof property === "string") {
      this.property = property;
    } else {
      throw new Error("property is required and should be type of string.");
    }
    this.is_required = typeof is_required === "boolean" ? is_required : false;
  }

  /**
   * This method is async in case we want to intergrate it with database
   * like is doc exist with that id.
   * This is out of the box of the default implemetations.
   * 
   * @param {RequestInterface} req 
   */
  async validate (req)
  {
    const vError = new ValidationError(this.namespace, this.property);
    let currentValue = await this.getCurrentValue(req);
    if(currentValue === undefined) {
      if(this.default_value) {
        currentValue = this.default_value;
      }
      if(this.is_required && (currentValue === undefined || currentValue === null)) {
        vError.addError(`Property ${this.property} is required.`);
        req._validation_errors.push(vError);
        return console.log("~~~~~~~~~`");
      }
    }
    if(currentValue === undefined && this.is_required === false) return;
    this.validations.map((validation, vindex) => {
      switch (validation.name) {
        case ValidationMethodType.MINLENGTH:
          if(currentValue.length < validation.value) {
            vError.addError(`Property ${this.property} min length is ${validation.value}`)
          }
          break;

        case ValidationMethodType.MAXLENGTH:
          if(currentValue.length > validation.value) {
            vError.addError(`Property ${this.property} max length is ${validation.value}`)
          }
          break;

        case ValidationMethodType.ONEOF:
          if(validation.value instanceof Array === true && !validation.value.some(s => s === currentValue)) {
            vError.addError(`Property ${this.property} should be one of: < ${validation.value.join(",")} >`)
          }
          break;

        case ValidationMethodType.SIZE:
          console.log("min size here", validation.value);
          
          break;
      
        default:
          break;
      }
    })
    if(vError.errors.length > 0) {
      vError.setValue(currentValue);
      req._validation_errors.push(vError);
    } else {
      req.validData.set(this.property, currentValue);
    }
  }


  /**
   * 
   * @param {RequestInterface} req 
   */
  async getCurrentValue (req)
  {
    if(this.namespace === "query") {
      return req.queriesObj()[this.property];
    } else if(this.namespace === "body") {
      const body = await req.body();
      return body[this.property];
    } else if(this.namespace === "params") {
      return req.params().get(this.property);
    }
  }


};
