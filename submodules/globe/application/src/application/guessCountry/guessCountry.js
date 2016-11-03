(function (angular) {
    'use strict';

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

        $http.get('data/gameTask/data/questions.mock.json')
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