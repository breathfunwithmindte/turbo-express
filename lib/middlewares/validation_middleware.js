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
module.exports = async function validation_middleware (req, res, next) 
{
  
 const { validations } = this;

 validations.map(v => req.addValidation(v));

 const validationResult = await req.validateIncomingData();

 if(validationResult === -1) return res.status(400).json({ errors: req._validation_errors });

 next();

}