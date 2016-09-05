module.exports = (router) => {

    router.get('/401', (req, res) => res.render('401'));

    router.get('/404', (req, res) => res.render('404'));

    return router;
};