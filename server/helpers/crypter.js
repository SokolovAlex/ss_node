const crypto = require('crypto'),
    len = 16;

const genRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0,length);
};

const sha = (password, salt) => {
    return crypto.createHmac('sha512', salt)
        .update(password)
        .digest('hex');
};

const salt = () => {
    return genRandomString(len);
};

const md5 = (text) => {
    return crypto.createHash('md5')
        .update(text)
        .digest('hex');
};

const compareAsync = (pasw, hashPassword, salt, next) => {
    return next(null, sha(pasw, salt) === hashPassword);
};

const compare = (pasw, hashPassword, salt) => {
    return sha(pasw, salt) === hashPassword;
};

module.exports = {
    sha: sha,
    salt: salt,
    md5: md5,
    compareAsync: compareAsync,
    compare: compare
};