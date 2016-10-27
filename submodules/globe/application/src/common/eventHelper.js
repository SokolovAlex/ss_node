(function(angular) {
    'use strict';

    angular
        .module('common.eventHelper', ['common.utils'])
        .factory('eventHelper', eventHelper);

    var raycaster = new THREE.Raycaster();

    function eventHelper(utils) {
        var width, height;
        var offsetY = 0, offsetX = 0;

        function setEvents(camera, items, type, wait) {
            var listener = function (event) {

                var mouse = {
                    x: ((event.clientX - offsetX - 1) / width) * 2 - 1,
                    y: -((event.clientY - offsetY - 1) / height) * 2 + 1
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
