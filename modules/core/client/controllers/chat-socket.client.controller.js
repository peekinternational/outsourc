'use strict';
angular.module('core').controller('ChatSocketController', ['$scope', '$rootScope', '$timeout', '$location', '$stateParams', 'Socket', 'Authentication', 'Account', 'Profiles', '$sce', 'usSpinnerService', 'Conversation', 'UserSchema', 'ChatMessages', 'Advertisement', 'FAQ', 'ngAudio',
  function ($scope, $rootScope, $timeout, $location, $stateParams, Socket, Authentication, Account, Profiles, $sce, usSpinnerService, Conversation, UserSchema, ChatMessages, Advertisement, FAQ, ngAudio) {
    
      $scope.authentication = Authentication;

      //chatwindow setting
      $scope.chatwindow2close = false;
      $scope.chatwindow3close = false;
      $scope.chatwindow4close = false;
      $scope.chatwindowMinimize = false;

      // console.log('ChatSocketControllerxxxxxxx');

      $scope.counterAndPosition = function()
      {

        if($scope.chatwindow2close === true  && $scope.chatwindow3close === true && $scope.chatwindow4close === true)
        {

         angular.element('#heightSettingChat2').css('right', '16.5%');
         angular.element('#heightSettingChat3').css('right', '37%');
         angular.element('#heightSettingChat4').css('right', '57.5%');
         return;
        }  

        if($scope.chatwindow2close === false  && $scope.chatwindow3close === false && $scope.chatwindow4close === false)
        {
         angular.element('#heightSettingChat2').css('right', '16.5%');
         angular.element('#heightSettingChat3').css('right', '37%');
         angular.element('#heightSettingChat4').css('right', '57.5%');
         return;
        }

        //if  2=false
        if($scope.chatwindow2close === false && $scope.chatwindow3close === true && $scope.chatwindow4close === true)
        {
         angular.element('#heightSettingChat3').css('right', '16.5%');
         angular.element('#heightSettingChat4').css('right', '37%');
        } 
        if($scope.chatwindow2close === false && $scope.chatwindow3close === true && $scope.chatwindow4close === false)
        {
         angular.element('#heightSettingChat3').css('right', '16.5%');
        } 
        if($scope.chatwindow2close === true && $scope.chatwindow3close === true && $scope.chatwindow4close === false)
        {
         angular.element('#heightSettingChat2').css('right', '16.5%');
         angular.element('#heightSettingChat3').css('right', '37%');
        }

        //if 3=false
        if($scope.chatwindow3close === false && $scope.chatwindow2close === true && $scope.chatwindow4close === true)
        {
         angular.element('#heightSettingChat4').css('right', '37%');
        } 
        if($scope.chatwindow3close === false && $scope.chatwindow2close === false && $scope.chatwindow4close === true)
        {
         angular.element('#heightSettingChat4').css('right', '16.5%');
        } 

        if($scope.chatwindow3close === true && $scope.chatwindow2close === false && $scope.chatwindow4close === false)
        {
         angular.element('#heightSettingChat3').css('right', '16.5%');
        }

      };
      
      $scope.profileOneId2 = null;
      $scope.profileOneId3 = null;
      $scope.profileOneId4 = null;
      //undefine userId when the window close
      $scope.undefinedWhenClose = function(whichClose)
      {
         if(whichClose === 2)
         {
             $scope.profileOneId2 = null;

         }
         if(whichClose === 3)
         {
             $scope.profileOneId3 = null;

         }
         if(whichClose === 4)
         {
             $scope.profileOneId4 = null;

         }
      };

      $scope.scrollBottom = function(){
        // scroll to bottom 
        // issue first time the height is 0
        $timeout(function() {
          var objDiv0 = document.getElementById("scrollBottom0");
          objDiv0.scrollTop = objDiv0.scrollHeight;
          // console.log('objDiv0.scrollTop', objDiv0.scrollTop);
          var objDiv1 = document.getElementById("scrollBottom1");
          objDiv1.scrollTop = objDiv1.scrollHeight;
          // console.log('objDiv1.scrollTop', objDiv1.scrollTop);
          var objDiv2 = document.getElementById("scrollBottom2");
          objDiv2.scrollTop = objDiv2.scrollHeight;
          // console.log('objDiv2.scrollTop', objDiv2.scrollTop);
        }, 1000);      
      };

      $scope.counterOne = 1;

      $rootScope.openChat2Window = function(conversationWithObj, userIdForChat, _email){
        // console.log('conversationWithObj', conversationWithObj);
        $scope.userIdForChat = userIdForChat; 
         if($scope.chatwindow2close === false && $scope.chatwindow3close === false && $scope.chatwindow4close === false)
         {
          $scope.counterOne = 1;
         }
         if($scope.chatwindow2close === false && $scope.chatwindow3close === false && $scope.chatwindow4close === true)
         {
          $scope.counterOne = 1;
         }
         if($scope.chatwindow2close === false && $scope.chatwindow3close === true && $scope.chatwindow4close === true)
         {
          $scope.counterOne = 1;
         }
         if($scope.chatwindow2close === true && $scope.chatwindow3close === false && $scope.chatwindow4close === false)
         {
          $scope.counterOne = 2;
         }
         if($scope.chatwindow2close === true && $scope.chatwindow3close === false && $scope.chatwindow4close === true)
         {
          $scope.counterOne = 2;
         }
         if($scope.chatwindow2close === true && $scope.chatwindow3close === true && $scope.chatwindow4close === false)
         {
          $scope.counterOne = 3;
         }
         if($scope.chatwindow2close === false && $scope.chatwindow3close === true && $scope.chatwindow4close === false)
         {
          $scope.counterOne = 3;
         }
         if($scope.chatwindow2close === true && $scope.chatwindow3close === true && $scope.chatwindow4close === false)
         {
          $scope.counterOne = 3;
         }
         if($scope.chatwindow2close === true && $scope.chatwindow3close === true && $scope.chatwindow4close === true)
         {
          $scope.counterOne = 3;
         }

        if($scope.counterOne === 1 && $scope.userIdForChat !== $scope.profileOneId2 && $scope.userIdForChat !== $scope.profileOneId3 && $scope.userIdForChat !== $scope.profileOneId4)
        { 

          $scope.getConversation(conversationWithObj, _email, $scope.counterOne+1);
          $scope.counterOne += 1;
          $scope.message1 = "";

          Conversation.findOne({
            filter:{
              where:{
                cid: userIdForChat
              }
            }
          }, function(suc){
            $scope.conData2 = suc;
            $scope.profileOneId2 = $scope.conData2.cid;
            // console.log('$scope.conData2:', $scope.conData2);
            if($scope.currentUserData.username === $scope.conData2.userTwo){
              $scope.conUser2 = $scope.conData2.userOne;
            }
            else{
              $scope.conUser2 = $scope.conData2.userTwo;
            }
            // console.log('zz2222 $scope.conUser2',$scope.conUser2);
            // Find the user
            UserSchema.findOne({
              filter:{
                where:{
                  username: $scope.conUser2
                }
              }
            }, function(suc){
              $scope.userTwo2 = suc;
              // console.log('$scope.userTwo2:', $scope.userTwo2);
            }, function(err){
              // console.log(err);
            });
          }, function(err){
            // console.log(err);
          });


         $scope.chatwindow2close = true;
         $scope.counterAndPosition();
         $scope.scrollBottom();
         return;
        }

        if($scope.counterOne === 2 && $scope.userIdForChat !== $scope.profileOneId2 && $scope.userIdForChat !== $scope.profileOneId3 && $scope.userIdForChat !== $scope.profileOneId4)
        {
         $scope.getConversation(conversationWithObj, _email, $scope.counterOne+1);
         $scope.counterOne += 1;
         $scope.message2 = "";

         // Find the Conversation
         Conversation.findOne({
            filter:{
              where:{
                cid: userIdForChat
              }
            }
          }, function(suc){
            $scope.conData3 = suc;
            $scope.profileOneId3 = $scope.conData3.cid;
            // console.log('$scope.conData3:', $scope.conData3.id);

            if($scope.currentUserData.username === $scope.conData3.userTwo){
              $scope.conUser3 = $scope.conData3.userOne;
            }
            else{
              $scope.conUser3 = $scope.conData3.userTwo;
            }

            // Find the user
            UserSchema.findOne({
              filter:{
                where:{
                  username: $scope.conUser3
                }
              }
            }, function(suc){
              $scope.userTwo3 = suc;
            }, function(err){
              // console.log(err);
            });

          }, function(err){
            // console.log(err);
          });

          $scope.chatwindow3close = true;
          $scope.counterAndPosition();
          // var objDiv = document.getElementById("scrollBottom1");
          // objDiv.scrollTop = objDiv.scrollHeight; 
          $scope.scrollBottom();
          return;
        }

       if($scope.counterOne === 3 && $scope.userIdForChat !== $scope.profileOneId2 && $scope.userIdForChat !== $scope.profileOneId3 && $scope.userIdForChat !== $scope.profileOneId4)
       {
          $scope.getConversation(conversationWithObj, _email, $scope.counterOne+1);
          $scope.counterOne += 1;
          $scope.message4 = "";

          Conversation.findOne({
            filter:{
              where:{
                cid: userIdForChat
              }
            }
          }, function(suc){
            $scope.conData4 = suc;
            $scope.profileOneId4 = $scope.conData4.cid;

            if($scope.currentUserData.username === $scope.conData4.userTwo){
              $scope.conUser4 = $scope.conData4.userOne;
            }
            else{
              $scope.conUser4 = $scope.conData4.userTwo;
            }
            console.log('zz4444 $scope.conUser4',$scope.conUser4);
            // Find the user
            UserSchema.findOne({
              filter:{
                where:{
                  username: $scope.conUser4
                }
              }
            }, function(suc){
              $scope.userTwo4 = suc;
            }, function(err){
              console.log(err);
            });
          }, function(err){
            console.log(err);
          });


          $scope.chatwindow4close = true;
          $scope.counterAndPosition();
          // var objDiv = document.getElementById("scrollBottom2");
          // objDiv.scrollTop = objDiv.scrollHeight;
          $scope.scrollBottom();
          return;
       }    
      };
      
      $scope.messages = {
          messageUser: $scope.authentication.user.username,
          message: '',
          messageDate: Date.now()
      };
      $scope.showPillsChats = true;
       
      $scope.showHidePills = function() {
         $scope.showPillsChats = true;
         $scope.showPillsContacts = false;
      };    
       $scope.showHidePills2 = function() {
         $scope.showPillsChats = false;
         $scope.showPillsContacts = true;
      };   

      //minimize chat window 1
      $scope.chat1Display = true;
      $scope.minimChatbox = function() {
         // $scope.minimize = false;
         $scope.chat1Display = !$scope.chat1Display;
         if(!$scope.chat1Display){angular.element('#heightSettingChat1').css('height', '32px');}
         else {angular.element('#heightSettingChat1').css('height', '318px');}
      }; 
      //minimize chat window 2
      $scope.chat2Display = true;
      $scope.minimChatbox2 = function() {
         // $scope.minimize = false;
         $scope.chat2Display = !$scope.chat2Display;
         if(!$scope.chat2Display){angular.element('#heightSettingChat2').css('height', '14px');}
         else {angular.element('#heightSettingChat2').css('height', '340px');}
      }; 

      $scope.chat3Display = true;
      $scope.minimChatbox3 = function() {
         // $scope.minimize = false;
         $scope.chat3Display = !$scope.chat3Display;
         if(!$scope.chat3Display){angular.element('#heightSettingChat3').css('height', '14px');}
         else {angular.element('#heightSettingChat3').css('height', '340px');}
      }; 

      $scope.chat4Display = true;
      $scope.minimChatbox4 = function() {
         // $scope.minimize = false;
         $scope.chat4Display = !$scope.chat4Display;
         if(!$scope.chat4Display){angular.element('#heightSettingChat4').css('height', '14px');}
         else {angular.element('#heightSettingChat4').css('height', '340px');}
      };      

      // document.getElementById("p2").style.color = "blue";
      angular.element('#p1').css('color', 'blue');
      angular.element('#heightSettingDiv').css('height', '110px');
      angular.element('#heightSettingDiv').css('background-color', 'red');

      // show users for chat

      $scope.getAllProfiles = function () {
        $scope.profile = Profiles.query().$promise.then(function(data) {
          $scope.promiseResolved = true;
          $scope.profile = data;
          $scope.allProfiles = data;

         // start code for pagination
          var begin = (($scope.currentPage - 1) * $scope.numPerPage);
          var end = begin + $scope.numPerPage;
          $scope.filteredProfiles = $scope.profile.slice(begin, end);

          //end code for pagination
          $scope.profilesLength = $scope.profile.length;
        }, function(error) {
          // error handler
        });
      };
       //chatwindow setting

       // console.log($scope.authentication.user.username);
       $scope.currentUserData = Authentication.user;

       $scope.getUserInfo = function(){
        // integration code for chat box
        Conversation.find({
          filter: {
            where: {
              userOne: Authentication.user.username
            }
          }
        }, function (resp) {
          // console.log('getUserInfo::',resp);
          $scope.conversations = resp;
          angular.forEach($scope.conversations, function (conv, i) {
            /* { filter : { where :{ id : conv.uerTwo}}} */

            UserSchema.findOne({
              filter: {
                where: {
                  username: conv.userTwo
                },
                fields: ['displayName', 'username', 'email', 'profileImageURL', 'status']
              }
            }, function (cuser) {
              Object.assign(conv, cuser);
              // console.log(cuser);
            });
          });

        });
       };

       $scope.OpendChat = [];
       $scope.getConversation = function (conversationWithObj, email, _window) {
        // console.log('conversationWithObj', conversationWithObj);
         $scope.conversationWith = email;
         ChatMessages.find({
           filter: {
             where: {
              cid: conversationWithObj.cid
               // or: [{
               //   conversationWith: $scope.currentUserData.username,
               //   sender: email
               // }, {
               //   conversationWith: email,
               //   sender: $scope.currentUserData.username
               // }]
             }
           }
         }, function (resp) {
           $scope.OpendChat[_window - 2] = {
             email: $scope.conversationWith,
             cid: conversationWithObj.cid,
             messages: resp
           };
         });
       };

       $scope.sendMessage = function (cid, _message, _window, projLink) {
         if($scope.messages1 || $scope.messages2 || $scope.messages3){
          Socket.emit('NewChatMessage', {
            sender: $scope.currentUserData.username,
            conversationWith: $scope.conversationWith,
            message: _message,
            cid: cid,
            conversationProject: projLink
          });

          ChatMessages.create({
            'sender': Authentication.user.username,
            'message': _message,
            'conversationWith': $scope.conversationWith, 
            'conversationProject': projLink,
            'cid': cid
          }, function (resp) {
           $scope.OpendChat[_window].messages.push(resp);

           // Make the convo unseen on other end
           Conversation.msgSeen({
             cid: cid,
             userTwo: Authentication.user.username,
             seen: true
           });

           Conversation.msgSeen({
             cid: cid,
             userTwo: $scope.conversationWith,
             seen: false
           });

          });
          
          if(_window === 0){
              $scope.messages1 = '';
              $timeout(function() {
               var objDiv0 = document.getElementById("scrollBottom0");
               objDiv0.scrollTop = objDiv0.scrollHeight;
              }, 500);
           }
           else if(_window === 1){
              $scope.messages2 = '';
              $timeout(function() {
                var objDiv1 = document.getElementById("scrollBottom1");
                objDiv1.scrollTop = objDiv1.scrollHeight;
              }, 500);
           }
           else if(_window === 2){
              $scope.messages3 = '';
              $timeout(function() {
                var objDiv2 = document.getElementById("scrollBottom2");
               objDiv2.scrollTop = objDiv2.scrollHeight; 
              }, 500);
               
           }
         }
       };

       // Make sure the Socket is connected
       if (!Socket.socket) {
           Socket.connect();
       }
       Socket.on(Authentication.user.username + 'chatMessagee', function (message) {
        $rootScope.msgAlert = true; 
        $scope.sound = ngAudio.load("modules/chat/client/sound/msg.mp3");
        $scope.sound.play();

        // show redalert/notif       
        $timeout(function() {
          var objDiv0 = document.getElementById("scrollBottom0");
          objDiv0.scrollTop = objDiv0.scrollHeight;
          var objDiv1 = document.getElementById("scrollBottom1");
          objDiv1.scrollTop = objDiv1.scrollHeight;
          var objDiv2 = document.getElementById("scrollBottom2");
          objDiv2.scrollTop = objDiv2.scrollHeight;
        }, 10);    
             
        for (var i = 0; i < $scope.conversations.length; i++) {          
          if($scope.conversations[i].cid === message.cid){
            console.log('exists');          
            $scope.convoExists = true;         
            $scope.oneConversation = $scope.conversations[i];
            $rootScope.openChat2Window($scope.oneConversation, message.cid, message.sender);         
          }       
        } 

        //push in message header       
        if(!$scope.convoExists){
          console.log('not exists');
          Conversation.findOne({       
            filter :{     
              where :{       
                cid: message.cid     
              }  
            }          
          }, function(con){
            $scope.oneConversation = con;
            $scope.conversations.push(con);       
          });

          $timeout(function() {
            $rootScope.openChat2Window($scope.oneConversation, message.cid, message.sender);
          }, 1000);   
        }

        angular.forEach($scope.conversations, function (conv, i) {
         // changes the status of new message and check if the chat is open
         if (message.sender === conv.userTwo && $scope.conversationWith !== $scope.currentUserData.username) {
           conv.hasUnreadMessages = true;
         }
        });

        angular.forEach($scope.OpendChat, function(_chatWindowMsgs, index){
        if(_chatWindowMsgs.cid === message.cid){
          $scope.OpendChat[index].messages.push(message);
        }
        });
        $scope.scrollBottom();
       });

       // integration code for chat box

       $scope.chatwindowclose = false;
       $scope.chatwindowMinimize = false;

       $scope.openChatWindow = function (_email) {
         $scope.chatwindowclose = true;

       };


       // Video Call
       $scope.makeVideoCall = function(_receiver){
           var myWindow = window.open($rootScope.messengerServerAddress+"/#!/messenger/"+_receiver+ "/"+ Authentication.user.username +"/", "", "width=100%");
       };

  }
]);
