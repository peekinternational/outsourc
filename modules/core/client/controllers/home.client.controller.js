'use strict';
angular.module('core').controller('HomeController', ['$scope', '$http', '$rootScope', '$timeout', '$location', '$stateParams', 'Socket', 'Authentication', 'Account', 'Profiles', 'Projects', 'Contests', '$sce', 'usSpinnerService', 'Conversation', 'UserSchema', 'ChatMessages', 'Advertisement', 'FAQ', 'ngAudio',
  function ($scope, $http, $rootScope, $timeout, $location, $stateParams, Socket, Authentication, Account, Profiles, Projects, Contests, $sce, usSpinnerService, Conversation, UserSchema, ChatMessages, Advertisement, FAQ, ngAudio) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.isNavCollapsed = true;
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;


    if(Authentication.user && !Authentication.user.verEmail){
      $location.path('/verify');
    }

    // Lates Projects
    // $scope.allProjects = function(){
      $http.get('api/projects/5/1').then(function(res){
        $scope.allProjects = res.data.projects;
      });


	  $http.get('api/contests').then(function(res){
        $scope.allContests = res.data;
      });


   
    
    //chatwindow setting end
    $scope.range = function (n) {
      return new Array(n);
    };
    
    // Advertisement
    $scope.advertisement = function (){
      $scope.advert = Advertisement.find({});
    };

    // Change pages in Support
    $scope.changeSupportPage = function(){
      $location.path($scope.selectedItem);
    };
    // FAQs
    $scope.getSupport = function (){
      $scope.supMembership = [];
      $scope.supProject = [];
      $scope.supContest = [];
      $scope.supProfile = [];
      $scope.supGeneral = [];
      $scope.supPayment = [];

      FAQ.find({},function(succ){
        $scope.faq = succ;
        console.log('support:', succ);
        if($scope.faq.length>0){
          for(var i=0; i<$scope.faq.length; i++){
            switch($scope.faq[i].category){
              case 'Membership':
                $scope.supMembership.push($scope.faq[i]);
                break;
              case 'General':
                $scope.supGeneral.push($scope.faq[i]);
                break;
              case 'Payment':
                $scope.supPayment.push($scope.faq[i]);
                break;
              case 'Profile':
                $scope.supProfile.push($scope.faq[i]);
                break;
              case 'Project':
                $scope.supProject.push($scope.faq[i]);
                break;
              case 'Contest':
                $scope.supContest.push($scope.faq[i]);
                break;
            }
          }
        }
      });
    };

  }
]);
