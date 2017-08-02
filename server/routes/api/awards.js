const menuHelper = require('../../helpers/menuHelper');
const authenticate = require('../../helpers/authenticate');
const UploadHelper = require('../../helpers/uploadHelper');
const imageHelper = require('../../helpers/image');
const mappers = require('../../helpers/mappers');
const enums = require('../../enums');

module.exports = (router, app) => {

    const imageTypeId = enums.ImageTypes.Awards.id;

    const uploadHelper = UploadHelper(app);

    const Image = app.models.Image;

    router.get('/awards', (req, res) => {
        var body = req.body;
        var page = body.page || 1;
        var size = body.size || 20;
        var order = body.order || 'name';

        Image.all({ where: { type: imageTypeId }, limit: size, skip: (page - 1) * size, order: order }, (err, result) => {
            if (err) {
                return res.status(500).json({ message: err });
            }
            res.json({ images: result });
        });
    });

    router.post('/awards', authenticate((req, res, user) => {
        let selectedFile;
        if (req.files) {
            selectedFile = req.files.selectedFile;
            if (selectedFile && selectedFile.data.length == 0) {
                selectedFile = null;
            }
        }

        if (!selectedFile) {
            return res.json({ error: true, message: 'file not found' });
        }

        const description = req.body.image_description;

        uploadHelper.create(selectedFile, imageTypeId, { description }, (err, result) => {
            if (err) {
                return res.json({ error: true });
            }
            res.json({ image: result });
        });
    }));

    router.delete('/awards/:id', authenticate((req, res, user) => {
        const id = req.params.id;

        Image.find(id, (err, imageModel) => {
            if (err || !imageModel) res.status(500).json({ error: err.message });

            uploadHelper.remove(imageModel.id, () => {
                if (err) res.status(500).json({ error: err.message });
                res.json({ error: false });
            });
        });
    }));

    return router;
};