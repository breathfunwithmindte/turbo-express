
# turbo express

//app.get("/public/something/*", TurboServer.Static({ folder: "/public", cache: true }))

oha http://localhost:5000/public/something/sample.mp4 -n 1000
Summary:
  Success rate:	1.0000
  Total:	8.2990 secs
  Slowest:	1.1018 secs
  Fastest:	0.0914 secs
  Average:	0.4102 secs
  Requests/sec:	120.4966

  Total data:	40.57 GiB
  Size/request:	41.55 MiB
  Size/sec:	4.89 GiB


# expressjs

// app.use("/public/something/*", require("express").static(require("path").resolve() + "/public"))

oha http://localhost:5001/sample.mp4 -n 1000
Summary:
  Success rate:	1.0000
  Total:	26.2146 secs
  Slowest:	2.7239 secs
  Fastest:	1.0497 secs
  Average:	1.3067 secs
  Requests/sec:	38.1467

  Total data:	40.57 GiB
  Size/request:	41.55 MiB
  Size/sec:	1.55 GiB
