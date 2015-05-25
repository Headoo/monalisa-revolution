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

    var cssLink = "url('../img/backgrounds/" + backgroundPerPage[hashInUrl] + "')";
    document.getElementsByTagName('body')[0].style.backgroundImage       = cssLink;
    document.getElementsByTagName('body')[0].style.backgroundSize        = "cover";
    document.getElementsByTagName('body')[0].style.backgroundRepeat      = "no-repeat";
    document.getElementsByTagName('body')[0].style.backgroundAttachment  = "fixed";
}/**
 * Created by Edouard on 23/05/2015.
 */
