var schemaInit = require('./schema');
var mailer = require('../helpers/mailer');
var config = require('../config');

module.exports = app => {

    app.config = config;

    app.models = schemaInit();

    require('./models_extend')(app);

    mailer.init(app);
};