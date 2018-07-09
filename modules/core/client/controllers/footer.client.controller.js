'use strict';

angular.module('core').controller('FooterController', ['$translate', '$scope', '$http', '$rootScope', 'SweetAlert', '$state', 'Authentication', 'logOutService', 'Account', 'toastr', 'ProjectSchema', 'UserSchema', 'ContestSchema',
  function ($translate, $scope, $http, $rootScope, SweetAlert, $state, Authentication, logOutService , Account, toastr, ProjectSchema, UserSchema, ContestSchema) {

    // Find total users registred
    $scope.changeLanguage = function () {
      $translate.use($scope.lang);
      console.log($scope.lang);
    };
    UserSchema.find({}, function(suc){
      $rootScope.totalRegUsers = suc.length + 46000;
    }, function(err){
      $rootScope.totalRegUsers = '--';
    });

    ProjectSchema.count(function(proj){
      ContestSchema.count(function(cont){
        $rootScope.totalJobsPosted = proj.count + proj.count + 11150;
      }, function(err){
        $rootScope.totalJobsPosted = 11150;
      });
    }, function(err){
      $rootScope.totalJobsPosted = 11150;
    });

    // Find total jobs posted
    // ProjectSchema.find({}, function(suc){
    //   $rootScope.totalJobsPosted = suc.length + 11150;
    // }, function(err){
    //   $rootScope.totalJobsPosted = '--';
    // });

    // Submit Contact Form
    $scope.contactForm = function(){
      $scope.isLoading = true;
      var detail = {
        'email':Authentication.user.email,
        'subject':$scope.subject,
        'message':$scope.message
      };

      return $http({
        url:'api/users/contactUs',
        method: 'POST',
        data: detail
      }).then( function(suc){
        $scope.isLoading = false;
        $scope.msg = true;
        $scope.subject = '';
        $scope.message = '';

      }, function(fail){
        $scope.isLoading = false;
      });
    };


  }
]);
