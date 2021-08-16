

/**
 * Root Route Controller
 * @param {*} opt
 */
 const RootRouteController = function (api, opt) {
    let $this = this;
    let _private = {};
    let server = api;
 
    // Options
    let options = Object.assign(
       {},
       typeof opt !== "undefined" ? opt : {}
    );
   
    /**
     * Constructor
     * Register all RestRoutes
     */
    _private.init = () => {
        server.addRoute("GET", "/", (req, res) => {
           res.render("index", options.General);
        });
    }

   // Call Init
   _private.init();    
 }
 module.exports = RootRouteController;