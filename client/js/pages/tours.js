(function(){
    var toursData = null;
    var user = null;
    var toursList = null;
    var editTag = null;
    var detailsTag = null;

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

    function prepareView(id, isDetails) {
        if(toursList) {
            toursList.update({hidden: true});
        }
        if (isDetails) {
            if(editTag) {
                editTag.update({hidden: true});
            }
        } else {
            if(detailsTag) {
                detailsTag.update({hidden: true});
            }
        }

        var tour = null;
        if (id) {
            tour = _.find(toursData, function (item) {
                return item.id == id;
            });
        }
        return tour;
    }

    var routes = {
        index: function(){
            init(function() {
                if(detailsTag) {
                    detailsTag.update({hidden: true});
                }
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
                var tour = prepareView(id);

                if (editTag) {
                    editTag.refresh(tour);
                } else {
                    editTag = riot.mount('edit_tour', {tour: tour})[0];
                }
            });
        },
        details: function(id){
            init(function() {
                var tour = prepareView(id, true);
                if (detailsTag) {
                    detailsTag.refresh(tour);
                } else {
                    detailsTag = riot.mount('details_tour', {tour: tour})[0];
                }
            });
        }
    };

    var getNightsTextMixin = {
        getNightsText: function(nights) {
            if(nights == 1 || nights == 21) {
                return nights + ' ночь';
            } else if (nights < 5) {
                return nights + ' ночи';
            } else if (nights < 20) {
                return nights + ' ночей';
            }
        }
    };
    var removeMixin = {
        remove: function() {
            var id = this.id;
            bootbox.confirm('Вы уверены?', function(result) {
                if (result) {
                    $.ajax({
                        url: 'api/tours/' + id,
                        method: "delete"
                    }).then(function(res) {
                        ss.alert.success();
                        app.removeFromCollection(id);
                        riot.route.exec('');
                    });
                }
            });
        }
    };

    window.app = {
        init: function() {
            riot.route(function(route, id) {
                var routeFn = routes[route || 'index'];
                routeFn(id);
            });

            riot.mixin('getNightsText', getNightsTextMixin);
            riot.mixin('remove', removeMixin);

            riot.route.start(true);
        },

        removeFromCollection(id) {
            toursData = _.reject(toursData, function(item) {
                return item.id == id;
            });
        },

        updateCollection: function(tour, type) {
            if (type == 'new') {
                toursData.push(tour);
            } else {
                var oldTour = _.find(toursData, function(item) {
                    return item.id == tour.id;
                });
                oldTour.title = tour.title;
                oldTour.description = tour.description;
                oldTour.nights = tour.nights;
                oldTour.cost = tour.cost;
                oldTour.startDate = tour.startDate;
            }
        }
    };

    app.init();
})();



