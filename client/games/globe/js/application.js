Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j, 1);
        }
    }
    return a;
};
(function (angular) {
    'use strict';

    config.$inject = ["$stateProvider", "$locationProvider"];
    run.$inject = ["$rootScope", "$state"];
    angular
        .module('application', [

            /* vendors */
            'angular-loading-bar',
            'pascalprecht.translate',
            'ui.router',
            'ui.bootstrap',
            'ngResource',
            'directive.brand',
            'application.guessCountry',
        ])
        .config(config)
        .run(run);

    function config(
        $stateProvider,
        $locationProvider
    ) {
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('application', {
                templateUrl: 'application/application.html'
            });
    }

    function run($rootScope, $state) {
        $state.go('application.guessCountry.game', {}, {location: 'replace'});
    }
})(angular);

(function(angular) {
    'use strict';

    eventHelper.$inject = ["utils"];
    angular
        .module('common.eventHelper', ['common.utils'])
        .factory('eventHelper', eventHelper);

    var raycaster = new THREE.Raycaster();

    function eventHelper(utils) {
        var width, height;
        var offsetY = 0, offsetX = 0;

        function setEvents(camera, items, type, wait) {
            var listener = function (event) {
                var scrollTop = window.pageYOffset;

                var mouse = {
                    x: ((event.clientX - offsetX - 1) / width) * 2 - 1,
                    y: -((event.clientY - offsetY + scrollTop - 1) / height) * 2 + 1
                };

                var vector = new THREE.Vector3();
                vector.set(mouse.x, mouse.y, 0.5);
                vector.unproject(camera);

                raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());

                var target = raycaster.intersectObjects(items);

                if (target.length) {
                    target[0].type = type;
                    target[0].object.dispatchEvent(target[0]);
                }
            };

            if (!wait) {
                document.addEventListener(type, listener, false);
            } else {
                document.addEventListener(type, utils.debounce(listener, wait), false);
            }
        };

        return {
            setEvents: setEvents,
            setSize: function(_width, _height){
                width = _width;
                height = _height;
            },
            setOffset: function(x, y){
                offsetY = y;
                offsetX = x;
            }
        };
    }
})(angular);

(function(angular) {
    'use strict';

    angular
        .module('common.geoHelper', [])
        .factory('geoHelper', geoHelper);

    function geoHelper() {
        var offsetX = 0,
            offsetY = 0,
            width,
            height;

        var instance = {
            setOffset: function(x, y) {
                offsetX = x;
                offsetY = y;
            },
            setSize: function(_width, _height) {
                width = parseInt(_width, 10);
                height = parseInt(_height, 10);
            },
            getPoint: function(event) {
                var a = this.geometry.vertices[event.face.a];
                var b = this.geometry.vertices[event.face.b];
                var c = this.geometry.vertices[event.face.c];

                var point = {
                    x: (a.x + b.x + c.x) / 3,
                    y: (a.y + b.y + c.y) / 3,
                    z: (a.z + b.z + c.z) / 3
                };

                return point;
            },
            getEventCenter: function(event, radius) {
                radius = radius || 200;

                var point = instance.getPoint.call(this, event);

                var latRads = Math.acos(point.y / radius);
                var lngRads = Math.atan2(point.z, point.x);
                var lat = (Math.PI / 2 - latRads) * (180 / Math.PI);
                var lng = (Math.PI - lngRads) * (180 / Math.PI);

                return [lat, lng - 180];
            },
            convertToXYZ: function(point, radius) {
                radius = radius || 200;

                var latRads = ( 90 - point[0]) * Math.PI / 180;
                var lngRads = (180 - point[1]) * Math.PI / 180;

                var x = radius * Math.sin(latRads) * Math.cos(lngRads);
                var y = radius * Math.cos(latRads);
                var z = radius * Math.sin(latRads) * Math.sin(lngRads);

                return {x: x, y: y, z: z};
            },
            geodecoder: function (features) {
                var store = {};

                for (var i = 0; i < features.length; i++) {
                    store[features[i].id] = features[i];
                }

                return {
                    find: function (id) {
                        return store[id];
                    },
                    search: function (lat, lng) {

                        var match = false;

                        var country, coords;

                        for (var i = 0; i < features.length; i++) {
                            country = features[i];
                            if(country.geometry.type === 'Polygon') {
                                match = instance.pointInPolygon(country.geometry.coordinates[0], [lng, lat]);
                                if (match) {
                                    return {
                                        code: features[i].id,
                                        name: features[i].properties.name
                                    };
                                }
                            } else if (country.geometry.type === 'MultiPolygon') {
                                coords = country.geometry.coordinates;
                                for (var j = 0; j < coords.length; j++) {
                                    match = instance.pointInPolygon(coords[j][0], [lng, lat]);
                                    if (match) {
                                        return {
                                            code: features[i].id,
                                            name: features[i].properties.name
                                        };
                                    }
                                }
                            }
                        }

                        return null;
                    }
                };
            },
            pointInPolygon: function(poly, point) {
                var x = point[0];
                var y = point[1];

                var inside = false, xi, xj, yi, yj, xk;

                for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                    xi = poly[i][0];
                    yi = poly[i][1];
                    xj = poly[j][0];
                    yj = poly[j][1];
                    xk = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    if (xk) {
                        inside = !inside;
                    }
                }
                return inside;
            }
        };

        return instance;
    }
})(angular);

