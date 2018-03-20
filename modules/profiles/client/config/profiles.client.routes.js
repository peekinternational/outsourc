'use strict';

// Setting up route
angular.module('profiles').config(['$stateProvider',
  function ($stateProvider) {
  // Profiles state routing
    $stateProvider
    .state('profile', {
      abstract: true,
      url: '/profile',
      templateUrl: 'modules/profiles/client/views/header-profile.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    .state('profile.view', {
      url: '/view/:profileId',
      templateUrl: 'modules/profiles/client/views/view-profile.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })

    .state('profile.outsourcer', {
      url: '^/outsourcer/:profileId',
      templateUrl: 'modules/profiles/client/views/freelancer-profile-view.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
      
    .state('profiles', {
      abstract: true,
      url: '/profiles',
      template: '<ui-view/>',
      data: {
        roles: ['individual', 'company']
      }
    })
    .state('profiles.list', {
      url: '',
      templateUrl: 'modules/profiles/client/views/viewprofile.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    .state('profiles.create', {
      url: '/create',
      templateUrl: 'modules/profiles/client/views/create-profile.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    .state('profiles.view', {
      url: '/:profileId',
      templateUrl: 'modules/profiles/client/views/view-profile.client.view.html'
    })
    .state('profiles.edit', {
      url: '/:profileId/edit',
      templateUrl: 'modules/profiles/client/views/edit-profile.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })

    // browse directry of freelancers
    .state('outsoucers', {
      url: '/outsoucers',
      templateUrl: 'modules/profiles/client/views/list-freelancers.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    
    .state('profile.resume', {
      url: '/:resume',
      templateUrl: 'modules/profiles/client/views/view-resume.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    .state('withdraw-amount', {
      url: '/withdraw-amount',
      templateUrl: 'modules/profiles/client/views/withdraw-amount.client.view.html',
      data: {
        roles: ['user', 'admin', 'individual', 'company']
      }
    })
    .state('deposit', {
      url: '/deposit',
      templateUrl: 'modules/profiles/client/views/deposit.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
	.state('credit-deposit', {
      url: '/credit-deposit',
      templateUrl: 'modules/profiles/client/views/credit-deposit.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
	.state('paypal-deposit', {
      url: '/paypal-deposit',
      templateUrl: 'modules/profiles/client/views/paypal-deposit.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
	.state('cash-deposit', {
      url: '/cash-deposit',
      templateUrl: 'modules/profiles/client/views/cash-deposit.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    });
  }
]);
