'use strict';

angular.module('core').controller('HeaderController', ['$translate','$scope', '$http', '$rootScope', '$location', '$anchorScroll', 'SweetAlert', '$state', 'Authentication', 'logOutService', 'Account', 'toastr', 'ChatMessages','UserSchema', 'Conversation', 'Notifications', 'AdminSocket', 'Notification', 'ProjectFeed', 'MessengerSocket', 'ngAudio', 'Socket', 'UniversalData',
  function ($translate,$scope, $http, $rootScope, $location, $anchorScroll, SweetAlert, $state, Authentication, logOutService, Account, toastr, ChatMessages,UserSchema, Conversation, Notifications, AdminSocket, Notification, ProjectFeed, MessengerSocket, ngAudio, Socket, UniversalData) {
    // Expose view variables
    $scope.$state = $state;
    $rootScope.$state = $state;
    $scope.authentication = Authentication;
    $scope.notification = [];
   
    if(Authentication.user && !Authentication.user.verEmail || Authentication.user && !Authentication.user.verjobcallmeEmail){
      $location.path('/verify');
    }
    

    // TEST 
    // function updateAccount (){
    //   var account = $rootScope.userAccountBalance;
    //   console.log('acc:', account);
  
    //   var updatedAcc = {
    //     "ownerId": account.ownerId,  
    //     "creationDate": account.creationDate,
    //     "accountBalance" :{
    //       "USD": account.accountBalance.USD+5,
    //       "KRW": account.accountBalance.KRW + 5
    //     }  
    //   };
    //   Account.update({
    //     where: {
    //       id: account.id
    //     }
    //   }, updatedAcc, function (updAcc) {
    //     console.log('account updated:', updAcc);  
    //   });
    // }
    
    // Get the topbar menu
    // $scope.menu = Menus.getMenu('topbar');

    $scope.isNavCollapsed = true;
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;

    //Search bar
    $scope.goToState = function (state, params) {
      $state.go(state, params);
    };

    //auto scrol top
    $rootScope.$on("$locationChangeSuccess", function() {
      $anchorScroll();
    });

    // Currency rate is being hardcoded here instead of getting the latest rate
    // 1 USD = 1000 KRW
    $rootScope.latestCurrencyRate = { 'USD': 1, 'KRW': 1000 };

    // Get all univeral data
    UniversalData.query().$promise.then(function(data) {
      $rootScope.universal = data[0];
    });

    // New Message
    Socket.on(Authentication.user.username + 'NewChatMessage', function (message) {
     // show redalert/notif       
      $rootScope.msgAlert = true;        
      // console.log('From header, socket ON');      
      Conversation.find({
        filter: {
          where: {
            userOne: Authentication.user.username
          }
        }
      }, function (resp) {
        $rootScope.conversations = resp;
        angular.forEach($rootScope.conversations, function (conv, i) {
          UserSchema.findOne({
            filter: {
              where: {
                username: conv.userTwo
              },
              fields: ['displayName', 'username', 'email', 'profileImageURL']
            }
          }, function (cuser) {
            Object.assign(conv, cuser);
          });
        });
      });
    });

    // admin eWallet
    Account.findOne({
      filter:{
        where:{
          ownerId: 'admin'
        }
      }
    }, function(resp){
      $rootScope.adminEWalletId = resp.id;
    });

    // admin/messenger server address 
    if($location.host() === 'localhost' || $location.host() ==='203.99.61.173'){
      $rootScope.adminServerAddress = 'https://203.99.61.173:3030';
      $rootScope.messengerServerAddress = 'https://203.99.61.173:3210';
    } 
    else{
      $rootScope.adminServerAddress = 'https://admin.bluefreelancer.com';
      $rootScope.messengerServerAddress = 'https://messenger.bluefreelancer.com';
    }

    //outOUt and change the status of user to offline
    $scope.logOut = function(){
      
      $scope.offline = 'offline';
      var status = {
        'currentPersonUserId' : $scope.authentication.user._id,
        'status' : $scope.offline
      };
      
      logOutService.logOut(status);
      
    };



    // message in header
    $scope.openChatWindowFromHeader = function(conversation, conversationCid, conversationUuserTwo){
      $scope.conversation = conversation;
      $scope.conversation.cid = conversationCid;
      $scope.conversation.userTwo = conversationUuserTwo;
      // console.log('conversation.', conversation);
      $rootScope.openChat2Window(conversation, conversation.cid, conversation.userTwo);
    };

    // Listen to AdminSocket
    Socket.on(Authentication.user.username+'ProjectNotif', function(data){
      if(Authentication.user.notificationsOnOff.receiveEntry){
        Notification.primary({message: data.description, positionY: 'bottom', positionX: 'left', closeOnClick: true, title: 'Notification'});
        $scope.notification.push(data);   
        $scope.notifAlert = true;
      }
    });
    
    // AdminSocket.on(Authentication.user.username+'notification', function(data){
    //   if(Authentication.user.notificationsOnOff.receiveEntry){
    //     Notification.primary({message: data.description, positionY: 'bottom', positionX: 'left', closeOnClick: true, title: 'Notification'});
    //     $scope.notification.push(data);   
    //     $scope.notifAlert = true;
    //   }
    // });

    // Listen to MessengerSocket(Video Call Alert)
    $scope.myWindow = false;
    
    // For Audio call
    MessengerSocket.on(Authentication.user.username + 'call', function(data) {

      // if(!$scope.myWindow){
        // play the call sound
        $scope.sound = ngAudio.load("modules/chat/client/sound/video_call.mp3");
        $scope.sound.play();
        $scope.sound.loop = true;

        // show calling popup
        SweetAlert.swal({
           title: "Incoming voice call from "+data.from,
           showCancelButton: true,
           cancelButtonColor: "#DD6B55",
           confirmButtonColor: "#5cb85c",
           confirmButtonText: "Accept",
           cancelButtonText: "Reject",
           closeOnConfirm: false,
           closeOnCancel: false 
         },function(isConfirm){ 
           if (isConfirm) {

            MessengerSocket.emit('answer', { to: data.from, callAnswer: false, answer: true, room: data.room, isVideoCall: false, isCall: false, paramId: data.room });
              // on accept
              // console.log("call accepted");
              // $rootScope.messengerServerAddress+'/#!/messenger/ + Auth.user.username + '/' + room'
              $scope.sound.stop();
              SweetAlert.close();

              var myWindow = window.open($rootScope.messengerServerAddress+"/#!/messenger/"+data.from+"/"+ Authentication.user.username +"/"+data.room, "", "width=100%");
              $scope.myWindow = true;
              // console.log("myWindow:", $scope.myWindow);
           } 
           else {
              // on reject
              //console.log("call rejected");
              $scope.sound.stop();
              MessengerSocket.emit('busy', { to: data.from, answer: '$scope.answer' });
              SweetAlert.close();
           }
        });
      // }
      
    });
    
    // For Video Call
    MessengerSocket.on(Authentication.user.username + 'videoCall', function(data) {

      // if(!$scope.myWindow){
        // play the call sound
        $scope.sound = ngAudio.load("modules/chat/client/sound/video_call.mp3");
        $scope.sound.play();
        $scope.sound.loop = true;

        // show calling popup
        SweetAlert.swal({
           title: "Incoming video call from "+data.from,
           showCancelButton: true,
           cancelButtonColor: "#DD6B55",
           confirmButtonColor: "#5cb85c",
           confirmButtonText: "Accept",
           cancelButtonText: "Reject",
           closeOnConfirm: false,
           closeOnCancel: false 
         },function(isConfirm){ 
           if (isConfirm) {

            MessengerSocket.emit('answer', { to: data.from, callAnswer: true, answer: true, room: data.room, isVideoCall: false, isCall: false, paramId: data.room });
              // console.log("call accepted");
              // $rootScope.messengerServerAddress+'/#!/messenger/ + Auth.user.username + '/' + room'
              $scope.sound.stop();
              SweetAlert.close();

              var myWindow = window.open($rootScope.messengerServerAddress+"/#!/messenger/"+data.from+"/"+ Authentication.user.username +"/"+data.room, "", "width=100%");
              $scope.myWindow = true;
              // console.log("myWindow:", $scope.myWindow);
           } 
           else {
              // on reject
              //console.log("call rejected");
              $scope.sound.stop();
              MessengerSocket.emit('busy', { to: data.from, answer: '$scope.answer' });
              SweetAlert.close();
           }
        });
      // }
      
    });

    // Listen to Project Feed
    AdminSocket.on(Authentication.user.username+'feeds', function(data){
      Notification.info({message: data.description, positionY: 'bottom', positionX: 'left', closeOnClick: true, title: 'Project Feed'});
      $scope.projectFeed.push(data);
      $scope.showredAlert = true;
    });

    //Notifications
    $rootScope.getAllNotifications = function(){
      // $http.get($rootScope.adminServerAddress+'/api/Notifications?filter[where][subscriber]='+Authentication.user.username).then(function(res){
      //   // $scope.notification = res.data;
      // });

      Notifications.find({
        filter:{
          where:{
            subscriber: Authentication.user.username
          }
        }
      }, function(res){
        $scope.notification = res;
      });
    };



    ProjectFeed.find({
      // filter:{
      //   where:{
      //     subscriber: Authentication.user.username
      //   }
      // }
    }, function(suc){
      $scope.projectFeed = suc;
      // //console.log('projectFeed:', suc);
      
    }, function(err){
      //console.log('projectFeed error');
    });

    // projFeedAlert
    $scope.projFeedAlert = function(){
      $scope.showredAlert = false;
    };

    // notificationAlert
    $scope.notificationAlert = function(){
      $scope.notifAlert = false;
    };

    // newMsgAlert
    $scope.newMsgAlert = function(){
      $rootScope.msgAlert = false;
    };

    $scope.msgWindow = false;
    

    // var urlToChangeStream = $rootScope.adminServerAddress+'/api/Notifications?filter[where][subscriber]='+Authentication.user.username +'/change-stream';
    // var src = new window.EventSource(urlToChangeStream);
    // src.addEventListener('data', function(msg) {  
    //   var data = JSON.parse(msg.data);  
    //   //console.log(data); // the change object
    //   $scope.notification.push(data);

    //   toastr.success('Notifications description here', 'Notification', {
    //      positionClass: 'toast-bottom-left'
    //    });

    // });

    // Toggle the menu items
    // $scope.isCollapsed = true;
    
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    // Fetch amount in Account
    $scope.getAmount = function () {
      if ($scope.authentication.user !== '') {
        Account.findOne({
          filter: {
            where: {
              ownerId: $scope.authentication.user.username
            }
          }
        }, function (res) {
          $rootScope.userAccountBalance = res;

          // updateAccount();
          /*
          * Get currency rate
          */
          // if(typeof($rootScope.latestCurrencyRate) === 'undefined' || Object.keys($rootScope.latestCurrencyRate).length === 0 ){
          if(typeof($rootScope.latestCurrencyRate) === 'undefined'){
            // $http.get('https://api.fixer.io/latest?base=USD').then(function(res){
            //   $rootScope.latestCurrencyRate = res.data.rates;
            //   $rootScope.latestCurrencyRate.USD = 1;
            //   localStorage.setItem('latestCurrencyRate', JSON.stringify($rootScope.latestCurrencyRate));
            // });
            $rootScope.latestCurrencyRate = { 'USD': 1, 'KRW': 1000 };
          }else{
            console.log('session exists');
            // $rootScope.latestCurrencyRate = JSON.parse(localStorage.getItem('latestCurrencyRate'));
            $rootScope.latestCurrencyRate = { 'USD': 1, 'KRW': 1000 };
          }
        }, function (err) {
          toastr.error('ERROR getting amount in account', 'Account Error');
        });
      }
    };

    $rootScope.totalBalanceKrw = function(){
      $rootScope.krw = $rootScope.userAccountBalance.accountBalance.USD * $rootScope.latestCurrencyRate.KRW;
    };

    // Fetch Coversation
    $rootScope.getMessages = function () {
      $rootScope.getAllNotifications();
      $scope.messageLoading = true;

      $rootScope.conversations = [];
      $scope.currentUserData = Authentication.user;
      Conversation.find({
        filter: {
          where: {
            userOne: Authentication.user.username
          }
        }
      }, function (resp) {
        $scope.allCovo = resp;
        // console.log($scope.allCovo);

        angular.forEach($scope.allCovo, function (conv, i) {
          // console.log(conv.userOne === Authentication.user.username);
          if(conv.userOne === Authentication.user.username){
            if(conv.hasUnreadMessages === true){
              $rootScope.msgAlert = true;
            }

            UserSchema.findOne({
              filter: {
                where: {
                  username: conv.userTwo
                },
                fields: ['displayName', 'username', 'email', 'profileImageURL']
              }
            }, function (cuser) {
              Object.assign(conv, cuser);
              $rootScope.conversations.push(conv);
            });
          }

        });
        $scope.messageLoading = false;

      }, function(err){
        $scope.messageLoading = false;
      });
    };

    // Search the outsourcer 
    $scope.search = {};
    $scope.$watch('search.outSourcer', function() {
      // console.log('Search:',$scope.search.outSourcer);
      if($scope.search.outSourcer)
        $scope.showSearch = true;
      else{
        $scope.showSearch = false;
        return;
      }

      return $http({
        url: '/api/search/'+$scope.search.outSourcer,
        method: 'GET'
      }).then(function(response){
        if(typeof response.data.length !=='undefined' && response.data.length>0){
          $scope.foundUser = response.data;
        }
        else
          $scope.foundUser = '';
      }, function(err){
        // toastr.error('We are sorry, something went wrong.');
      });
    });

  }
]);
