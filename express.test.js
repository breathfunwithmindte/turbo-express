const app = require("express")()

const cluster = require("cluster")
const router = require("express").Router();

if (cluster.isMaster) {
  for (let i = 0; i < 7; i++) { cluster.fork() }
} else {
  let p = "/"
  //app.use(require("express").static(require("path").resolve() + "/public"));
  console.log("running")
  app.listen(5001)


  app.get("/hi", (req, res) => res.send("hi"));

  return;

  for (let i = 0; i < 11; i++) {
    router.get(p, (req, res) => res.send(`Current ${i}`));
    p = p + ":a/"
  }

  app.use("/public/something/*", require("express").static(require("path").resolve() + "/public"))

  

  async function mycallaback (req, res) {
    const r = req.body
  
    res.status(201).json({ body: r, aq: [
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},{params: req.params, queries: req.query},
      {params: req.params, queries: req.query},{params: req.params, queries: req.query},
    ] });
  }

  app.use(require("express").static("/public"));

  app.get("/about/:something", mycallaback)  
  

  app.use(require("express").json())
  app.use((req, res, next) => next());
  app.use((req, res, next) => next());
  app.use((req, res, next) => next());
  app.use((req, res, next) => next());
  app.use((req, res, next) => next());
  app.use((req, res, next) => next());
  app.use((req, res, next) => next());
  app.use(router);

}

