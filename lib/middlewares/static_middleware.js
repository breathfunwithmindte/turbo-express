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

const fs = require("fs");
const FileEndToContentType = require("../enum/FileEndToContentType");
const RequestInterface = require("../types/RequestInterface");
const ResponseInterface = require("../types/ResponseInterface");

/**
* 
* @param {RequestInterface} req 
* @param {ResponseInterface} res 
* @param {*} next 
*/
module.exports = function static_middleware (req, res, next) 
{
 const filePathParam = req.url().split(req.current.path_parts.slice(0, req.current.path_parts.length - 1).join("/"))[1];
 const correctHeaders = FileEndToContentType(filePathParam);

 const filePath = require("path").resolve() + this.folder + filePathParam;

 if(fs.existsSync(filePath) === false) {
  res.OutgoingMessage.writeHead(200, { ...res.headers, 'Content-Type': 'text/html', });
  return res.OutgoingMessage.end("NOT FOUND || 404")
 }

 /**
  * @doc if in global property {TurboExpressCaching} exist the filepath
  * then send file from cache;
  */
 if(global["TurboExpressCaching"][filePath]) {
  res.OutgoingMessage.writeHead(200, { ...res.headers, 'Content-Type': correctHeaders });
  res.OutgoingMessage.end(global["TurboExpressCaching"][filePath]);
  return;
 }
 
 /**
  * @doc read file using nodejs streams;
  * when stream is over, check if cache property is true, then
  * if true save the buffer to global {TurboExpressCaching}
  * in any case send the file to the client;
  */
 const stream = fs.createReadStream(filePath);

 res.OutgoingMessage.writeHead(200, { ...res.headers, 'Content-Type': correctHeaders });

 let chunks = [];

 stream.on("data", (chunk) => chunks.push(chunk))
 stream.on("end", () => {
   let fileData = Buffer.concat(chunks);
   if(this.cache) global["TurboExpressCaching"][filePath] = fileData;
   res.OutgoingMessage.end(fileData);
 });

 stream.on('error', (err) => {
   res.OutgoingMessage.writeHead(404);
   res.OutgoingMessage.end(err.message);
 });

}