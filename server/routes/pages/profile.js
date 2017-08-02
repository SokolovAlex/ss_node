var menuHelper = require('../../helpers/menuHelper');
var authenticate = require('../../helpers/authenticate');

module.exports = (router) => {

    router.get('/profile', authenticate((req, res, user) => {
        res.render('profile', { user, menu: menuHelper.back(user), profileActions: menuHelper.profileActions(user) });
    }));

    router.get('/photos', authenticate((req, res, user) => {
        res.render('photos', { user, menu: menuHelper.back(user) });
    }));

    router.get('/awards', authenticate((req, res, user) => {
        res.render('awards', { user, menu: menuHelper.back(user) });
    }));

    router.get('/game_results', authenticate((req, res, user) => {
        res.render('game_results', { user, menu: menuHelper.back(user) });
    }));

    return router;
};