var Schema = require('jugglingdb').Schema;

module.exports = () => {
    var schema = new Schema('mySql', {
        host: 'localhost',
        port: 3306,
        database: 'ssdb',
        "username": "root",
        "password": "Xx102030"
    });

    schema.on('connected', function() {
        console.log("db connected");
    });

    schema.on('log', function(msg, duration) {
        console.log("db log", msg, duration);
    });

    var User = schema.define('User', {
        id: {type: Number, index: true},
        email: {type: String, limit: 50, index: true},
        firstName: {type: String, limit: 50},
        lastName: {type: String, limit: 50},
        password: {type: String, limit: 150},
        salt: {type: String, limit: 50},
        birthDate: Date,
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
        },
        activated: {type: Boolean, default: false}
    }, {
        table: 'users'
    });

    var Role = schema.define('Role', {
        id: {type: Number, limit: 50},
        name: {type: String, limit: 50},
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
    }, {
        table: 'roles'
    });

    var GameResult = schema.define('GameResult', {
        id: {type: Number, limit: 50},
        created: {
            type: Date,
            default: function () {
                return new Date
            }
        },
        result: {type: Object}
    }, {
        table: 'game_results'
    });

    schema.isActual(function (err, actual) {
        if (!actual) {
            console.log("db automigrate");
            schema.automigrate();
        }
    });

    return schema.models;
};