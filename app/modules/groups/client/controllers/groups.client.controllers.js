angular.module('groups')
    .controller('groupsController',
        function($scope, GROUP_SERVICE) {
            GROUP_SERVICE.getGroups().then(function(response) {
                $scope.groups = response;
            });

            $scope.joinToGroup = function(id) {
                GROUP_SERVICE.joinToGroup(id).then();
            }

        });
