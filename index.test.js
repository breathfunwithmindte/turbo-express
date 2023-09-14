const TurboExpress = require("./lib/TurboServer");
const RequestInterface = require("./lib/types/RequestInterface");
const SimpleResponse = require("./lib/types/Response/SimpleResponse");
const ResponseInterface = require("./lib/types/ResponseInterface");

const app = new TurboExpress(1);
app.overrideResponse(SimpleResponse)
// 6976355584

app.get("/", (req, res) => {
    res.redirect("Hello World")
})
// app.use("/asd", new TurboExpress.Router)

app.listen(3001, () => console.log("Server is running on port 3000"));