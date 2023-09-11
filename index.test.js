const TurboExpress = require("./lib/TurboServer");
const RequestInterface = require("./lib/types/RequestInterface");
const SimpleResponse = require("./lib/types/Response/SimpleResponse");
const ResponseInterface = require("./lib/types/ResponseInterface");


const app = new TurboExpress();
app.overrideResponse(SimpleResponse)


// 6976355584

app.get("/", (req, res) => { 
    res.redirect("Redirect")
    // res.redirect("/home") 
});

app.get("/home", (req, res) => { 
    res.redirect("/about") 
});

app.get("/about", (req, res) => { 
    res.send("Redirects test") 
});



app.use("/asd", new TurboExpress.Router)

app.listen(3001, () => console.log("Server is running on port 3000"));