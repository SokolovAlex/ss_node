var Schema = require('jugglingdb').Schema;
var _ = require('lodash');
var config = require('../config');

module.exports = () => {
    var schema = new Schema('mysql', config.db_connect);

    schema.on('connected', function() {
        console.log("db connected");
    });

    schema.on('log', function(msg, duration) {
        console.log("db log", msg, duration);
    });

    var baseModel = {
        created: {
            type: Date,
            default: function () {
                return new Date
            }
        },
        modified: {
            type: Date,
            default: function () {
                return new Date
            }
        }
    };

    var User = schema.define('User', _.extend({
        id: {type: Number, index: true},
        hash: {type: String, limit: 150},
        email: {type: String, limit: 50, index: true},
        firstName: {type: String, limit: 50},
        lastName: {type: String, limit: 50},
        password: {type: String, limit: 150},
        salt: {type: String, limit: 50},
        birthDate: Date,
        activated: {type: Boolean, default: false}
    }, baseModel), {
        table: 'users'
    });

    var Role = schema.define('Role', _.extend({
        id: {type: Number, limit: 50},
        name: {type: String, limit: 50}
    }, baseModel), {
        table: 'roles'
    });

    var Request = schema.define('Request', _.extend({
        id: {type: Number, limit: 50},
        userId: {type: Number, limit: 10},
        email: {type: String, limit: 50},
        name: {type: String, limit: 50},
        phone: {type: String, limit: 50},
        message: {type: String}
    }, baseModel), {
        table: 'requests'
    });

    var games = {
        couples: {id: 1}
    };

    var GameResult = schema.define('GameResult', _.extend({
        id: {type: Number, limit: 50},
        gameId: {type: Number, limit: 10},
        rules: {type: String, limit: 50},
        result: {type: Object}
    }, baseModel), {
        table: 'game_results'
    });

    User.belongsTo(Role, {as: 'role', foreignKey: 'roleId'});
    //User.belongsTo(Role, {as: 'role', foreignKey: 'roleId'});

    schema.isActual(function (err, actual) {
        if (!actual) {
            console.log("db autoupdate");
            //schema.automigrate();
            schema.autoupdate();
        }
    });

    return schema;
};