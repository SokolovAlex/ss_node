const db = require('./db');
const mailer = require('../helpers/mailer');
const config = require('../config');

module.exports = app => {
  app.config = config;

  db.init();

  app.models = db.models;

  // require('./models_extend')(app);

  mailer.init(app);
};