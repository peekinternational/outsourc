// Showcases service used to communicate Showcases REST endpoints
(function () {
  'use strict';

  angular
    .module('showcases')
    .factory('ShowcasesService', ShowcasesService);

  ShowcasesService.$inject = ['$resource'];

  function ShowcasesService($resource) {
    return $resource('api/showcases/:showcaseId', {
      showcaseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
