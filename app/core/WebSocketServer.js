const chalk = require("chalk");
const PubSub = require("pubsub-js");
const WebSocket = require("ws");
const Util = require("./Util.js");

/**
 * WebSocket Server
 * This Class starts a Classic WebSocket Server and Handles all Requests and Clients.
 * @param {*} opt
 */
const WebSocketServer = function (opt) {
   let $this = this;
   let _private = {};
   let server = null;

   // Options
   let options = Object.assign(
      {
         port: 5505,
      },
      typeof opt !== "undefined" ? opt : {}
   );

   /**
    * PRIVATE: Constructor
    */
   _private.init = () => {};

   /**
    * PUBLIC: Listening
    * Starting Websocket Server
    * @param {*} port OPTIONAL
    */
   this.listening = (port) => {
      port = typeof port === "undefined" ? options.port : port;
      server = new WebSocket.Server({ port: port });

      console.log(chalk.blue.bold("[WebSocket] ") + "Server starting................ " + chalk.green.bold("[SUCCESS]"));
      console.log(chalk.blue.bold("[WebSocket] ") + "WebSocket Server is listening on Port: " + chalk.bold(options.port));

      // Call Client Connections Handler
      _private.handleClientConnections();
      _private.handleClientDisconnections();
   };

   /**
    * PUBLIC: OnMessage
    * This is a PubSubJS Wrapper. and will call the Callbacks
    * Whenever a Message with the Specific type is incoming.
    * for Reading ALL Messages use Type = "*"
    * @param {*} type
    * @param {*} callback
    */
   this.onMessage = (type, callback) => {
      if (typeof callback === "function") {
         PubSub.subscribe(type, callback);
      }
   };

   /**
    * PUBLIC: Broadcast
    * This is sending a Message to all Clients connected
    * @param {*} type
    * @param {*} json
    */
   this.broadcast = (type, json) => {
      isLive = typeof isLive === "undefined" ? true : isLive;
      json.type = type;
      server.clients.forEach(function (client) {
         client.send(JSON.stringify(json));
         _private.printReq("SENDING", true, client, JSON.stringify(json));
      });
   };

   /**
    * PUBLIC: Broadcast
    * This is sending a Message to all Clients connected
    * @param {*} type
    * @param {*} to
    * @param {*} json
    */
   this.send = (type, to, json) => {
      isLive = typeof isLive === "undefined" ? true : isLive;
      json.type = type;
      server.clients.forEach(function (client) {
         if (client.client_id === to) {
            client.send(JSON.stringify(json));
            _private.printReq("SENDING", true, client, JSON.stringify(json));
         }
      });
   };

   /**
    * PRIVATE: HandleClientConnections
    * This is handling all Client Connections and handels the Incoming Message Stream.
    */
   _private.handleClientConnections = () => {
      server.on("connection", (client) => {
         const util = new Util();
         client.client_id = util.uuid();
         console.log(
            chalk.blue.bold("[WebSocket] ") + chalk.green("NEW CLIENT CONNECTED") + ": " + chalk.bold("IP") + ": " + (client._socket.remoteAddress == "::1" ? "localhost" : client._socket.remoteAddress) + chalk.bold("   ID:") + ": " + client.client_id
         );

         // Handle Message
         client.on("message", (message) => {
            const json = JSON.parse(message);
            if (json.type === "KEEP_ALIVE") {
               client.send(JSON.stringify({ type: "KEEP_ALIVE_RESPONSE" }));
            } else {
               _private.printReq("INCOMING", true, client, message);
            }
            if (typeof json.type !== "undefined") {
               PubSub.publish(json.type, json);
            }
         });
      });
   };

   /**
    * PRIVATE: handleClientDisconnections
    * This is handling all Client Disconnections
    */
   _private.handleClientDisconnections = () => {
      server.on("close", (client) => {
         _private.printReq("CLIENT DISCONECTED", false, client);
      });
   };

   /**
    * PRIVATE: PrintReq
    * This is a Helper which is printing out all Incoming requests to the console.
    * @param {*} type
    * @param {*} isValid
    * @param {*} client
    * @param {*} data
    */
   _private.printReq = (type, isValid, client, data) => {
      console.log(
         chalk.blue.bold("[WebSocket] ") +
            (isValid ? chalk.green.bold(type) : chalk.red.bold(type)) +
            " " +
            chalk.bold("IP") +
            ": " +
            (client._socket.remoteAddress == "::1" ? "localhost" : client._socket.remoteAddress) +
            (typeof data === "undefined" ? "" : chalk.bold(" DATA") + ": " + data)
      );
   };

   // Call Init
   _private.init();
};

module.exports = WebSocketServer;
