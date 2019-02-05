const express = require('express');
const router = express.Router();
const crypter = require('./../helpers/crypter');
const validators = require('./../helpers/validators');

const auth_cookie = 'x-auth';
const auth_cookie_client = 'xx-auth';

module.exports = app => {
  const User = app.models.User;
  router.post('/registration', function(req, res) {
    const body = req.body;
    const email = body.email;
    const fname = body.fname;
    const lname = body.lname;
    const password = body.password;
    const repeat = body.repeat;
    const birthDate = body.birthDate;

    const validResult = validators.checkUserData(email, password, repeat, fname, lname, birthDate);

    if (!validResult.valid) {
      return res.json({ success: false, message: validResult.messages });
    }

    const salt = crypter.salt();
    const hashed = crypter.sha(req.body.password, salt);

    User.findOne({ where: { email: email } }).then((user) => {
        if (user) {
            return res.json({ success: false, message: 'Email already exist!' });
        }
        User.create({
          email: email,
          hash: crypter.md5(email),
          firstName: req.body.fname,
          lastName: req.body.lname,
          salt: salt,
          password: hashed,
          birthDate: req.body.birthDate
        })
          .then((result) => res.json({ success: true, userId: result.id, userHash: result.hash }))
          .then((err) => res.json({ success: false, message: [err] }));
    });
  });

  router.post('/login', function(req, res) {
      const email = req.body.email;
      const validResult = validators.checkEmail(email);

      if (!validResult.valid) {
        return res.json({ success: false, message: validResult.messages });
      }

      User.findOne({ where: { email: email } }).then((user) => {
        if (!user) {
          return res.json({ success: false, message: 'No users with such email!' });
        }

        if (!crypter.compare(req.body.password, user.password, user.salt)) {
          return res.json({ success: false, message: 'Password incorrect!' });
        }

        const userModel = {
          hash: user.hash,
          lname: user.lastName,
          email: user.email,
          fname: user.firstName,
          birthDate: user.birthDate,
          role: user.roleId
        };
        res.cookie(auth_cookie, userModel, { maxAge: 60 * 1000 * 60 * 24 });
        res.cookie(auth_cookie_client, JSON.stringify(userModel), { maxAge: 60 * 1000 * 60 * 24 });

        return res.json({ success: true, redirect: '/profile' });
    });
  });

  router.get('/logout', function(req, res) {
      res.clearCookie(auth_cookie);
      res.clearCookie(auth_cookie_client);
      return res.redirect('/');
  });

  return router;
};