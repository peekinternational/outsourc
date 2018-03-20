'use strict';

//Profiles service used for communicating with the profiles REST endpoints
angular.module('profiles').factory('Profiles', ['$resource',
  function ($resource) {
    return $resource('api/profiles/:profileId', {
      profilesId: '@_id'
    }, {
      update: {
        method: 'PUT',
        isArray: true
      }
    });
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

