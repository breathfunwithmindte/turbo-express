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

/** @type */
module.exports = class FileType
{
  /** @type {String}    */      name;
  /** @type {String}    */      fileName;
  /** @type {String}    */      extension;
  /** @type {String}    */      mime_type;
  /** @type {String}    */      description;
  /** @type {boolean}   */      is_saved;
  /** @type {boolean}   */      is_binary;
  /** @type {boolean}   */      is_compressible;
  /** @type {boolean}   */      is_encrypted;
  /** @type {number}    */      buffer_size;
  /** @type {Buffer}    */      buffer;
  /** @type {String}    */      owner;
  /** @type {*}         */      metadata;


  save(path, cb)
  {

  }

  saveSync (path)
  {

  }

  /**
   * @param {*} by 
   */
  fileExtension (by)
  {

  }

}