const chalk = require("chalk");
const path = require("path");
const express = require("express");
const nocache = require("nocache");
const mustacheExpress = require("mustache-express");
const GenericCrudRestApi = require("./GenericCrudRestApi");

/**
 * WebSocket Server
 * This Class starts a Classic WebSocket Server and Handles all Requests and Clients.
 * @param {*} opt
 */
const WebServerRestApi = function (opt) {
   let $this = this;
   let _private = {};
   let server = null;

   // Options
   let options = Object.assign(
      {
         port: 5500,
         staticFolder: "./../static",
         viewsFolder: "./../views",
         cryptKey: "",
      },
      typeof opt !== "undefined" ? opt : {}
   );

   /**
    * PRIVATE: Constructor
    */
   _private.init = () => {
      $this.server = express();

      // Set Template Engine to Mustache
      $this.server.engine("mustache", mustacheExpress());
      $this.server.set("view engine", "mustache");
      $this.server.set("views", path.join(__dirname, options.viewsFolder));

      // Set HTTP Server Options
      $this.server.use(nocache());
      $this.server.use(express.urlencoded({ extended: true }));
      $this.server.use(express.json());
      $this.server.use("/static", express.static(path.join(__dirname, options.staticFolder)));

      // Call Default Route Handler
      _private.handleDefaultRoutes();
   };

   /**
    * PUBLIC Listening
    * @param {*} port
    */
   this.listening = (port) => {
      port = typeof port === "undefined" ? options.port : port;
      $this.server.listen(port);
      console.log(chalk.blue.bold("[REST_API] ") + "Server starting................ " + chalk.green.bold("[SUCCESS]"));
      console.log(chalk.blue.bold("[REST_API] ") + "REST_API Server is listening on Port: " + chalk.bold(options.port));
   };

   /**
    * PUBLIC: AddRoute
    * Adding Route to WebServer REST API Server
    * @param {*} method
    * @param {*} path
    * @param {*} callback
    * @param {*} middleware
    */
   this.addRoute = (method, path, callback, middleware) => {
      method = method.toLowerCase();
      if (typeof $this.server[method] === "undefined") return false;
      if (typeof callback !== "function") return false;
      if (typeof middleware === "function") {
         $this.server[method](path, middleware, callback);
      } else {
         $this.server[method](path, callback);
      }
      return true;
   };

   /**
    * PRIVATE: HandleDefaultRoutes
    * This handles the buildin REST Routes.
    */
   _private.handleDefaultRoutes = () => {
      // Add Middleware Error Handler
      $this.server.use((req, res, next) => {
         res.on("finish", () => {
            const codeStr = String(res.statusCode);
            const status = res.statusCode < 400 ? true : false;
            _private.printReq(req, status);
         });
         next();
      });
   };

   /**
    * PRIVATE: PrintReq
    * This is a Helper which is printing out all Incoming requests to the console.
    * @param {*} req
    * @param {*} isValid
    */
   _private.printReq = (req, isValid) => {
      let ip = (req.headers["x-forwarded-for"] || req.connection.remoteAddress || "").split(",")[0].trim();

      let prefix = chalk.green.bold("VALID REQUEST ");
      if (!isValid) {
         prefix = chalk.red.bold("INVALID REQUEST ");
      }

      console.log(chalk.blue.bold("[REST_API] ") + prefix + chalk.bold("FROM") + ": " + (ip == "::1" ? "localhost" : ip) + " " + chalk.bold("URL") + ": " + req.method + " " + req.url);
   };

   /**
    * PUBLIC: UseGenericCrudApi
    * Using Generic CRUD Rest API Server Module.
    * @param {*} config
    */
   this.useGenericCrudApi = (config) => {
      const genericCrudRestApi = new GenericCrudRestApi(config);

      // Request Initialisator
      const initRequest = (req) => {
         if (config.isCrypted) {
            genericCrudRestApi.setCryptKey(options.cryptKey);
         }
         if (config.isAuth) {
            genericCrudRestApi.setUserId(req.userId); // TODO: set UserID from Request (JWWT Middeware should set this...)
         }
      };

      // Set Authentication Middleware if required
      let middleware = null;
      let apiPath = "/public-crud";
      if (config.isAuth) {
         middleware = null; // TODO: JWT MITTLEWARE
         apiPath = "/private-crud";
      }

      // List (?from=1&to=10)
      $this.addRoute(
         "get",
         apiPath + "/:entity",
         (req, res) => {
            initRequest(req);
            const result = genericCrudRestApi.list(req.params.entity, req.query.from, req.query.to);
            res.send(JSON.stringify(result));
         },
         middleware
      );

      // Find
      $this.addRoute(
         "get",
         apiPath + "/:entity/:attr/:value",
         (req, res) => {
            initRequest(req);
            const result = genericCrudRestApi.find(req.params.entity, req.params.attr, req.params.value);
            res.send(JSON.stringify(result));
         },
         middleware
      );

      // Create
      $this.addRoute(
         "post",
         apiPath + "/:entity",
         (req, res) => {
            initRequest(req);
            const result = genericCrudRestApi.create(req.params.entity, req.body);
            res.send(JSON.stringify(result));
         },
         middleware
      );

      // Read
      $this.addRoute(
         "get",
         apiPath + "/:entity/:id",
         (req, res) => {
            initRequest(req);
            const result = genericCrudRestApi.read(req.params.entity, req.params.id);
            res.send(JSON.stringify(result));
         },
         middleware
      );

      // Update
      $this.addRoute(
         "patch",
         apiPath + "/:entity/:id",
         (req, res) => {
            initRequest(req);
            const result = genericCrudRestApi.update(req.params.entity, req.params.id, req.body);
            res.send(JSON.stringify(result));
         },
         middleware
      );

      // Replace
      $this.addRoute(
         "put",
         apiPath + "/:entity/:id",
         (req, res) => {
            initRequest(req);
            const result = genericCrudRestApi.replace(req.params.entity, req.params.id, req.body);
            res.send(JSON.stringify(result));
         },
         middleware
      );

      // Delete
      $this.addRoute(
         "delete",
         apiPath + "/:entity/:id",
         (req, res) => {
            initRequest(req);
            const result = genericCrudRestApi.delete(req.params.entity, req.params.id);
            res.send(JSON.stringify(result));
         },
         middleware
      );
   };

   /**
    * PUBLIC: UseAuthenticationService
    * This is enabling the Authentication Service. If This is enable a User DB File will be created
    * and a Simple USER Login API will be enabled.
    * @param {*} config
    */
   this.useAuthenticationService = (config) => {};

   // Call Init
   _private.init();
};
module.exports = WebServerRestApi;
