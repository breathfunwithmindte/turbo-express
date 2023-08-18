const AuthenticationService = require("./AuthenticationService");
const FormDataService = require("./FormDataService");
const LocaleService = require("./LocaleService");
const SystemService = require("./SystemService");


module.exports = class ExpressService
{
  static AuthenticationService = AuthenticationService;
  static FormDataService = FormDataService;
  static SystemService = SystemService;
  static LocaleService = LocaleService;
}