const menuHelper = require('../../helpers/menuHelper');
const authenticate = require('../../helpers/authenticate');
const auth_cookie = 'x-auth';

module.exports = (router) => {
  router.get('/games', (req, res) => {
    const user = req.cookies[auth_cookie];
    res.render('games/index', { menu: menuHelper.back(user) });
  });

  router.get('/games/couples', (req, res) => {
    const user = req.cookies[auth_cookie];
    res.render('games/couples', { user, menu: menuHelper.back(user) });
  });

  router.get('/games/globe', (req, res) => {
    const user = req.cookies[auth_cookie];
    res.render('games/globe', { user, menu: menuHelper.back(user) });
  });

  return router;
};