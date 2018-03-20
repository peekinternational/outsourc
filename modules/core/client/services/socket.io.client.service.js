'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout', '$rootScope', '$location',
  function (Authentication, $state, $timeout, $rootScope, $location) {

    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

// Admin Socket
angular.module('core').service('AdminSocket', ['Authentication', '$state', '$timeout', '$rootScope', '$location',
  function (Authentication, $state, $timeout, $rootScope, $location) {

    // admin/messenger server address 
    if($location.host() === 'localhost'){
      $rootScope.adminServerAddress = 'https://localhost:3030';
    }
    else{
      $rootScope.adminServerAddress = 'https://adm.outsourcingok.com';
      // $rootScope.adminServerAddress = 'https://admin.outsourcingok.com';
    }

    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
        // this.socket = io($rootScope.adminServerAddress);
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          // console.log("data:", data);
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);


// Admin Socket Messenger
angular.module('core').service('MessengerSocket', ['Authentication', '$state', '$timeout', '$rootScope', '$location',
  function (Authentication, $state, $timeout, $rootScope, $location) {

    // admin/messenger server address 
    if($location.host() === 'localhost'){
      $rootScope.adminServerAddress = 'https://localhost:3030';
    }
    else{
      $rootScope.adminServerAddress = 'https://adm.outsourcingok.com';
      // $rootScope.adminServerAddress = 'https://admin.outsourcingok.com';
    }

    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
        // this.socket = io($rootScope.messengerServerAddress);
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          // console.log("data:", data);
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);
