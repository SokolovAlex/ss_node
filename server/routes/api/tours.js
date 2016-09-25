var menuHelper = require('../../helpers/menuHelper');
var authenticate = require('../../helpers/authenticate');
var UploadHelper = require('../../helpers/uploadHelper');
var mappers = require('../../helpers/mappers');
var enums = require('../../enums');

module.exports = (router, app) => {

    var uploadHelper = UploadHelper(app);

    var Tour = app.models.Tour;

    var tourImageId = enums.ImageTypes.Tour.id;

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

    router.get('/tours/:id', (req, res) => {

        res.json({});
    });

    router.post('/tours', authenticate((req, res, user) => {
        var tourImage;
        if (req.files) {
            tourImage = req.files.tourImage;
            if(tourImage && tourImage.data.length == 0) {
                tourImage = null;
            }
        }

        var body = req.body;

        var dbData = {
            title: body.title,
            description: body.description,
            cost: body.cost,
            nights: body.nights,
            startDate: body.start_date
        };

        if(body.id) {
            Tour.find(body.id, (err, tourModel) => {
                uploadHelper.save(tourModel.imageId, tourImage, tourImageId, (err, image) => {
                    if(err) {
                        return res.status(500).json({ error: err.message });
                    }
                    if (!tourModel.imageId) {
                        dbData.imageId = image ? image.id : null;
                    }

                    tourModel.updateAttributes(dbData, (err, result) => {
                        return res.json({message: 'Success', tour: result, type: 'update', error: false})
                    });
                });
            });
        } else {
            function createTour(err, image) {
                if(err) {
                    return res.status(500).json({ error: err.message });
                }

                dbData.imageId = image ? image.id : null;

                Tour.create(dbData, (err, result) => {
                    if(err) {
                        return res.status(500).json({ error: err.message });
                    }
                    return res.json({message: 'Success', tour: result, type: 'new', error: false})
                });
            }

            uploadHelper.create(tourImage, tourImageId, createTour);
        }
    }));

    router.delete('/tours/:id', authenticate((req, res, user) => {
        var id = req.params.id;
        Tour.find(id, (err, tourModel) => {
            if(err || !tourModel) res.status(500).json({ error: err.message });

            uploadHelper.remove(tourModel.imageId, destroy);

            function destroy(err) {
                if(err) res.status(500).json({ error: err.message });
                tourModel.destroy((err) => {
                    if(err) res.status(500).json({ error: err.message });
                    res.json({error: false});
                });
            }
        });

    }));

    return router;
};

