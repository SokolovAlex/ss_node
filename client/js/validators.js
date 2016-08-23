const checkEmail = (email) => {
    if (!email) {
        return {
            valid: false,
            message: 'email required'
        };
    }

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return {
        valid: re.test(email),
        message: 'Invalid email'
    };
};

const checkPassword = (password, repeat) => {

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

const checkUserData = (email, pswd, repeat) => {
    var valid = true,
        messages = [];

    var emailResult = checkEmail(email);

    if(!emailResult.valid) {
        messages.push(emailResult.message);
        valid = false;
    }

    var pswdResult = checkPassword(pswd, repeat);

    if(!pswdResult.valid) {
        messages.push(pswdResult.message);
        valid = false;
    }

    return {
        valid,
        messages
    };
};

window.ss = window.ss || {};
window.ss.validators = {
    checkUserData: checkUserData,
    checkEmail: checkEmail,
    checkPassword: checkPassword
};