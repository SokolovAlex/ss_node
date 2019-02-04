var _ = require('lodash');
var crypter = require('./server/helpers/crypter');
var db = require('./server/boot/db');

var argv = require('yargs').argv;
var validators = require('./server/helpers/validators');

const schema = db.schema;
const models = schema.models;

const seed = () => {
  if (argv.role) {
      var managerId = 5;
      models.Role.findOne({where: {id: managerId}}).then((role) => {
          if(!role) {
              models.Role.create({id: managerId, name: "Manager"}).then((role) => {
                  console.log("Role created: ", role.id);
              });
          }
      });
      return true;
  }
  
  var email = argv.email || 'ssibir.elena@gmail.com';
  var pwd = argv.pwd || 'Lomonosov85';
  var fname = argv.fname || 'Elena';
  var lname = argv.lname || 'Sokolova';
  var bdate = argv.bdate || '1962-02-19';
  
  var validResult = validators.checkUserData(email, pwd, pwd, fname, lname, bdate);
  
  if(!validResult.valid) {
      throw new Error(validResult.messages);
  }
  
  var salt = crypter.salt();
  var hashed = crypter.sha(pwd, salt);

  models.User.findOne({where: {email: email}}).then((user) => {
      console.log("user", user);

      var manager = {
          email: email,
          hash: crypter.md5(email),
          firstName: fname,
          lastName: lname,
          salt: salt,
          password: hashed,
          birthDate: bdate,
          roleId: 5
      };
  
      if (user) {
          models.User.save(manager, (err, result) => {
              console.log("User updated: ", email, result.id);
              process.exit(1)
          });
      } else {
        console.log("11", email);
          models.User.create(manager).then((result) => {
              console.log("User created: ", email, result.id);
              process.exit(1)
          });
      }
  });
}

schema.sync({force: false}).then(seed);