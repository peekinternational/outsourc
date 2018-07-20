'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$rootScope', '$state', '$http', 'logOutService', '$location', '$window', '$timeout', 'Authentication', 'geolocation', 'UniversalData', 'PasswordValidator', 'Account', 'Notification',
  function ($scope, $rootScope, $state, $http, logOutService, $location, $window, $timeout, Authentication, geolocation, UniversalData, PasswordValidator, Account, Notification) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();
    $scope.credentials = {};
    $scope.credentials.company = {};
    $scope.credentials.individual = {};
    $scope.credentials.company.country = {};
    $scope.credentials.individual.country = {};


    $scope.getCountry = function() {

      $http.get('https://ipinfo.io/json').
      success(function(data){
        $scope.location = data;
        $timeout(function(){
          angular.forEach($scope.countryData, function(value, key) {
            if(value.code === $scope.location.country){
              $scope.credentials.company.country.name = value.name;
              $scope.credentials.individual.country.name = value.name;



              geolocation.getLocation().then(function(data){
                $scope.coords = { lat:data.coords.latitude, long:data.coords.longitude };
                // //console.log($scope.coords);
                var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.coords.lat + ',' + $scope.coords.long + '&sensor=true';
                $http.get(url)
                .then(function(result) { 
                  if(result.data.results.length>0 && result.data.results[0].address_components.length>0){
                    $scope.countryName  = result.data.results[0].address_components[4].long_name;
                    $scope.countryCod  = result.data.results[0].address_components[4].short_name;
                    $scope.city  = result.data.results[0].address_components[1].long_name;
                    $scope.credentials.individual.country.city = result.data.results[0].address_components[1].long_name;
                  }
                   
                });
              });
              return;
            }
          });
        },800);
      });
    };

     

    var options = {
      url: 'https://services.groupkt.com/country/',
      method: 'GET',
      cache: true,
      transformResponse: function (data) {
        if(data){
          var result = angular.fromJson(data).RestResponse.result;
          if (!angular.isArray(result)) result = [result];
          return result.map(function (country) {
            return {
              name: country.name,
              code: country.alpha2_code
            };
          });
        }
      }
    };
    
    
    $rootScope.latestCurrencyRate = { 'USD': 1, 'KRW': 1000 };
    
    $scope.remote = angular.copy(options);
    $scope.remote.url += 'search';
    $scope.remoteParam = 'text';
    
    $scope.remoteValidation = function (value) {
      var settings = angular.copy(options);
      settings.url += 'get/iso2code/' + value;
      return settings;
    };
    // Custom code
    
    $scope.agreement = {
      'isSelected': false
    };
    $scope.indvisualAgreement = {
      'isSelected': false
    };
    $scope.roleCheck = '';
    //$scope.interestCheck = '';
   
    $scope.users = [
      { title:'사업자 전용', value:'company' },
      { title:'개인 전용', value:'individual' }
    ];

    $scope.alertMe = function() {
      setTimeout(function() {
        $window.alert('You have selected the alert tab!');
      });
    };

    $scope.model = {
      name: 'Tabs'
    };
    $scope.tab = {};
    $scope.tab.value = 'company';
    $scope.checkUser = function() {

      $timeout(function() {
      
        if($scope.tab.value === 'company') {
        
          $scope.tab.value = 'individual';
          //console.log($scope.tab.value);

        }
        else {       
          $scope.tab.value = 'company';
          //console.log($scope.tab.value);
        }

      },300);
        
    };

    $scope.callSearch = function(num) {
      $scope.countrycode = num;
      
    };

    // ends custom code

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.status = 'online';
    $scope.signup = function (isValid, userType) {
      $http.get('https://www.jobcallme.com/check').success(function(res){
        console.log(res);
      })
      return false;
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      
      if(userType==='individual') {
        $scope.identify = 'individual';

        if(!$scope.credentials.individual.hasOwnProperty('userRole')) {
          $scope.error = 'Please select one of the role';
          return false;
        }
  
        $scope.credentials = {
          'firstName' : $scope.credentials.individual.firstName,
          'lastName' : $scope.credentials.individual.lastName,
          'email' : $scope.credentials.individual.email,
          'username' : $scope.credentials.individual.username,
          'country' : {
            'name' : $scope.countryName,
            'code' : $scope.countryCod,
            'city' : $scope.city
          },
          'userType' : userType,
          'mobileNumber' : $scope.credentials.individual.mobileNumber,
          'userRole' : $scope.credentials.individual.userRole,
          'subscribe' : $scope.credentials.individual.subscribe,
          'password' : $scope.credentials.individual.password,
          'status' : $scope.status
        };
        

      }
      if(userType==='company') {
        $scope.identify = 'company';

        if(!$scope.credentials.company.hasOwnProperty('userRole')) {
          $scope.error = 'Please select one of the role';
          return false;
        }

        $scope.credentials = {
          'companyName' : $scope.credentials.company.companyName,
          'companyRegNum' : $scope.credentials.company.companyRegNum,
          'email' : $scope.credentials.company.email,
          'username' : $scope.credentials.company.username,
          'country' : {
            'name' : $scope.countryName,
            'code' : $scope.countryCod,
            'city' : $scope.city
          },
          'userType' : userType,
          'companyTel' : $scope.credentials.company.companyTel,
          'companyExt' : $scope.credentials.company.companyExt,
          'personInChargeNum' : $scope.credentials.company.personInChargeNum,
          'userRole' : $scope.credentials.company.userRole,
          // 'interest' : $scope.credentials.company.interest,
          'subscribe' : $scope.credentials.company.subscribe,
          'password' : $scope.credentials.company.password,
          'status' : $scope.status
        };
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;


        // create an account with amount 0.0 and USD
        Account.create({
          ownerId : $scope.authentication.user.username,
          creationDate: $scope.authentication.user.created,
          accountBalance : {
            KRW : 0,
            USD : 0
          }
          }, function(suc){
            $rootScope.userAccountBalance = Account.findOne({ 
              filter: {
                where: {
                  ownerId: $scope.authentication.user.username
                }
              }
            }, function(res){
              $location.path('/verify');
              // $state.go('profile.view');
            });

          }, function(err){

          });
        // And redirect to the previous or home page
        // $state.go($state.previous.state.name || 'home', $state.previous.params);
        
      }).error(function (response) {
        $scope.error = response.message;
        if($scope.identify === 'company') {
          if($scope.error.includes('Username')) {

            delete response.user.username;

          }
          else if($scope.error.includes('Email')){

            delete response.user.email;
            
          }

          $scope.credentials.company = response.user;
          
        }
        else if($scope.identify === 'individual'){

          if($scope.error.includes('Username')) {

            delete response.user.username;

          }
          else if($scope.error.includes('Email')){

            delete response.user.email;
          }
          
          $scope.credentials.individual = response.user;
        }
        
        
      });
    };

    
    $scope.signin = function (isValid) {
      //console.log('helo');
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
     
      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        
        var welcomeText = '환영합니다! '+response.username;

        // status should online on signin
        
        $scope.offline = 'online';
        var status = {
          'currentPersonUserId' : response._id,
          'status' : $scope.offline
        };
        
        logOutService.logOut(status);
        // end status should online on signin
        Account.findOne({ 
          filter: {
            where: {
              ownerId: response.username
            }
          }
        }, function(res){

          Notification.success({message: welcomeText, positionY: 'bottom', positionX: 'right', closeOnClick: true, title: '<i class="glyphicon glyphicon-check"></i> 로그인 성공!'});
          $scope.authentication.user = response;
          $rootScope.userAccountBalance = res;

          $rootScope.userAccountBalance = res;
          if($scope.authentication.user.verEmail || $scope.authentication.user.verjobcallmeEmail){
            // $state.go('projects.project-dash');
            if($state.previous.state.name !== 'home'){
              $state.go($state.previous.state.name, $state.previous.params);
            }else{
              $state.go('projects.project-dash');
            }
          }else{
            $state.go('verify');
          }
           $rootScope.getMessages();
           $rootScope.getAllNotifications();
          //$state.go($state.previous.state.name || 'projects.project-dash', $state.previous.params);
        }, function(err){
          //console.log('Amount total getAmount ERROR: ', err);
        });

      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      
      var redirect_to;
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      // $window.location.href = url;
      $window.location.href = url + (redirect_to ? '?redirect_to=' + encodeURIComponent(redirect_to) : '');
    };

    // $scope.companyInterestRemove = function () {

    //   if($scope.credentials.company.interest) {
    //     $scope.credentials.company.interest = '';
    //   }

    // };

    // $scope.individualInterestRemove = function () {

    //   if($scope.credentials.individual.interest) {
    //     $scope.credentials.individual.interest = '';
    //   }

    // };

    $scope.universalData = function () {
      $scope.countryData = {};
      

      $scope.universal = UniversalData.query().$promise.then(function(data) {
        $scope.records = data[0];
        $scope.countryData = $scope.records.countryData;
        
        return $scope.records;
      }, function(error) {
        // error handler
      });
    };

    $scope.getPhoneCodeIndivisual = function () {

      console.log('ind country:', $scope.credentials.individual);

      $timeout(function() {

        angular.forEach($scope.countryData, function(value, key) {

          if(value.name === $scope.credentials.individual.country.name)
          {
            $scope.dialCodeIndivisual = value.dial_code;
            $scope.countryCode = value.code;
          }
        });
      },200);
    };

    $scope.getPhoneCodeCompany = function () {

      console.log('com country:', $scope.credentials.company);

      $timeout(function() {
      
        angular.forEach($scope.countryData, function(value, key) {

          ////console.log(value.name + ' ' + key );
          if(value.name === $scope.credentials.company.country.name)
          {
            $scope.dialCodeCompany = value.dial_code;
            $scope.countryCode = value.code;
          }
        });
      },200);
    };
    
  }
]);
