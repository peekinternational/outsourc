'use strict';

// Create the 'chat' controller
angular.module('chat').controller('BroadcastAppController', ['$scope',
  function ($scope) {
    console.log('BroadcastAppController');

    $scope.hasStream = false;
    $scope.roomName = '';
    $scope.isBroadcasting = '';
    $scope.prepare = function prepare() {
      $scope.$broadcast('prepare');
    };
    $scope.start = function start() {
      $scope.$broadcast('start');
    };

    
  }
]);