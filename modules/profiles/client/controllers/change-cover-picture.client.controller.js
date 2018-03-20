'use strict';

angular.module('profiles').controller('CoverPictureController', ['$scope', '$timeout', '$window', '$http', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, $http, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.coverImageURL = $scope.user.coverImageURL;
    $scope.lastCoverURL = $scope.user.coverImageURL;
    $scope.uploadButton = false;
    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/coverPicture',
      alias: 'newCoverPicture'
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
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);
        //console.log(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          var image = new Image();
          image.src = fileReaderEvent.target.result;

          $timeout(function () {
            ////console.log(fileReaderEvent.target.result);
            
            //console.log(image.src);
            //console.log(image.width);
            //console.log(image.height);
            var width = parseInt(image.width);
            $scope.uploadButton = true;
            if(width<200) {
              $scope.cancelUpload();
              $scope.uploader.clearQueue();
              alert('이미지 사이즈가 너무 작습니다.');
            }
            else{
              $scope.coverImageURL = fileReaderEvent.target.result;
            }
            
          }, 1000);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();

      if(!$scope.lastCoverURL.includes('default')) {

        $http({
          url: '/api/users/upload/delete',
          method: 'PUT',
          data: { 'imageURL' : $scope.lastCoverURL }
        })
          .then(function(response) {
            $scope.lastCoverURL = $scope.user.coverImageURL;
          }, 
          function(response) { // optional
            //console.log(response);
          });
      }
      else {
        $scope.lastCoverURL = $scope.user.coverImageURL;
      }
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.coverImageURL = $scope.user.coverImageURL;
    };
  }
]);
