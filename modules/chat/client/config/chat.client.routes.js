'use strict';

// Configure the 'chat' module routes
angular.module('chat').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('chat', {
        abstract: true,
        url: '/chat',
        templateUrl: 'modules/chat/client/views/header-chat.client.view.html',
        data: {
          roles: ['individual', 'company', 'admin', 'user']
        }
      })
      .state('chat.inbox', {
        url: '/inbox/:cid',
        templateUrl: 'modules/chat/client/views/inbox.client.view.html',
        data: {
          roles: ['individual', 'company']
        }
      })
      .state('videochat', {
        data: {
          roles: ['individual', 'company']
        },
        url: '/videochat',
        templateUrl: 'modules/chat/client/views/videochat.client.view.html'
      })

    //videochat3
    // .state('videochat',{
    //   data: {
    //     roles: ['individual', 'company']
    //   },
    //   url: '/videochat',
    //   templateUrl: 'modules/chat/client/views/video-chat.client.view.html'
    // })
    // // .state('videochat:/roomId',{
    // //   data: {
    // //     roles: ['individual', 'company']
    // //   },
    // //   url: '/videochat/:roomId',
    // //   templateUrl: 'modules/chat/client/views/video-chat.client.view.html'
    // // })

    // //videochat simple webrtc
    .state('broadcast',{
      data: {
        roles: ['individual', 'company']
      },
      url: '/broadcast',
      controller:'BroadcastAppController',
      templateUrl: 'modules/chat/client/views/broadcast.client.view.html'
    })

    .state('joinroom',{
      data: {
        roles: ['individual', 'company']
      },
      url: '/joinroom',
      templateUrl: 'modules/chat/client/views/watch-room.client.view.html'
    });
  }
]);
