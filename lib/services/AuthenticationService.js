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

const RequestInterface = require("../types/RequestInterface");
const ResponseInterface = require("../types/ResponseInterface");
const { Log, random_string, random_number } = require("../utils");


module.exports = class AuthenticationService
{

  /** @type {Boolean}               */  useRedis    = false;  // not implemetated
  /** @type {Boolean}               */  setCookie   = false;  // not implemetated
  /** @type {Boolean}               */  useDbUser   = false;
  /** @type {Boolean}               */  devLogs     = false;
  /** @type {Boolean}               */  nonBlocking = false;

  /** @type {Map<String, String>}   */  pins = new Map();
  /** @type {Map<String, String>}   */  tokens = new Map();

  /** @type {String}                */  secret = "s3cr3t";
  /** @type {String}                */  secret_tmp = "s-tmp";
  
  /** @type {String[][]}            */  user_key_value_properties = [
    ["user_id", "id"],
    ["username", "username"],
    ["email", "email"]
  ];

  async setMemory (namespace, key, value) { this[namespace].set(key, value); }
  async getMemory (namespace, key) { return this[namespace].get(key); }
  async deleteMemory (namespace, key) { this[namespace].delete(key); }

  constructor(props) {
    
  }

  async signToken (tokenData, key) {
    const jwt = require("jsonwebtoken");
    return jwt.sign(tokenData, (key || this.secret));
  }

  async verifyToken (token, key) {
    const jwt = require("jsonwebtoken");
    return jwt.verify(token, (key || this.secret));
  }

  async find_user (login_value) { throw new Error("Require implmetation ~> find_user") }
  async compare_password  (user, password) { throw new Error("Require implmetation ~> compare_password") }
  get_token (req) { throw new Error("Require implmetation ~> get_token") }
  async do_something_with_pin (pin) { throw new Error("Require implmetation ~> do_something_with_pin") }


  /**
   * @param {RequestInterface} req
   * @param {ResponseInterface} res
   */
  async authenticated (req, res, next)
  {
    try {
      const tokenData = await this.verifyToken(this.get_token(req), this.secret);
      const userObj = new Object();
      console.log(tokenData);
      this.user_key_value_properties.map(i => userObj[i[1]] = tokenData[i[0]]);
      const curr_user = this.useDbUser ? await this.find_user(tokenData["login_value"]) : userObj;
      if(!curr_user) {
        if(this.nonBlocking) {
          req.setState("authenticated", false);
          req.setState("user", null);
          return next();
        } else {
          return res.status(401).json({ status: 401, message: "Not authenticated || 401" });
        }
      }
      req.setState("authenticated", true);
      req.setState("login_value", tokenData["login_value"]);
      req.setState("authentication_type", tokenData["authentication_type"]);
      req.setState("user", curr_user);
      next()
    } catch (error) {
      if(this.devLogs) console.log(error);
      if(this.nonBlocking) {
        req.setState("authenticated", false);
        req.setState("user", null);
        return next();
      }
      return res.status(401).json({ status: 401, message: "Not authenticated || 401" });
    }
  }

  /**
   * @param {RequestInterface} req
   * @param {ResponseInterface} res
   */
  async simpleLogin (req, res)
  {
    try {
      const body = await req.body();
      const query = req.queriesObj();

      const loginValue = body["login_value"] || query["login_value"];
      const password = body["password"] || query["password"];

      if(!loginValue || !password) return res.status(400).json({ status: 400, message: "Bad Request || 400", description: "<login_value> && <password> are required in query string or request body." });

      const user = await this.find_user(loginValue);
      if(this.devLogs) console.log(`User search using ${loginValue} := ${JSON.stringify(user)}`)
      
      if(!user) return res.status(401).json({ status: 401, message: "Not authenticated || 401" });

      const passwordMatch = await this.compare_password(user, password);
      if(!passwordMatch) return res.status(401).json({ status: 401, message: "Not authenticated || 401" });

      const tokenObj = new Object();
      tokenObj["login_value"] = loginValue;
      tokenObj["authentication_type"] = "simple-authentication";
      this.user_key_value_properties.map(i => tokenObj[i[0]] = user[i[1]]);
      if(this.devLogs) console.log(`Token Data generated := ${JSON.stringify(tokenObj)}`)
      return res.status(200).json({ status: 200, message: "ok", token: await this.signToken(tokenObj) });
    } catch (error) {
      console.log(error)
      return res.status(401).json({ status: 401, message: "Not authenticated || 401" });
    }
  }

  /**
   * @param {RequestInterface} req
   * @param {ResponseInterface} res
   */
  async doubleLoginWorkflow (req, res)
  {
    try {
      const body = await req.body();
      const query = req.queriesObj();
      const token = body["token"] || query["token"];
      const loginValue = body["login_value"] || query["login_value"];
      const password = body["password"] || query["password"];
      const pin = body["pin"] || query["pin"];

      if(token) {
        if(!pin) return res.status(400).json({ status: 400, message: "Bad Request || 400", description: "<pin> is required in query string or request body." });
        
        const tokenData = await this.verifyToken(token, this.secret_tmp);

        if(this.devLogs) console.log(`Temporary token data := ${JSON.stringify(tokenData)}`);
        
        const pin_stored = await this.getMemory("pins", tokenData["login_value"]);

        if(this.devLogs) console.log(`Random pin in memory for ${tokenData["login_value"]} := ${await this.getMemory("pins", loginValue)}, request body pin := ${pin}`);

        if(!pin_stored) return res.status(401).json({ status: 401, message: "Not authenticated || 401", description: "Pin not exist" });
        if(pin_stored.toString() != pin.toString()) return res.status(401).json({ status: 401, message: "Not authenticated || 401", description: "Pin is not matched" });
        
        await this.deleteMemory("pins", tokenData["login_value"]);

        const user = await this.find_user(tokenData["login_value"]);
        if(this.devLogs) console.log(`User search using ${loginValue} := ${JSON.stringify(user)}`)
        if(!user) return res.status(401).json({ status: 401, message: "Not authenticated || 401" });

        const tokenObj = new Object();
        tokenObj["login_value"] = loginValue;
        tokenObj["authentication_type"] = "double-authentication";
        tokenObj["pin"] = pin_stored;
        this.user_key_value_properties.map(i => tokenObj[i[0]] = user[i[1]]);
        if(this.devLogs) console.log(`Token Data generated := ${JSON.stringify(tokenObj)}`)
        return res.status(200).json({ status: 200, message: "ok", token: await this.signToken(tokenObj) });
        
      } else {
        if(!loginValue || !password) return res.status(400).json({ status: 400, message: "Bad Request || 400", description: "<login_value> && <password> are required in query string or request body." });

        const user = await this.find_user(loginValue);
        if(this.devLogs) console.log(`User search using ${loginValue} := ${JSON.stringify(user)}`)
        if(!user) return res.status(401).json({ status: 401, message: "Not authenticated || 401" });
  
        const passwordMatch = await this.compare_password(user, password);
        if(!passwordMatch) return res.status(401).json({ status: 401, message: "Not authenticated || 401" });

        const new_pin = random_number(1000, 9999);
        await this.do_something_with_pin(new_pin);
        await this.setMemory("pins", loginValue, new_pin);

        if(this.devLogs) console.log(`Random pin in memory for ${loginValue} := ${await this.getMemory("pins", loginValue)}`)
  
        return res.status(200).json({ status: 200, message: "ok", token: await this.signToken({ login_value: loginValue }, this.secret_tmp) });
      }
    } catch (error) {
      console.log(error)
      return res.status(401).json({ status: 401, message: "Not authenticated || 401" });
    }
  }


}