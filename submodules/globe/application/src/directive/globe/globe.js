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
            height = window.innerHeight - 90;
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