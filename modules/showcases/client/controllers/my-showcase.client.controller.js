(function () {
  'use strict';

  angular
    .module('showcases')
    .controller('MyShowcaseController', MyShowcaseController);

  MyShowcaseController.$inject = ['$scope', 'Authentication', 'ShowcasesService', '$http', '$uibModal', 'SweetAlert', 'Notification'];

  function MyShowcaseController($scope, Authentication, ShowcasesService, $http, $uibModal, SweetAlert, Notification) {
    $scope.authentication = Authentication;
    $scope.showcases = [];

    $scope.dynamicPopover = {
        deleteProjectPopoverUrl: 'deleteProjectPopover.html'
    };

    var getAllShowCases = function(){
      $scope.isLoading = true;
      $scope.activeShowcases = [];
      $scope.pendingShowcases = [];
      $scope.rejectedShowcases = [];

    	$http.get('/api/myshowcases').then(function (res) {
        var showcases = res.data;
        $scope.showcases = res.data;
        

        for(var i =0; i< showcases.length; i++){
          if(showcases[i].status === 'active'){
            $scope.activeShowcases.push(showcases[i]);
          }else if(showcases[i].status === 'pending'){
            $scope.pendingShowcases.push(showcases[i]);
          }else if(showcases[i].status === 'rejected'){
            $scope.rejectedShowcases.push(showcases[i]);
          }
        }


        $scope.isLoading = false;
      }, function(err){
        $scope.isLoading = false;
      });
      
    };

    // Delete any showcase
    $scope.removeShowcase = function(id){
      SweetAlert.swal({
        title: '상품을 삭제 하시겠습니까?',
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "삭제",
        closeOnConfirm: true,
        closeOnCancel: true
      },function(isConfirm){
        if(isConfirm){
          $http.delete('/api/showcases/'+id).then(function(res){
            
            Notification.success({
              message: '성공적으로 삭제했습니다', 
              positionY: 'bottom', 
              positionX: 'right', 
              closeOnClick: true, 
              title: '<i class="glyphicon glyphicon-remove"></i> Deleted'
            });

            getAllShowCases();

          });
        }
      });
    };
    
    getAllShowCases();
  
  }
}());
