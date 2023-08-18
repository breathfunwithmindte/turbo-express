/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @MikeKarypidis
 * @project - TurboExpress
 * @name ValidationStaticTypes
 * @namespace TurboExpress::types::ValidationStaticTypes
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

/** @StaticType */
module.exports = class ValidationStaticTypes
{

  static ISREQUIRED = "ISREQUIRED";
  
  static ATTACHMENT_REQUIRED = "ATTACHMENT_REQUIRED";
  static ATTACHMENT_MIMETYPE = "ATTACHMENT_MIMETYPE";
  static ATTACHMENT_EXTENSION = "ATTACHMENT_EXTENSION";

  static MINLENGTH = "MINLENGTH";
  static MAXLENGTH = "MAXLENGTH";
  static ONEOF = "ONEOF";
  static NOT_ONEOF = "NOT_ONEOF";
  static RANGE = "RANGE";
  static STARTSWITH = "STARTSWITH";
  static NOT_STARTSWITH = "NOT_STARTSWITH";
  static ENDSWIDTH = "ENDSWIDTH";
  static NOT_ENDSWITH = "NOT_ENDSWITH";
  static CONTAIN = "CONTAIN";
  static NOT_CONTAIN = "NOT_CONTAIN";
  static VALID_EMAIL = "VALID_EMAIL";
  static STRONG_PASSWORD = "STRONG_PASSWORD";
  static SIZE = "SIZE";

  static REGEX = "REGEX";
  static FUNCTION = "FUNCTION";
}

