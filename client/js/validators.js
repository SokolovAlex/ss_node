var checkEmail = (email) => {
    if (!email) {
        return {
            valid: false,
            message: 'Email required.'
        };
    }

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return {
        valid: re.test(email),
        message: 'Invalid email'
    };
};

var checkPassword = (password, repeat) => {

    if(!password || !repeat) {
        return {
            valid: password === repeat && password.length >= 8,
            message: 'password and repeat required'
        };
    }

    return {
        valid: password === repeat && password.length >= 8,
        message: 'Invalid password'
    };
};

var checkBirth = (bdate) => {
    return {
        valid: !!bdate,
        message: 'bdate required'
    };
};

var checkNames = (fname, lname) => {
    return {
        valid: fname && lname,
        message: 'Names required'
    };
};

var checkRequired = (value, name) => {
    return {
        valid: !!value,
        message: name +  ' required.'
    };
};

var aggregateResults = function(rules) {
    var valid = true,
        messages = [];

    $.each(rules, function(i, rule) {
        var res = rule();
        if(!res.valid) {
            messages.push(res.message);
            valid = false;
        }
    });

    return {
        valid: valid,
        messages: messages
    };
};

var checkUserData = function(email, pswd, repeat, fname, lname, bdate) {
    return aggregateResults([
        checkEmail.bind(null, email),
        checkPassword.bind(null, pswd, repeat),
        checkBirth.bind(null, bdate),
        checkNames.bind(null, fname, lname)
    ]);
};

var checkContactForm = function(email, name, message) {
    return aggregateResults([
        checkEmail.bind(null, email),
        checkRequired.bind(null, message, 'Message'),
        checkRequired.bind(null, name, 'Name')
    ]);
};

window.ss = window.ss || {};
window.ss.validators = {
    checkUserData: checkUserData,
    checkEmail: checkEmail,
    checkPassword: checkPassword,
    checkContactForm: checkContactForm
};