(function(angular) {
    'use strict';

    angular
        .module('common.mapTexture', [])
        .factory('mapTexture', mapTexture);

    function mapTexture() {
        var projection = d3.geo.equirectangular()
            .translate([1024, 512])
            .scale(325);

        return function(geojson, color) {
            var texture, context, canvas;

            canvas = d3.select("body").append("canvas")
                .style("display", "none")
                .attr("width", "2048px")
                .attr("height", "1024px");

            context = canvas.node().getContext("2d");

            var path = d3.geo.path()
                .projection(projection)
                .context(context);

            context.strokeStyle = "#eae8e8";
            context.lineWidth = 0.4;
            context.fillStyle = color || "#CDB380";

            context.beginPath();

            path(geojson);

            if (color) {
                context.fill();
            }

            context.stroke();

            texture = new THREE.Texture(canvas.node());
            texture.needsUpdate = true;

            canvas.remove();

            return texture;
        };
    }
})(angular);

(function(angular) {
    'use strict';

    angular
        .module('common.scene', [])
        .factory('sceneHelper', sceneHelper);

    function SceneObj (element, width, height) {
        var _width = window.innerWidth;
        var _height = window.innerHeight;

        this.offsetX = _width - width;
        this.offsetY = _height - height;

        this.canvas = d3.select(element).append("canvas");

        this.canvas.node().getContext("experimental-webgl");

        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.node(), antialias: true});

        this.renderer.setSize(width, height);

        element.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(70, width / height, 1, 5000);

        this.camera.position.z = 900;

        this.scene = new THREE.Scene();

        this.light = new THREE.HemisphereLight('#ffffff', '#666666', 1.2);

        this.light.position.set(0, 1000, 0);
        this.scene.add(this.light);
    };

    function sceneHelper() {
        return {
            init: function(elem, width, height) {
                return new SceneObj(elem, width, height);
            }
        };
    }
})(angular);

(function() {
    window.settings = {
        globe: {
            oceanColor: '#fff',
            countriesColor: '#c3c7cf',
            overlayColor: '#FF7F27',
            maxZoom: 1000,
            minZoom: 700,
            zoomStep: 50,
            earthRadius: 200,
            cloudsRadius: 206,
            starsRadius: 1000,
            overlayRadius: 202
        }
    };
})();
/**
 * Created by sokolov on 15.01.2016.
 */

