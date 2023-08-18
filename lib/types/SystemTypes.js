const RequestInterface = require("./RequestInterface");
const ResponseInterface = require("./ResponseInterface");
const ResponseMongo = require("./ResponseMongo");
const Route = require("./Route");
const Middleware = require("./Middleware");
const MemoryManagement = require("./MemoryManagement");
const RunMethodType = require("./RunMethodType");
const FileType = require("./FileType");


module.exports = class SystemTypes
{
  static RequestInterface = RequestInterface;
  static ResponseInterface = ResponseInterface;
  static ResponseMongo = ResponseMongo;
  static Route = Route;
  static Middleware = Middleware;
  static MemoryManagement = MemoryManagement;
  static RunMethodType = RunMethodType;
  static FileType = FileType;
}