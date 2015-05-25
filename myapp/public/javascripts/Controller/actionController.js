/**
 * Created by Edouard on 23/05/2015.
 */

//Variable that will store form datas values
var formDatas = '';
var formErrors = [];

/**
 * Do something on media depending on current page
 *
 * @param link string
 */
function actionController(link) {
    switch(link) {
        case '#positioning':
            //When user faces camera the first time to adjust itself
            //Show the video tag and display live stream
            mediaRecorder.show();
            mediaRecorder.stream();
            break;

        case '#countdown':
            //User has finished adjustment, he will record his content, show him a countdown
            //For performance issues, hide webcam tag, and stop media stream
            mediaRecorder.hide();
            mediaRecorder.unStream();

            //Create directory
            //var directoryCreateParams = "session="+session;
            //post(directoryCreateParams, '/directory/create', '');
            break;

        case '#record':
            //User is recording, start the webcam stream, then record the content
            mediaRecorder.stream();
            mediaRecorder.record();
            break;

        case '#waiting':
            //A request to end the record has been done
            //Stop recording, stop webcam stream and hide its tag
            mediaRecorder.stop(function(){
                //'/media/create'
                //session
                //When medias blob have been generated, simulate click on DOM to go to next page
                document.querySelectorAll('#waiting a')[0].click();
            });
            mediaRecorder.unStream();
            mediaRecorder.hide();
            break;

        case '#validation':
            //Show resulted blob video
            //An event listener will play the audio file simultaneously
            var video = document.getElementById('render');
            video.src = createBlobURL(mediaRecorder.recordVideo.getBlob());
            video.play();
            break;

        case '#form':
            mediaRecorder.unStream();
            mediaRecorder.hide();
            var form = document.querySelector('form');
            var data = new FormData(form);
            /*var req = new XMLHttpRequest();
            req.send(data);*/
            break;

        case '#footer':
            //SEND DATAS

            //From video blob to base64
            var videoReader = new window.FileReader();
            videoReader.readAsDataURL(mediaRecorder.recordVideo.getBlob());
            videoReader.onloadend = function() {
                var base64Video = videoReader.result;

                //Form audio blob to base64
                var audioReader = new window.FileReader();
                audioReader.readAsDataURL(mediaRecorder.recordAudio.getBlob());
                audioReader.onloadend = function() {
                    var base64Audio = audioReader.result;

                    //SAVE FORM DATAS FIRST !
                    var formData             = new Parse.File(session + '.json', formDatas.form);
                    var parseAudioFile       = new Parse.File(session + '.wav', { base64: base64Audio });
                    var parseVideoFile       = new Parse.File(session + '.webm', {base64: base64Video});

                    sendFileToParse('quinzedefrance', session, formData, function(){
                        console.log('form datas successfully saved !');

                        sendFileToParse('quinzedefrance', session, parseAudioFile, function(){
                            console.log('audio file successfully saved !');

                            sendFileToParse('quinzedefrance', session, parseVideoFile, function(){
                                console.log('video file successfully saved !');
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                }
            };
            break;

        default:
            //We must be on home page
            //By default, don't stream and hide video elements
            mediaRecorder.unStream();
            mediaRecorder.hide();
    }
}

/**
 * Function destined to be called as call back functions
 *
 * @param selectors string
 */
function callbackMethod(selectors) {
    document.querySelectorAll(selectors)[0].click();

}

var createBlobURL = window.createBlobURL || window.createObjectURL;
if (!createBlobURL) {
    var URL = window.URL || window.webkitURL;

    if (URL) {
        createBlobURL = URL.createObjectURL;
    } else {
        throw new Error('No Blob creation implementation found.');
    }
}

/**
 * Write form errors inside element
 *
 * @param formErrors object
 * @param id         Html element where to write form errors
 */
function writeFormErrors(formErrors, id) {

    //Reset all errors
    document.getElementById(id).innerHTML = '';

    //Iterate through all errors objects
    for(var object in formErrors) {
        var errors = formErrors[object];

        for(var error in errors) {
            var errorToWrite = errors[error];
            //Add all registered errors
            document.getElementById(id).innerHTML += (errorToWrite.length > 0) ? '<p>' + errorToWrite + '</p>' : '';
        }
    }
}


/**
 * Send all files to Parse API
 *
 * @param client   string   Client name
 * @param session  integer  Session id
 * @param file     Object   Parse file object
 * @param callback function Callback method
 */
function sendFileToParse(client, session, file, callback) {

    file.save().then(function() {
        var parseClass = new Parse.Object(client);
        parseClass.set("applicantName", session);
        parseClass.set("applicantResumeFile", file);
        parseClass.save({}, {
            success: function(object) {
                if (callback && typeof(callback) === "function") {
                    callback();
                }
            }.bind(this),
            error: function(model, error) {
                console.log('error on object saving');
            }.bind(this)
        });

    }.bind(this), function (error) {
        console.log('Error on form datas saving');
    }.bind(this));
}