(function(angular) {
    'use strict';

    angular
        .module('common.utils', [])
        .factory('utils', ['$q', utils]);

    function utils($q) {
        var questions = null;
        var deferred;

        var instance = {

            getFlags: function(questions, fakeSize) {
                if (!questions){
                    deferred = deferred || $q.defer();
                    return deferred.promise;
                }
                var countryCodes = [{"name":"Afghanistan","code":"af"},{"name":"Åland Islands","code":"ax"},{"name":"Albania","code":"al"},{"name":"Algeria","code":"dz"},{"name":"American Samoa","code":"as"},{"name":"AndorrA","code":"ad"},{"name":"Angola","code":"ao"},{"name":"Anguilla","code":"ai"},{"name":"Antarctica","code":"aq"},{"name":"Antigua and Barbuda","code":"ag"},{"name":"Argentina","code":"ar"},{"name":"Armenia","code":"am"},{"name":"Aruba","code":"aw"},{"name":"Australia","code":"au"},{"name":"Austria","code":"at"},{"name":"Azerbaijan","code":"az"},{"name":"Bahamas","code":"bs"},{"name":"Bahrain","code":"bh"},{"name":"Bangladesh","code":"bd"},{"name":"Barbados","code":"bb"},{"name":"Belarus","code":"by"},{"name":"Belgium","code":"be"},{"name":"Belize","code":"bz"},{"name":"Benin","code":"bj"},{"name":"Bermuda","code":"bm"},{"name":"Bhutan","code":"bt"},{"name":"Bolivia","code":"bo"},{"name":"Bosnia and Herzegovina","code":"ba"},{"name":"Botswana","code":"bw"},{"name":"Bouvet Island","code":"bv"},{"name":"Brazil","code":"br"},{"name":"British Indian Ocean Territory","code":"io"},{"name":"Brunei Darussalam","code":"bn"},{"name":"Bulgaria","code":"bg"},{"name":"Burkina Faso","code":"bf"},{"name":"Burundi","code":"bi"},{"name":"Cambodia","code":"kh"},{"name":"Cameroon","code":"cm"},{"name":"Canada","code":"ca"},{"name":"Cape Verde","code":"cv"},{"name":"Cayman Islands","code":"ky"},{"name":"Central African Republic","code":"cf"},{"name":"Chad","code":"td"},{"name":"Chile","code":"cl"},{"name":"China","code":"cn"},{"name":"Christmas Island","code":"cx"},{"name":"Cocos (Keeling) Islands","code":"cc"},{"name":"Colombia","code":"co"},{"name":"Comoros","code":"km"},{"name":"Congo","code":"cg"},{"name":"Congo, The Democratic Republic of the","code":"cd"},{"name":"Cook Islands","code":"ck"},{"name":"Costa Rica","code":"cr"},{"name":"Cote D'Ivoire","code":"ci"},{"name":"Croatia","code":"hr"},{"name":"Cuba","code":"cu"},{"name":"Cyprus","code":"cy"},{"name":"Czech Republic","code":"cz"},{"name":"Denmark","code":"dk"},{"name":"Djibouti","code":"dj"},{"name":"Dominica","code":"dm"},{"name":"Dominican Republic","code":"do"},{"name":"Ecuador","code":"ec"},{"name":"Egypt","code":"eg"},{"name":"El Salvador","code":"sv"},{"name":"Equatorial Guinea","code":"gq"},{"name":"Eritrea","code":"er"},{"name":"Estonia","code":"ee"},{"name":"Ethiopia","code":"et"},{"name":"Falkland Islands (Malvinas)","code":"fk"},{"name":"Faroe Islands","code":"fo"},{"name":"Fiji","code":"fj"},{"name":"Finland","code":"fi"},{"name":"France","code":"fr"},{"name":"French Guiana","code":"gf"},{"name":"French Polynesia","code":"pf"},{"name":"French Southern Territories","code":"tf"},{"name":"Gabon","code":"ga"},{"name":"Gambia","code":"gm"},{"name":"Georgia","code":"ge"},{"name":"Germany","code":"de"},{"name":"Ghana","code":"gh"},{"name":"Gibraltar","code":"gi"},{"name":"Greece","code":"gr"},{"name":"Greenland","code":"gl"},{"name":"Grenada","code":"gd"},{"name":"Guadeloupe","code":"gp"},{"name":"Guam","code":"gu"},{"name":"Guatemala","code":"gt"},{"name":"Guernsey","code":"gg"},{"name":"Guinea","code":"gn"},{"name":"Guinea-Bissau","code":"gw"},{"name":"Guyana","code":"gy"},{"name":"Haiti","code":"ht"},{"name":"Heard Island and Mcdonald Islands","code":"hm"},{"name":"Holy See (Vatican City State)","code":"va"},{"name":"Honduras","code":"hn"},{"name":"Hong Kong","code":"hk"},{"name":"Hungary","code":"hu"},{"name":"Iceland","code":"is"},{"name":"India","code":"in"},{"name":"Indonesia","code":"id"},{"name":"Iran, Islamic Republic Of","code":"ir"},{"name":"Iraq","code":"iq"},{"name":"Ireland","code":"ie"},{"name":"Isle of Man","code":"im"},{"name":"Israel","code":"il"},{"name":"Italy","code":"it"},{"name":"Jamaica","code":"jm"},{"name":"Japan","code":"jp"},{"name":"Jersey","code":"je"},{"name":"Jordan","code":"jo"},{"name":"Kazakhstan","code":"kz"},{"name":"Kenya","code":"ke"},{"name":"Kiribati","code":"ki"},{"name":"Korea, Democratic People'S Republic of","code":"kp"},{"name":"Korea, Republic of","code":"kr"},{"name":"Kuwait","code":"kw"},{"name":"Kyrgyzstan","code":"kg"},{"name":"Lao People'S Democratic Republic","code":"la"},{"name":"Latvia","code":"lv"},{"name":"Lebanon","code":"lb"},{"name":"Lesotho","code":"ls"},{"name":"Liberia","code":"lr"},{"name":"Libyan Arab Jamahiriya","code":"ly"},{"name":"Liechtenstein","code":"li"},{"name":"Lithuania","code":"lt"},{"name":"Luxembourg","code":"lu"},{"name":"Macao","code":"mo"},{"name":"Macedonia, The Former Yugoslav Republic of","code":"mk"},{"name":"Madagascar","code":"mg"},{"name":"Malawi","code":"mw"},{"name":"Malaysia","code":"my"},{"name":"Maldives","code":"mv"},{"name":"Mali","code":"ml"},{"name":"Malta","code":"mt"},{"name":"Marshall Islands","code":"mh"},{"name":"Martinique","code":"mq"},{"name":"Mauritania","code":"mr"},{"name":"Mauritius","code":"mu"},{"name":"Mayotte","code":"yt"},{"name":"Mexico","code":"mx"},{"name":"Micronesia, Federated States of","code":"fm"},{"name":"Moldova, Republic of","code":"md"},{"name":"Monaco","code":"mc"},{"name":"Mongolia","code":"mn"},{"name":"Montserrat","code":"ms"},{"name":"Morocco","code":"ma"},{"name":"Mozambique","code":"mz"},{"name":"Myanmar","code":"mm"},{"name":"Namibia","code":"na"},{"name":"Nauru","code":"nr"},{"name":"Nepal","code":"np"},{"name":"Netherlands","code":"nl"},{"name":"Netherlands Antilles","code":"an"},{"name":"New Caledonia","code":"nc"},{"name":"New Zealand","code":"nz"},{"name":"Nicaragua","code":"ni"},{"name":"Niger","code":"ne"},{"name":"Nigeria","code":"ng"},{"name":"Niue","code":"nu"},{"name":"Norfolk Island","code":"nf"},{"name":"Northern Mariana Islands","code":"mp"},{"name":"Norway","code":"no"},{"name":"Oman","code":"om"},{"name":"Pakistan","code":"pk"},{"name":"Palau","code":"pw"},{"name":"Palestinian Territory, Occupied","code":"ps"},{"name":"Panama","code":"pa"},{"name":"Papua New Guinea","code":"pg"},{"name":"Paraguay","code":"py"},{"name":"Peru","code":"pe"},{"name":"Philippines","code":"ph"},{"name":"Pitcairn","code":"pn"},{"name":"Poland","code":"pl"},{"name":"Portugal","code":"pt"},{"name":"Puerto Rico","code":"pr"},{"name":"Qatar","code":"qa"},{"name":"Reunion","code":"re"},{"name":"Romania","code":"ro"},{"name":"Russian Federation","code":"ru"},{"name":"RWANDA","code":"rw"},{"name":"Saint Helena","code":"sh"},{"name":"Saint Kitts and Nevis","code":"kn"},{"name":"Saint Lucia","code":"lc"},{"name":"Saint Pierre and Miquelon","code":"pm"},{"name":"Saint Vincent and the Grenadines","code":"vc"},{"name":"Samoa","code":"ws"},{"name":"San Marino","code":"sm"},{"name":"Sao Tome and Principe","code":"st"},{"name":"Saudi Arabia","code":"sa"},{"name":"Senegal","code":"sn"},{"name":"Serbia and Montenegro","code":"cs"},{"name":"Seychelles","code":"sc"},{"name":"Sierra Leone","code":"sl"},{"name":"Singapore","code":"sg"},{"name":"Slovakia","code":"sk"},{"name":"Slovenia","code":"si"},{"name":"Solomon Islands","code":"sb"},{"name":"Somalia","code":"so"},{"name":"South Africa","code":"za"},{"name":"South Georgia and the South Sandwich Islands","code":"gs"},{"name":"Spain","code":"es"},{"name":"Sri Lanka","code":"lk"},{"name":"Sudan","code":"sd"},{"name":"Suriname","code":"sr"},{"name":"Svalbard and Jan Mayen","code":"sj"},{"name":"Swaziland","code":"sz"},{"name":"Sweden","code":"se"},{"name":"Switzerland","code":"ch"},{"name":"Syrian Arab Republic","code":"sy"},{"name":"Taiwan, Province of China","code":"tw"},{"name":"Tajikistan","code":"tj"},{"name":"Tanzania, United Republic of","code":"tz"},{"name":"Thailand","code":"th"},{"name":"Timor-Leste","code":"tl"},{"name":"Togo","code":"tg"},{"name":"Tokelau","code":"tk"},{"name":"Tonga","code":"to"},{"name":"Trinidad and Tobago","code":"tt"},{"name":"Tunisia","code":"tn"},{"name":"Turkey","code":"tr"},{"name":"Turkmenistan","code":"tm"},{"name":"Turks and Caicos Islands","code":"tc"},{"name":"Tuvalu","code":"tv"},{"name":"Uganda","code":"ug"},{"name":"Ukraine","code":"ua"},{"name":"United Arab Emirates","code":"ae"},{"name":"United Kingdom","code":"gb"},{"name":"United States","code":"us"},{"name":"United States Minor Outlying Islands","code":"um"},{"name":"Uruguay","code":"uy"},{"name":"Uzbekistan","code":"uz"},{"name":"Vanuatu","code":"vu"},{"name":"Venezuela","code":"ve"},{"name":"Viet Nam","code":"vn"},{"name":"Virgin Islands, British","code":"vg"},{"name":"Virgin Islands, U.S.","code":"vi"},{"name":"Wallis and Futuna","code":"wf"},{"name":"Western Sahara","code":"eh"},{"name":"Yemen","code":"ye"},{"name":"Zambia","code":"zm"},{"name":"Zimbabwe","code":"zw"}];
                var flags = _.clone(questions);
                var fakeFlags = _.shuffle(countryCodes);
                fakeFlags = _.take(fakeFlags, fakeSize);
                flags = flags.concat(fakeFlags);
                flags = _.shuffle(flags);

                if(deferred) {
                    deferred.resolve(flags);
                }
            },

            getQuestions: function(availableQuestions, size, fakeSize) {
                if(!questions && availableQuestions) {
                    questions = _.shuffle(availableQuestions);
                    questions = _.take(questions, size);
                    instance.getFlags(questions, fakeSize);
                }
                return questions;
            },

            memorize: function(fn) {
                return function () {
                    var args = Array.prototype.slice.call(arguments);

                    var key = "", len = args.length, cur = null;

                    while (len--) {
                        cur = args[len];
                        key += (cur === Object(cur))? JSON.stringify(cur): cur;

                        fn.memoize || (fn.memoize = {});
                    }

                    return (key in fn.memoize)? fn.memoize[key]:
                        fn.memoize[key] = fn.apply(this, args);
                };
            },
            debounce: function(func, wait, immediate) {
                var timeout;
                return function() {
                    var context = this, args = arguments;
                    var later = function () {
                        timeout = null;
                        if (!immediate) {
                            func.apply(context, args);
                        }
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) {
                        func.apply(context, args);
                    }
                };
            },
            getTween: function (prop, to, time) {
                time = time || 500;
                var node = this;
                var curr = node[prop];
                var interpol = d3.interpolateObject(curr, to);
                return function (t) {
                    node[prop].copy(interpol(t / time));
                    if (t >= time) {
                        return true;
                    }
                };
            }
        };

        return instance;
    }
})(angular);

