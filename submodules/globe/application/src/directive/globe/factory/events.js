(function(angular) {
    'use strict';

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


                console.log('onDragOver', e);

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

                console.log('onDrop', e);

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

