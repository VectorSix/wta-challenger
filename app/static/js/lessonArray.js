/**
 * Main
 */
 const LessonArray = function (opt) {
    let $this = this;
    let _private = {};
    let options = Object.assign(
       {
           baseUrl: "http://localhost:5500/"
       },
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
        $('button.rest-send-post').on("click", _private.genericSendButton);
    };

    /**
     * PRIVATE
     * GenericSendButton
     * This is loading all the Parameter from the Form data and generating the REST Request Informations.
     * @param {*} event 
     */
    _private.genericSendButton = (event) => {
        let data = {};
        $(event.target).closest("div.lesson-container").find(".send-data").each((index, element)=>{
            let key = $(element).attr("data-key");
            let value = $(element).val();
            try{ value = JSON.parse($(element).val()); }catch(e) {}
            data[key] = value;
        });

        const url = $(event.target).attr("data-url");
        const resultElement = $(event.target).closest("div.lesson-container").find("textarea.rest-result");

        console.log("REST CALL:", url, "DATA:", data);

        $this.postData(url, data, resultElement);
    }

    /**
     * Post Data
     * this is Posting the data and Displays the Result in the Result TextArea.
     * @param {*} url 
     * @param {*} data 
     * @param {*} resultElement 
     */
    this.postData = (url, data, resultElement) => {
        jQuery.post(options.baseUrl + url, data, (result) => {
            $(resultElement).val(result);
        });
    };

    $this.init();
 };
 
 // Run this Class With:
 $(() => {
    const lessonArray = new LessonArray();
    console.log("READY");
 });