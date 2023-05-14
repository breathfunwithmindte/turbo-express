
// ? testing with thousends of middleware 

// for (let i = 0; i < 10000; i++) {
  
//   app.use("/a/*", (req, res, next) => {
//     next()
//     req.setState("something", "helloow rold")
//     console.log("something middleware is running 111");
//   }, (req, res, next) => {
//     next()
//     req.setState("something", "helloow rold 222")
//     console.log("something middleware is running 222");
//   })
    
//   }
  
//   app.get("/a/hello", (req, res) => {
//     res.send(req.useState("something"));
//   })

// ! result: not cost any performance;\


// ? testing middleware after route 

// app.use("/somepath", (req, res, next) => {console.log("wowoowow middleware is running"); next()});

// app.get("somepath", mycallaback)

// app.use("/somepath", (req, res, next) => {console.log("wowoowow middleware is running"); next()});

// ! result: middleware will not run if it set after the route\








// ! using runmethod to execute validations;


app.get("/hello1/:username", 
  TurboServer.RunMethod({ exe: [
    { belong: "req", methodname: "runmethod_addvalidation", inject: { validation: new TurboServer.ValidationSchema("username", [
      { name: TurboServer.ValidationMethodType.MINLENGTH, value: 3 }, 
      { name: TurboServer.ValidationMethodType.MAXLENGTH, value: 14 },
      { name: TurboServer.ValidationMethodType.ONEOF, value: ["XristinaMike"] }
    ], true, "hello", "params") } },

    { belong: "req", methodname: "execute_validation", inject: {}, isAsync: true }
  
  
  ] }),
  
  
  hello);