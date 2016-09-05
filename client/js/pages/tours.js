(function(){
    var tours = null;

    var routes = {
        index: function(){

            if (tours) {

                riot.mount('tours', {tours: tours});

            } else {

                $.ajax({
                    url: 'api/tours'
                }).then(function(res) {
                    var t = riot.mount('tours', res);
                    tours = res.tours;
                    console.log(t);
                });

            }
        },
        tour: function(id){}
    };

    riot.route(function(route, id) {
        var routeFn = routes[route || 'index'];
        routeFn(id);
    });

    riot.route.start(true);

})();



