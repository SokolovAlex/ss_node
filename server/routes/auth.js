var express = require('express');
var router = express.Router();
var crypter = require('./../helpers/crypter');
var validators = require('./../helpers/validators');
//var _ = require('lodash');

module.exports = app => {

    var User = app.models.User;

    router.post('/registration', function (req, res) {
        var email = req.body.email;
        var validResult = validators.checkUserData(email, req.body.password, req.body.repeat);

        if(!validResult.valid) {
            return res.json({success: false, message: validResult.messages });
        }

        var salt = crypter.salt();
        var hashed = crypter.sha(req.body.password, salt);

        //console.log("User", _.keys(User));

        User.findOne({where: {email: email}}, (err, user) => {

            if (user) {
                return res.json({success: false, message: 'Email already exist!'});
            }

            User.create({
                email: email,
                hash: crypter.md5(email),
                firstName: req.body.fname,
                lastName: req.body.lname,
                salt: salt,
                password: hashed,
                birthDate: req.body.birthDate
            }, (err, result) => {
                if (err) return res.json({success: false, message: [err]});

                return res.json({success: true, userId: result.id, userHash: result.hash});
            });
        });
    });

    router.post('/login', function (req, res) {
        console.log("login body", req.body);

        res.json({
            msg: 'API is running'
        });

    });

    return router;
};