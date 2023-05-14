/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @project - TurboExpress
 * @name ServerCallback
 * @namespace TurboExpress::ServerCallback
 * @license - MIT
 * @author - Mike Karypidis
 * @version - 1.0.0
 * @link - https://npmjs.com/TurboExpress
 * @github - https://github.com/TurboExpress
 *
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 * 
 * this is the primary callback that will be executed on each server connection;
 * TurboExpress is written on top of nodejs<http> package, and on .createServer(...) we are passing this callback
 * 
 */

const RequestInterface = require("./types/RequestInterface");
const ResponseInterface = require("./types/ResponseInterface");
const http = require("http");
const { matching_route, matching_nonexact_route } = require("./utils"); 

/**
 *
 * @param {http.IncomingMessage} req
 * @param {http.OutgoingMessage} res
 * @returns
 */
module.exports = async function ServerCallback(req, res) 
{
  const [path, query] = req.url.split("?");

  let curr = matching_route(path, this[`__${req.method.toLowerCase()}_routes`]);

  if (!curr) {
    curr = matching_nonexact_route(
      path,
      this[`__${req.method.toLowerCase()}_routes`]
    );
  }

  if (!curr) return res.end("~ Page Not Found || 404 ~");

  /** @type {RequestInterface} new instance of <T extends RequestInterface> */
  const request = new this.Request(req, curr, this);

  /** @type {ResponseInterface} new instance of <T extends ResponseInterface> */
  const response = new this.Response(res, curr, this);

  let nextRun = true; // ! also not cost performance

  const next = () => nextRun = true; // ! also not cost performance   *creating a new function callback for each connection  *there is no need to be static

  for (let i = 0; i < curr.callbacks.length; i++) {
    if(!nextRun) break;
    nextRun = false; // ! not cost perfomance tested with 1000 middlewares running next() function and without next function and if checks here.;
    await curr.callbacks[i](request, response, next);
  }
  
  //console.log("request finished\n")

};
