/**
 *
 * Created by Pavel Akulov on 11.01.2016.
 * Email: akulov@magora-systems.ru
 * Company: Magora Systems LLC
 * Website: http://magora-systems.com
 */

(function (angular) {
    'use strict';

    angular
        .module('application.guessCountry.game', [
            'directive.globe'
        ])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('application.guessCountry.game', {
                templateUrl: 'application/guessCountry/game/game.html'
            });
    }

})(angular);