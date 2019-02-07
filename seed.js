const _ = require('lodash');
const crypter = require('./server/helpers/crypter');
const db = require('./server/boot/db');

const argv = require('yargs').argv;
const validators = require('./server/helpers/validators');

const schema = db.schema;
const models = schema.models;
const managerId = 5;

const seed = () => {
  if (argv.role) {
    models.Role.findOne({where: {id: managerId}}).then((role) => {
      if(!role) {
        models.Role.create({id: managerId, name: "Manager"}).then((role) => {
          console.log("Role created: ", role.id);
        });
      }
    });
    return true;
  }
  
  const email = argv.email || 'ssibir.elena@gmail.com';
  const pwd = argv.pwd || 'Lomonosov85';
  const fname = argv.fname || 'Elena';
  const lname = argv.lname || 'Sokolova';
  const bdate = argv.bdate || '1962-02-19';
  
  const validResult = validators.checkUserData(email, pwd, pwd, fname, lname, bdate);
  
  if(!validResult.valid) {
    throw new Error(validResult.messages);
  }
  
  const salt = crypter.salt();
  const hashed = crypter.sha(pwd, salt);

  models.User.findOne({where: {email: email}}).then((user) => {
    const manager = {
      email: email,
      hash: crypter.md5(email),
      firstName: fname,
      lastName: lname,
      salt: salt,
      password: hashed,
      birthDate: bdate,
      roleId: managerId
    };

    if (user) {
      models.User.save(manager).then((result) => {
        console.log("User updated: ", email, result.id);
        process.exit(1)
      });
    } else {
      models.User.create(manager).then((result) => {
        console.log("User created: ", email, result.id);
        process.exit(1)
      });
    }
  });
}

db.init().then(seed);