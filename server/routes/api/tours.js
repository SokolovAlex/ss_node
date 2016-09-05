var menuHelper = require('../../helpers/menuHelper');
var authenticate = require('../../helpers/authenticate');

module.exports = (router) => {

    router.get('/tours', (req, res) => {

        res.json({tours: [{
            title: 'title',
            description: 'titletitletitle',
            cost: '12312 ddaw ',
            nights: 3,
            tags: ['sea', 'museum'],
            hotel: {title: 'museum'},
            startDate: new Date()
        }, {
            title: 'title4',
            description: 'titletitletitletitletitle title',
            cost: 'wadad wd',
            nights: 4,
            tags: ['sea', 'museum'],
            hotel: {title: 'museum'},
            startDate: new Date()
        }, {
            title: 'title3',
            description: '',
            cost: 'wdawd wdaw',
            nights: 5,
            tags: ['sea', 'museum'],
            hotel: {title: 'museum'},
            startDate: new Date()
        }]});
    });

    router.get('/tours/{id}', authenticate((req, res, user) => {

        res.json({});
    }));

    router.post('/tours', authenticate((req, res, user) => {

        res.json({});
    }));

    router.delete('/tours/{id}', authenticate((req, res, user) => {

        res.json({});
    }));

    return router;
};

