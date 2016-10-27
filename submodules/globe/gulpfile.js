gulp = require('gulp');
dir = require('require-dir');

//

var knownOptions = {
        default: {
            env: 'dev',
            config: 'application',
            protocol: 'http://',
            server: 'localhost:9990'
        }
    },
    minimist = require('minimist');

options = minimist(process.argv.slice(2), knownOptions);

console.info('API HOST: ' + options.server);
config = require('./' + options.config + '/config.json');

if (options['env'] === 'production') {
    config.isProduction = true;
}
modules = {};

onErrors = function (error) {
    console.log(error.toString());
};

dir('./gulp');

gulp.task('default', ['build'], function () {
    gulp.start('watch');
    gulp.start('webServer');
});

