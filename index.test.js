const TurboServer = require("./lib/TurboServer");
const { MongoClient } = require('mongodb');

const RequestInterface = require("./lib/types/RequestInterface");
const ResponseInterface = require("./lib/types/ResponseInterface");
const Router = require("./lib/Router");



/**
 * 
 * @param {RequestInterface} req 
 * @param {ResponseInterface} res 
 * @param {Function} next 
 */
async function mymiddleware (req, res, next)
{
  req.setState("testone", "some test here");

  next();
}


const app = new TurboServer(2);

app.get("/public/*",  TurboServer.Static({ folder: "/public", cache: true }));
app.post("/upload",   TurboServer.Upload({ folder: "/storage", memory: true }));


app.use("/*", TurboServer.Validation({ validations: [
  new TurboServer.ValidationSchema("username", [
    { name: TurboServer.ValidationMethodType.MINLENGTH, value: 3 }, 
    { name: TurboServer.ValidationMethodType.MAXLENGTH, value: 14 },
    { name: TurboServer.ValidationMethodType.ONEOF, value: ["XristinaMike"] }
  ], true, "hello", "body")
]}));
app.use("/*", TurboServer.Authentication());
app.use("/*", TurboServer.BuildForm());
app.use("/*", TurboServer.Cors());

// run method of request without running controller callback
app.get("/hello/:username", TurboServer.RunMethod({ exe: [{ belog: "req", methodname: "fetchUsers", isAsync: true, inject: { somedata: "hello world some data injected to that method" } }] }));

app.get("/", (req, res) => res.status(200).json({}))

/**
 * @AUTHENTICATION MIDDLEWARE
 * @BUILD FORM MIDDLEWARE
 */


/**
 * 
 * @param {RequestInterface} req 
 * @param {ResponseInterface} res 
 * @param {Function} next 
 */
async function hello (req, res, next)
{
  console.log(app.__link_routes = app.__link_routes.filter(f => f.path == "asdasd"))
  console.log(app.__link_routes)
  
  console.log("####", "hello")
  console.log(req.validData)
  next()
  res.status(201).json({result: 1, something: req.validateDataObj(), app: req.instance});
}


app.useEndMiddleware("/*", (req, res, next) => {console.log("middleware running after the controller method - #1"); next()}, (req, res, next) => {console.log("last middleware #2"); next()});


app.use("/*", TurboServer.Cors({  }))

app.get("/a/ok", (req, res) => {
  res.send("hello")
})

app.get("/hello/:username", 
  TurboServer.RunMethod({ exe: [{ belog: "req", methodname: "something", isAsync: true, inject: { somedata: "hello world some data" } }] }), 
  TurboServer.Validation({ validations: [
  new TurboServer.ValidationSchema("username", [
    { name: TurboServer.ValidationMethodType.MINLENGTH, value: 3 }, 
    { name: TurboServer.ValidationMethodType.MAXLENGTH, value: 14 },
    { name: TurboServer.ValidationMethodType.ONEOF, value: ["XristinaMike"] }
  ], true, "hello", "params")
] }), hello);

app.get("/hello1/:username", hello);

  app.link("/hello1/:username", 
  TurboServer.Validation({ validations: [
    new TurboServer.ValidationSchema("username", [
      { name: TurboServer.ValidationMethodType.MINLENGTH, value: 3 }, 
      { name: TurboServer.ValidationMethodType.MAXLENGTH, value: 14 },
      { name: TurboServer.ValidationMethodType.ONEOF, value: ["XristinaMike"] }
    ], true, "hello", "params")
  ]}),

  hello);

  const admin_router = new TurboServer.Router();

  admin_router.get("/admin/:username", (req, res) => { res.send(req.params().get("username")) });
  
  app.use("/api/v1/", admin_router)


app.listen(5000);

app.logRoutes();

//console.log(app);



