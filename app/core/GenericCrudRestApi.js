const StormDB = require("stormdb");
const Util = require("./Util.js");
const Cryptr = require("cryptr");

/**
 * Lesson Twonpm run dev
 *
 * @param {*} opt
 */
const GenericCrudRestApi = function (opt) {
   let $this = this;
   let _private = {};
   let db = null;

   // Options
   let options = Object.assign(
      {
         isAuth: false,
         isCrypted: false,
         cryptKey: "",
         userId: "",
      },
      typeof opt !== "undefined" ? opt : {}
   );

   /**
    * List
    * Diese Methode gibt alle Objekte als Array aus.
    * @param {string} entity Entity Name (Virtual Table Name)
    * @param {number} from OPTIONAL Pagination From
    * @param {number} to OPTIONAL Pagination To
    * @returns {object} {items: LIST_RESULT, total: TOTAL_ITEM_COUNT, error: ERROR_OBJECT}
    */
   this.list = (entity, from, to) => {
      return { items: [], total: 0, error: false };
   };

   /**
    * Find
    * Diese Methode sucht alle Datensäze welche ein Attribut mit dem entsprechenden
    * Wert haben und gibt ein Array mit den entsprechenden ID's zurück.
    * @param {string} entity
    * @param {string} attribute
    * @param {string} searchPhrase
    * @returns {object} { itemIds: [NUMERIC_ID_ARRAY], error: ERROR_OBJECT }
    */
   this.find = (entity, attribute, searchPhrase) => {
      return { itemIds: [], error: false };
   };

   /**
    * Create
    * Diese Methode legt einen Datensatz an.
    * @param {object} data
    * @returns {object} {id: ELEMENT_ID}
    */
   this.create = (entity, data) => {
      const util = new Util();
      const newId = util.uuid();
      let error = false;

      try {
         _private.initDatabase(entity, options.isAuth, options.isCrypted);
         data.id = newId;
         $this.db.get("data").get(entity).push(data);
         $this.db.save();
      } catch (err) {
         error = { msg: err.stack };
      }
      return { id: newId, error: error };
   };

   /**
    * Read
    * Gibt den Datensatz mit der entsprechenden ID zurück.
    * @param {*} entity
    * @param {*} id
    * @returns  {object} { item: ITEM_OBJECT, error: ERROR_OBJECT }
    */
   this.read = (entity, id) => {
      return { item: {}, error: false };
   };

   /**
    * Update
    * Diese Methode ändert die Werte eines existierenden Datensatzes.
    * @param {*} entity
    * @param {*} id
    * @param {*} data
    * @returns  {object} { item: ITEM_OBJECT, error: ERROR_OBJECT }
    */
   this.update = (entity, id, data) => {
      return { item: {}, error: false };
   };

   /**
    * Replace
    * Diese Methode ändert die Werte eines existierenden Datensatzes.
    * @param {*} entity
    * @param {*} id
    * @param {*} data
    * @returns  {object} { item: ITEM_OBJECT, error: ERROR_OBJECT }
    */
   this.replace = (entity, id, data) => {
      return { item: {}, error: false };
   };

   /**
    * Delete
    * Diese Methode Löscht einen existierenden Datensatz.
    * @param {*} entity
    * @param {*} id
    * @returns  {object} { item: ITEM_OBJECT, error: ERROR_OBJECT }
    */
   this.delete = (entity, id) => {
      return { item: {}, error: false };
   };

   /**
    * initDatabase
    * Diese Methode verbindet das korrekte DB File.
    * @param {string} entity Virtual Table name
    * @param {boolean} isAuth  If enabled JWT auth is used and every user has his own DB
    * @param {boolean} isCrypted If enabled the DB File will be Crypted.
    */
   _private.initDatabase = (entity, isAuth, isCrypted) => {
      // Select DB File Name
      let userId = "public";
      let cryptKey = options.cryptKey;
      if (isAuth) {
         cryprtKey = options.cryptKey + "::" + options.userId;
      }

      // File Connector
      let cryptoOptions = {};
      if (isCrypted) {
         const cryptr = new Cryptr(cryprtKey);
         cryptoOptions = {
            serialize: (data) => cryptr.encrypt(JSON.stringify(data)),
            deserialize: (data) => JSON.parse(cryptr.decrypt(data)),
         };
      }
      const engine = new StormDB.localFileEngine("./database/" + userId + ".stormdb", cryptoOptions);
      $this.db = new StormDB(engine);

      // Init New DB File
      if (typeof $this.db.state.data === "undefined") {
         $this.db.default({ data: {} }).save();
      }

      // Init Table Name
      if (typeof $this.db.get("data").value()[entity] === "undefined") {
         $this.db.get("data").set(entity, []).save();
      }
   };
};

module.exports = GenericCrudRestApi;
