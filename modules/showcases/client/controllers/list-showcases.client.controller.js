(function () {
  'use strict';

  angular
    .module('showcases')
    .controller('ShowcasesListController', ShowcasesListController);

  ShowcasesListController.$inject = ['$scope', 'Authentication', 'ShowcasesService', '$http', '$uibModal', '$rootScope'];

  function ShowcasesListController($scope, Authentication, ShowcasesService, $http, $uibModal, $rootScope) {
    $scope.authentication = Authentication;
    $scope.showcases = [];
    $scope.searchString = {};

    $scope.searchByType = function(label){
      $scope.searchString.showcaseType = label;  
    };

    var getAllShowCases = function(){
      $scope.isLoading = true;

      // ShowcasesService.query().$promise.then(function (data) {
    	ShowcasesService.query().$promise.then(function (data) {
        var showcases = data;
        $http.get('/api/users').then(function(res, err){
          var users = res.data;
          showcases.forEach(function(val1, key){
            users.forEach(function(val2, key2){
             if(angular.equals(val1.user._id, val2._id) && angular.equals(val1.status, 'active')){
                var user = {};
                user.username = val2.username;
                user.country = val2.country;
                user.profileId = val2.profile_id;
                user.img = val2.profileImageURL;
                val1.userInfo = user; 
                $scope.showcases.push(val1);
              }
            });
          });

          $scope.isLoading = false;
        });
      }, function(err){
        $scope.isLoading = false;
      });
      
    };

    //View ShowCase
    $scope.viewShowcase = function (index) {
      var obj = {};

      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/showcases/client/views/modals/showcase-modal.client.view.html',
        controller: function($scope, $uibModalInstance, $location,$window, obj, ShowcasesService, Notification){
          $scope.user = Authentication.user;
          $scope.slides = obj.showcases;
          $scope.index = obj.index;

          // likeShowcase 
          $scope.likeShowcase = function(selectedSc){
            var copy = selectedSc;
            var i = 0;
            var index = 0;
            var liked = false;
            
            do {
              if(selectedSc.likes[i] === Authentication.user._id){
                liked = true;
                index = i;
              }
              i++;
            }
            while(i<selectedSc.likes.length);
            
            if(liked === false){
              selectedSc.likes.push(Authentication.user._id);
            }else{
              selectedSc.likes.splice(index, 1);
            }

            // var updatedShowcase = new ShowcasesService(selectedSc);
            // updatedShowcase.$update(function(res){
            $http.put('/api/showcases/'+selectedSc._id, selectedSc).then(function(res){
              selectedSc = res;
            });

        };

        // Hire freelancer
        $scope.hireFreelancer = function(slide){
          $uibModalInstance.dismiss();

          var detail = {
            projectMsg: "안녕하세요, 쇼케이스에 등록된 상품에 대해서 상담을 원합니다. ",
            projectTitle: "쇼케이스 상품등록 아이디 "+slide.userInfo.username,
            projectDesc: "안녕하세요, 쇼케이스에 등록된 상품에 대해서 상담을 원합니다. ",
            selectedCurrency: slide.budget.cur,
            fixedPrice: slide.budget.amount
          };
          $http.get('/api/profiles/'+slide.userInfo.profileId).then(function(res){
            var profile = res.data.profile;
            $rootScope.hireMe('md', profile, detail);
          });
        };

        // Close 
        $scope.closeShowcaseModel=function(){
          $uibModalInstance.dismiss();
        };
    },
      size: 'lg',
      resolve: {
        obj: function() {
          obj.showcases = $scope.showcases;
          obj.index = index;
          return obj;
        }
      }
    });
  };
  //View ShowCase end

  getAllShowCases();
  
  }
}());
