const fs = require("fs");

module.exports = class LocaleService
{

  /** @type {String[]}                         */ allowed_locales = new Array();
  /** @type {Map<String, Map<String, String>>} */ locales = new Map();

 
  /**
   * 
   * @param {String} directory 
   */
  fillLocales (directory)
  {
    fs.readdirSync(require("path").resolve() + directory).map(f => {
      if(fs.statSync(require("path").resolve() + directory + "/" + f).isFile() === false)
      {
        this.allowed_locales.push(f);
        const localeMap = new Map();
        fs.readdirSync(require("path").resolve() + directory + "/" + f).map(j => {
          const content = JSON.parse(fs.readFileSync(require("path").resolve() + directory + "/" + f + "/" + j, "utf-8"));
          for (const key in content) if (Object.hasOwnProperty.call(content, key)) { localeMap.set(key, content[key]) }
          this.locales.set(f, localeMap);
        })
      }
    })
    console.log(this)
  }

  /**
   * 
   * @param {String} locale 
   * @param {String} key 
   * @returns {String | null}
   */
  get (locale, key)
  {
    if(this.locales.has(locale))
    {
      return this.locales.get(locale).get(key) || null
    }
    return null;
  }

}