const TurboExpress = require("./lib/TurboServer");
const RequestInterface = require("./lib/types/RequestInterface");
const ResponseInterface = require("./lib/types/ResponseInterface");

const app = new TurboExpress(1);

// 6976355584

// app.get("/", (req, res) => {req.}, (req, res) => {req.});

// app.use("/asd", new TurboExpress.Router)

app.listen(3001, () => console.log("Server is running on port 3000"));