function sync_code() {
    var countryCodes = []; //flags
    var w = {objects:{countries: {geometries: []}}}; //worlds json

    _.each(w.objects.countries.geometries, function(item) {
        var finded = _.find(countryCodes, function(f) {
            return f.name == item.id;
        });
        if (finded) {
            item.code = finded.code
        }
    });
    console.log(JSON.stringify(w)); // result
}

(function (angular) {
    'use strict';

    config.$inject = ["$stateProvider"];
    angular
        .module('application.guessCountry', [
            'application.guessCountry.game',
            'directive.gameTask',
            'directive.gameProgress',
            'common.utils',
            'globe.modal'
        ])
        .config(config);

    function config($stateProvider) {

        $stateProvider
            .state('application.guessCountry', {
                templateUrl: 'application/guessCountry/guessCountry.html',
                controller: ['$scope', '$http', 'utils', 'modalservice', GuessCountryCtrl],
                controllerAs: 'guessCountryCtrl'
            });
    }

    function GuessCountryCtrl($scope, $http, utils, modalservice){
        var guessCountryCtrl = this;
        guessCountryCtrl.questions = [];
        var currentQuestionIndex = 0;
        var size = 10;
        var fakeFlags = 5;
        var scores = 0;

        var currentQuestion;

        $scope.$on('answer', function(event, answer) {
            if(!answer.mapCode || !answer.flagCode || !currentQuestion) {
                return;
            }

            var error = true,
                message = '';

            var Statuses = {
                error: 1,
                partly: 2,
                success: 3
            };

            var message,
                status;

            if (currentQuestion.code == answer.flagCode && currentQuestion.code == answer.mapCode) {
                error = false;
                scores = scores + 3;
                status = Statuses.success;
                message = "Отлично! Вы справились с заданием.";
            } else if(currentQuestion.code == answer.mapCode) {
                scores++;
                status = Statuses.partly;
                message = "Увы... Вы угадали страну, но не угадали флаг.";
            } else if(currentQuestion.code == answer.flagCode) {
                scores++;
                status = Statuses.partly;
                message = "Увы... Вы угадали флаг, но не угадали страну.";
            } else {
                status = Statuses.error;
                message = "К сожалению, вы ошиблись и с флагом и со страной.";
            }

            currentQuestionIndex++;
            currentQuestion = guessCountryCtrl.questions[currentQuestionIndex];

            if (currentQuestion) {
                modalservice.open(message, status);
                $scope.$broadcast('change', {
                    name: currentQuestion.name,
                    error: error
                });
            } else {
                modalservice.open(message, status, scores);
                var event = new CustomEvent("endGame", { 'detail': { scores: scores } });
                document.dispatchEvent(event);
            }

            $scope.$apply();
        });

        $http.get('/games/globe/data/gameTask/data/questions.mock.json')
            .then(function(response) {
                if (!response.data) {
                    return;
                }

                guessCountryCtrl.questions = utils.getQuestions(response.data.questions, size, fakeFlags);
                currentQuestion = guessCountryCtrl.questions[currentQuestionIndex];

                $scope.$broadcast('initQuestions', {
                    questionAmount: guessCountryCtrl.questions.length
                });

                $scope.$broadcast('change', {
                    name: currentQuestion.name
                });
        });
    }

})(angular);
/**
 *
 * Created by Pavel Akulov on 15.01.2016.
 * Email: akulov@magora-systems.ru
 * Company: Magora Systems LLC
 * Website: http://magora-systems.com
 */

