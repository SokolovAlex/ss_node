const express = require('express');
const router = express.Router();
const mailer = require('../helpers/mailer');
const authenticate = require('../helpers/authenticate');
const toursApi = require('./api/tours');
const galleryApi = require('./api/gallery');
const awardsApi = require('./api/awards');

module.exports = app => {
  const User = app.models.User;
  const Request = app.models.Request;
  const GameResult = app.models.GameResult;

  router.post('/request', function(req, res) {
    const body = req.body;

    const requestModel = {
        email: body.email,
        name: body.name,
        phone: body.phone,
        message: body.message,
    };

    Request.create(requestModel)
      .then((request) => {
        mailer.sendRequest(requestModel);
        return res.json({ success: true, message: 'Ваша заявка принята. Наши менеджеры ответят Вам в ближайшее время.' });
      })
      .catch((err) => {
        res.json({ success: false, message: `server error: ${err}` })
      });
  });

  router.get('/gameresult', authenticate((req, res, user) => {
    const body = req.body;
    const score = body.score;
    const game = body.gameId;
    const rules = body.rules;

    GameResult.create({
      game: game,
      userId: user.id,
      score: score,
      rules: rules
    }).then((result) => res.json({ success: true, message: 'Результат сохранен' }));
  }));

  router = toursApi(router, app);

  router = galleryApi(router, app);

  router = awardsApi(router, app);

  return router;
};