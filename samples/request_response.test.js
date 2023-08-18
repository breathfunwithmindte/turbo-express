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

class MyRequest extends RequestInterface 
{
  mymethod ()
  {
    return `Hello ${this.params().get("username")}, I am Kristina !!`;
  }
}

class MyResponse extends ResponseInterface
{
  my_response_method (req)
  {
    this.status(200).json({ message: req.mymethod() })
  }
}

app.Request = MyRequest;
app.Response = MyResponse;


app.get("/:username", controller);

app.listen(5000);

/**
 * @param {MyRequest} req 
 * @param {MyResponse} res 
 */
async function controller (req, res) {
  res.my_response_method(req);
}