const express = require('express');
let router = express.Router();
const menuHelper = require('../helpers/menuHelper');
const profilePages = require('./pages/profile');
const gamesPages = require('./pages/games');
const errorPages = require('./pages/errorPages');
const auth_cookie = 'x-auth';
const enums = require('../enums');

module.exports = app => {
  const Image = app.models.Image;
  const imageTypeId = enums.ImageTypes.Gallery.id;

  router.get('/', (req, res) => {
    const user = req.cookies[auth_cookie];
    res.render('welcome', 
      { menu: menuHelper.welcome(user), actions: menuHelper.commonActions() });
  });

  router.get('/aviakassa', (req, res) => {
    const user = req.cookies[auth_cookie];
    res.render('aviakassa', { menu: menuHelper.back(user) });
  });

  router.get('/cruises', (req, res) => {
    const user = req.cookies[auth_cookie];
    res.render('cruises', { menu: menuHelper.back(user) });
  });

  router.get('/tours', (req, res) => {
    const user = req.cookies[auth_cookie];
    res.render('tours', { menu: menuHelper.back(user) });
  });

  router.get('/gallery', (req, res) => {
    const user = req.cookies[auth_cookie];

    Image.findAll({ where: { type: imageTypeId }, limit: 20 }).then((result) => {
      res.render('gallery', {
        menu: menuHelper.back(user),
        title: "Галерея",
        title_all: "Все фотографии",
        images: result,
        folder: enums.ImageTypes.Gallery.folder
      });
    });
  });

  router.get('/awards-gallery', (req, res) => {
    const user = req.cookies[auth_cookie];
    const awardsTypeId = enums.ImageTypes.Awards.id;

    Image.findAll({ where: { type: awardsTypeId }, limit: 20 }).then((result) => {
      res.render('gallery', {
        menu: menuHelper.back(user),
        images: result,
        title: "Сертификаты",
        title_all: "Все сертификаты",
        folder: enums.ImageTypes.Awards.folder
      });
    });
  });

  router.get('/maldives', (req, res) => {
    const user = req.cookies[auth_cookie];
    res.render('maldives', { menu: menuHelper.back(user) });
  });

  router.get('/articles', (req, res) => {
    const user = req.cookies[auth_cookie];
    res.render('articles', { menu: menuHelper.back(user) });
  });

  router.get('/joali', (req, res) => {
    const user = req.cookies[auth_cookie];
    res.render('joali', { menu: menuHelper.back(user) });
  });

  router.get('/partners', (req, res) => {
    const user = req.cookies[auth_cookie];
    res.render('partners', { menu: menuHelper.back(user) });
  });

  router = profilePages(router);
  router = errorPages(router);
  router = gamesPages(router);

  return router;
};