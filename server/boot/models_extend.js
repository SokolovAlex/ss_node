module.exports = (app) => {
    /**
     * Auto update modified and created fields for each model in the system
     */
    for (var modelName in app.models) {

        app.models[modelName].beforeSave = (next, ctx) => {

            if (!ctx.created) {
                ctx.created = new Date();
            }

            ctx.modified = new Date();

            next();
        };
    }


};
