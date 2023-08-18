/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @MikeKarypidis
 * @project - TurboExpress
 * @name Middleware
 * @namespace TurboExpress::services::AuthenticationService
 * @license - MIT
 * @copyright - ©2022 PerfectEvolution Corporation;
 * @author - Mike Karypidis
 * @version - 1.0.0
 * @link - https://turboserverjs.org
 * @github - https://github.com/breathfunwithmindte/turbo-server.git
 *
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 */

const multiparty = require("multiparty")
const FileType = require("../types/FileType");


module.exports = class FormDataService
{

  /** @type {import("../types/RequestInterface")} */ req;
  /** @type {Boolean}                             */ log;
  /** @type {Boolean}                             */ idk;

  constructor(props) { this.req = props.req; this.log = props["log"] || false }
  

  async memory_read ()
  {
    const _body_hash = new Object();
    return new Promise((resolve, reject) => {
      const form = new multiparty.Form({  });
      form.on("part", (part) => {
        let buffer = Buffer.alloc(0);
        let mine_type = part.headers["content-type"] || "";
        let turboExpressFile = new FileType();
        turboExpressFile.name = part.name;
        turboExpressFile.file_name = part.filename || "nofilename";
        turboExpressFile.is_binary= true;
        turboExpressFile.extension = mine_type.split("/")[1] || "not-found"
        turboExpressFile.mime_type = mine_type;
        turboExpressFile.buffer_size = part.byteCount;
        turboExpressFile.description = `File with name = {${turboExpressFile.file_name}}, sent with name = {${turboExpressFile.name}} and stored into server memory;`
        
        part.on("data", (chunk) => buffer = Buffer.concat([buffer, chunk]));
        part.on("error", (err) => console.log(err))
        part.on("end", () => {
          turboExpressFile.buffer = buffer;
          turboExpressFile.buffer_size = buffer.length;
          this.req._files.push(turboExpressFile)
          _body_hash[part.name] = `attachment::${turboExpressFile.id}`
        })
      })
      form.on("error", (err) => {
        console.log(err);
        reject(err);
      })
      form.on("field", (name, value) => _body_hash[name] = this.#getValueByType(value));
      form.on("progress", (...props) => {/** console.log(props) */})
      form.on("close", () => {
        if(this.log === true) console.log("Form data service completed without error, body hash is ~> ", _body_hash);
        resolve(_body_hash);
      })
      form.parse(this.req.IncomingMessage);
    })
  }


  #getValueByType (value)
  {
    if(typeof value !== "string") return null
    if(value.toLowerCase() === "true") return true;
    if(value.toLowerCase() === "false") return false;
    if(value.toLowerCase() === "nil" || value.toLowerCase() === "null") return null;
    if(!isNaN(Number(value))) return Number(value);
    return value;
  }

}



// ! store files
// async memory_read ()
// {
//   const _body_hash = new Object();
//   return new Promise((resolve, reject) => {
//     const form = new multiparty.Form({
//       autoFields: true,
//       autoFiles: true,
//       uploadDir: require("path").resolve() + "/samples"
//     });
//     // form.on("part", (part) => {
//     //   console.log(part);
//     //   //part.on("data", () => {console.log("dataa")})
//     //   //part.on("end", (...e) => { console.log("end", e)})
//     // })
//     form.on("error", (err) => {
//       console.log(err);
//       reject(err);
//     })
//     form.on("field", (name, value) => _body_hash[name] = this.#getValueByType(value));
//     form.on("progress", (...props) => {/** console.log(props) */})
//     form.on("close", () => resolve(_body_hash))
//     form.parse(this.req.IncomingMessage);
//   })
// }