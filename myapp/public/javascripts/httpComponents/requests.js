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
}/**
 * Created by Edouard on 23/05/2015.
 */
