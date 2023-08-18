/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @project - TurboExpress
 * @name TurboExpress
 * @namespace TurboExpress::middlewares::authentication_middleware
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
module.exports = async function authentication_middleware (req, res, next) 
{

  const { authentication_service } = this;

  return await authentication_service.authenticated(req, res, next);

}