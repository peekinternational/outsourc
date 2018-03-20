'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication', '$state',
  function ($scope, Authentication, $state) {
    $scope.user = Authentication.user; 
    $scope.$state = $state;    
  }
]);
