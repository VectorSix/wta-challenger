
const LessonArray = require("./../business/LessonArray");

/**
 * Lesson One Controller
 * @param {*} opt
 */
 const LessonArrayController = function (api, opt) {
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
		_private.registerRoutes();
	}

	/**
	 * PRIVATE
	 * Resgister Routes
	 */
	_private.registerRoutes = () => {
		const lessonArray = new LessonArray();

		// GET: Overview GUI
		server.addRoute("get", "/lesson_array", (req, res) => {
			res.render("lessonArray", options.General);
		 });

		// POST: GetCapitalLetters
		server.addRoute("POST", "/get_capital_letters", (req, res) => {
         const result = lessonArray.getCapitalLetters(req.body.arrData)
		   res.send(JSON.stringify(result));
		});

		// POST: ArrayUnification
		server.addRoute("POST", "/array_unification", (req, res) => {
         const result = lessonArray.arrayUnification(req.body.arrData)
		   res.send(JSON.stringify(result));
		});

		// POST: SortArray
		server.addRoute("POST", "/sort_array", (req, res) => {
         const result = lessonArray.sortArray(req.body.arrData)
		   res.send(JSON.stringify(result));
		});
      
		// POST: FindInArray
		server.addRoute("POST", "/find_in_array", (req, res) => {
         const result = lessonArray.findInArray(req.body.arrData, req.body.needle)
		   res.send(JSON.stringify(result));
		});      
	}

   // Call Init
   _private.init();    
 }
 module.exports = LessonArrayController;