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

app.use("/*", TurboExpress.Cors());



app.get("/:username", controller);


app.options("/*", (req, res) => res.send("ok")); // in most cases u need to include this like because browser will send options request before the main request.

app.listen(5000);

/**
 * @param {RequestInterface} req 
 * @param {ResponseInterface} res 
 */
async function controller (req, res) {
  res.send(`Hello ${req.params().get("username")}, I am Kristina !!`);
}