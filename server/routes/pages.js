var express = require('express');
var router = express.Router();
var menuHelper = require('../helpers/menuHelper');
var auth_cookie = 'x-auth';

router.get('/', function (req, res) {
    var user = req.cookies[auth_cookie];
    res.render('welcome', { menu: menuHelper.welcome(user)});
});

router.get('/games', function (req, res) {
    var user = req.cookies[auth_cookie];
    res.render('games', { menu: menuHelper.back(user)});
});

router.get('/aviakassa', function (req, res) {
    var user = req.cookies[auth_cookie];
    res.render('aviakassa', { menu: menuHelper.back(user)});
});

router.get('/cruises', function (req, res) {
    var user = req.cookies[auth_cookie];
    res.render('cruises', { menu: menuHelper.back(user)});
});

router.get('/profile', function (req, res) {
    var user = req.cookies[auth_cookie];
    res.render('profile', { user , menu: menuHelper.back(user)});
});

router.get('/photos', function (req, res) {
    var user = req.cookies[auth_cookie];
    res.render('photos', { user , menu: menuHelper.back(user)});
});

router.get('/game_results', function (req, res) {
    var user = req.cookies[auth_cookie];
    res.render('game_results', { user , menu: menuHelper.back(user)});
});

module.exports = router;
