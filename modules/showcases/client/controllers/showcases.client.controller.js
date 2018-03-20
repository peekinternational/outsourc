(function () {
  'use strict';

  // Showcases controller
  angular
    .module('showcases')
    .controller('ShowcasesController', ShowcasesController);

  ShowcasesController.$inject = ['$scope', '$state', '$http', '$window', '$timeout', 'Authentication', 'ShowcasesService', 'FileUploader', 'Categories', 'SubCategories', 'Notification'];

  function ShowcasesController ($scope, $state, $http, $window, $timeout, Authentication, ShowcasesService, FileUploader, Categories, SubCategories, Notification) {
    $scope.authentication = Authentication;
    // $scope.showcase = showcase;
    $scope.showcase = {};
    $scope.file = {};
    $scope.error = null;
    $scope.imageURL = false;

    $scope.currency = [ {'name':'KRW'}, {'name':'USD'}];
    $scope.showcaseTypes = [ 
      {'name':'Logos'}, 
      {'name':'Websites'},
      {'name':'Mobile App'},
      {'name':'Graphic Design'},
      {'name':'Illustration'},
      {'name':'3D Models'}
    ];

    // File Uploader
    $scope.uploader = new FileUploader({
      url: '/api/showcase/file',
      alias: 'newShowcaseFile'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      $scope.item = fileItem;
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Change user profile picture
    $scope.uploadFile = function () {
      // Clear messages
      $scope.uploading = true;
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
      return true;
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = undefined;
      $scope.item = undefined;
      $scope.uploading = undefined;
    };

    // Get categories/sucat and skills
    var getCatSubcat = function(){
      Categories.find({}, function(res){
        $scope.categories = res;
      });

      SubCategories.find({}, function(res){
        $scope.subCategories = res;
      });
    };
    getCatSubcat();
    
    // On Change of Cateogries
    $scope.selectCat = function(){
      $scope.selectedSubCat = [];
      $timeout(function() {
        if(!$scope.showcase.cat){
          $scope.showcase.cat = '';
          return;
        }
        $scope.subCategories.forEach(function(value1, key1){
          $scope.showcase.cat.subCategories.forEach(function(value2, key2){
            if( angular.equals(value1.id, value2)){
              $scope.selectedSubCat.push(value1);
            }
          });
        });
      }, 100);

    };

    // Remove existing Showcase
    $scope.removeShowCase = function() {
      if ($window.confirm('쇼케이스 상품을 삭제 하시겠습니까?')) {
        $scope.showcase.$remove($state.go('showcases.list'));
      }
    };

    // Save Showcase
    $scope.createShowCase = function() {    
      if(!$scope.imageURL){
        alert('파일을 업로드 하십시오');
        return false;
      }

      $scope.isLoading = true;
      $scope.uploadFile();
      // Called after the user has successfully uploaded a new picture
      $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // Show success message
        $scope.success = true;

        $scope.file.name = fileItem.file.name;
        $scope.file.link = response;
        $scope.showcase.file = $scope.file;

        var sc = new ShowcasesService($scope.showcase);
        sc.$save(function(res, err){
          if(err){
            $scope.isLoading = false;
            $state.go('showcases.list');
            // Clear upload buttons
            $scope.cancelUpload();
          }else{
            $scope.showcase = {};
            $scope.cancelUpload();
            $scope.isLoading = false;
          }
        });
      };

      // Called after the user has failed to uploaded a new picture
      $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
        // Clear upload buttons
        $scope.cancelUpload();
        $scope.isLoading = false;

        // Show error message
        $scope.error = response.message;
        alert('파일업로드 실패');
      };
    };

    // find one
    $scope.findOne = function(){
      var id = $state.params.showcaseId;
      $http.get('/api/showcases/'+id).then(function(res){
        $scope.showcase = res.data;
      });
    };

    // Edit ShowCase
    $scope.editShowcase = function(fileItem, showcaseType, title, description, cur, amount) {
      var id = $state.params.showcaseId;

      var objEdit = {
        'showcaseType': $scope.showcase.showcaseType,
        'title': $scope.showcase.title,
        'showcaseId': $state.params.showcaseId,
        'description': $scope.showcase.description,
        'budget':{
          'cur': $scope.showcase.budget.cur,
          'amount': $scope.showcase.budget.amount
        }
      };

      $http({
        url: '/api/showcases/'+id,
        method: 'PUT',
        data: objEdit
      }).then(function (response) {
        $scope.Showcases = response.data;
        Notification.success({
          title: 'Showcase',
          message: '업데이트 성공',
          positionX: 'right',
          positionY: 'bottom'
        });

        $state.go('showcases.myshowcases');
      });
    };
    
  }
}());
