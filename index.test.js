const TurboExpress = require("./lib/TurboServer");
const RequestInterface = require("./lib/types/RequestInterface");
const ResponseInterface = require("./lib/types/ResponseInterface");


const app = new TurboExpress();

class ResponseOverride extends ResponseInterface {
    send() {
        this.headers["Content-Type"] = "text/html";
        this.headers["perfect-evolution"] = "@turbo-express";
        this.OutgoingMessage.writeHead(this.statusCode, this.headers);
        this.OutgoingMessage.end("Works <3");
    }
}

app.overrideResponse(ResponseOverride)

// 6976355584

app.get("/", (req, res) => { 
    res.send()
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