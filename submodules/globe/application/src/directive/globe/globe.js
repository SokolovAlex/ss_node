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
        };

        globeCtrl.zoomIn = globe.zoomIn;

        globeCtrl.zoomOut = globe.zoomOut;

        globeCtrl.normalize = globe.normalize;

        globeCtrl.showAxes = globe.showAxes;
    }

    angular
        .module('directive.globe.draggableFlag', [])
        .directive('draggableFlag', draggableFlag);

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