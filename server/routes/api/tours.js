var menuHelper = require('../../helpers/menuHelper');
var authenticate = require('../../helpers/authenticate');
var UploadHelper = require('../../helpers/uploadHelper');
var mappers = require('../../helpers/mappers');
var enums = require('../../enums');

module.exports = (router, app) => {

    var uploadHelper = UploadHelper(app);

    var Tour = app.models.Tour;

    router.get('/tours', (req, res) => {
        var body = req.body;
        var page = body.page || 1;
        var size = body.size || 20;
        var order = body.order || 'title';

        Tour.all({limit: size, skip: (page - 1) * size, order: order, include: ['image']}, (err, result) => {
            if(err) {
                return res.status(500).json({ message: err });
            }
            res.json({ tours: mappers.tours(result) });
        });
    });

    router.get('/tours/{id}', (req, res) => {

        res.json({});
    });

    //router.post('/tours/{id}', authenticate((req, res, user) => {
    router.post('/tours', (req, res) => {
        var tourImage;
        if (req.files) {
            tourImage = req.files.tourImage;
        }

        var body = req.body;

        if(body.id) {


        } else {
            function createTour(data, image) {
                Tour.create({
                    imageId: image ? image.id : null,
                    title: data.title,
                    description: data.description,
                    cost: data.cost,
                    nights: data.duration,
                    startDate: data.start_date
                }, (err, result) => {
                    if(err) {
                        res.status(500).json({ error: err.message });
                    }
                    res.json({message: 'Success', tour: result, error: false})
                });
            }

            if(tourImage) {
                uploadHelper.save(tourImage, enums.ImageTypes.Tour.folder, (err, image) => {
                    createTour(body, image);
                });
            } else {
                createTour(body);
            }
        }
    });

    router.delete('/tours/{id}', authenticate((req, res, user) => {

        res.json({});
    }));

    return router;

};

