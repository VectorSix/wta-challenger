/**
 *  RestApiClient
 * @description
 *
 */
var RestApiClient = function (opt) {
   let $this = this;
   let _private = {};

   // CodePirate System Variables
   let options = $.extend(
      {
         baseUrl: "http://localhost:5500/",
         isAuth: false,
         token: "",
      },
      opt
   );

   /**
    * Constructor
    */
   _private.init = () => {};

   // Authentication API
   this.signin = () => {};
   // Authentication API
   this.signup = () => {};
   // Authentication API
   this.forgot = () => {};
   // Authentication API
   this.verify = () => {};
   // Authentication API
   this.changePassword = () => {};
   // Authentication API
   this.changeEmail = () => {};
   // Authentication API
   this.deleteAccount = () => {};

   //Public Generic CRUD API
   this.list = () => {};
   //Public Generic CRUD API
   this.find = () => {};

   /**
    * PUBLIC Create
    * Public Generic CRUD API
    * @param {*} entity
    * @param {*} data
    * @param {*} fncSuccess
    * @param {*} fncError
    */
   this.create = (entity, data, fncSuccess, fncError) => {
      $.ajax({
         type: "POST",
         dataType: "json",
         url: _private.getPath(entity, ""),
         data: data,
         headers: _private.getHeader(),
         success: (result) => {
            if (typeof result.error === "object") {
               console.log("ERROR CREATE: " + entity, result.error);
               _private.callback(fncError, result.error);
            } else {
               console.log("SUCCESS CREATE: " + entity, result);
               _private.callback(fncSuccess, result);
            }
         },
         error: function (err) {
            console.log("ERROR CREATE: ", err);
         },
      });
   };

   //Public Generic CRUD API
   this.read = () => {};
   //Public Generic CRUD API
   this.update = () => {};
   //Public Generic CRUD API
   this.replace = () => {};
   //Public Generic CRUD API
   this.delete = () => {};

   /**
    * PRIVATE
    * Generate Generic CRUD API Path
    * @param {*} entity
    * @param {*} actionPath
    * @returns
    */
   _private.getPath = (entity, actionPath) => {
      let apiPath = "public-crud/" + entity;
      if (options.isAuth) {
         apiPath = "private-crud/" + entity;
      }
      return options.baseUrl + apiPath + actionPath;
   };

   /**
    * PRIVATE
    * Generic callback caller helper
    * @param {*} fncCallback
    * @param {*} param
    */
   _private.callback = (fncCallback, param) => {
      if (typeof fncCallback === "function") {
         fncCallback(param);
      }
   };

   /**
    * PRIVATE
    * Generic JWT Authorisation Header helper
    * @returns
    */
   _private.getHeader = () => {
      let header = {};
      if (options.isAuth && options.token !== "") {
         header["Authorization"] = options.token;
      }
      return header;
   };

   // Constructor Call
   _private.init();
};
