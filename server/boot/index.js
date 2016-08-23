var schemaInit = require('./schema');

module.exports = app => {

    app.models = schemaInit();

    require('./models_extend')(app);

};