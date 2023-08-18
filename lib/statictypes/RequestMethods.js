/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @project - TurboExpress
 * @name TurboExpress
 * @namespace TurboExpress::StaticTypes::RequestMethods
 * @license - MIT
 * @author - Mike Karypidis
 * @version - 1.0.0
 * @link - https://npmjs.com/TurboExpress
 * @github - https://github.com/TurboExpress
 * 
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 */


module.exports = class RequestMethods
{

  static GET = "get";
  static POST = "post";
  static PUT = "put";
  static DELETE = "delete";
  static HEAD = "head";
  static PATCH = "patch";
  static OPTIONS = "options";
  static LINK = "link";
  static UNLINK = "unlink";
  static VIEW = "view";
  static LOCK = "lock";
  static UNLOCK = "unlock";
  static COPY = "copy";
  static PURGE = "purge";
  static PROPFIND = "propfind"

  http_methods = ["get", "post", "delete", "put", "head", "patch", "options", "link", "unlink", "view", "lock", "unlock", "copy", "purge", "propfind"];

  get;
  post;
  put;
  delete;
  head;
  patch;
  options;
  link;
  unlink;
  view;
  lock;
  unlock;
  copy;
  purge;
  propfind;


  constructor ()
  {
    this.get = RequestMethods.GET;
    this.post = RequestMethods.POST;
    this.put = RequestMethods.PUT;
    this.delete = RequestMethods.DELETE;
    this.head = RequestMethods.HEAD;
    this.patch = RequestMethods.PATCH;
    this.options = RequestMethods.OPTIONS;
    this.link = RequestMethods.LINK;
    this.unlink = RequestMethods.UNLINK;
    this.view = RequestMethods.VIEW;
    this.lock = RequestMethods.LOCK;
    this.unlock = RequestMethods.UNLOCK;
    this.copy = RequestMethods.COPY;
    this.purge = RequestMethods.PURGE;
    this.propfind = RequestMethods.PROPFIND;
  }

  /**
   * 
   * @param {Function} cb
   * @returns {void} 
   */
  forEach (cb) 
  {
    this.http_methods.map(cb);
  }

}