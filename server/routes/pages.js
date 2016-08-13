var express = require('express');
var router = express.Router();
var menuHelper = require('../helpers/menuHelper');

router.get('/', function (req, res) {
    res.render('welcome', { menu: menuHelper.welcome()});
});

router.get('/games', function (req, res) {
    res.render('games', { menu: menuHelper.back()});
});

router.get('/aviakassa', function (req, res) {
    res.render('aviakassa', { menu: menuHelper.back()});
});

module.exports = router;
