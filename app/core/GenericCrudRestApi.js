const fs = require("fs");

/**
 * Lesson Two
 * @param {*} opt
 */
const GenericCrudRestApi = function (opt) {
   let $this = this;
   let _private = {};
   let server = null;

   // Options
   let options = Object.assign({}, typeof opt !== "undefined" ? opt : {});

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
      return { id: "UUID", error: false };
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
    * Delete
    * Diese Methode Löscht einen existierenden Datensatz.
    * @param {*} entity
    * @param {*} id
    * @returns  {object} { item: ITEM_OBJECT, error: ERROR_OBJECT }
    */
   this.delete = (entity, id) => {
      return { item: {}, error: false };
   };
};

module.exports = GenericCrudRestApi;
