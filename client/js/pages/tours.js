(function(){
    var toursData = null;
    var user = null;
    var toursList = null;
    var editTag = null;

    function init(next) {
        if(toursData) {
            return next();
        }
        $.ajax({
            url: 'api/tours'
        }).then(function(res) {
            user = Cookies.getJSON('xx-auth');
            toursData = res.tours;
            next();
        });
    }

    var routes = {
        index: function(){
            init(function() {
                if(editTag) {
                    editTag.update({hidden: true});
                }
                var opts = {tours: toursData, isManager: user && !!user.role };
                if (toursList) {
                    toursList.refresh(toursData);
                } else {
                    toursList = riot.mount('tours', opts)[0];
                }
            });
        },
        edit: function(id){
            init(function() {
                if(toursList) {
                    toursList.update({hidden: true});
                }
                var tour = null;
                if (id) {
                    tour = _.find(toursData, function (item) {
                        return item.id == id;
                    });
                }
                if (editTag) {
                    editTag.refresh(tour);
                } else {
                    editTag = riot.mount('edit_tour', {tour: tour})[0];
                }
            });
        },
        details: function(id){

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
        addTour: function(tour) {
            toursData.push(tour);
        }
    };

    app.init();
})();



