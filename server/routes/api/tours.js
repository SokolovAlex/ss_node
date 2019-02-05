const menuHelper = require('../../helpers/menuHelper');
const authenticate = require('../../helpers/authenticate');
const UploadHelper = require('../../helpers/uploadHelper');
const mappers = require('../../helpers/mappers');
const enums = require('../../enums');

module.exports = (router, app) => {
  const uploadHelper = UploadHelper(app);

  const Tour = app.models.Tour;

  const tourImageId = enums.ImageTypes.Tour.id;

  router.get('/tours', (req, res) => {
    const body = req.body;
    const page = body.page || 1;
    const size = body.size || 20;
    const order = body.order || 'title';

    Tour.findAll({limit: size, skip: (page - 1) * size, order: order, include: ['image']})
      .then((result) => res.json({ tours: mappers.tours(result) }))
      .catch((err) => res.status(500).json({ message: err }));
  });

  router.get('/tours/:id', (req, res) => {
      res.json({});
  });

  router.post('/tours', authenticate((req, res, user) => {
    const tourImage;
    if (req.files) {
      tourImage = req.files.tourImage;
      if (tourImage && tourImage.data.length == 0) {
          tourImage = null;
      }
    }

    const body = req.body;

    const dbData = {
      title: body.title,
      description: body.description,
      cost: body.cost,
      nights: body.nights,
      startDate: body.start_date || new Date()
    };

    if (body.id) {
      Tour.find(body.id)
        .then((tourModel) => {
          uploadHelper.save(tourModel.imageId, tourImage, tourImageId, (err, image) => {
            if (!tourModel.imageId) {
              dbData.imageId = image ? image.id : null;
            }
            tourModel.updateAttributes(dbData)
              .then((err, result) => res.json({message: 'Success', tour: result, type: 'update', error: false}));
          });
        })
        .catch((err) => res.status(500).json({ error: err.message }));
    } else {
        function createTour(err, image) {
          if(err) {
            return res.status(500).json({ error: err.message });
          }
          dbData.imageId = image ? image.id : null;

          Tour.create(dbData)
            .then((result) => res.json({message: 'Success', tour: result, type: 'new', error: false}))
            .catch((err) => res.status(500).json({ error: err.message }));
        }

        uploadHelper.create(tourImage, tourImageId, createTour);
    }
  }));

  router.delete('/tours/:id', authenticate((req, res, user) => {
    const id = req.params.id;
    Tour.find(id)
      .then((tourModel) => {
        uploadHelper.remove(tourModel.imageId, destroy);

        function destroy(err) {
          if (err) res.status(500).json({ error: err.message });

          tourModel.destroy()
            .then(() => res.json({error: false}))
            .catch((err) => res.status(500).json({ error: err.message }));
        }
      })
      .catch((err) =>res.status(500).json({ error: err.message }));
  }));

  return router;
};

