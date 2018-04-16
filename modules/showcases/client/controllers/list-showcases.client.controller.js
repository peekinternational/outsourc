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
      $scope.showCaseType=label; 
      $scope.paginationDate=new Date();
      $scope.getAllShowCases();
    };
    $scope.paginationDate=new Date();
    $scope.showCaseType=0;
    $scope.showCaseExist=true;
    $scope.getAllShowCases = function(){ 
      $scope.isLoading = true;   
     
      $http.post('/api/showcasesType', {'type':$scope.showCaseType,'paginationDate':$scope.paginationDate,'limit':50})
      .success(function (data) { 
        if(data.length<=0){
          $scope.showCaseExist=false;
        } 
        else{
          $scope.showCaseExist=true; 
          if(data.length>0){
            $scope.paginationDate=data[data.length-1].created;  
          }
          var i=0;
          var j=0;
          for (i; i<data.length; i++){
              j=0;
              var checkShowLen=0;
              for (j; j<$scope.showcases.length; j++){
                if(data[i]._id==$scope.showcases[j]._id){
                  checkShowLen=1;
                } 
              }
              if(checkShowLen==0){
                $scope.showcases.push(data[i]);
              } 
          }
           
          $scope.isLoading = false;   
        } 
      }).error(function (response) {
         $scope.isLoading = false;
      });
      
    };
    $scope.getScrollXY=function() {
      var scrOfX = 0, scrOfY = 0;
      if( typeof( window.pageYOffset ) == 'number' ) {
          //Netscape compliant
          scrOfY = window.pageYOffset;
          scrOfX = window.pageXOffset;
      } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
          //DOM compliant
          scrOfY = document.body.scrollTop;
          scrOfX = document.body.scrollLeft;
      } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
          //IE6 standards compliant mode
          scrOfY = document.documentElement.scrollTop;
          scrOfX = document.documentElement.scrollLeft;
      }
      return [ scrOfX, scrOfY ];
    }
 
  $scope.getDocHeight=function() {
      var D = document;
      return Math.max(
          D.body.scrollHeight, D.documentElement.scrollHeight,
          D.body.offsetHeight, D.documentElement.offsetHeight,
          D.body.clientHeight, D.documentElement.clientHeight
      );
  }

 
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
          $scope.index = obj.index;
          $scope.slide = obj.showcases.filter(function(item) {
            return item._id === $scope.index;
          })[0]; 
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
            }
            else{
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
              projectTitle: "쇼케이스 상품등록 아이디 "+slide.user.username,
              projectDesc: "안녕하세요, 쇼케이스에 등록된 상품에 대해서 상담을 원합니다. ",
              selectedCurrency: slide.budget.cur,
              fixedPrice: slide.budget.amount
            };
            $http.get('/api/profiles/'+slide.user.profile_id).then(function(res){
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
    
    $scope.getAllShowCases();
  
  }
}());
