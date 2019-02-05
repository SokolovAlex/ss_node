const menuHelper = require('../../helpers/menuHelper');
const authenticate = require('../../helpers/authenticate');
const UploadHelper = require('../../helpers/uploadHelper');
const mappers = require('../../helpers/mappers');
const enums = require('../../enums');

module.exports = (router, app) => {
  const imageTypeId = enums.ImageTypes.Gallery.id;

  const uploadHelper = UploadHelper(app);

  const Image = app.models.Image;

  router.get('/photos', (req, res) => {
    const body = req.body;
    const page = body.page || 1;
    const size = body.size || 20;
    const order = body.order || 'name';

    Image.findAll({ where: { type: imageTypeId }, limit: size, skip: (page - 1) * size, order: order })
      .then((result) => res.json({ images: result }))
      .catch(err => res.status(500).json({ message: err }));
  });

  router.post('/photos', authenticate((req, res, user) => {
    const selectedFile;
    if (req.files) {
      selectedFile = req.files.selectedFile;
      if (selectedFile && selectedFile.data.length == 0) {
        selectedFile = null;
      }
    }

    if (!selectedFile) {
      return res.json({ error: true, message: 'не нашли файла' });
    }

    const description = req.body.image_description;

    uploadHelper.create(selectedFile, imageTypeId, { description }, (err, result) => {
      if (err) {
        return res.json({ error: true });
      }
      res.json({ image: result });
    });
  }));

  router.delete('/photos/:id', authenticate((req, res, user) => {
    const id = req.params.id;

    Image.find(id)
      .then((imageModel) => {
        if (!imageModel) res.status(500).json({ error: 'no image' });

        uploadHelper.remove(imageModel.id, () => {
          if (err) res.status(500).json({ error: err.message });
          res.json({ error: false });
        });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  }));

  return router;
};