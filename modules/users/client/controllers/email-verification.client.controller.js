'use strict';

angular.module('users').controller('EmailVerificationController', ['$scope', '$state', '$http', '$location', '$window', '$timeout', 'Authentication', 'UniversalData', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, $timeout, Authentication, UniversalData, PasswordValidator) 
  {

    $scope.authentication = Authentication;
    // for email verifcatin of user
    $scope.sendMail= function(){
      var data = ({
        contact_email : $scope.contact_email,
        contact_msg : 'Thank you ' + $scope.authentication.user.username + '!. Click here to verify your email address. http://localhost:3000/emailverify?' + $scope.authentication.user._id
      });

      //console.log(data); 


      $http({
        url: '/api/users/contactForm',
        method: 'POST' ,
        data: { 'message' : data }
      }).then(function(response) {
          // success
          //console.log('email success', response);
      },function(response){
          // failed
        // //console.log(response);
          // //console.log(data);
      });
    };  

    //to fetch logged in user id from url
    var userId = location.search;
    
    // //console.log($scope.authentication);
    // //console.log('from URL:' , userId);
    // //console.log('from DB:' , $scope.authentication.user._id);

    if (userId.includes('?') && $scope.authentication.user._id===userId.substr(1)) {
      alert('Hi ' + $scope.authentication.user.username + '! Your email is verified now.  ');
    }
    // else
      // alert("Verfication URL is incorrect, give correct email address and re-verify!")
  }
]);
