module.exports = {
    mailTo: 's5sibir@yandex.ru',
    mailServer: {
        service: 'Gmail',
        auth: {
            user: 'ssibir.manager@gmail.com',
            pass: '*'
        }
    },
    db_connect: {
        host: 'localhost',
        port: 3306,
        database: 'ssdb',
        "username": "root",
        "password": "Xx102030"
    },
    db: {
      logging: false,
      dialect: 'sqlite',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      storage: 'ssdb.sqlite',
      operatorsAliases: false
    },
    auth_cookie: 'x-auth',
    upload_path: __dirname + '/../upload/'
};