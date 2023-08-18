const attachment_middleware = require("./attachment_middleware");
const authentication_middleware = require("./authentication_middleware");
const buildform_middleware = require("./buildform_middleware");
const cors_middleware = require("./cors_middleware");
const runmethod_middleware = require("./runmethod_middleware");
const static_middleware = require("./static_middleware");
const validation_middleware = require("./validation_middleware");

module.exports = {
  attachment_middleware,
  authentication_middleware,
  buildform_middleware,
  cors_middleware,
  runmethod_middleware,
  static_middleware,
  validation_middleware
}