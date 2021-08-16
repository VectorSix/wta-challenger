
// HF-ICT WTA Core Imports
const Util = require("./core/Util.js");
const config = require("./config.json");
const WebServerRestApi = require("./core/WebServerRestApi");
const RootRouteController = require("./controller/RootRouteController");
const LessonArrayController = require("./controller/LessonArrayController");

// Start StreamlineJS Server
const util = new Util();
util.printLogo(config.General);
util.printDescription(config.General);

// Start WebServer and REST API
const webServerRestApi = new WebServerRestApi(config.WebServerRestApi);
webServerRestApi.listening(config.WebServerRestApi.port);

// Add Controller Routes to REST API
rootRouteController = new RootRouteController(webServerRestApi, config);
lessonArrayController = new LessonArrayController(webServerRestApi, config);