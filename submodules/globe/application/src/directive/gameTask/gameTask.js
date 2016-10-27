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