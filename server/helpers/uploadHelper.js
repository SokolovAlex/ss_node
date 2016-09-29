var fs = require("fs");
var _ = require("lodash");
var enums = require('../enums');

var ImageTypesFolders = _.reduce(enums.ImageTypes, (memo, item) => {
    memo[item.id] = item.folder || 'Temp';
    return memo;
}, {});

module.exports = (app) => {

    const Image = app.models.Image;

    function getRandomInt() {
        return parseInt(Math.random() * 1000, 10);
    }

    const addNum = (name) => {
        var fields = name.split('.');
        return [fields[0] + '_' + getRandomInt(), fields[1]].join('.');
    };

    const removeFile = (name, folder) => {
        fs.unlink(`${app.upload_path}${folder}/${name}`, _.noop);
    };

    const remove = (id, next) => {
        if(!id) {
            return next(null);
        }

        Image.find(id, (err, model) => {
            removeFile(model.name, ImageTypesFolders[model.type]);
            model.destroy(next);
        });
    };

    const update = (id, file, type, next) => {
        var folder = ImageTypesFolders[type];

        Image.find(id, (err, model) => {
            if (model.name != file.name) {
                removeFile(model.name, folder);
            }

            var name = addNum(file.name);

            file.mv(app.upload_path + `${folder}/${name}`, _.noop);

            model.updateAttributes({
                name: name
            }, next);
        });
    };

    function create(file, type, options, next) {
        if (_.isFunction(options)) {
            next = options;
        }

        options = options || {};

        var folder = ImageTypesFolders[type];

        if(!file) {
            return next(null);
        }

        var name = addNum(file.name);

        const saveDb = new Promise((resolve) => {
            Image.create({
                name: name,
                description: options.description,
                type
            }, (err, result) => {
                if (err) {
                    return next(err);
                }
                resolve(result);
            });
        });

        return saveDb.then((result) => {
            file.mv(app.upload_path + `${folder}/${name}`, function(err) {
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

    function save(id, file, type, next) {
        if(!id) {
            create(file, type, next);
        } else {
            if(file) {
                update(id, file, type, next);
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

