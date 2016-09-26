var express = require('express');
var router = express.Router();
var menuHelper = require('../helpers/menuHelper');
var authenticate = require('../helpers/authenticate');
var profilePages = require('./pages/profile');
var errorPages = require('./pages/errorPages');
var auth_cookie = 'x-auth';
var enums = require('../enums');

module.exports = app => {

    var Image = app.models.Image;
    var imageTypeId = enums.ImageTypes.Gallery.id;

    router.get('/', (req, res) => {
        var user = req.cookies[auth_cookie];
        res.render('welcome', {menu: menuHelper.welcome(user), actions: menuHelper.commonActions()});
    });

    router.get('/games', (req, res) => {
        var user = req.cookies[auth_cookie];
        res.render('games', {menu: menuHelper.back(user)});
    });

    router.get('/aviakassa', (req, res) => {
        var user = req.cookies[auth_cookie];
        res.render('aviakassa', {menu: menuHelper.back(user)});
    });

    router.get('/cruises', (req, res) => {
        var user = req.cookies[auth_cookie];
        res.render('cruises', {menu: menuHelper.back(user)});
    });

    router.get('/tours', (req, res) => {
        var user = req.cookies[auth_cookie];
        res.render('tours', {menu: menuHelper.back(user)});
    });

    router.get('/gallery', (req, res) => {
        var user = req.cookies[auth_cookie];

        Image.all({where: {type: imageTypeId}, limit: 20 }, (err, result) => {
            res.render('gallery', { menu: menuHelper.back(user), images: result });
        });
    });

    router.get('/401', (req, res) => {
        res.render('401');
    });

    router = profilePages(router);
    router = errorPages(router);

    return router;
};
