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