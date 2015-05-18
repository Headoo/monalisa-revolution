/**
 * RESIZE EACH ROWS TO CURRENT DOCUMENT HEIGHT
 * RESIZE MEDIA TO DOCUMENT PROPORTIONS
 */
function resizeLogic () {

    var w = window.innerWidth;
    var h = window.innerHeight;

    var ratio  = (w/h).toFixed(1);

    var mediaW = (w/2).toFixed(0) + 'px';
    var mediaH = ((w/2)/ratio).toFixed(0) + 'px';

    console.log(ratio + ' // ' + mediaW + ' // ' + mediaH );

    //Affect document height to each "row" class
    var elements = document.querySelectorAll('.row');
    for (var i=0; i < elements.length; i++) {
        elements[i].style.height = h + 'px';
    }

    //Affect document height to Jumbotron
    document.getElementsByClassName('jumbotron')[0].style.height = h + 'px';

    //Affect document height to footer
    document.getElementsByTagName('footer')[0].style.height = h + 'px';

    //Resize video tags depending on window
    var videoElement = document.querySelectorAll('video');
    for (var i = 0; i < videoElement.length; i++) {
        videoElement[i].style.width = mediaW;
        videoElement[i].style.height = mediaH;
    }

    //Resize canvas tags depending on window
    var canvasElement = document.querySelectorAll('canvas');
    for (var i = 0; i < canvasElement.length; i++) {
        canvasElement[i].style.width = mediaW;
        canvasElement[i].style.height = mediaH;
    }

    //Resize img tags depending on window
    var imgElement = document.querySelectorAll('img');
    for (var i = 0; i < imgElement.length; i++) {
        imgElement[i].style.width = mediaW;
        imgElement[i].style.height = mediaH;
    }
}


/**
 * Change page background depending on yurl
 *
 * @param link string
 */
function changeBackground(link) {
    var hashInUrl = "";

    if (link.length <= 0) {
        if (window.location.hash) {
            hashInUrl = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        }
    } else {
        hashInUrl = link.replace('#', '');
    }

    var cssLink = "url('../img/backgrounds/" + backgroundPerPage[hashInUrl] + "')";
    document.getElementsByTagName('body')[0].style.backgroundImage       = cssLink;
    document.getElementsByTagName('body')[0].style.backgroundSize        = "cover";
    document.getElementsByTagName('body')[0].style.backgroundRepeat      = "no-repeat";
    document.getElementsByTagName('body')[0].style.backgroundAttachment  = "fixed";
}

/**
 * Do something on media depending on current page
 *
 * @param link string
 */
function mediaAction(link) {
    switch(link) {
        case '#positioning':
            mediaRecorder.show();
            mediaRecorder.stream();
            break;

        case '#countdown':
            //For performance issues, hide and don't stream webcam live feed where we don't need it
            mediaRecorder.hide();
            mediaRecorder.unStream();

            //Create directory
            var directoryCreateParams = "session="+session;
            post(directoryCreateParams, '/directory/create', '');
            break;

        case '#record':
            //Stream the webcam feed but don't show it for performance issues
            mediaRecorder.stream();
            mediaRecorder.record();
            break;

        case '#waiting':
            mediaRecorder.stop('/media/create', session, '#waiting a');
            mediaRecorder.unStream();
            mediaRecorder.hide();
            break;

        case '#validation':
            //Render recorded video from live stream
            var video = document.getElementById('render');
            video.src = createBlobURL(mediaRecorder.recordVideo.getBlob());
            video.play();
            break;

        default:
            //By default, don't stream and hide video elements
            mediaRecorder.unStream();
            mediaRecorder.hide();
    }
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
 * Function destined to be called as call back functions
 *
 * @param selectors string
 */
function callbackMethod(selectors) {
    document.querySelectorAll(selectors)[0].click();

}

/**
 * Execute asynchronous http post request
 * Click on selected element to go to next page
 *
 * @param params      string
 * @param url         string
 * @param selector    string
 */
function post(params, url, selector) {

    var http = new XMLHttpRequest();
    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
            if ('true' === http.responseText) {
                if (selector.length > 0) {
                    document.querySelectorAll(selector)[0].click();
                }
            }
            http = null;
        }
    };
    http.send(params);
}


//Initialize all resize
resizeLogic();

//Change page background
changeBackground('');


//Set mediaRecorder
var mediaRecorder = new Html5RTCRecorder();
//Associate tag to specific id
mediaRecorder.rtc = RecordRTC; //RecordRTC object
mediaRecorder.callback = 'callbackMethod';
mediaRecorder.associate('video', 'video');
mediaRecorder.associate('audio', 'audio');
mediaRecorder.associate('canvas', 'canvas');
mediaRecorder.init();


/**
 * EVENTS LISTENERS
 * LISTEN TO ALL NECESSARY EVENTS
 */

//Reset the logic on page resize
window.addEventListener('resize', function(event) {
    resizeLogic();
});

//Listen to generic event listeners
window.addEventListener('click', function(event) {
    //Get onclick value
    var link    = event.srcElement.attributes[0].value;

    //Change page background with this link
    //If a click is detected outside from link, simply reload current background
    (link[0] !==  '#') ? changeBackground('') : changeBackground(link) ;

    //Act on media record depending on page
    mediaAction(link);
});

//Manage event listener on render video (play sound + video
document.getElementById("render").addEventListener("play", function () {
    mediaRecorder.audio.src =  createBlobURL(mediaRecorder.recordAudio.getBlob());
    mediaRecorder.audio.play();
}, false);

document.getElementById("render").addEventListener("pause", function () {
    mediaRecorder.audio.pause();
}, false);

