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
  static MINLENGTH = "MINLENGTH";
  static MAXLENGTH = "MAXLENGTH";
  static ISREQUIRED = "ISREQUIRED";
  static ONEOF = "ONEOF";
  static NOTONEOF = "NOTONEOF";
  static REGEX = "REGEX";
  static RANGE = "RANGE";
  static FUNCTION = "FUNCTION";
}

