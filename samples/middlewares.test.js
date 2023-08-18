/**
 * 
 * @name - Turbo Express JS
 * @package - turbo-express-js
 * @author - Mike Karypidis
 * @example - Middlewares out of the box
 * @license - MIT
 * 
 * ============================
 * 
 * 
 * ============================
 * 
 */

const TurboExpress = require("../lib/TurboServer"); // replace this line with := const TurboExpress = require("turbo-express-js")
const RequestInterface = require("../lib/types/RequestInterface");
const ResponseInterface = require("../lib/types/ResponseInterface");
const app = new TurboExpress(1);

app.use("/*", TurboExpress.Cors({ origins: ["*"] })); // CORS middleware
app.get("/public/*", TurboExpress.Static({ folder: "/public" })); // Serve static files
app.post("/replace-attachments", TurboExpress.Upload({ memory: true, folder: "/storage" }), attachment_replace); // Handle attachment replacement
app.get("/run-method", TurboExpress.RunMethod({
  exe: [{ isAsync: true, belong: "res", methodname: "test_runmethod", inject: "injected data" }]
})); // Execute methods of req or res without passing a controller function

// app.get("/something", TurboExpress.Validation())                                                       // Look at example for request validation
// app.get("/something", TurboExpress.Authentication({ authentication_service: authenticationService })) //  Look at example for authentication
// app.get("/user/new", TurboExpress.BuildForm()) // Work in progress

app.get("/:username", (req, res) => res.send("ok with cors: " + req.params().get("username")));

app.options("/*", (req, res) => res.send("ok")); // CORS :: in most cases u need to include this line because browser will send options request before the main request.

app.listen(5000);

/**
 * @param {RequestInterface} req 
 * @param {ResponseInterface} res 
 */
async function attachment_replace(req, res) {
  // req._files[0].is_saved   // if not error this will be true
  // req._files[0].save()     // this method is used to save the file, file can be saved without middleware.
  // req._files[0].unlink()   // delete the file is it is saved, in case for some reason, file that was saved should be rolled back.

  res.status(200).json({
    body: await req.body(), // attachment properties will be replaced by url using Upload middleware.
    files: req.files()
  });
}