(function(angular) {
    'use strict';
    angular
        .module('directive.brand', [])
        .directive('brand', brandTask);

    function brandTask() {
        return {
            replace: true,
            restrict: 'E',
            templateUrl: 'directive/brand/brand.html',
            controllerAs: 'brandCtrl',
            bindToController: true,
            controller: BrandCtrl,
            link: function($scope, $element) {
                bind($element);
            }
        }
    }

    function BrandCtrl(){
    }

    function bind($element){
        var container = $element[0];
        container.addEventListener('click', function() {
            location.href = '/games';
            location.reload();
        });
    }

})(angular);
(function(angular) {
    'use strict';

    GameProgressCtrl.$inject = ["$scope"];
    angular
        .module('directive.gameProgress', [])
        .directive('gameProgress', gameProgress);

    function gameProgress() {
        return {
            replace: true,
            scope: {
                amount: "@"
            },
            restrict: 'E',
            templateUrl: 'directive/gameProgress/gameProgress.html',
            controllerAs: 'gameProgressCtrl',
            bindToController: true,
            controller: GameProgressCtrl
        }
    }

    function GameProgressCtrl($scope){
        var gameProgressCtrl = this;
        gameProgressCtrl.questionStates = [];

        gameProgressCtrl.currentStateIndex = 0;
        var currentQuestionState;

        $scope.$on('initQuestions', function(e, data) {
            gameProgressCtrl.questionStates = _.map(_.range(data.questionAmount), function() {
                return {};
            });
        });

        $scope.$on('change', function(e, data) {
            if (currentQuestionState) {
                currentQuestionState.state = data.error ? "wrong" : "correct";
            }

            gameProgressCtrl.currentStateIndex++;

            currentQuestionState = gameProgressCtrl.questionStates[gameProgressCtrl.currentStateIndex - 1];

            currentQuestionState.state = 'active';
        });
    }
})(angular);
(function(angular) {
    'use strict';

    GameTaskCtrl.$inject = ["$scope"];
    angular
        .module('directive.gameTask', [])
        .directive('gameTask', gameTask);

    function gameTask() {
        return {
            replace: true,
            scope: {
                generalTask: '@'
            },
            restrict: 'E',
            templateUrl: 'directive/gameTask/gameTask.html',
            controllerAs: 'gameTaskCtrl',
            bindToController: true,
            controller: GameTaskCtrl
        }
    }

    function GameTaskCtrl($scope){
        var gameTaskCtrl = this;
        gameTaskCtrl.questTask = '';

        $scope.$on('change', function(e, data) {
            gameTaskCtrl.questTask = data.name;
        });
    }
})(angular);
(function(angular) {
    'use strict';

    angular
        .module('directive.globe', [
            'globe.factory',
            'directive.globe.draggableFlag',
            'common.utils'
        ])
        .directive('globe', globe);

    function globe() {
        return {
            restrict: 'E',
            scope: {
                width: '@',
                height: '@'
            },
            templateUrl: 'directive/globe/globe.html',
            controller: ['globe', 'utils', GlobeCtrl],
            controllerAs: 'globeCtrl',
            bindToController: true,
            link: function($scope, $element) {
                $scope.globeCtrl.init($element);
            }
        }
    }

    function GlobeCtrl(globe, utils) {
        var globeCtrl = this;

        utils.getFlags().then(function(flags) {
            globeCtrl.countryCodes = flags;
        });

        globeCtrl.init = function($element){
            var container = $element[0].getElementsByClassName('globe');
            container = container[0] || {};

            var width =  globeCtrl.width || window.innerWidth;
            var height =  globeCtrl.height || window.innerHeight;

            globe.init(container, width, height);

            var flagContainer = $element[0].getElementsByClassName('country-list-container');
            initFlags(flagContainer[0]);
        };

        globeCtrl.zoomIn = globe.zoomIn;

        globeCtrl.zoomOut = globe.zoomOut;

        globeCtrl.normalize = globe.normalize;

        globeCtrl.showAxes = globe.showAxes;
    }

    angular
        .module('directive.globe.draggableFlag', [])
        .directive('draggableFlag', draggableFlag);

    function initFlags(el) {
        var upEl = el.getElementsByClassName('js-flags-up')[0];
        var downEl = el.getElementsByClassName('js-flags-down')[0];
        var list = el.getElementsByClassName('country-list')[0];
        var styleToAnimate = 'margin-top';
        var maxSize = 15 * 43;
        var height;

        var value = 0;

        upEl.addEventListener('click', function(e) {
            value += 43;
            if(value > 0) {
                value = 0;
            }
            list.style[styleToAnimate] = value + 'px';
            list.style['height'] = height - value + "px";
        });

        downEl.addEventListener('click', function(e) {
            value -= 43;
            if(Math.abs(value) > maxSize - height ) {
                value = - maxSize + height;
            }
            list.style[styleToAnimate] = value + 'px';
            list.style['height'] = height - value + "px";
        });

        function resize() {
            height = window.innerHeight - 80;
            list.style['height'] = height + "px";
        }
        resize();

        window.addEventListener("resize", resize);
    };

    function draggableFlag() {
        return {
            restrict: 'A',
            scope: {
                data: '=draggableFlag'
            },
            controller: DraggableFlagCtrl,
            controllerAs: 'draggableFlagCtrl',
            bindToController: true,
            link: function($scope, $element) {
                $scope.draggableFlagCtrl.init($element[0]);
            }
        }
    }

    function DraggableFlagCtrl(){
        var draggableFlagCtrl = this;

        draggableFlagCtrl.init = function(el) {
            el.draggable = true;

            el.addEventListener(
                'dragstart',
                function(e) {
                    e.dataTransfer.effectAllowed = 'copy';
                    e.dataTransfer.setData('Text', el.getAttribute('data-country'));
                    this.classList.add('drag');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragend',
                function(e) {
                    this.classList.remove('drag');
                    return false;
                },
                false
            );
        }
    }
})(angular);
(function (angular) {
    'use strict';

    angular
        .module('globe.modal', [
            'ui.bootstrap.modal'
        ])
        .controller('globeModalCtrl', ['$scope', '$rootScope', '$uibModalInstance', function($scope, $rootScope, $uibModalInstance) {
            $rootScope.text = $uibModalInstance.text;
            $rootScope.error = $uibModalInstance.status !== 3;
            $rootScope.status_class =
                $uibModalInstance.status === 3 ? 'status-success' :
                ($uibModalInstance.status === 1 ? 'status-error' : 'status-partly');
            $rootScope.close = function () {
                $uibModalInstance.dismiss('cancel');
                if ($uibModalInstance.finish) {
                    $uibModalInstance.finish();
                }
            };
        }])
        .controller('finishModalCtrl', ['$scope', '$rootScope', '$uibModalInstance', function($scope, $rootScope, $uibModalInstance) {
            $rootScope.scores = $uibModalInstance.scores;
            $rootScope.restart = function () {
                location.reload();
            };
        }])
        .factory('modalservice', ['$modal', modal]);

    function modal($modal){
        var modalInstance;
        var finishModalInstance;

        var open = function (text, status, scores) {
            modalInstance = $modal.open({
                templateUrl: 'directive/modal/modal.html',
                controller: 'globeModalCtrl',
                controllerAs: '$ctrl'
            });
            modalInstance.status = status;
            modalInstance.text = text;
            if  (typeof(scores) !== 'undefined') {
                modalInstance.finish = function() {
                    finishModalInstance = $modal.open({
                        templateUrl: 'directive/modal/finish.html',
                        controller: 'finishModalCtrl',
                        controllerAs: '$ctrl'
                    });
                    finishModalInstance.scores = scores;
                };
            }
        };

        return {open: open};
    }
})(angular);


/**
 *
 * Created by Pavel Akulov on 11.01.2016.
 * Email: akulov@magora-systems.ru
 * Company: Magora Systems LLC
 * Website: http://magora-systems.com
 */

(function (angular) {
    'use strict';

    config.$inject = ["$stateProvider"];
    angular
        .module('application.guessCountry.game', [
            'directive.globe'
        ])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('application.guessCountry.game', {
                templateUrl: 'application/guessCountry/game/game.html'
            });
    }

})(angular);
(function(angular) {
    'use strict';

    globeEvents.$inject = ["$rootScope", "utils", "geoHelper"];
    angular
        .module('globe.events', [
            'common.geoHelper',
            'common.utils'
        ])
        .factory('globeEvents', globeEvents);

    function globeEvents($rootScope, utils, geoHelper) {
        var position = {x: 0, y: 0},
            currentCountry,
            dragging = false;

        return function(countries, overlay, textureCache, geo, root, countriesCodes, camera) {

            var settings = window.settings.globe;

            function onDragOver(e) {
                e.dataTransfer.dropEffect = 'copy';
                if (e.preventDefault) e.preventDefault();
                this.classList.add('over');

                return false;
            }

            function onDragEnter(e) {
                this.classList.add('over');
                return false;
            }

            function onDragLeave(e) {
                this.classList.remove('over');
                return false;
            }

            function onDrop(e) {
                if (e.stopPropagation) e.stopPropagation();

                this.classList.remove('over');

                $rootScope.$broadcast('answer', {
                    flagCode: e.dataTransfer.getData('Text'),
                    mapCode: countriesCodes[currentCountry]
                });

                return false;
            }

            function onMouseMove(e) {
                var precision = 5;
                if (dragging) {
                    return;
                }

                if (Math.abs(e.screenX - position.x) > precision
                    || Math.abs(e.screenY - position.y) > precision) {
                    dragging = true;
                }
            }

            function onMouseDown(e) {
                dragging = false;
                position.x = e.screenX;
                position.y = e.screenY;
            }

            function onGlobeClick(event) {
                if (dragging) {
                    return;
                }

                var latlng = geoHelper.getEventCenter.call(this, event);
                var temp = new THREE.Mesh();
                temp.position.copy(geoHelper.convertToXYZ(latlng, 900));
                temp.lookAt(root.position);
                temp.rotateY(Math.PI);

                for (var key in temp.rotation) {
                    if (temp.rotation[key] - camera.rotation[key] > Math.PI) {
                        temp.rotation[key] -= Math.PI * 2;
                    } else if (camera.rotation[key] - temp.rotation[key] > Math.PI) {
                        temp.rotation[key] += Math.PI * 2;
                    }
                }

                var tweenPos = utils.getTween.call(camera, 'position', temp.position);
                d3.timer(tweenPos);

                var tweenRot = utils.getTween.call(camera, 'rotation', temp.rotation);
                d3.timer(tweenRot);
            }

            function onGlobeMouseMove(event) {
                var map, material;

                var latlng = geoHelper.getEventCenter.call(this, event);

                var country = geo.search(latlng[0], latlng[1]);

                if (country !== null && country.code !== currentCountry) {
                    currentCountry = country.code;
                    map = textureCache(country.code, settings.overlayColor);

                    material = new THREE.MeshPhongMaterial({map: map, transparent: true});
                    overlay.material = material;
                }
            }

            return {
                onGlobeMouseMove: onGlobeMouseMove,
                onGlobeClick: onGlobeClick,
                onMouseMove: onMouseMove,
                onMouseDown: onMouseDown,
                onDrop: onDrop,
                onDragLeave: onDragLeave,
                onDragOver: onDragOver,
                onDragEnter: onDragEnter
            };
        }
    }
})(angular);


