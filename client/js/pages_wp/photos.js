require('../tags/photos');
var riot = require('riot');

$(document).ready(function() {

    var imagesData = null;
    var imageTag;
    var user = null;

    function init(next) {
        if(imagesData) {
            return next();
        }
        $.ajax({
            url: 'api/photos'
        }).then(function(res) {
            user = Cookies.getJSON('xx-auth');
            imagesData = res.images;
            next();
        });
    }

    var routes = {
        index: function(){
            init(function() {
                imageTag = riot.mount('photosList', { images: imagesData })[0];
            });
        }
    };

    window.app = {
        init: function() {
            riot.route(function(route, id) {
                var routeFn = routes[route || 'index'];
                routeFn(id);
            });

            riot.route.start(true);
        },
        deleteFromCollection: function(id) {
            imagesData = _.reject(imagesData, function(item) {
                return item.id == id;
            });

            imageTag.update({ images: imagesData });
        },
        updateCollection: function(image) {
            imagesData.push(image);
            imageTag.update({ images: imagesData });
        }
    };

    app.init();
});
