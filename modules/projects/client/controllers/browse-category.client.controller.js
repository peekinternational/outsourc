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
      $http.get('/api/activeProjects/'+$state.params.categoryId)
      .then(function(res){ 
        $rootScope.Pros = res.data.projects; 
        var catName=false;
        if($rootScope.Pros.length>0){
            catName=$rootScope.Pros[0].workRequire.name;
        }
         
        UniversalData.query().$promise.then(function(res, err){ 
          var work = res[0].typeOfWork;
          var i=0;
          var j=0;
          var skills='';
          for(i; i<work.length; i++){ 
            skills = work[i].Skills;
            for(j=0; j<skills.length; j++){
              work[i].Skills[j].count = 0; 
            }
          }
          
          $rootScope.subCategories = work;
           
          //console.log(' $rootScope.subCategories ',$rootScope.subCategories);
          $scope.isLoading = false;
          //console.log('$state.params.categoryId in ',$state.params.categoryId,' hmm ',$rootScope.subCategories);

          // Count the skills with respect to projects
          $rootScope.Pros.forEach(function(proj, key){
            projSkills = projSkills.concat(proj.skills); 
          });

          // For main category
          var i=0;
          var j=0;
          var k=0;
          for(i; i<$rootScope.subCategories.length; i++){
            for(j=0; j<$rootScope.subCategories[i].Skills.length; j++){
              // For project skills
              for(k=0; k<projSkills.length; k++){
                if($rootScope.subCategories[i].Skills[j].name === projSkills[k].name){
                  $rootScope.subCategories[i].Skills[j].count = $rootScope.subCategories[i].Skills[j].count+1;
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