(function(angular) {
    globeFactory.$inject = ["geoHelper", "sceneHelper", "utils", "eventHelper", "mapTexture", "globeEvents"];
    angular
        .module('globe.factory', [
            'common.geoHelper',
            'common.utils',
            'common.scene',
            'common.eventHelper',
            'common.mapTexture',
            'globe.events'
        ])
        .factory('globe', globeFactory);

    function globeFactory(geoHelper, sceneHelper, utils, eventHelper, mapTexture, globeEvents) {
        var controls;
        var scene, renderer, canvas, camera, geo, root, axes;

        var loader = new THREE.TextureLoader();

        var setEvents = eventHelper.setEvents;

        var settings = window.settings.globe;

        var textureCache = utils.memorize(function (cntryID, color) {
            var country = geo.find(cntryID);
            return mapTexture(country, color);
        });

        function initControls() {
            var _controls = new THREE.TrackballControls(camera, renderer.domElement);
            _controls.rotateSpeed = 5.0;
            _controls.noZoom = false;
            _controls.noPan = true;
            _controls.staticMoving = false;
            _controls.minDistance = settings.minZoom;
            _controls.maxDistance = settings.maxZoom;
            return _controls;
        }

        function createEarth(countries, segments) {
            var material = new THREE.MeshPhongMaterial({
                color: settings.oceanColor,
                transparent: true
            });
            var sphere = new THREE.SphereGeometry(settings.earthRadius, segments, segments);
            var baseGlobe = new THREE.Mesh(sphere, material);
            baseGlobe.rotation.y = Math.PI;
            baseGlobe.renderOrder = 0;

            var worldTexture = mapTexture(countries, settings.countriesColor);
            var mapMaterial = new THREE.MeshPhongMaterial({
                map: worldTexture,
                transparent: true
            });
            var baseMap = new THREE.Mesh(new THREE.SphereGeometry(settings.earthRadius, segments, segments), mapMaterial);
            baseMap.rotation.y = Math.PI;
            baseMap.renderOrder = 0;
            return {
                map: baseMap,
                globe: baseGlobe
            };
        }

        function createStars(segments) {
            var mesh = new THREE.Mesh(
                new THREE.SphereGeometry(settings.starsRadius, segments, segments),
                new THREE.MeshBasicMaterial({
                    map:  loader.load('/games/globe/assets/images/globe/images/galaxy_starfield.png'),
                    side: THREE.BackSide
                })
            );
            return {
                mesh: mesh,
                move: function(delta) {
                    mesh.rotateY( 1/16 * delta );
                    mesh.rotateX( 1/32 * delta );
                }
            };
        }

        function createClouds(segments) {
            var mesh = new THREE.Mesh(
                new THREE.SphereGeometry(settings.cloudsRadius, segments, segments),
                new THREE.MeshPhongMaterial({
                    map: loader.load('/games/globe/assets/images/globe/images/fair_clouds_4к.png'),
                    side: THREE.DoubleSide,
                    transparent: true
                })
            );

            mesh.renderOrder = 2;
            return {
                mesh: mesh,
                move: function(delta) {
                    mesh.rotateY( 1/32 * delta );
                }
            };
        }

        function drawPoint(pos){
            var mesh = new THREE.Mesh(
                new THREE.SphereGeometry(10, 50, 50),
                new THREE.MeshPhongMaterial({
                    color: 0xff0000
                }));

            mesh.position.set(pos.x, pos.y, pos.z);
            root.add(mesh);
        }

        function createOverlay(segments) {
            var material = new THREE.MeshPhongMaterial({
                transparent: true,
                opacity: 0,
                color: '#fff'
            });
            var sphere = new THREE.SphereGeometry(202, segments, segments);
            var _overlay = new THREE.Mesh(sphere, material);
            _overlay.rotation.y = Math.PI;

            _overlay.renderOrder = 1;

            return {
                mesh: _overlay
            };
        }

        var showedAxes = false;
        function showAxes() {
            if (showedAxes) {
                root.remove(axes);
            } else {
                root.add(axes);
            }
            showedAxes= !showedAxes;
        }

        function zoom(R) {
            var v1 = new THREE.Vector3( 0, 0, 1 );
            var pos = _.clone(camera.position);
            v1.applyQuaternion( camera.quaternion );
            pos.add( v1.multiplyScalar( R ) );

            var tweenPos = utils.getTween.call(camera, 'position', pos);
            d3.timer(tweenPos);
        }

        function zoomIn() {
            zoom(-settings.zoomStep);
        }

        function zoomIn() {
            zoom(settings.zoomStep);
        }

        function zoomOut() {
            zoom(settings.zoomStep);
        }

        function normalize() {
            var copy = _.clone(camera);

            new TWEEN.Tween( camera.up ).to( controls.up0, 600 )
                .easing( TWEEN.Easing.Sinusoidal.InOut).start();
        }

        function init(container, width, height) {
            var overlay;

            function onLoadWorld(err, data) {
                if (err) return;

                var segments = 155;

                var countriesCodes = {};
                _.each(data.objects.countries.geometries, function(country) {
                    countriesCodes[country.id] = country.code;
                });

                var countries = topojson.feature(data, data.objects.countries);
                geo = geoHelper.geodecoder(countries.features);

               var sceneObj = sceneHelper.init(container, width, height);
                scene = sceneObj.scene;
                renderer = sceneObj.renderer;
                canvas = sceneObj.canvas[0][0];
                camera = sceneObj.camera;

                geoHelper.setSize(width, height);

                eventHelper.setSize(width, height);

                controls = initControls();

                var stars = createStars(segments);

                var earth = createEarth(countries, segments),
                    baseGlobe = earth.globe,
                    baseMap = earth.map;

                overlay = createOverlay(segments).mesh;

                var clouds = createClouds(segments);

                root = new THREE.Object3D();
                root.scale.set(2.5, 2.5, 2.5);

                root.add(baseGlobe);
                root.add(baseMap);

                root.add(overlay);

                root.add(clouds.mesh);

                root.add(stars.mesh);

                scene.add(root);

                function buildAxes( length ) {
                    var axes = new THREE.Object3D();

                    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
                    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
                    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
                    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
                    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
                    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

                    var mz = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000 ), new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.5,
                        color: 0xFF0000}) );
                    var mx = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000 ), new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.5,
                        color: 0x00FF00}) );
                    var my = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000 ), new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.5,
                        color: 0x0000FF}) );

                    mz.rotation.set(-Math.PI/2, Math.PI/2, Math.PI);
                    my.rotation.set(-Math.PI/2, 0, 0);

                    axes.add(mz);
                    axes.add(mx);
                    axes.add(my);

                    return axes;

                }

                function buildAxis( src, dst, colorHex, dashed ) {
                    var geom = new THREE.Geometry(),
                        mat;

                    if(dashed) {
                        mat = new THREE.LineDashedMaterial({ linewidth: 8, color: colorHex, dashSize: 3, gapSize: 3 });
                    } else {
                        mat = new THREE.LineBasicMaterial({ linewidth: 8, color: colorHex });
                    }

                    geom.vertices.push( src.clone() );
                    geom.vertices.push( dst.clone() );
                    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

                    var axis = new THREE.Line( geom, mat, THREE.LinePieces );

                    return axis;

                }

                //axes = buildAxes(2000);

                //root.add(axes);

                var events  = globeEvents(countries, overlay, textureCache, geo, root, countriesCodes, camera);

                canvas.addEventListener('mousedown', events.onMouseDown, false);

                canvas.addEventListener('mousemove', events.onMouseMove, false);

                canvas.addEventListener('dragover', events.onDragOver, false);

                canvas.addEventListener('dragenter', events.onDragEnter, false);

                canvas.addEventListener('dragleave', events.onDragLeave, false);

                canvas.addEventListener('drop', events.onDrop, false);

                baseGlobe.addEventListener('click', events.onGlobeClick);

                baseGlobe.addEventListener('dragover', events.onGlobeMouseMove);

                setEvents(camera, [baseGlobe], 'click');
                setEvents(camera, [baseGlobe], 'mousemove', 10);
                setEvents(camera, [baseGlobe], 'dragover', 10);

                var lastTimeMsec = null;
                requestAnimationFrame(function animate(nowMsec) {
                    requestAnimationFrame(animate);

                    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
                    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
                    lastTimeMsec = nowMsec;

                    clouds.move(deltaMsec / 1000);
                    //stars.move(deltaMsec / 1000);

                    TWEEN.update();

                    controls.update();
                    renderer.render(scene, camera);
                });
            }

            d3.json('/games/globe/data/globe/data/world.json', onLoadWorld);
        }

        return {
            init: init,
            zoomIn: zoomIn,
            zoomOut: zoomOut,
            normalize: normalize,
            showAxes: showAxes
        };
    }
})(angular);