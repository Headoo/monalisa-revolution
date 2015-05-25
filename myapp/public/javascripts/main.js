
//Resize medias depending on current screen size
mediaResizeLogic();

//Change page background, depending on current page (hashtag in url)
changeBackground('');

// Insert your Dropbox app key here:
Parse.initialize("w5btRxd9dtAURWNO7Zyzjs8rfBOl7AfrKM3inxEV", "8ilAeBCISlrya0SPW5SdstoMXVL4LV89t0qlyuMz");

//Initialize mediaRecorder object
var mediaRecorder = new Html5RTCRecorder();
mediaRecorder.rtc = RecordRTC; //RecordRTC object
mediaRecorder.associate('video', 'video');
mediaRecorder.associate('audio', 'audio');
mediaRecorder.associate('canvas', 'canvas');
mediaRecorder.init();


//Call the media resize logic on window resize event
window.addEventListener('resize', function(event) {
    mediaResizeLogic();
});

//Change page background and execute specific action on click event
window.addEventListener('click', function(event) {
    var link = '#';

    //Get onclick value
    if (undefined !== event.srcElement.attributes[0].value) {
        link    = event.srcElement.attributes[0].value;

        //Change page background with this link
        //If a click is detected outside from link, simply reload current background
        (link[0] !==  '#') ? changeBackground('') : changeBackground(link) ;
    }

    //Act on media record depending on page
    actionController(link);
});

//When recorded video has ended, play simultaneously audio blob with video by listening to play event
document.getElementById("render").addEventListener("play", function () {
    mediaRecorder.audio.src =  createBlobURL(mediaRecorder.recordAudio.getBlob());
    mediaRecorder.audio.play();
}, false);

//When recorded video has ended, stop simultaneously audio blob with video by listening to pause event
document.getElementById("render").addEventListener("pause", function () {
    mediaRecorder.audio.pause();
}, false);

//Handle form errors in live mode by listening to form input and focus events
var inputElements = document.querySelectorAll('form#app_form input');
for (var i = 0; i < inputElements.length; i++) {
    ("input focus".split(" ")).forEach(function(e){
        inputElements[i].addEventListener(e, function(ev)
        {
            //Collect all input errors
            getFormErrors(ev.target, function(errors){
                if (typeof(errors) === 'object') {
                    //Add collected errors to field input id
                    formErrors[ev.target.id] = errors;

                    //Write input errors to view
                    writeFormErrors(formErrors, 'form_errors');
                }
            })
        });
    });
}

//Handle form on submit event
var myform = document.getElementById("app_form");
myform.addEventListener("submit", function(e) {

    //First set focus on all form input to display errors, if there are errors
    for (var i = 0; i < inputElements.length; i++) {
        inputElements[i].focus();
    }

    //Then, if html error elements is empty, we can validate the form
    //Otherwise, get form datas
    console.log(document.getElementById('form_errors').innerHTML);
    if (document.getElementById('form_errors').innerHTML === '') {
        getFormDatas('form#app_form input', function(datas){
            formDatas = datas;

            //Go to next step
            document.getElementById('form_hidden_link').click();
            console.log(formDatas.form);
        })
    }
});