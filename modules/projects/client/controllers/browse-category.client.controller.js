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

      //Projects.query().$promise.then(function(res, err){ 
    };

    
    // If Cat detail page has catId 
    if($state.params.categoryId){
       $scope.isLoading = true;
      var projSkills = [];
      $rootScope.subCatSkills=[];
      $http.get('/api/activeProjects/'+$state.params.categoryId)
      .then(function(res){ 
        $rootScope.Pros = res.data.projects;  
        $http.get('/api/subCatSkills/'+$state.params.categoryId)
        .then(function(res){ 
          $rootScope.subCatSkills=res.data.data;
           // Count the skills with respect to projects
          $rootScope.Pros.forEach(function(proj, key){
            projSkills = projSkills.concat(proj.skills); 
          });
          var i=0;
          var j=0;
          var k=0;
          for(i; i<$rootScope.subCatSkills.length; i++){
            for(j=0; j<$rootScope.subCatSkills[i].skills.length; j++){
              // For project skills
              for(k=0; k<projSkills.length; k++){
                if($rootScope.subCatSkills[i].skills[j].name === projSkills[k].name){
                  if(!$rootScope.subCatSkills[i].skills[j].count){
                    $rootScope.subCatSkills[i].skills[j].count=1;
                  }
                  else{
                    $rootScope.subCatSkills[i].skills[j].count=$rootScope.subCatSkills[i].skills[j].count+1
                  } 
                } 
              }
            }
          }
          
          $scope.isLoading = false; 
        });
        
      });
 
    }

    // Get Cat once
    if(!$rootScope.categories && !$rootScope.subCategories && !$rootScope.Pros)
      getAllCat();

  }
]);
