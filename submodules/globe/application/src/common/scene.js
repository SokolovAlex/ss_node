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
