(function () {
  'use strict';

  angular
    .module('showcases')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('showcases', {
        abstract: true,
        url: '/showcases',
        template: '<ui-view/>'
      })
      .state('showcases.list', {
        url: '',
        templateUrl: 'modules/showcases/client/views/list-showcases.client.view.html',
        controller: 'ShowcasesListController',
        data: {
          roles: ['user', 'admin', 'individual', 'company'],
          pageTitle: 'Showcases List'
        }
      })
      .state('showcases.create', {
        url: '/create',
        templateUrl: 'modules/showcases/client/views/create-showcase.client.view.html',
        controller: 'ShowcasesController',
        controllerAs: 'vm',
        // resolve: {
        //   showcaseResolve: newShowcase
        // },
        data: {
          roles: ['user', 'admin', 'individual', 'company'],
          pageTitle: 'Showcases Create'
        }
      })
      .state('showcases.edit', {
        url: '/edit/:showcaseId',
        templateUrl: 'modules/showcases/client/views/edit-showcase.client.view.html',
        controller: 'ShowcasesController',
        controllerAs: 'vm',
        resolve: {
          showcaseResolve: getShowcase
        },
        data: {
          roles: ['user', 'admin', 'individual', 'company'],
          pageTitle: 'Edit Showcase {{ showcaseResolve.name }}'
        }
      })
      .state('showcases.view', {
        url: '/:showcaseId',
        templateUrl: 'modules/showcases/client/views/view-showcase.client.view.html',
        controller: 'ShowcasesController',
        controllerAs: 'vm',
        // resolve: {
        //   showcaseResolve: getShowcase
        // },
        data: {
          roles: ['user', 'admin', 'individual', 'company'],
          pageTitle: 'Showcase {{ showcaseResolve.name }}'
        }
      })


      .state('showcases.myshowcases', {
        url: '^/myshowcases',
        templateUrl: 'modules/showcases/client/views/my-showcase.client.view.html',
        controller: 'MyShowcaseController',
        data: {
          roles: ['user', 'admin', 'individual', 'company'],
          pageTitle: 'My Showcases'
        }
      });
  }

  getShowcase.$inject = ['$stateParams', 'ShowcasesService'];

  function getShowcase($stateParams, ShowcasesService) {
    return ShowcasesService.get({
      showcaseId: $stateParams.showcaseId
    }).$promise;
  }

  newShowcase.$inject = ['ShowcasesService'];

  function newShowcase(ShowcasesService) {
    return new ShowcasesService();
  }
}());
