/**
 * Validate email syntax
 *
 * @param email string
 * @returns {boolean}
 */
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

/**
 * Apply style to input
 *
 * @param id   string Input id
 * @param type string Class to apply
 */
function applyStyleToInput(id, type) {
    document.getElementById(id).setAttribute('class', type);
}

/**
 * Get an input error and apply style to matching input
 *
 * @param input    object   input element
 * @param callback function
 */
function getFormErrors(input, callback) {

    var placeholder = input.placeholder;
    var name        = input.name;
    var value       = input.value;
    var id          = input.id;
    var errorClass  = 'inputError';
    var cleanClass  = 'inputClean';

    var formErrors = {0:'',1:''};

    //Set form errors if input value is empty or contains less than 1 character
    if (value.length <= 1) {
        formErrors[0] = placeholder + ': field is required and needs at least two characters.';
        applyStyleToInput(id, errorClass); //apply error style to input
    } else {
        formErrors[0] = '';
        applyStyleToInput(id, cleanClass); //apply clean class to input
    }

    //Validate email and return error if syntax is incorrect
    if (name === 'email') {
        var emailValidated = validateEmail(value);
        if (false === emailValidated) {
            formErrors[1] = placeholder + ': syntax is invalid.';
            applyStyleToInput(id, errorClass); //apply error style to input
        } else {
            formErrors[1] = '';
            applyStyleToInput(id, cleanClass); //apply clean class to input
        }
    } else if (name === 'checkbox') {
        //If checkbox is not validated, return error
        var checkbox = document.getElementById('form_'+name+'').checked;
        if (!checkbox) {
            formErrors[1] = placeholder + ': field must be validated.';
            applyStyleToInput(id, errorClass); //apply error style to input
        } else {
            formErrors[1] = '';
            applyStyleToInput(id, cleanClass); //apply clean class to input
        }
    }

    if (callback && typeof(callback) === "function") {
        callback(formErrors);
    }
}


/**
 * Get all form datas by scanning inputs
 *
 * @param selector string   Inputs to target
 * @param callback function
 */
function getFormDatas(selector, callback) {
    var formDatas = {'form': []};

    var inputs = document.querySelectorAll(selector);
    for (var i = 0; i < inputs.length; ++i) {
        var placeholder = inputs[i].placeholder;
        var lowerCasePlaceHolder = placeholder.toLowerCase();
        var name        = inputs[i].name;
        var value       = inputs[i].value;
        var id          = inputs[i].id;

        //Return datas
        if (name === 'checkbox') {
            var checkbox        = document.getElementById('form_'+name+'').checked;
            var checkboxValue   = (checkbox) ? 1 : 0;
            formDatas['form'][lowerCasePlaceHolder] = checkboxValue;
        } else {
            if (undefined !== value) {
                formDatas['form'][lowerCasePlaceHolder] = value;
            }
        }
    }

    if (callback && typeof(callback) === "function") {
        callback(formDatas);
    }
}