/**
 * Change page background depending on url hashtag
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

    setBackgroundsOnLocalStorage();

    var background = getCurrentPageBackground(hashInUrl);
    console.log(background);
    var cssLink = "url('" + background + "')";
    document.getElementsByTagName('body')[0].style.backgroundImage       = cssLink;
    document.getElementsByTagName('body')[0].style.backgroundSize        = "cover";
    document.getElementsByTagName('body')[0].style.backgroundRepeat      = "no-repeat";
    document.getElementsByTagName('body')[0].style.backgroundAttachment  = "fixed";
}

/**
 *
 */
function setBackgroundsOnLocalStorage() {
    // Détection
    if (typeof localStorage !== 'undefined') {

        var currentBackgrounds = localStorage.getItem('backgrounds');
        if(null === currentBackgrounds) {
            backgrounds.homeBackground.url = getBase64Image(backgrounds.homeBackground.url);
            backgrounds.positioningBackground.url = getBase64Image(backgrounds.positioningBackground.url);
            backgrounds.recordBackground.url = getBase64Image(backgrounds.recordBackground.url);
            backgrounds.countdownBackground.url = getBase64Image(backgrounds.countdownBackground.url);
            backgrounds.validationBackground.url = getBase64Image(backgrounds.validationBackground.url);
            backgrounds.waitingBackground.url = getBase64Image(backgrounds.waitingBackground.url);
            backgrounds.formBackground.url = getBase64Image(backgrounds.formBackground.url);
            backgrounds.footerBackground.url = getBase64Image(backgrounds.footerBackground.url);

            // Stockage à nouveau en attendant la prochaine visite...
            localStorage.setItem('backgrounds', backgrounds);
        }
    } else {
        alert("localStorage n'est pas supporté");
    }
}

// Code taken from MatthewCrumley (http://stackoverflow.com/a/934925/298479)
function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to guess the
    // original format, but be aware the using "image/jpg" will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

/**
 * Get current page background url
 *
 * @param page string
 * @returns {*}
 */
function getCurrentPageBackground(page) {
    var url = '';

    var localBackgrounds = localStorage.getItem('backgrounds');

    switch (page) {
    case 'home':
        url = localBackgrounds.homeBackground.url;
        break;
    case 'positioning':
        url = localBackgrounds.positioningBackground.url;
        break;
    case 'countdown':
        url = localBackgrounds.countdownBackground.url;
        break;
    case 'record':
        url = localBackgrounds.recordBackground.url;
        break;
    case 'waiting':
        url = localBackgrounds.waitingBackground.url;
        break;
    case 'validation':
        url = localBackgrounds.validationBackground.url;
        break;
    case 'form':
        url = localBackgrounds.formBackground.url;
        break;
    case 'footer':
        url = localBackgrounds.footerBackground.url;
        break;
    default :
        url = backgrounds.homeBackground.url;
    }

    return url;
}

/**
 * Created by Edouard on 23/05/2015.
 */
