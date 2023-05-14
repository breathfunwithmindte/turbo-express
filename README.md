# TurboServer - A Fast and Powerful Node.js Web Framework

    TurboServer is inspired by Express.js and offers a similar API to make it easy for developers familiar with Express to get started. In fact, TurboServer offers many of the same features and middleware that Express does, making it a great choice for developers who want a fast and efficient alternative to Express.

#

    Additionally, TurboServer is built with an OOP architecture in mind, with Request and Response classes acting as interfaces. This makes it easy for developers to add new methods or override default functionality, leading to increased scalability and flexibility for your web applications.

#

## Installation

To install TurboServer, simply run the following command:

```
npm install turboserver
```

## Getting Started

Here's a simple example of how to create a basic server using TurboServer:

``` javascript

  const TurboServer = require('turboserver');

  const app = new TurboServer(1);

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
```

# Clustering

TurboServer is built to support clustering out of the box. By passing a number to the TurboServer constructor, you can specify how many worker processes to spawn for your application.

In the example above, const app = new TurboServer(2) tells TurboServer to start two worker processes for the server. This allows the server to handle multiple requests simultaneously, improving the performance and scalability of your application.

To take full advantage of the clustering feature, it's important to make sure your application is stateless and doesn't rely on local variables or in-memory storage. With proper configuration, clustering can help your application handle a large number of requests with ease.

## Middlewares

TurboServer includes a number of built-in middlewares that you can use to add functionality to your application. Here are some of the most commonly used middlewares:
Static

The Static middleware serves static files from a specified folder:

``` javascript
  app.use(TurboServer.Static({ folder: '/public' }));
```


# Upload

The Upload middleware handles file uploads:


``` javascript
 app.post('/upload', TurboServer.Upload({ folder: '/storage' }));
```

## Validation

The Validation middleware validates incoming requests against a specified schema (can validate by namespaces<params, query, body>):

``` javascript
  app.use(TurboServer.Validation({ 
  validations: [
    new TurboServer.ValidationSchema("username", [
      { name: TurboServer.ValidationMethodType.MINLENGTH, value: 3 }, 
      { name: TurboServer.ValidationMethodType.MAXLENGTH, value: 14 },
      { name: TurboServer.ValidationMethodType.ONEOF, value: ["Xristina"] }
    ], true, "Default Value", "body")
  ]
}));
```

## Authentication

The Authentication middleware handles user authentication:

*work in progress still

``` javascript
  app.use(TurboServer.Authentication());
```

## BuildForm

The BuildForm middleware parses some sort of model and can generate list of fields for external app (reactJS, nextJS) or for template engine like EJS:

*work in progress still

``` javascript
  app.use(TurboServer.BuildForm());
```

## Cors

The Cors middleware adds CORS headers to responses:

*work in progress still

``` javascript
  app.use(TurboServer.Cors());
```


## Custom Middleware

In addition to the built-in middlewares, TurboServer allows you to create your own custom middlewares for your application. Custom middleware functions can be used to add functionality to your application that is specific to your needs.

To create a custom middleware function, simply define a function that takes three parameters: the request object, the response object, and the next function. The next function is a callback that is used to pass control to the next middleware function in the chain.

Here's an example of a custom middleware function that logs the request method and URL to the console:

``` javascript
  function logger(req, res, next) {
    console.log(`${req.method()} ${req.url()}`);
    next();
  }

  app.use(logger);
```

In the above example, we define a logger function that logs the request method and URL to the console, and then calls the next function to pass control to the next middleware function in the chain. We then use the app.use method to add the logger function as a middleware function for all routes in our application.

You can define as many custom middleware functions as you need, and they will be executed in the order in which they are added to the middleware stack.

## Custom Middleware after controller

In TurboServer, you can define middleware that will run after the controller method has completed. This can be useful for tasks such as logging, error handling, or any other post-processing that needs to be done after the response has been sent.

To define an end middleware in TurboServer, you can use the useEndMiddleware method. This method takes a path pattern and one or more middleware functions as arguments. The middleware functions will be executed in the order they are passed to the method.

Here is an example of how to define an end middleware in TurboServer:

``` javascript
  app.useEndMiddleware("/api/*", (req, res, next) => {
    console.log("End middleware #1");
    next();
  }, (req, res, next) => {
    console.log("End middleware #2");
    next();
  });
```

#

## Router

TurboServer offers a built-in Router to handle different HTTP methods and routes. The Router class is similar to the express.Router class, but it has some additional features. Here's a simple example of how to create a router and use it with TurboServer:

``` javascript
  const TurboServer = require('turboserver');

  const app = new TurboServer(2);
  const router = new TurboServer.Router();

  router.get("/admin/:username", (req, res) => { res.send(req.params().get("username")) });

  app.use('/api', router);

  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });

```

## About the Author

Our lead developer is a top-tier expert web and software engineer with mastery in over 20 programming languages, including Java, PHP, JavaScript, Golang, C, C++, and Python. With years of experience, they have built numerous open-source projects in these languages, including web, mobile, and desktop applications, as well as libraries and frameworks. Their expertise and passion for technology have been the driving force behind the creation of TurboServer, and they continue to work tirelessly to make it the fastest and most efficient web framework available.

#

## Conclusion

TurboServer is a powerful and fast Node.js web framework that makes it easy to build high-performance web applications. With its built-in middlewares and simple API, it's a great choice for any project.

#

First deployment: 14/05/2023