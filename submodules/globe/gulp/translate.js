var jsoncombine = require("gulp-jsoncombine"),
    _ = require('lodash');

gulp.task('translate', function () {

    Object.keys(config['translate']['lang'])
        .forEach(function(lang){

            gulp.src(config['translate']['lang'][lang])
                .pipe(jsoncombine(lang + ".json", function (data) {
                    var tr = {},
                        items = Object.keys(data);

                    items.reverse();

                    items.forEach(function (path) {
                        _.merge(tr, data[path]);
                    });

                    return new Buffer(JSON.stringify(tr));
                }))
                .pipe(gulp.dest(config['translate']['dst']))

        });



});