'use strict';
angular.module('core').controller('NewChatController', ['$scope', '$rootScope', '$timeout', '$location', '$stateParams', 'Socket', 'Authentication', 'Account', 'Profiles', '$sce', 'usSpinnerService', 'Conversation', 'UserSchema', 'ChatMessages', 'Advertisement', 'FAQ', 'ngAudio',
  function ($scope, $rootScope, $timeout, $location, $stateParams, Socket, Authentication, Account, Profiles, $sce, usSpinnerService, Conversation, UserSchema, ChatMessages, Advertisement, FAQ, ngAudio) {

  	$scope.authentication = Authentication;
  }
]);
