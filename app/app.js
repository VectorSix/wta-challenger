/**
 * =============================================================================================
 *   _   _ _____    ___ ____ _____            ____ _           _ _
 *  | | | |  ___|  |_ _/ ___|_   _|          / ___| |__   __ _| | | ___ _ __   __ _  ___ _ __
 *  | |_| | |_ _____| | |     | |    _____  | |   | '_ \ / _` | | |/ _ \ '_ \ / _` |/ _ \ '__|
 *  |  _  |  _|_____| | |___  | |   |_____| | |___| | | | (_| | | |  __/ | | | (_| |  __/ |
 *  |_| |_|_|      |___\____| |_|            \____|_| |_|\__,_|_|_|\___|_| |_|\__, |\___|_|
 *                                                                            |___/
 * =============================================================================================
 */

// HF-ICT WTA Core Imports
const Util = require("./core/Util.js");
const config = require("./config.json");
const WebServerRestApi = require("./core/WebServerRestApi");
const WebSocketServer = require("./core/WebSocketServer");
const RootRouteController = require("./controller/RootRouteController");
const LessonArrayController = require("./controller/LessonArrayController");
const LessonRestClientController = require("./controller/LessonRestClientController");

// Start StreamlineJS Server
const util = new Util();
util.printLogo(config.General);
util.printDescription(config.General);

// Start WebServer and REST API
const webServerRestApi = new WebServerRestApi(config.WebServerRestApi);
webServerRestApi.useGenericCrudApi();
webServerRestApi.listening(config.WebServerRestApi.port);

// Add Controller Routes to REST API
rootRouteController = new RootRouteController(webServerRestApi, config);
lessonArrayController = new LessonArrayController(webServerRestApi, config);
lessonRestClientController = new LessonRestClientController(webServerRestApi, config);

// Start WebSocket Browser Connection Server
const webSocketServer = new WebSocketServer(config.WebSocketServer);
webSocketServer.listening(config.WebSocketServer.port);
