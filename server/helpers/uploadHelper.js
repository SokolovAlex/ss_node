module.exports = (app) => {

    const Image = app.models.Image;

    function save(file, folder, next) {
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

    function saveFile(file, folder, next) {
        file.mv(app.upload_path + `${folder}/${file.name}`, next);
    }

    return {
        save,
        saveFile
    };
};

