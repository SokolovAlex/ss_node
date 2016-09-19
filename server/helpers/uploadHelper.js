var fs = require("fs");
var _ = require("lodash");
var enums = require('../enums');

var ImageTypesFolders = _.reduce(enums.ImageTypes, (memo, item) => {
    memo[item.id] = item.folder || 'Temp';
    return memo;
}, {});

module.exports = (app) => {

    const Image = app.models.Image;

    const removeFile = (name, folder) => {
        fs.unlink(`${app.upload_path}${folder}/${name}`, _.noop);
    };

    const remove = (id, next) => {
        Image.find(id, (err, model) => {
            removeFile(model.name, ImageTypesFolders[model.type]);
            model.destroy(next);
        });
    };

    const update = (id, file, folder, next) => {
        Image.find(id, (err, model) => {
            if (model.name != file.name) {
                removeFile(model.name, folder);
            }

            file.mv(app.upload_path + `${folder}/${file.name}`, _.noop);

            model.updateAttributes({
                name: file.name
            }, next);
        });
    };

    function create(file, folder, next) {
        const saveDb = new Promise((resolve) => {
            Image.create({
                name: file.name
            }, (err, result) => {
                if (err) {
                    return next(err);
                }
                resolve(result);
            });
        });

        return saveDb.then((result) => {
            file.mv(app.upload_path + `${folder}/${file.name}`, function(err) {
                if (err) {
                    next(err);
                } else {
                    next(null, result);
                }
            });
        }).catch(function(err) {
            next(err);
        });
    }

    function save(id, file, folder, next) {
        if(!id) {
            create(file, folder, next);
        } else {
            if(file) {
                update(id, file, folder, next);
            } else {
                //remove(id, next);
                next(null, null)
            }
        }
    }

    function saveFile(file, folder, next) {
        file.mv(app.upload_path + `${folder}/${file.name}`, next);
    }

    return {
        create,
        save,
        remove
    };
};

