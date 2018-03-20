'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['individual', 'company']
        }
      })
       .state('settings.profile', {
         url: '/profile',
         templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
       })
       .state('settings.password', {
         url: '/password',
         templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
       })
       // .state('settings.accounts', {
       //   url: '/accounts',
       //   templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
       // })
       .state('settings.membership', {
         url: '/membership',
         templateUrl: 'modules/users/client/views/settings/membership.client.view.html'
       })
       
       .state('settings.notifications', {
         url: '/notifications',
         templateUrl: 'modules/users/client/views/settings/notifications.client.view.html'
       })
       .state('settings.account', {
         url: '/account',
         templateUrl: 'modules/users/client/views/settings/account.client.view.html'
       })

      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })


      .state('emailverify',{
        data: {
          roles: ['individual', 'company']
        },
        url: '/emailverify',
        templateUrl: 'modules/users/client/views/authentication/emailverify.client.view.html',
        controller: 'EmailVerificationController'
      })

      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })

      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);
