/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @project - TurboExpress
 * @name TurboExpress
 * @namespace TurboExpress::middlewares::static_middleware
 * @license - MIT
 * @author - Mike Karypidis
 * @version - 1.0.0
 * @link - https://npmjs.com/TurboExpress
 * @github - https://github.com/TurboExpress
 * 
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 */

const RequestInterface = require("../types/RequestInterface");
const ResponseInterface = require("../types/ResponseInterface");

/**
* 
* @param {RequestInterface} req 
* @param {ResponseInterface} res 
* @param {*} next 
*/
module.exports = function cors_middleware (req, res, next) 
{
  const { origins, methods, credentials, headers } = this;

  res.header("Access-Control-Allow-Origin", origins.join(","));
  res.header("Access-Control-Allow-Credentials", credentials);
  res.header("Access-Control-Allow-Methods", methods.join(","));
  res.header("Access-Control-Max-Age", 3600);

  let allowedHeaders = "";
  const headers_req = req.headers();
  for (const key in headers_req) {
    if (Object.hasOwnProperty.call(headers_req, key)) {
      if(key.toLowerCase() === "access-control-request-headers") { allowedHeaders = allowedHeaders + headers_req[key] + "," } else {
        allowedHeaders = allowedHeaders + key + ","
      }
    }
  }
  res.header("Access-Control-Allow-Headers", (allowedHeaders + headers.join(",")).substring(
    0, (allowedHeaders + headers.join(",")).length - 1
  ));

  next();

}