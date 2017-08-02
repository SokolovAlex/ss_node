const fs = require('fs');
const pdf2img = require('pdf2img');
const config = require('../config');
const enums = require('../enums');

const awardEnum = enums.ImageTypes.Awards;
const awardUpload = `${config.upload_path}${awardEnum.folder}`;

pdf2img.setOptions({
    type: 'png',
    size: 1024,
    density: 600,
    outputdir: awardUpload,
    page: null
});

module.exports = {
    pdfToImg(file) {
        console.log("file---->", file);

        return new Promise((resolve, reject) => {
            const pdfPath = `${awardUpload}/${file.name}`;

            file.mv(pdfPath, (err, result) => {
                if (err) return reject(err);

                pdf2img.convert(pdfPath, function(err, info) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log(info);
                        resolve(info);
                    }
                });
            });
        });
    }
}