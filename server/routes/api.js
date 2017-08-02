var express = require('express');
var router = express.Router();
var mailer = require('../helpers/mailer');
var authenticate = require('../helpers/authenticate');
var toursApi = require('./api/tours');
var galleryApi = require('./api/gallery');
var awardsApi = require('./api/awards');

module.exports = app => {

    var User = app.models.User;
    var Request = app.models.Request;
    var GameResult = app.models.GameResult;

    router.post('/request', function(req, res) {
        var body = req.body;

        var requestModel = {
            email: body.email,
            name: body.name,
            phone: body.phone,
            message: body.message
        };

        Request.create(requestModel, (err, request) => {
            if (err) {
                return res.json({ success: false, message: "server error" });
            }

            mailer.sendRequest(requestModel);

            return res.json({ success: true, message: 'Ваша заявка принята. Наши менеджеры ответят Вам в ближайшее время.' });
        });
    });

    router.get('/gameresult', authenticate((req, res, user) => {
        var body = req.body;
        var score = body.score;
        var game = body.gameId;
        var rules = body.rules;

        GameResult.create({
            game: game,
            userId: user.id,
            score: score,
            rules: rules
        }, (err, result) => {
            if (err) throw err;

            return res.json({ success: true, message: 'Результат сохранен' });
        });
    }));

    router = toursApi(router, app);

    router = galleryApi(router, app);

    router = awardsApi(router, app);

    return router;
};