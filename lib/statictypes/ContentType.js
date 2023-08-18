/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @project - TurboExpress
 * @name TurboExpress
 * @namespace TurboExpress::StaticTypes::ContentType
 * @license - MIT
 * @author - Mike Karypidis
 * @version - 1.0.0
 * @link - https://npmjs.com/TurboExpress
 * @github - https://github.com/TurboExpress
 * 
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 */

module.exports = class ContentType
{
  static UNSET = "unset";
  static UNKNOWN = "unknown";
  static APPLICATION_JSON = "application/json";
  static APPLICATION_JAVASCRIPT = "application/javascript";
  static APPLICATION_XML = "application/xml";
  static TEXT_HTML = "text/html";
  static TEXT_PLAIN = "text/plain";
  static APPLICATION_XWWWFORM_URLENCODED = "application/x-www-form-urlencoded"
  static FORMDATA = "multipart/form-data"

  static GET_CONTENT_TYPE (content_type)
  {
    if(!content_type) return ContentType.UNKNOWN;
    if(content_type.includes("multipart/form-data")) return ContentType.FORMDATA;
    switch (content_type) {
      case "application/json":
        return ContentType.APPLICATION_JSON;
      case "application/javascript":
        return ContentType.APPLICATION_JAVASCRIPT;
      case "application/xml":
        return ContentType.APPLICATION_XML;
      case "text/html":
        return ContentType.TEXT_HTML;
      case "text/plain":
        return ContentType.TEXT_PLAIN;
      case "application/x-www-form-urlencoded":
        return ContentType.APPLICATION_XWWWFORM_URLENCODED;
      default:
        return ContentType.UNKNOWN;
    }
  }

}