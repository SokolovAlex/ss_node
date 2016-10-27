(function(angular) {
    'use strict';

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