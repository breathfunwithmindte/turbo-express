const AuthenticationService = require("../../services/AuthenticationService");

module.exports = class JWTBcryptMongoDBAuthService extends AuthenticationService
{

  /** @type {string[]}                  */ db_fields = [];
  /** @type {import("mongoose").Model}  */ UserModel;

  constructor(options={}) {
    super();

    this.bcrypt = require("bcryptjs");
    this.jwt = require("jsonwebtoken");

    this.db_fields = options["db_fields"] || ["username", "email"];
    this.UserModel = options["UserModel"];
    this.devLogs = options["devLogs"] || true;
    this.useDbUser = options["useDbUser"] || false;
    
  }

  async find_user (login_value)
  {
    try {
      const queries = [];
      this.db_fields.map(i => queries.push({ [i]: login_value }))
      return await this.UserModel.findOne({ $or: queries });
    } catch (error) {
      console.log(error)
      return null;
    }
  }

  async compare_password (user, password)
  {
    return this.bcrypt.compareSync(password, user["password"]);
  }

  /** @param {RequestInterface} req */
  get_token (req) {
    return req.headers()["authentication"];
  }

  async do_something_with_pin (pin) {
    console.log("\n" + pin + "\n");
  }

}