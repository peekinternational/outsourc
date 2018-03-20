'use strict';

//Projects service used for communicating with the projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
  function ($resource) {
    return $resource('api/projects/:projectId', {
      projectId: '@_id'
    }, {
      update: {
        method: 'PUT'
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
