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

  // comming soon;

  res.send("comming soon - cors middleware");

}