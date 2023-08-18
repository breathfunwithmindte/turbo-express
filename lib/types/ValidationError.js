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

  /**
   * @typedef {Object} ValidationErrorObj
   * @property {Number} code
   * @property {String} description
   */

  /** @type {import("./RequestInterface")}    */ req;

  /** @type {String}                          */ namespace;
  /** @type {String}                          */ property;
  /** @type {*}                               */ value;
  /** @type {String[]}                        */ errors = new Array();
  

  /**
   * 
   * @param {String} path
   * @param {Function[]} callbacks
   */
  constructor(req, namespace, property) 
  {
    this.req = req;
    this.namespace = namespace;
    this.property = property;
    this.value = null;
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addIsRequiredError ()
  {
    this.errors.push(`Property ${this.property} is required`);
  }

  
  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addMinlengthError (value)
  {
    this.errors.push(`Property ${this.property} min length is ${value}`);
  }


  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addMaxlengthError (value)
  {
    this.errors.push(`Property ${this.property} max length is ${value}`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addOneofError (value)
  {
    this.errors.push(`Property ${this.property} should be one of: < ${value.join(",")} >`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addNotOneofError (value)
  {
    this.errors.push(`Property ${this.property} should not be one of: < ${value.join(",")} >`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addStartsWithError (value)
  {
    this.errors.push(`Property ${this.property} should start with ${value}`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addNotStartsWithError (value)
  {
    this.errors.push(`Property ${this.property} should not start with ${value}`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addEndsWithError (value)
  {
    this.errors.push(`Property ${this.property} should end with ${value}`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addNotEndsWithError (value)
  {
    this.errors.push(`Property ${this.property} should not end with ${value}`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addContainError (value)
  {
    this.errors.push(`Property ${this.property} should contain ${value}`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addNotContainError (value)
  {
    this.errors.push(`Property ${this.property} should not contain ${value}`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addValidEmailError (value)
  {
    this.errors.push(`Property ${this.property} should be valid email format.`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addStrongPasswordError (value)
  {
    this.errors.push(`Property ${this.property} should be strong password format. One special letter, one uppercase, no spaces, one number.`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addSizeError (value)
  {
    this.errors.push(`Property ${this.property} should has length between ${value}.`);
  }


  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addAttachmentRequiredError ()
  {
    this.errors.push(`Property ${this.property} should be type of attachment`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   */
  addAttachmentMimetypeError (value, file)
  {
    if(!file) return this.errors.push(`Property ${this.property} should be type of attachment | mimetype error`)
    this.errors.push(`Property ${this.property} should be attachment with mime type := ${value}, but recieved := ${file.mime_type}`);
  }

  /**
   * You can override this method and use multi locale error messages.
   * 
   * @param {import("./RequestInterface")} req 
   */
  addAttachmentExtensionError (value, file)
  {
    if(!file) return this.errors.push(`Property ${this.property} should be type of attachment | extension error`)
    this.errors.push(`Property ${this.property} should be attachment with extension := ${value}, but recieved := ${file.extension}`);
  }


  /**
   * @param {String} error 
   */
  addError (error_message, error)
  {
    this.errors_messages.push(error_message);
    if(error) this.errors.push(error);
  }

  setValue(value) {
    if(value === undefined) this.value = null;
    this.value = value;
  }

  /**
   * You can override this method and add more stuff for your Rest Api bad request response type.
   * 
   * @returns 
   */
  build ()
  {
    return {
      namespace: this.namespace,
      property: this.property,
      value: this.value,
      errors: this.errors
    }
  }


};
