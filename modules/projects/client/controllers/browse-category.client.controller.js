'use strict';

angular.module('projects').controller('BrowseCatCtrl', ['$scope', '$rootScope', '$filter' ,'$state', '$location','$http', '$timeout', '$window', 'Authentication', 'Projects', 'Categories', 'SubCategories', 'Skills', 'UniversalData',
  function ($scope, $rootScope, $filter, $state, $location, $http, $timeout, $window, Authentication, Projects, Categories, SubCategories, Skills, UniversalData) {
    $scope.authentication = Authentication;

    // Get all categories
    var getAllCat = function(){
      $rootScope.allSkills = [];
      $scope.isLoading = true;

      $scope.search = {};

      Categories.find({}, function(res, err){
        $rootScope.categories = res;
      });

      Projects.query().$promise.then(function(res, err){
        $rootScope.Pros = res;
        var projects = res;

        UniversalData.query().$promise.then(function(res, err){
          var work = res[0].typeOfWork;
          for(var i=0; i<work.length; i++){
            var skills = work[i].Skills;
            for(var j=0; j<skills.length; j++){
              work[i].Skills[j].count = 0; 
            }
          }

          $rootScope.subCategories = work;
          $scope.isLoading = false;
        });

      });
    };

    // If Cat detail page has catId
    if($state.params.categoryId && $rootScope.subCategories ){
      $scope.isLoading = true;
      var projSkills = [];

      


      // Count the skills with respect to projects
      $rootScope.Pros.forEach(function(proj, key){
        projSkills = projSkills.concat(proj.skills); 
      });

      // For main category
      for(var i=0; i<$rootScope.subCategories.length; i++){
        for(var j=0; j<$rootScope.subCategories[i].Skills.length; j++){
          // For project skills
          for(var k=0; k<projSkills.length; k++){
            if($rootScope.subCategories[i].Skills[j].name === projSkills[k].name){
              $rootScope.subCategories[i].Skills[j].count = $rootScope.subCategories[i].Skills[j].count+1;
            }
          }
        }
      }

      $scope.isLoading = false;
    }

    // Get Cat once
    if(!$rootScope.categories && !$rootScope.subCategories && !$rootScope.Pros)
      getAllCat();

  }
]);
