var express = require('express');
var router = express.Router();
var mailer = require('../helpers/mailer');
var auth_cookie = 'x-auth';

module.exports = app => {

    var User = app.models.User;
    var Request = app.models.Request;

    router.post('/request', function (req, res) {
        var body = req.body;

        var requestModel = {
            email: body.email,
            name: body.name,
            phone: body.phone,
            message: body.message
        };

        Request.create(requestModel, (err, request) => {
            if(err) {
                return res.json({success: false, message: "server error"});
            }

            mailer.sendRequest(requestModel);

            return res.json({success: true, message: 'Ваша заявка принята. Наши менеджеры ответят Вам в ближайшее время.'});

        });
    });

    return router;
};