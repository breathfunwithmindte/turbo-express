/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @MikeKarypidis
 * @project - TurboExpress
 * @name Middleware
 * @namespace TurboExpress::types::FileType
 * @license - MIT
 * @copyright - ©2022 PerfectEvolution Corporation;
 * @author - Mike Karypidis
 * @version - 1.0.0
 * @link - https://turboserverjs.org
 * @github - https://github.com/breathfunwithmindte/turbo-server.git
 *
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 */

const { random_string } = require("../utils");

/** @type */
module.exports = class FileType
{
  /** @type {String}    */      id;
  /** @type {String}    */      name;
  /** @type {String}    */      file_name;
  /** @type {String}    */      extension;
  /** @type {String}    */      mime_type;
  /** @type {String}    */      description = "";
  /** @type {String}    */      saved_url = "";
  /** @type {boolean}   */      is_saved = false;
  /** @type {boolean}   */      is_binary = true;
  /** @type {boolean}   */      is_compressible = false;
  /** @type {boolean}   */      is_encrypted = false;
  /** @type {number}    */      buffer_size;
  /** @type {Buffer}    */      buffer;
  /** @type {String}    */      owner = null;
  /** @type {*}         */      metadata = {};

  constructor ()
  {
    this.id = random_string(14);
  }


  save(path)
  {
    try {
      require("fs").writeFileSync(`${require("path").resolve()}${path}/${this.id}.${this.extension}`, this.buffer);
      this.is_saved = true;
      this.saved_url = `${path}/${this.id}.${this.extension}`;
      return this.saved_url;
    } catch (error) {
      this.is_saved = false;
      return error.toString();
    }
  }

  unlink ()
  {
    if(this.is_saved)
    {
      try {
        require("fs").unlinkSync(`${require("path").resolve()}${this.saved_url}`);
        this.is_saved = false;
        this.saved_url = "";
      } catch (error) {
        console.log(error);
      }
    }
  }

  build ()
  {
    return {...this, buffer: null}
  }

}