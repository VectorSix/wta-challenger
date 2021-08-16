/**
 * Lesson One
 * @param {*} opt
 */
 const LessonArray = function (opt) {
    let $this = this;
    let _private = {};
    let server = null;
 
    // Options
    let options = Object.assign(
       {},
       typeof opt !== "undefined" ? opt : {}
    );

    /**
     * GetCapitalLetters
     * [Simple]
     * 
     * @param {Char Array} arrayData ['a', 'b', 'C', 'D',...]
     * @returns array ['C', 'D']
     */
    this.getCapitalLetters = (arrayData) => {
        let result = [];
        return result;
    }

    /**
     * ArrayUnification
     * [Simple]
     * 
     * @param {String Array} arrData ['red', 'green', 'red', 'blue',...]
     * @returns array ['red', 'green', 'blue',...]
     */
    this.arrayUnification = (arrData) => {
        let result = [];
        return result;
    }

    /**
     * SortArray
     * [Medium]
     * 
     * @param {*} arrData 
     * @returns 
     */
    this.sortArray = (arrData) => {
        let result = [];
        return result;        
    }

    /**
     * Find In Array (Recursion)
     * [Hard]
     * 
     * @param {String Array} arrData [multi dim array]
     * @param {String} needle Search String
     * @returns 
     */
     this.findInArray = (arrData, needle) => {
        let result = [];
        return result;
    }
 }

 module.exports = LessonArray;