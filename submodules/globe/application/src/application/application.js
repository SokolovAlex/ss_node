(function (angular) {
    'use strict';

    angular
        .module('application', [

            /* vendors */
            'angular-loading-bar',
            'pascalprecht.translate',
            'ui.router',
            'ui.bootstrap',
            'ngResource',
            'directive.brand',
            'application.guessCountry',
        ])
        .config(config)
        .run(run);

    function config(
        $stateProvider,
        $locationProvider
    ) {
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('application', {
                templateUrl: 'application/application.html'
            });
    }

    function run($rootScope, $state) {
        $state.go('application.guessCountry.game', {}, {location: 'replace'});
    }
})(angular);
