var menuHelper = require('../../helpers/menuHelper');
var authenticate = require('../../helpers/authenticate');
var UploadHelper = require('../../helpers/uploadHelper');
var mappers = require('../../helpers/mappers');
var enums = require('../../enums');

module.exports = (router, app) => {

    var imageTypeId = enums.ImageTypes.Gallery.id;

    var uploadHelper = UploadHelper(app);

    var Image = app.models.Image;

    router.get('/photos', (req, res) => {
        var body = req.body;
        var page = body.page || 1;
        var size = body.size || 20;
        var order = body.order || 'name';

        Image.all({where: {type: imageTypeId}, limit: size, skip: (page - 1) * size, order: order}, (err, result) => {
            if(err) {
                return res.status(500).json({ message: err });
            }
            res.json({ images: result });
        });
    });

    router.post('/photos', authenticate((req, res, user) => {
        var selectedFile;
        if (req.files) {
            selectedFile = req.files.selectedFile;
            if(selectedFile && selectedFile.data.length == 0) {
                selectedFile = null;
            }
        }

        if (!selectedFile) {
            return res.json({ error: true, message: 'не нашли файла' });
        }

        var description = req.body.image_description;

        uploadHelper.create(selectedFile, imageTypeId, { description }, (err, result) => {
            if (err) {
                return res.json({ error: true });
            }
            res.json({ image: result });
        });
    }));

    router.delete('/photos/:id', authenticate((req, res, user) => {
        var id = req.params.id;

        Image.find(id, (err, imageModel) => {
            if(err || !imageModel) res.status(500).json({ error: err.message });

            uploadHelper.remove(imageModel.id, () => {
                if(err) res.status(500).json({ error: err.message });
                res.json({error: false});
            });
        });
    }));

    return router;
};

