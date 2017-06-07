var express = require('express');
var router = express.Router();
var menuHelper = require('../helpers/menuHelper');
var authenticate = require('../helpers/authenticate');
var profilePages = require('./pages/profile');
var gamesPages = require('./pages/games');
var errorPages = require('./pages/errorPages');
var auth_cookie = 'x-auth';
var enums = require('../enums');

module.exports = app => {

    router.get('/', (req, res) => {
        var user = req.cookies[auth_cookie];
        res.render('welcome', { menu: menuHelper.welcome(user), actions: menuHelper.commonActions() });
    });

    return router;
};