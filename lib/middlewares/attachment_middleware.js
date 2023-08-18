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

const FileType = require("../types/FileType");
const RequestInterface = require("../types/RequestInterface");
const ResponseInterface = require("../types/ResponseInterface");
const multiparty = require("multiparty")

/**
* 
* @param {RequestInterface} req 
* @param {ResponseInterface} res 
* @param {*} next 
*/
module.exports = async function attachment_middleware (req, res, next) 
{
  if(this.memory)
  {
    await req.body();
    req._files.map(f => {
      if(req.body_hash()[f.name]) {
        req._body_hash[f.name] = f.save(this.folder);
      }
    })
    next();
  } else {
    console.log("Attachment middleware is not implemented for large files that require streaming os.write yet");
    res.send("Attachment middleware is not implemented for large files that require streaming os.write yet");
  }
}