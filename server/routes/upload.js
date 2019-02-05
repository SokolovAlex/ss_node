const express = require('express');
const router = express.Router();
const UploadHelper = require('../helpers/uploadHelper');

module.exports = app => {
  const uploadHelper = UploadHelper(app);

  router.post('/tour', function(req, res) {
    if (!req.files) {
      res.send('No files were uploaded.');
      return;
    }

    const tourImage = req.files.tourImage;

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


