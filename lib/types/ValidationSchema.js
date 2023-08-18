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

const RequestInterface = require("./RequestInterface");
const ValidationStaticTypes = require("./ValidationStaticTypes");

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
    const vError = new req.ValidationError(req, this.namespace, this.property);
    let currentValue = await this.getCurrentValue(req);
    if(currentValue === undefined) {
      if(this.default_value) {
        currentValue = this.default_value;
      }
      if(this.is_required && (currentValue === undefined || currentValue === null)) {
        vError.addIsRequiredError();
        req._validation_errors.push(vError.build());
        return //console.log("~~~~~~~~~`");
      }
    }
    if(currentValue === undefined && this.is_required === false) return;
    this.validations.map((validation, vindex) => {
      switch (validation.name) {
        case ValidationStaticTypes.MINLENGTH:
          if(currentValue.length < validation.value) vError.addMinlengthError(validation.value);
          break;

        case ValidationStaticTypes.MAXLENGTH:
          if(currentValue.length > validation.value) vError.addMaxlengthError(validation.value);
          break;

        case ValidationStaticTypes.ONEOF:
          if(validation.value instanceof Array === true && !validation.value.some(s => s === currentValue)) {
            vError.addOneofError(validation.value);
          }
          break;

        case ValidationStaticTypes.NOT_ONEOF:
          if(validation.value instanceof Array === true && validation.value.some(s => s === currentValue)) {
            vError.addNotOneofError(validation.value);
          }
          break;

        case ValidationStaticTypes.STARTSWITH:
          if(typeof validation.value === "string" && !currentValue.toString().startsWith(validation.value)) {
            vError.addStartsWithError(validation.value);
          }
          break;
        case ValidationStaticTypes.NOT_STARTSWITH:
          if(typeof validation.value === "string" && currentValue.toString().startsWith(validation.value)) {
            vError.addNotStartsWithError(validation.value);
          }
          break;

        case ValidationStaticTypes.ENDSWIDTH:
          if(typeof validation.value === "string" && !currentValue.toString().endsWith(validation.value)) {
            vError.addEndsWithError(validation.value);
          }
          break;
        case ValidationStaticTypes.NOT_ENDSWITH:
          if(typeof validation.value === "string" && currentValue.toString().endsWith(validation.value)) {
            vError.addNotEndsWithError(validation.value);
          }
          break;

        case ValidationStaticTypes.CONTAIN:
          if(typeof validation.value === "string" && !currentValue.toString().includes(validation.value)) {
            vError.addContainError(validation.value);
          }
          break;
        case ValidationStaticTypes.NOT_CONTAIN:
          if(typeof validation.value === "string" && currentValue.toString().includes(validation.value)) {
            vError.addNotContainError(validation.value);
          }
          break;

        case ValidationStaticTypes.VALID_EMAIL:
          const emailPattern = /^[\w.-]+@[\w.-]+\.\w+$/;
          if(!emailPattern.test(currentValue)) {
            vError.addValidEmailError();
          }
          break;

        case ValidationStaticTypes.STRONG_PASSWORD:
          const passwordPattern = /^(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*\d)(?!.*\s).*$/;
          if(!passwordPattern.test(currentValue)) {
            vError.addStrongPasswordError();
          }
          break;

        case ValidationStaticTypes.SIZE:
          if(typeof validation.value === "string")
          {
            const [min, max] = validation.value.toString().split(":").map(i => Number(i));
            if(currentValue.length < min || currentValue.length > max)
            {
              vError.addSizeError(validation.value);
            }
          }
          break;

        case ValidationStaticTypes.ATTACHMENT_REQUIRED:
          const att_parts = currentValue.split("::");
          if(!att_parts[1]) {
            vError.addAttachmentRequiredError();
          } else if(!req._files.some(s => s.id === att_parts[1])) {
            vError.addAttachmentRequiredError();
          } 
          break;

        case ValidationStaticTypes.ATTACHMENT_MIMETYPE:
          const current_file_mimetype = req._files.find(f => f.id === currentValue.split("::")[1]);
          if(!current_file_mimetype) {
            vError.addAttachmentMimetypeError(validation.value, current_file_extension);
          } else if(current_file_mimetype.mime_type !== validation.value) {
            vError.addAttachmentMimetypeError(validation.value, current_file_extension);
          }
          break;

        case ValidationStaticTypes.ATTACHMENT_EXTENSION:
          const current_file_extension = req._files.find(f => f.id === currentValue.split("::")[1]);
          if(!current_file_extension) {
            vError.addAttachmentExtensionError(validation.value, current_file_extension);
          } else if(current_file_extension.extension !== validation.value) {
            vError.addAttachmentExtensionError(validation.value, current_file_extension);
          }
          break;
      
        default:
          break;
      }
    })
    if(vError.errors.length > 0 ) {
      vError.setValue(currentValue);
      req._validation_errors.push(vError.build());
    } else {
      req._validData.set(this.property, currentValue);
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
    } else if(this.namespace === "formdata") {
      const body = await req.body();
      return body[this.property];
    } else {
      return undefined;
    }
  }


};
