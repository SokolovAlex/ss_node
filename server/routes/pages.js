var express = require('express');
var router = express.Router();
var menuHelper = require('../helpers/menuHelper');
var auth_cookie = 'x-auth';

router.get('/', function (req, res) {
    res.render('welcome', { menu: menuHelper.welcome()});
});

router.get('/games', function (req, res) {
    res.render('games', { menu: menuHelper.back()});
});

router.get('/aviakassa', function (req, res) {
    res.render('aviakassa', { menu: menuHelper.back()});
});

router.get('/profile', function (req, res) {

    console.log("profile", { user: req.cookies });

    res.render('profile', { user: req.cookies[auth_cookie], menu: menuHelper.back()});
});

module.exports = router;
