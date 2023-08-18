const ValidationSchema = require("./ValidationSchema");
const ValidationStaticTypes = require("./ValidationStaticTypes");
const ValidationError = require("./ValidationError");

/** @Export */
module.exports = class ValidationTypes 
{
  static ValidationSchema = ValidationSchema;
  static ValidationName = ValidationStaticTypes;
  static ValidationError = ValidationError;
}