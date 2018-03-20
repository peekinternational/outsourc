'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

angular.module('users').factory('UniversalData', ['$resource',
  function ($resource) {
    return $resource('api/universal', {}, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
  }
]);

// angular.module('users').factory('logOutService', ['$resource',
//   function ($resource) {
//     return $resource('/api/auth/signout7', {}, {
//       query: {
//         method: 'PUT',
//         isArray: true
//       }
//     });
//   }
// ]);

angular.module('users').factory('logOutService', function($http) {
    return {
        logOut: function(status) {
            // alert('logOut fn is called');
            //console.log.log('logOutService is called');
            //console.log.log('status', status);
            // $scope.offline = 'offline';
            // var status = {
            //   'currentPersonUserId' : $scope.authentication.user._id,
            //   'status' : $scope.offline
            // };
            return $http({
              // url: '/api/auth/signout'+$scope.authentication.user._id,
              url: '/api/auth/signout7',
              method: 'PUT',
              data: status
            }).then(function(response) {
              // success
              //console.log.log('success', response);
              // $location.path('contests/view/' + $scope.currentContestId);
            },function(response){
              // failed
              //console.log.log('failled', response);
            });

        }    
    };
});
