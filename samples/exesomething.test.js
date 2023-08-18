/**
 * 
 * @name - Turbo Express JS
 * @package - turbo-express-js
 * @author - Mike Karypidis
 * @example - Run Something on Worker and on Master process;
 * @license - MIT
 * 
 * ============================
 * 
 * 
 * ============================
 * 
 */

const TurboExpress = require("../lib/TurboServer"); // replace this line with := const TurboExpress = require("turbo-express-js")

const app = new TurboExpress(2);

TurboExpress.exeMaster(async () => {
  console.log("This callback is executed in master cluster process.")
});
TurboExpress.exeWorker(async () => {
  console.log("This callback is executed on each worker cluster process.")
});

app.listen(5000);