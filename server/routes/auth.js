var express = require('express');
var router = express.Router();
var crypter = require('./../helpers/crypter');
var validators = require('./../helpers/validators');
var auth_cookie = 'x-auth';
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
        var email = req.body.email;
        var validResult = validators.checkEmail(email);

        if(!validResult.valid) {
            return res.json({success: false, message: validResult.messages });
        }

        User.findOne({where: {email: email}}, (err, user) => {

            if (!user) {
                return res.json({success: false, message: 'No users with such email!'});
            }

            if (!crypter.compare(req.body.password, user.password, user.salt)) {
                return res.json({success: false, message: 'Password incorrect!'});
            }

            res.cookie(auth_cookie, {
                hash: user.hash,
                lname: user.lastName,
                email: user.email,
                fname: user.firstName,
                birthDate: user.birthDate,
                role: user.role
            }, {maxAge: 60 * 1000 * 60 * 24});

            return res.json({success: true, redirect: '/profile'});
        });
    });

    router.get('/logout', function (req, res) {
        res.clearCookie(auth_cookie);
        return res.redirect('/');
    });

    return router;
};