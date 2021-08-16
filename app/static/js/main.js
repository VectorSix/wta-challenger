/**
 * Main
 */
 const Main = function (opt) {
    let $this = this;
    let _private = {};
    let options = Object.assign(
       {},
       typeof opt == "undefined" ? {} : opt
    );
 
    // Constructor
    this.init = () => {
       $this.eventManager();
    };
    /**
     * EventManager
     */
    this.eventManager = () => {
    };
 
    $this.init();
 };
 
 // Run this Class With:
 $(() => {
    const main = new Main();
    console.log("READY");
 });