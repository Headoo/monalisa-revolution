/**
 * Depending on screen resolution, adapt all media size
 *
 * RESIZE EACH ROWS TO CURRENT DOCUMENT HEIGHT
 * RESIZE MEDIA TO DOCUMENT PROPORTIONS
 */
function mediaResizeLogic () {

    var w                   = window.innerWidth;
    var h                   = window.innerHeight;
    var normalVideoRatio    = 0;
    var ratioReducer        = 40/100; //Reduce video depending on current screen proportions
    var ratio               = ((w/h)/((w/h)*ratioReducer)).toFixed(2);
    var mediaW              = (w/ratio).toFixed(0) + 'px';
    var mediaH              = '';


    if (w > h) {
        //Normal video ratio for paysage mode
        normalVideoRatio    = 1.33;

        //If screen width is higher than screen height, we're on paysage mode
        //So video width must be higher than video height
        mediaH              = ((w/ratio)/normalVideoRatio).toFixed(0) + 'px';

    } else {
        //Normal video ratio for portrait mode
        normalVideoRatio    = 1.66;

        //If screen width is lower than screen height, we're on portrait mode
        //So video height must be higher than video width
        mediaH              = ((w/ratio)*normalVideoRatio).toFixed(0) + 'px';
    }

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
}/**
 * Created by Edouard on 23/05/2015.
 */
