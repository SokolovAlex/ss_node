var express = require('express');
var router = express.Router();
var menuHelper = require('../helpers/menuHelper');
var authenticate = require('../helpers/authenticate');
var profilePages = require('./pages/profile');
var errorPages = require('./pages/errorPages');
var auth_cookie = 'x-auth';

router.get('/', (req, res) => {
    var user = req.cookies[auth_cookie];
    res.render('welcome', { menu: menuHelper.welcome(user)});
});

router.get('/games', (req, res) => {
    var user = req.cookies[auth_cookie];
    res.render('games', { menu: menuHelper.back(user)});
});

router.get('/aviakassa', (req, res) => {
    var user = req.cookies[auth_cookie];
    res.render('aviakassa', { menu: menuHelper.back(user)});
});

router.get('/cruises', (req, res) => {
    var user = req.cookies[auth_cookie];
    res.render('cruises', { menu: menuHelper.back(user)});
});

router.get('/tours', (req, res) => {
    var user = req.cookies[auth_cookie];
    res.render('tours', { menu: menuHelper.back(user)});
});

router = profilePages(router);
router = errorPages(router);

module.exports = router;
