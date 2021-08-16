/**
 * Lesson One
 * @param {*} opt
 */
const LessonArray = function (opt) {
   let $this = this;
   let _private = {};
   let server = null;

   // Options
   let options = Object.assign({}, typeof opt !== "undefined" ? opt : {});

   /**
    * GetCapitalLetters
    * [Simple]
    * Diese Methode nimmt einen Array als Parameter und gibt nur die Array Nodes welche mit Grossbuchstaben gefüllt sind, zurück.
    * Wenn Wörter oder Zahlen im Array stehen, werden diese nicht berücksichtigt (werden nicht ausgegeben).
    * @param {Char Array} arrayData ['a', 'b', 'C', 'D']
    * @returns array ['C', 'D']
    */
   this.getCapitalLetters = (arrayData) => {
      let result = [];
      return result;
   };

   /**
    * ArrayUnification
    * [Simple]
    * Diese Methode eliminiert alle doppelt vorkommenden Werte in einem Array. Der Rückgabe wert ist ein Array, bei dem jedes
    * Element nur einmalig vorkommt.
    * @param {String Array} arrData ['red', 'green', 'red', 'blue']
    * @returns array ['red', 'green', 'blue']
    */
   this.arrayUnification = (arrData) => {
      let result = [];
      return result;
   };

   /**
    * SortArray
    * [Medium]
    * Diese Methode sortiert einen Array nach alphabetischer Reihenfolge und gibt den sortierten Array als Rückgabewert zurück.
    * @param {String Array} arrData ["Auto", "Velo", "E-Bike", "Skateboard"]
    * @returns array ["Auto", "E-Bike", "Skateboard", "Velo"]
    */
   this.sortArray = (arrData) => {
      let result = [];
      return result;
   };

   /**
    * Find In Array
    * [Hard]
    * Diese Methode akzeptiert einen mehrdimensionalen Array als Parameter und einen Suchbegriff (needle). Wenn der Suchbegriff
    * innerhalb des Arrays vorkommt, wird ein TRUE und sonst ein FALSE ausgegeben. Profis verwenden bitte den rekursiven Ansatz.
    * @param {String Array} arrData ["Auto", ["Banane", "Apfel", ["grün", "rot", "gelb"]]]
    * @param {String} needle rot
    * @returns Boolean TRUE
    */
   this.findInArray = (arrData, needle) => {
      let result = false;
      return result;
   };
};

module.exports = LessonArray;
