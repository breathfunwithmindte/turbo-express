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
module.exports = function attachment_middleware (req, res, next) 
{
  console.log("attachment middleware");

  const { memory, folder } = this;
  console.log(memory, folder);

  const httpRequest = req.IncomingMessage;  //http.IncomingMessage
  const httpResponse = res.OutgoingMessage; //http.OutgoingMessage

  const files = new Array();

  if(memory)
  {
    /** @type{Buffer[]} */ const FilesBuffers = new Array(); 
    const form = new multiparty.Form({ autoFields: true });

    form.on("part", (part) => {
      let buffer = Buffer.alloc(0);
      const mine_type = part.headers["content-type"] || "";
      const turboExpressFile = new FileType();
      turboExpressFile.name = part.name;
      turboExpressFile.fileName = part.filename;
      turboExpressFile.is_binary = true;
      turboExpressFile.is_compressible = false;
      turboExpressFile.is_encrypted = false;
      turboExpressFile.extension = mine_type.split("/")[1] || "not-found"
      turboExpressFile.mime_type = mine_type;
      turboExpressFile.buffer_size = part.byteCount;
      turboExpressFile.metadata = {}
      turboExpressFile.description = `File with name = {${turboExpressFile.fileName}}, sent with name = {${turboExpressFile.name}} and stored into server memory;`
      turboExpressFile.owner = null;

      console.log(turboExpressFile)

      part.on("data", (chunk) => {
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        buffer = Buffer.concat([buffer, chunk]);
      })

      part.on("end", () => {
        console.log("ennennenen")
        turboExpressFile.buffer = buffer;
        turboExpressFile.buffer_size = buffer.length;
        req._files.push(turboExpressFile);
      })

    })
    form.parse(req.IncomingMessage);

    form.on("close", () => {
      console.log(req._files, "@@@")
    })

  } 
  else 
  {
    throw new Error("Currently method to store files not in memory and handle large files, is not implemented.")
  }

 
}