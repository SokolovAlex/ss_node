var nodemailer = require('nodemailer');
var _ = require('lodash');
var fs = require('fs');

var config,
    requestTemplate,
    transporter;

module.exports = {
    init(app) {
        config = app.config;
        transporter = nodemailer.createTransport(config.mailServer);
        fs.readFile('server/templates/request.html', (err, tmpl) => {
            if (err) {
                console.log('templates error -->  ', err);
            }
            requestTemplate = tmpl;
        });
    },
    sendRequest(options, next) {

        next = next || _.noop;

        var mailOptions = {
            from: options.email,
            to: config.mailTo,
            subject: 'Заявка с сайта',
            // text: options.message //, // plaintext body
            html: _.template(requestTemplate)(options) // You can choose to send an HTML body instead
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log(error);
                next(error);
            }else{
                console.log('Message sent: ' + info.response);
                next();
            }
        });
    }
};





