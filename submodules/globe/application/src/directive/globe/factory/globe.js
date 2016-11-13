(function(angular) {
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