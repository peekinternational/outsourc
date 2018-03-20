'use strict';

// Setting up route
angular.module('contests').config(['$stateProvider',
  function ($stateProvider) {
    
    // Contests state routing
    $stateProvider
      .state('contests', {
        abstract: true,
        url: '/contests',
        templateUrl: 'modules/contests/client/views/contest-header.client.view.html',
      })

      // .state('contests.list', {
      //   url: 'list',
      //   templateUrl: 'modules/contests/client/views/list-contests.client.view.html',
      //   data: {
      //     roles: ['user', 'admin', 'individual', 'company']
      //   }
      // })
      
      // post a contest
      .state('contests.contest-post', {
        url: '/contest-post',
        templateUrl: 'modules/contests/client/views/contest-post.client.view.html',
        data: {
          roles: ['user', 'admin', 'individual', 'company']
        }
      })

      // show list of contests posted
      .state('contests.contest-list', {
        url: '/contest-list',
        templateUrl: 'modules/contests/client/views/contest-list.client.view.html',
        data: {
          roles: ['user', 'admin', 'individual', 'company']
        }
      })

      // show a description of given contest
      .state('contests.view', {
        url: '/view/:contestId',
        templateUrl: 'modules/contests/client/views/contest-desc.client.view.html',
        data: {
          roles: ['user', 'admin','individual', 'company']
        }
      })

      // post an entry on any contest
      .state('contests.entry', {
        url: '/entry/:contestId',
        templateUrl: 'modules/contests/client/views/upload-contest-entry.client.view.html',
        data: {
          roles: ['user', 'admin', 'individual', 'company']
        }
      })

      // post an entry on any contest
      .state('contests.handover', {
        url: '/handover/:contestId',
        templateUrl: 'modules/contests/client/views/handover-contest.client.view.html',
        data: {
          roles: ['user', 'admin', 'individual', 'company']
        }
      })

       // Update/ Delete contest
      .state('contests.edit', {
        url: '/edit/:contestId',
        templateUrl: 'modules/contests/client/views/edit-contest.client.view.html',
        data: {
          roles: ['individual', 'company']
        }
      })
      
      
      // total entries on a specific contest
      .state('contests.work-entities', {
        url: '/work-entities',
        templateUrl: 'modules/contests/client/views/work-entities.client.view.html',
        data: {
          roles: ['user', 'admin', 'individual', 'company']
        }
      })
      .state('contests.transcation', {
        url: '/transcation',
        templateUrl: 'modules/contests/client/views/transcation-history.client.view.html',
        data: {
          roles: ['user', 'admin', 'individual', 'company']
        }
      })
      .state('contests.verify-payment', {
        url: '/verify-payment',
        templateUrl: 'modules/contests/client/views/verify-payment.client.view.html',
        data: {
          roles: ['user', 'admin', 'individual', 'company']
        }
      })
      .state('contests.credit-card', {
        url: '/credit-card',
        templateUrl: 'modules/contests/client/views/credit-card.client.view.html',
        data: {
          roles: ['user', 'admin', 'individual', 'company']
        }
      });
      
      // 
      // .state('contests.view', {
      //   url: '/:contestId',
      //   templateUrl: 'modules/contests/client/views/view-contest.client.view.html',
      //   data: {
      //     roles: ['user', 'admin', 'individual', 'company']
      //   }
      // })

      
     // .state('contests.work-contest', {
     //    url: '',
     //    templateUrl: 'modules/contests/client/views/work-contest.client.view.html'
     //  });
  }
]);
