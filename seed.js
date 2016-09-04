var _ = require('lodash');
var crypter = require('./server/helpers/crypter');
var models = require('./server/boot/schema')().models;
var argv = require('yargs').argv;
var validators = require('./server/helpers/validators');

if (argv.role) {
    var managerId = 5;
    models.Role.findOne({where: {id: managerId}}, (err, role) => {
        if(!role) {
            models.Role.create({id: managerId, name: "Manager"}, (err, role) => {
                if (err) throw new Error(error);
                console.log("Role created: ", email, role.id);
            });
        }
    });
    return true;
}

var email = argv.email;
var pwd = argv.pwd && argv.pwd.toString();
var fname = argv.fname;
var lname = argv.lname;
var bdate = argv.bdate;

var validResult = validators.checkUserData(email, pwd, pwd, fname, lname, bdate);

if(!validResult.valid) {
    throw new Error(validResult.messages);
}

var salt = crypter.salt();
var hashed = crypter.sha(pwd, salt);

models.User.findOne({where: {email: email}}, (err, user) => {
    if (err) throw new Error(err);

    var manager = {
        email: email,
        hash: crypter.md5(email),
        firstName: fname,
        lastName: lname,
        salt: salt,
        password: hashed,
        birthDate: bdate
    };

    if (user) {

        models.User.save(manager, (err, result) => {
            if (err) throw new Error(error);

            console.log("User updated: ", email, result.id);

            process.exit(1)
        });
    } else {

        models.User.create(manager, (err, result) => {
            if (err) throw new Error(error);

            console.log("User created: ", email, result.id);

            process.exit(1)
        });

    }
});
