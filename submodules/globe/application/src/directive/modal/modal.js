(function (angular) {
    'use strict';

    angular
        .module('globe.modal', [
            'ui.bootstrap.modal'
        ])
        .controller('globeModalCtrl', ['$scope', '$rootScope', '$uibModalInstance', function($scope, $rootScope, $uibModalInstance) {
            $rootScope.text = $uibModalInstance.text;
            $rootScope.error = $uibModalInstance.status !== 3;
            $rootScope.status_class =
                $uibModalInstance.status === 3 ? 'status-success' :
                ($uibModalInstance.status === 1 ? 'status-error' : 'status-partly');
            $rootScope.close = function () {
                $uibModalInstance.dismiss('cancel');
                if ($uibModalInstance.finish) {
                    $uibModalInstance.finish();
                }
            };
        }])
        .controller('finishModalCtrl', ['$scope', '$rootScope', '$uibModalInstance', function($scope, $rootScope, $uibModalInstance) {
            $rootScope.scores = $uibModalInstance.scores;
            $rootScope.restart = function () {
                location.reload();
            };
        }])
        .factory('modalservice', ['$modal', modal]);

    function modal($modal){
        var modalInstance;
        var finishModalInstance;

        var open = function (text, status, scores) {
            modalInstance = $modal.open({
                templateUrl: 'directive/modal/modal.html',
                controller: 'globeModalCtrl',
                controllerAs: '$ctrl'
            });
            modalInstance.status = status;
            modalInstance.text = text;
            if  (typeof(scores) !== 'undefined') {
                modalInstance.finish = function() {
                    finishModalInstance = $modal.open({
                        templateUrl: 'directive/modal/finish.html',
                        controller: 'finishModalCtrl',
                        controllerAs: '$ctrl'
                    });
                    finishModalInstance.scores = scores;
                };
            }
        };

        return {open: open};
    }
})(angular);

