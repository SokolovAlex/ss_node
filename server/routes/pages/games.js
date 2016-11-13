var menuHelper = require('../../helpers/menuHelper');
var authenticate = require('../../helpers/authenticate');
var auth_cookie = 'x-auth';

module.exports = (router) => {

    router.get('/games', (req, res) => {
        var user = req.cookies[auth_cookie];
        res.render('games/index', {menu: menuHelper.back(user)});
    });

    router.get('/games/couples', (req, res) => {
        var user = req.cookies[auth_cookie];
        res.render('games/couples', { user , menu: menuHelper.back(user)});
    });

    router.get('/games/globe',  (req, res) => {
        var user = req.cookies[auth_cookie];
        res.render('games/globe', { user , menu: menuHelper.back(user)});
    });

    return router;
};

