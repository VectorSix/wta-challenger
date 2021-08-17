/**
 * Lesson One Controller
 * @param {*} opt
 */
const LessonRestClientController = function (api, opt) {
   let $this = this;
   let _private = {};
   let server = api;

   // Options
   let options = Object.assign({}, typeof opt !== "undefined" ? opt : {});

   /**
    * Constructor
    * Register all RestRoutes
    */
   _private.init = () => {
      _private.registerRoutes();
   };

   /**
    * PRIVATE
    * Resgister Routes
    */
   _private.registerRoutes = () => {
      // GET: Overview GUI
      server.addRoute("get", "/lesson_rest_client", (req, res) => {
         res.render("lessonRestClient", options.General);
      });
   };

   // Call Init
   _private.init();
};
module.exports = LessonRestClientController;
