'use strict';

// Create the 'chat' controller
angular.module('chat').controller('WatchAppController', ['$scope', 
  function ($scope) {

    $scope.roomName = '';
    $scope.joinedRoom = false;
    $scope.message = 'watching the room';
    $scope.userEmail = 'watcher@gmail.com';
    $scope.joinRoom = function () {
      $scope.$broadcast('joinRoom');
    };
    $scope.leaveRoom = function () {
      $scope.$broadcast('leaveRoom');
    };
    
    // print broadcasted messages?
    $scope.sendMessage = function sendMessage() {
      $scope.$broadcast('messageAll', $scope.message);
    };
    $scope.$on('channelMessage', function (event, peer, message) {
      console.log('message', message);
    });

    // video lits
    $scope.videoList = []; // initialize videoList variable to hold all videos coming to watch-room directive
    $scope.joinRoom = function () {
      $scope.$broadcast('joinRoom');
    };
    $scope.leaveRoom = function () {
      $scope.$broadcast('leaveRoom');
    };        


  }
]);