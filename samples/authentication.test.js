/**
 * 
 * @name - Turbo Express JS
 * @package - turbo-express-js
 * @author - Mike Karypidis
 * @example - Authentication out of the box
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

// class MyAuthenticationService extends TurboExpress.TurboExpressDefault.JWTBcryptMongoDBAuthService; Work Completed but documetation will come soon. Class that already implements all the required methods using MongoDB database, jwt and bcryptjs.

class MyAuthenticationService extends TurboExpress.ExpressServices.AuthenticationService {

  // Override default values if needed
  // secret
  // secret_tmp
  // user_key_value_properties

  async find_user(login_value) 
  {
    // Find the actual user in the database or from an external service using the login_value (e.g., email, phone number, username)
    if (login_value === "katia") return { user_id: "1", email: "katia@gmail.com", username: "@katia" };
    return null; // User not found or unauthorized (401)
  }

  async compare_password(user, password) 
  {
    return true; // Compare user.password with the incoming password (Note: Do not use this implementation in production)
  }

  get_token(req) 
  {
    return req.headers()["authentication"]; // Get the token from headers or cookies and manipulate if needed
  }

  async do_something_with_pin(pin) 
  {
    console.log("\n" + pin + "\n"); // Do something with the generated pin (e.g., send an email)
  }

  // Optional methods (not required to be implemented)
  // signToken() {} // You need to install the jsonwebtoken library to use this method
  // verifyToken() {} // You need to install the jsonwebtoken library to use this method
}

const authService = new MyAuthenticationService();

// Simple login: <login_value, password> => returns a token
app.post("/login", async (req, res) => await authService.simpleLogin(req, res));

// Login workflow case #1: <login_value, password> => returns a temporary token
// Login workflow case #2: <pin, tmp token> => returns a token
app.post("/double-login", async (req, res) => await authService.doubleLoginWorkflow(req, res));

// Authenticated route
app.get(
  "/authenticated", 
  async (req, res, next) => await authService.authenticated(req, res, next), 
  (req, res) => res.status(200).json(req.getStateObj())
);

app.listen(5000);