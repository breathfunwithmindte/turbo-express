
# turbo express

//app.get("/public/something/*", TurboServer.Static({ folder: "/public", cache: true }))

oha http://localhost:5000/public/something/testass.jpg -n 1000
Summary:
  Success rate:	1.0000
  Total:	0.0666 secs
  Slowest:	0.0492 secs
  Fastest:	0.0001 secs
  Average:	0.0029 secs
  Requests/sec:	15018.7871

  Total data:	104.55 MiB
  Size/request:	107.06 KiB
  Size/sec:	1.53 GiB


# expressjs

// app.use("/public/something/*", require("express").static(require("path").resolve() + "/public"))

oha http://localhost:5001/testass.jpg -n 1000
Summary:
  Success rate:	1.0000
  Total:	0.2664 secs
  Slowest:	0.0755 secs
  Fastest:	0.0017 secs
  Average:	0.0131 secs
  Requests/sec:	3754.2075

  Total data:	104.55 MiB
  Size/request:	107.06 KiB
  Size/sec:	392.51 MiB
