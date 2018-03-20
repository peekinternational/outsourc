'use strict';

angular.module('profiles').controller('ProfilePictureController', ['$scope', '$timeout', '$window', '$http', 'Authentication', 'FileUploader','UniversalData',
  function ($scope, $timeout, $window, $http, Authentication, FileUploader, UniversalData) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;
    $scope.lastImageURL = $scope.user.profileImageURL;
    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
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

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;
      $scope.imageURL = Authentication.user.profileImageURL;
      //console.log($scope.imageURL);

      // Clear upload buttons
      $scope.cancelUpload();

      if(!$scope.lastImageURL.includes('default')){

        $http({
          url: '/api/users/upload/delete',
          method: 'PUT',
          data: { 'imageURL' : $scope.lastImageURL }
        })
        .then(function(response) {
          // success
          $scope.lastImageURL = $scope.user.profileImageURL;
        }, 
        function(response) { // optional
          // failed
          //console.log(response);

        });
      }
      else{
        $scope.lastImageURL = $scope.user.profileImageURL;
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
      $scope.imageURL = $scope.user.profileImageURL;
    };

  }
]);
