'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$uibModal', '$timeout', '$http', '$location', 'Users', 'UniversalData', 'geolocation', 'Authentication', 'Notification',
  function ($scope, $uibModal, $timeout,  $http, $location, Users, UniversalData, geolocation, Authentication, Notification) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
       $timeout(function(){
        $scope.success = $scope.error = null;

        if (!isValid) {
           //console.log('update error fn is called');
          $scope.$broadcast('show-errors-check-validity', 'userForm');

          return false;
        }

        //user service provider $resource located client/services/user-client.service.js
        
        var user = new Users($scope.user); //create new object of the service User
        
        user.$update(function (response) {
          
          $scope.$broadcast('show-errors-reset', 'userForm');
          Notification.success({ 
            message: '<i class="glyphicon glyphicon-ok"></i> 프로필 수정 완료!',
            positionY: 'bottom', 
            positionX: 'right'
          });

          $scope.success = true;
          Authentication.user = response;
          $scope.user = response;
        }, function (response) {
          
          $scope.error = response.data.message;
          Notification.error({ 
            message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> 프로필 수정 실패!',
            positionY: 'bottom', 
            positionX: 'right'
          });
        });
       }, 0);
    };
    
    //edit profile work here
    $scope.detectMyLocation = function () {

      geolocation.getLocation().then(function(data){
        $scope.coords = { lat:data.coords.latitude, long:data.coords.longitude };
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.coords.lat + ',' + $scope.coords.long + '&sensor=true';
        $http.get(url)
        .then(function(result) {

          if(result.data.results[0]){
            var address = result.data.results[0].formatted_address;
            $scope.user.location = address;
            $scope.user.address = address;

            var add = result.data.results[0].address_components;
            for(var i =0; i<add.length; i++){
              if(add[i].types[0] === 'locality'){
                $scope.user.city = add[i].long_name;
              }

			       //if(add[i].types[0] === 'postal_code'){
                //$scope.user.zipcode = add[i].long_name;
              //}

              if(add[i].types[0] === 'country'){
				      $scope.user.stateprovince = add[i].long_name;
                $scope.user.country = {
                  'name': add[i].long_name,
                  'code': add[i].short_name,
                  'code_lower': add[i].short_name.toLowerCase()
                };
              }
            }
          }else{
            Notification.error({
              message: 'Could not detect your location, please try again.', 
              positionY: 'bottom', 
              positionX: 'right', 
              closeOnClick: true, 
              title: '<i class="glyphicon glyphicon-remove"></i> location error'
            });
          }
            
        });
      });
    };

    // Update email
    $scope.updateEmail = function(){
      // $scope.credentials.username = Authentication.user.username;
      // $scope.credentials.password = $scope.passwordDetails.currentPassword;

      // console.log('credentials:', $scope.credentials);
      // $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
      //   console.log('Sign in Called:',response);
      // }).error(function (response) {
      //   $scope.error = response.message;
      // });

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');
        $scope.success = true;
        Authentication.user = response;
        $scope.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };

    $scope.updateEmailAddress = function(size){
      //console.log('updateEmailAddress fn is called');
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/users/client/views/models/updateEmailAddressModel.client.view.html',
        controller: function($scope, $uibModalInstance, $location){
          $scope.user = Authentication.user;

          // $scope.profile = profile;
          // $scope.companyInformation = $scope.profile.companyInformation;

          $scope.ok=function(){
            //my code
            //console.log('ok fn of security change phone is called');
            $scope.success = true;
          }; //ok end


          $scope.cancel=function(){
            $uibModalInstance.dismiss('cancel');
          };
        },
        size: size
      });
    };
    $scope.editSecurityNumber = function(size){
      //console.log('edit security no fn is called');
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/users/client/views/models/security-phone-change.client.view.html',
        controller: function($scope, $uibModalInstance, $location){
          $scope.user = Authentication.user;

          // $scope.profile = profile;
          // $scope.companyInformation = $scope.profile.companyInformation;

          $scope.ok=function(){
            //my code
            //console.log('ok fn of security change phone is called');
            $scope.success = true;
          }; //ok end


          $scope.cancel=function(){
            $uibModalInstance.dismiss('cancel');
          };
        },
        size: size
      });
    };


//edit profile model work
    $scope.divOne = true;
    $scope.divTwo = false;
    $scope.showSecondDivOnModel = function(){
      //console.log('showSecondDivOnModel fn is called');
      $scope.divOne = false;
      $scope.divTwo = true;

    };

    // var options = {
    //   url: 'https://services.groupkt.com/country/',
    //   method: 'GET',
    //   cache: true,
    //   transformResponse: function (data) {
    //     if(data){
    //         var result = angular.fromJson(data).RestResponse.result;
    //         if (!angular.isArray(result)) result = [result];
    //         return result.map(function (country) {
    //           return {
    //             name: country.name,
    //             code: country.alpha2_code
    //           };
    //         });
    //       }
    //     }
    // };

    // $scope.getCountryName = function () {

    //   //console.log('$scope.countryDat', $scope.countryData);

    //   $timeout(function() {
    //     angular.forEach($scope.countryData, function(value, key) {
    //       if(value.code === $scope.profile.userInfo.country.code)
    //       {
    //         $scope.countryName = value.name;
    //       }
    //     });
    //   },200);

    // };


    $scope.universalData = function(){
      //console.log('hello unvier');   


      $scope.universal = UniversalData.query().$promise.then(function(data) {
        $scope.records = data[0];
        $scope.countryData = $scope.records.countryData;
        $scope.timez = {};
        $scope.timez = $scope.records.timezones;

        //console.log('hello zon', $scope.timez);

        return $scope.records;
      }, function(error) {
        // error handler
      });
    };

    //Setting/Account page work
    $scope.myfm = function(){
       //console.log('kuch b');
       $timeout(function(){
        //console.log($scope.user.notEmailFormate);
       }, 0);
    };

    $scope.visibleshowHideCloseButton = false;
    $scope.showHideCloseButton = function () {
        //If DIV is visible it will be hidden and vice versa.
        $scope.visibleshowHideCloseButton = $scope.visibleshowHideCloseButton ? false : true;
    };
   

  }
]);
