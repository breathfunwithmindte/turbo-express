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
module.exports = async function runmethod_middleware (req, res, next) 
{
  let continueExecuting = true;
  const nextExe = () => continueExecuting = true;

  for (let index = 0; index < this.exe.length; index++) {
    if(continueExecuting === false) break;
    continueExecuting = false;
    //console.log(this.exe[index]);
    if(this.exe[index].isAsync) {
      if(this.exe[index].belong === "req") {
        await req[this.exe[index].methodname](res, this.exe[index].inject, nextExe)
      } else {
        await res[this.exe[index].methodname](req, this.exe[index].inject, nextExe)
      }
    } else {
      if(this.exe[index].belong === "req") {
        req[this.exe[index].methodname](res, this.exe[index].inject, nextExe)
      } else {
        res[this.exe[index].methodname](req, this.exe[index].inject, nextExe)
      }
    }
    
  }
  if(continueExecuting) next()
}