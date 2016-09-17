var express = require('express');
var router = express.Router();
var UploadHelper = require('../helpers/uploadHelper');

module.exports = app => {

    var uploadHelper = UploadHelper(app);

    router.post('/tour', function(req, res) {
        if (!req.files) {
            res.send('No files were uploaded.');
            return;
        }

        var tourImage = req.files.tourImage;

        console.log("body", req.body);

        console.log("tourImage", tourImage);

        if(tourImage) {
            uploadHelper.save(tourImage, 'temp', () => {
                res.json({message: '', error: true})
            });
        } else {
            res.json({message: '', error: true})
        }
    });

    return router;
};


