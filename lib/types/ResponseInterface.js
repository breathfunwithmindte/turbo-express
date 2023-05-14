/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @MikeKarypidis
 * @project - TurboServer
 * @name TurboServer
 * @license - MIT
 * @copyright - ©2022 PerfectEvolution Corporation;
 * @author - Mike Karypidis
 * @version - 1.0.0
 * @link - https://turboserverjs.org
 * @github - https://github.com/breathfunwithmindte/turbo-server.git
 * 
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 */

const http = require("http");
const Route = require("./Route");

module.exports = class ResponseInterface 
{
  /** @type{http.OutgoingMessage}                     */   OutgoingMessage;
  /** @type {Route}                                   */   current;
  /** @type {import("../TurboServer")}                */   instance;
  /** @type {Map<String, import("mongoose").Model>}   */   models;

  /**
   * @param {http.OutgoingMessage} res
   * @param {Route} current
   * @param {import("../TurboServer")} instance
   */
  constructor(res, current, instance) 
  {
    this.current = current;
    this.OutgoingMessage = res;
    this.statusCode = 200;
    this.response = new Object();
    this.instance = instance;
    this.models = instance.models;
  }

  status(status) 
  {
    this.statusCode = !isNaN(status) ? Number(status) : 500;
    return this;
  }

  send(string, contentType) 
  {
    this.OutgoingMessage.writeHead(this.statusCode, {
      "Content-Type": contentType || "text/html",
    });
    this.OutgoingMessage.end(string);
  }

  json(data) 
  {
    this.OutgoingMessage.writeHead(this.statusCode, {
      "Content-Type": "application/json",
    });
    this.OutgoingMessage.end(JSON.stringify(data));
  }

  /** @require_implemetation  @returns {void} should implement 1) convert object to xml 2) send response 3) close the connection */
  xml() {
    console.log("You have not implemeneted method 'xml'");
  }
  /** @require_implemetation @returns {BasicAuth} comming soon */
  sendFile() {
    console.log("You have not implemeneted method 'sendFile'");
  }
  /** @require_implemetation @returns {Object} broadact data to specific users, works with web sockets connections  */
  broadcast() {
    console.log("You have not implemeneted method 'broadcast'");
  }
  /** @require_implemetation @returns {Number} broadact data to specific user, works with web sockets connections */
  broadcastTo() {
    console.log("You have not implemeneted method 'broadcastTo'");
  }

  /** @doc - require to be implemented */
  useRedis() {
    console.log("You have not implemeneted method 'useRedis'");
  }
  /** @doc - require to be implemented */
  storeRedis() {
    console.log("You have not implemeneted method 'storeRedis'");
  }
  /** @doc - require to be implemented */
  refreshRedis() {
    console.log("You have not implemeneted method 'refreshRedis'");
  }
};
