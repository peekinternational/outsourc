'use strict';

// Contest controller
angular.module('contests').controller('ContestsController', ['$scope', '$rootScope', 'Conversation', 'uuid2', '$uibModal', '$stateParams', '$location','$http', '$timeout', '$window', 'Authentication', 'Contests','geolocation', 'FileUploader', 'UniversalData', 'Account', 'Transactions', 'toastr', 'SweetAlert', 'usSpinnerService', 'Notifications', 'Notification', 'ProjectSchema', 'Projects', 'Excel', 'Socket','Categories', 'SubCategories', 'Skills',
  function ($scope, $rootScope, Conversation, uuid2, $uibModal, $stateParams, $location, $http, $timeout, $window, Authentication, Contests, geolocation, FileUploader, UniversalData, Account, Transactions, toastr, SweetAlert, usSpinnerService, Notifications, Notification, ProjectSchema, Projects, Excel, Socket, Categories, SubCategories, Skills) {
    $scope.authentication = Authentication;
    $scope.contest = {}; 
    $scope.rateList = [];

    $scope.deliverDays = 3;
    $scope.contestFee = 0;
    $scope.yourBid = 0;
    $scope.totalEntryAmount = 0;
    $scope.contest.sliderContestBudg = 1000;
    $scope.totalAmount = $scope.contest.sliderContestBudg;
  
    $scope.rate = 5;
    $scope.max = 5;
    $scope.isReadonly = true;
    $scope.percent = 100;
    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };
    $scope.ratingStates = [
      { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
      { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' },
      { stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle' },
      { stateOn: 'glyphicon-heart' },
      { stateOff: 'glyphicon-off' }
    ];



    // Currency rate is being hardcoded here instead of getting the latest rate
    // 1 USD = 1000 KRW
    $rootScope.latestCurrencyRate = { 'USD': 1, 'KRW': 1000 };
    $scope.getLatestRate = function(){

      // Currency rate is being hardcoded here instead of getting the latest rate
      // 1 USD = 1000 KRW
      $rootScope.latestCurrencyRate = { 'USD': 1, 'KRW': 1000 };
    };
    // get first pagination page data 
    $timeout(function() {
      usSpinnerService.spin('contLoader');
    }, 100);
    $http({
        method: 'GET',
        url: '/contestRecord/'+5+'/'+1
      }).then(function successCallback(response) {
          $scope.filteredContests = response.data;
          $timeout(function() {
            usSpinnerService.stop('contLoader');
          }, 50);
        }, function errorCallback(response) {
          alert('error in contest.client.controller.js line no 65')
        });
    
    // count All contest to make pagination 
    $http({
        method: 'GET',
        url: '/countContestRecord'
      }).then(function successCallback(response) {
          $scope.contestsLength = response.data;
          
        }, function errorCallback(response) {
          alert('error in contest.client.controller.js line no 53')
        });
    
    // get per page contest data dynamic on change in pagination
    $scope.perpage = 5;
    $scope.getpagedata = function(){
      
      if($scope.searchContest){
       
        console.log($scope.oldcontest);
        var start = ($scope.currentPage - 1) * $scope.perpage;
        var end = $scope.currentPage * $scope.perpage;
        console.log(start);
        console.log(end);
        $scope.filteredContests = $scope.oldcontest.slice(start,end);
        console.log($scope.filteredContests);
      }else{
        $http({
        method: 'GET',
        url: '/contestRecord/'+$scope.perpage+'/'+$scope.currentPage
      }).then(function successCallback(response) {
          $scope.filteredContests = response.data;
          
        }, function errorCallback(response) {
          alert('error in contest.client.controller.js line no 65')
        });
      }
      
    }
    // create new option for contest skills dropdown 
    $scope.createFunction = function (input) {
      // format the option and return it
      var name = {
        description:input,
        name:input,
        id:""
      }
      return name;
    };
    $scope.remoteConfig = {
      url: "/api/searchSkills",
      cache: true,
      transformResponse: function (data) {
        var skills = angular.fromJson(data);
        return skills
        
      }
    };
    // Add an event listener to the comment on entry
    Socket.on($stateParams.contestId+'contestComment', function (message) {
      if($scope.thisContest){
        if(message.text.userId !== Authentication.user._id){
          $scope.thisContest.comments.unshift(message.text);
          Notification.warning({
            message: message.text.userName+' 회원님께서 콘테스트 공개포럼에 등록하셨습니다.', 
            positionY: 'bottom', 
            positionX: 'right', 
            closeOnClick: true, 
            title: '<i class="glyphicon glyphicon-comment"></i>콘테스트 공개포럼',
            maxCount:6
          });
        }
      }
    }); 

    // Add an event listener to upload entry against contest
    Socket.on(Authentication.user.username+'contestEntry', function (message) {
      if($scope.thisContest){
        $scope.thisContest.entries.unshift(message.text);
      }
    });

    // Editable contest info
    $scope.deleteContest = function(value){
      SweetAlert.swal({
        title: '콘테스트 삭제를 원하시나요?',
        text:'삭제시 복원이 불가능하며 상금은 환불되지 않습니다.\n이용약관[27조 6항]을 참조하시길 바랍니다.',
        type:'warning',
        showCancelButton: true,
        confirmButtonColor: "#419641",
        confirmButtonText: "삭제",
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm){
        if(isConfirm){
          SweetAlert.close();
          $scope.isLoading = true;
          var contest = new Contests($scope.thisContest);
          contest.$remove();
          $location.path('/projects/my-project');
        }else{
          SweetAlert.close();
        }
      });
    };

    $scope.editContest = function(value){
      $scope.copy = angular.copy($scope.thisContest);
      $scope.editName = true;
      $scope.editDesc = true;
      $scope.upgrade = false;
    };

    $scope.cancelEdit = function(value){
      $scope.thisContest = $scope.copy;
      $scope.editName = false;
      $scope.editDesc = false;
    };

    $scope.upgradeContest = function(){
      $scope.copyy = angular.copy($scope.thisContest);
      console.log(' $scope.thisContest ',$scope.thisContest);
      $scope.upgradeTotal=$scope.thisContest.sliderContestBudg;
    };

    $scope.cancelUpgrade = function(){
      $scope.thisContest = $scope.copyy;
      $scope.upgradeTotal = 0;
    
      $scope.upgrade = false;
      $scope.editName = false;
      $scope.editDesc = false;
    };

    // Update Contests
    $scope.updateContest = function(value){
      $scope.isLoading = true;
      $scope.editName = false;
      $scope.editDesc = false;
      $scope.upgrade = false;

      if($scope.upgradeTotal>0){
        SweetAlert.swal({
          title: '콘테스트 업그레이드 하시겠습니까?',
          text:'회원님께서는 아웃소싱오케이 서비스를 구매하셨습니다. 금액은 ' + "₩" +$scope.thisContest.currency.code + $scope.upgradeTotal+' 원 입니다. 회원님께서 승인 할 경우 회원님 계좌에있는 예치금에서 자동인출됩니다. 예치금이 부족할 경우 [서비스 이용료 결제]에서 지불하시길 바랍니다.',
          type:'warning',
          showCancelButton: true,
          confirmButtonColor: "#008000",
          confirmButtonText: "업그레이드",
          closeOnConfirm: false,
          closeOnCancel: false
        }, function(isConfirm){
          if(isConfirm){
            SweetAlert.close();
            // Check for enough amount
            if($rootScope.userAccountBalance.accountBalance[$scope.thisContest.currency.code] >= $scope.upgradeTotal){
              
              // Transaction
              Transactions.transfer({
                Sid : $rootScope.userAccountBalance.id,
                Rid : $rootScope.adminEWalletId,
                amount : parseFloat($scope.upgradeTotal),
                currency: $scope.thisContest.currency.code,
                description:{
                  'detail':'You upgraded the contest by selecting additionl features. <a href="contests/view/'+$scope.thisContest._id+'">'+$scope.thisContest.name+'</a>',
                  'tax':0
                }
              }, function(suc){
                $http({
                  url: '/api/contests/update/'+$stateParams.contestId,
                  method: 'PUT',
                  data: $scope.thisContest
                }).then( function(suc){

                  //Create service transaction
                  Transactions.create({
                    accountId: $rootScope.userAccountBalance.id,
                    transectionType: 'service',
                    transectionFrom: $rootScope.userAccountBalance.ownerId,
                    referenceId: $scope.thisContest._id,
                    currency: $scope.thisContest.currency.code,
                    amount: parseFloat($scope.upgradeTotal),
                    description:{
                      'detail': 'Contest Upgraded'
                    },
                    transactionDate: Date.now()
                  });

                  SweetAlert.swal('업그레이드 완료!', '본 콘테스트가 업그레이드 됐습니다.', 'success');
                  $rootScope.userAccountBalance.accountBalance[$scope.thisContest.currency.code] = $rootScope.userAccountBalance.accountBalance[$scope.thisContest.currency.code]-$scope.upgradeTotal;
                  $scope.isLoading = false;
                  $scope.thisContest = suc.data;
                }, function (fail) {
                  $scope.isLoading = false;
                  toastr.error('오류', '죄송합니다. 업그레이드하는 동안 문제가 발생했습니다. 다시 시도하십시오.');
                  //Reverse transaction
                  Transactions.transfer({
                    Sid: $rootScope.adminEWalletId,
                    Rid: $rootScope.userAccountBalance.id,
                    amount: $scope.upgradeTotal,
                    currency: $scope.thisContest.currency.code,
                    description:{
                      'detail':'Upgrading the contest and selecting additionl features failed. <a href="contests/view/'+$scope.thisContest._id+'">'+$scope.thisContest.name+'</a>',
                      'tax':0
                    }
                  });

                });
              }, function(fail){
                $scope.isLoading = false;
                SweetAlert.swal('죄송합니다', '문제가 발생했습니다. 다시 시도하십시오.', 'warning');
              });

            }
            else if($rootScope.userAccountBalance.accountBalance[$scope.thisContest.currency.code] < $scope.upgradeTotal){

              var convertedAmount = 0;
              if($scope.thisContest.currency.code === 'USD'){
                console.log('usd');
                convertedAmount = $rootScope.userAccountBalance.accountBalance.USD +  ($rootScope.userAccountBalance.accountBalance.KRW/$rootScope.latestCurrencyRate.KRW);
              }else if($scope.thisContest.currency.code === 'KRW'){
                console.log('krw');
                convertedAmount =  $rootScope.userAccountBalance.accountBalance.KRW + ($rootScope.userAccountBalance.accountBalance.USD*$rootScope.latestCurrencyRate.KRW);
              }

              if(convertedAmount>= $scope.upgradeTotal){
                // updateAccount
                Account.updateAccount({
                  ownerId: Authentication.user.username,
                  currency: $scope.thisContest.currency.code,
                  amount: convertedAmount
                }, function(suc){
                  Account.findOne({
                    filter: {
                      where: {
                        ownerId: $scope.authentication.user.username
                      }
                    }
                  }, function (res) {
                    $rootScope.userAccountBalance = res;
                    // upgrade contest
                    Transactions.transfer({
                      Sid : $rootScope.userAccountBalance.id,
                      Rid : $rootScope.adminEWalletId,
                      amount : parseFloat($scope.upgradeTotal),
                      currency: $scope.thisContest.currency.code,
                      description:{
                        'detail':'You upgraded the contest by selecting additionl features. <a href="contests/view/'+$scope.thisContest._id+'">'+$scope.thisContest.name+'</a>',
                        'tax':0
                      }
                    }, function(suc){
                      $http({
                        url: '/api/contests/update/'+$stateParams.contestId,
                        method: 'PUT',
                        data: $scope.thisContest
                      }).then( function(suc){

                        //Create service transaction
                        Transactions.create({
                          accountId: $rootScope.userAccountBalance.id,
                          transectionType: 'service',
                          transectionFrom: $rootScope.userAccountBalance.ownerId,
                          referenceId: $scope.thisContest._id,
                          currency: $scope.thisContest.currency.code,
                          amount: parseFloat($scope.upgradeTotal),
                          description:{
                            'detail': 'Contest Upgraded'
                          },
                          transactionDate: Date.now()
                        });
                        SweetAlert.swal('업그레이드 완료!', '본 콘테스트가 업그레이드 됐습니다.', 'success');
                        $rootScope.userAccountBalance.accountBalance[$scope.thisContest.currency.code] = $rootScope.userAccountBalance.accountBalance[$scope.thisContest.currency.code]-$scope.upgradeTotal;
                        $scope.isLoading = false;
                        $scope.thisContest = suc.data;
                      }, function (fail) {
                        $scope.isLoading = false;
                        toastr.error('오류', '문제가 발생했습니다. 다시 시도하십시오.');
                        //Reverse transaction
                        Transactions.transfer({
                          Sid: $rootScope.adminEWalletId,
                          Rid: $rootScope.userAccountBalance.id,
                          amount: $scope.upgradeTotal,
                          currency: $scope.thisContest.currency.code,
                          description:{
                            'detail':'Upgrading the contest and selecting additionl features failed. <a href="contests/view/'+$scope.thisContest._id+'">'+$scope.thisContest.name+'</a>',
                            'tax':0
                          }
                        });

                      });
                    }, function(fail){
                      $scope.isLoading = false;
                      SweetAlert.swal('죄송합니다', '문제가 발생했습니다. 다시 시도하십시오.', 'warning');
                    });
                    
                  });

                }, function(fail){
                  $scope.isLoading = false;
                  SweetAlert.swal('다시 시도하십시오.!', '', 'warning');
                });
              }else{
                $scope.isLoading = false;
                SweetAlert.swal("예치금 잔액부족", "콘테스트 업그레이드를 위해 예치금이 부족합니다. 예치금 결제 후 다시 시도하십시오.", "error");
                $location.path('credit-deposit');
              }
            }

          }else{
            $scope.isLoading = false;
            SweetAlert.close();
          }
        });
      }else{
        $http({
          url: '/api/contests/update/'+$stateParams.contestId,
          method: 'PUT',
          data: $scope.thisContest
        }).then( function(suc){
          $scope.isLoading = false;
          $scope.thisContest = suc.data;
          SweetAlert.swal('수정 완료', '', 'success');
          
        }, function (fail) {
          $scope.isLoading = false;
          toastr.error('수정 오류', '문제가 발생했습니다.');
        });
      }
    };

    

    //chat based on contest
    $scope.createConversationBasedOnContest = function (contest, bool, contestId, contestName, entry) {
      // Find the existing convo
      Conversation.findOne({
        filter:{
          where:{
            and:[
              {
                projectTitle: contestName +' '+ entry.entryName,
                userTwo: entry.entryPersonUsername
              }
            ]
          }
        }
      }, function(suc){
          $location.path('chat/inbox/'+suc.id);
      }, function(err){
        // When Freelancer starts convo
        
          Conversation.create({
            "userOne": Authentication.user.username,
            "userTwo": entry.entryPersonUsername,
            "projectTitle": contestName +' '+ entry.entryName,
            "projectLink": contestId,
            "projectId": contestId,
            "isAwarded": bool,
            "cid": uuid2.newuuid(),
            "hasUnreadMessages": true
          }, function(_resp){
        
            $rootScope.convToOpen = _resp;
            $rootScope.convToOpenFromProjects = 1;
        
            Conversation.findOne({
              filter:{
                where:{
                  and:[
                    {
                      projectTitle: contestName +' '+ entry.entryName,
                      userTwo: entry.entryPersonUsername
                    }
                  ]
                }
              }
            }, function(suc){
                 $location.path('chat/inbox/'+suc.id);
            });
          }, function(err){
            
            toastr.error("죄송합니다, 문제가 발생했습니다.");
          });
      });
    };

    // Get categories/sucat and skills
    var getCatSubcat = function(){
      /*Skills.find({}, function(res){
        $scope.allProjectSkills = res;
      });*/
      $http.get("/api/getskills").then(function(response) {
        $scope.allProjectSkills = response.data;
      });

      Categories.find({}, function(res){
        $scope.categories = res;
      });

      SubCategories.find({}, function(res){
        $scope.subCategories = res;
      });
    };
    getCatSubcat();
    
    // On Change of Cateogries
    $scope.selectCat = function(){
      
      $scope.subCat = [];
      $timeout(function() {
        if(!$scope.contest.workRequire){
          $scope.contest.workRequire = '';
          $scope.contest.skills = '';
          return;
        }
        $scope.subCategories.forEach(function(value1, key1){
          $scope.contest.workRequire.subCategories.forEach(function(value2, key2){
            if( angular.equals(value1.id, value2)){
              $scope.subCat.push(value1);
            }
          });
        });

      }, 10);
    };

    // On change of subcategories
    $scope.selectSubCat = function(){
      
      $scope.projSkills = [];
      $timeout(function() {
        if(!$scope.contest.subcat){
          $scope.contest.subcat = '';
          $scope.contest.skills = '';
          return;
        }

        if(!$scope.contest.subcat.skills)
          return; 

        $scope.allProjectSkills.forEach(function(value1, key1){
          $scope.contest.subcat.skills.forEach(function(value2, key2){
            if( angular.equals(value1.id, value2)){
              $scope.projSkills.push(value1);
            }
          });
        });

        $scope.contest.skills = $scope.projSkills;

      }, 10);
    };
    
    
    $scope.contest.isLocal = false;
    $scope.priceList = [{
      id: 1,
      price: '$250 - $750'
    }, {
      id: 2,
      price: 'Custom price'
    }];

    $scope.pakagePrices = {
      'pakage_1' : 0, //video and chat
      'pakage_2' : 0, //video
      'pakage_3' : 0, //chat
      'pakage_4' : 0, //private
      'pakage_5' : 1, //sealed
      'pakage_6' : 1, //NDA
      'pakage_7' : 1, //urgent
      'gaurantee' : 0 //gaurantee
    };

    // Calculate total sum of contest total budget and additional features
    $scope.$watch('contest.sliderContestBudg', function (newBudg, oldBudg) {
      $timeout(function() {}, 10);

      if(newBudg > 100000000){
        $scope.pakage_1 = false;
        $scope.pakage_2 = false;
        $scope.pakage_3 = false;
        $scope.pakage_4 = false;
        $scope.pakage_5 = false;
        $scope.pakage_6 = false;
        $scope.pakage_7 = false;
        $scope.gaurantee = false;
        
        $scope.contest.sliderContestBudg = 0;
        newBudg = 0;
        oldBudg = 0;
        $scope.totalAmount = 0;
        $scope.totalTax = 0;
      }

      if(isNaN(newBudg) || isNaN(oldBudg)){

        $scope.pakage_1 = false;
        $scope.pakage_2 = false;
        $scope.pakage_3 = false;
        $scope.pakage_4 = false;
        $scope.pakage_5 = false;
        $scope.pakage_6 = false;
        $scope.pakage_7 = false;
        $scope.gaurantee = false;
        
        $scope.contest.sliderContestBudg = 0;
        newBudg = 0;
        oldBudg = 0;
        $scope.totalAmount = 0;
        $scope.totalTax = 0;

      }else{
        $scope.totalAmount = $scope.totalAmount-oldBudg;
        $scope.totalAmount = $scope.totalAmount+newBudg;
      }

    });


    $scope.checkLocal = function () {
      $scope.contest.isLocal = !$scope.contest.isLocal;
    };

    // Toggle custom profile fields
    $scope.toggleCustomPrice = function () {
      //console.log('in');
    };

    $scope.rateToFixed = function () {
      $scope.rateList = $scope.fixedRate;
    };
    $scope.rateToHourly = function () {
      $scope.rateList = $scope.hourlyRate;
    };

    // to hide button, bid on this contest
    $scope.btnBTP = function(){
      $scope.btnBidThisPro = true;
    };

    $scope.checktotalAmount = function (value,pakage_name) {
      if(pakage_name === 'pakage_1') {  
        if(value){
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.pakage_1*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);
          if($scope.pakage_2===true) {
            $scope.pakage_2 = false;
            $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_2*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);
          }
          if($scope.pakage_3===true) {
            $scope.pakage_3 = false;
            $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_3*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);
          }
        }
        else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_1*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);
        }
      }
      
      else if(pakage_name === 'pakage_2' && $scope.pakage_1 === false) {  
        if(value){
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.pakage_2*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);   
        }
        else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_2*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);
        }
        
      }
      else if(pakage_name === 'pakage_3' && $scope.pakage_1 === false) {  
        if(value){
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.pakage_3*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);   
        }
        else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_3*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);
        }
        
      }
      else if(pakage_name === 'pakage_4') {  
        if(value){
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.pakage_4*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);   
        }
        else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_4*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);
        }
        
      }
      else if(pakage_name === 'pakage_5') {  
        if(value){
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.pakage_5*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);   
        }
        else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_5*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);
        }
        
      }
      else if(pakage_name === 'pakage_6') {  
        if(value){
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.pakage_6*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);   
        }
        else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_6*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);
        }
        
      }
      else if(pakage_name === 'pakage_7') {  
        if(value){
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.pakage_7*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);   
        }
        else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_7*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);
        }
        
      }
      else if(pakage_name === 'gaurantee') {  
        if(value){
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.gaurantee*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);
        }
        else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.gaurantee*$rootScope.latestCurrencyRate[$scope.contest.currency.code]);
        }
        // $scope.$apply();
      }
    };

    $scope.upgradeTotal = 0;
    $scope.calculateUpgradeAmount = function (value,pakage_name) {
      $scope.upgradeTotal=parseInt($scope.upgradeTotal);
      if(pakage_name === 'pakage_1') {  
        if(value){
          $scope.upgradeTotal = $scope.upgradeTotal + ($scope.pakagePrices.pakage_1*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);
          if($scope.pakage_2===true) {
            $scope.pakage_2 = false;
            $scope.upgradeTotal = $scope.upgradeTotal - ($scope.pakagePrices.pakage_2*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);
          }
          if($scope.pakage_3===true) {
            $scope.pakage_3 = false;
            $scope.upgradeTotal = $scope.upgradeTotal - ($scope.pakagePrices.pakage_3*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);
          }
        }
        else {
          $scope.upgradeTotal = $scope.upgradeTotal - ($scope.pakagePrices.pakage_1*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);
        }
      }
      else if(pakage_name === 'pakage_2' && $scope.pakage_1 === false) {  
        if(value){
          $scope.upgradeTotal = $scope.upgradeTotal + ($scope.pakagePrices.pakage_2*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);   
        }
        else {
          $scope.upgradeTotal = $scope.upgradeTotal - ($scope.pakagePrices.pakage_2*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);
        }
        
      }
      else if(pakage_name === 'pakage_3' && $scope.pakage_1 === false) {  
        if(value){
          $scope.upgradeTotal = $scope.upgradeTotal + ($scope.pakagePrices.pakage_3*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);   
        }
        else {
          $scope.upgradeTotal = $scope.upgradeTotal - ($scope.pakagePrices.pakage_3*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);
        }
        
      }
      else if(pakage_name === 'pakage_4') {  
        if(value){
          $scope.upgradeTotal = $scope.upgradeTotal + ($scope.pakagePrices.pakage_4*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);   
        }
        else {
          $scope.upgradeTotal = $scope.upgradeTotal - ($scope.pakagePrices.pakage_4*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);
        }
        
      }
      else if(pakage_name === 'pakage_5') {  
        if(value){
          $scope.upgradeTotal = $scope.upgradeTotal + ($scope.pakagePrices.pakage_5*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);   
        }
        else {
          $scope.upgradeTotal = $scope.upgradeTotal - ($scope.pakagePrices.pakage_5*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);
        }
        
      }
      else if(pakage_name === 'pakage_6') {  
        
        if(value){
          $scope.upgradeTotal = $scope.upgradeTotal + ($scope.pakagePrices.pakage_6*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);   
        }
        else {
          $scope.upgradeTotal = $scope.upgradeTotal - ($scope.pakagePrices.pakage_6*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);
        }
      }
      else if(pakage_name === 'pakage_7') {  
        if(value){
          $scope.upgradeTotal = $scope.upgradeTotal + ($scope.pakagePrices.pakage_7*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);   
        }
        else {
          $scope.upgradeTotal = $scope.upgradeTotal - ($scope.pakagePrices.pakage_7*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);
        }
        
      }
      else if(pakage_name === 'gaurantee') {  
        if(value){
          $scope.upgradeTotal = $scope.upgradeTotal + ($scope.pakagePrices.gaurantee*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);
        }
        else {
          $scope.upgradeTotal = $scope.upgradeTotal - ($scope.pakagePrices.gaurantee*$rootScope.latestCurrencyRate[$scope.thisContest.currency.code]);
        }
        
      }
    };

    $scope.detectMyLocation = function () {
      geolocation.getLocation().then(function(data){
        $scope.coords = { lat:data.coords.latitude, long:data.coords.longitude };
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.coords.lat + ',' + $scope.coords.long + '&sensor=true';
        $http.get(url)
        .then(function(result) {

          if(result.data.results[0]){
            var address = result.data.results[0].formatted_address;
            $scope.contest.location = address;
          }else{
            Notification.error({
              message: '위치를 알수가 없습니다.다시 하십시오.', 
              positionY: 'bottom', 
              positionX: 'right', 
              closeOnClick: true, 
              title: '<i class="glyphicon glyphicon-remove"></i> 위치 오류'
            });
          }
            
        });
      });

    };

    // File Uploader
    $scope.uploader = new FileUploader({
      url: 'api/contest/contestFile',
      alias: 'newContestFile'
    });

    $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      // console.info('onWhenAddingFileFailed', item, filter, options);
     };
    $scope.uploader.onAfterAddingAll = function(addedFileItems) {
      // console.info('onAfterAddingAll', addedFileItems);
    };
    $scope.uploader.onBeforeUploadItem = function(item) {
      // console.info('onBeforeUploadItem', item);
    };
    $scope.uploader.onProgressItem = function(fileItem, progress) {
      // console.info('onProgressItem', fileItem, progress);
    };
    $scope.uploader.onProgressAll = function(progress) {
      // console.info('onProgressAll', progress);
    };
    $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
      $scope.contestFileLink = response;
      $scope.contestFileName = fileItem.file.name;

      $scope.sucMsg = '파일이 성공적으로 업로드 되었습니다.';//File successfully uploaded
      $scope.errMsg = '';
    };
    $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
      $scope.errMsg = response.message;
      $scope.sucMsg = '';
      SweetAlert.swal("파일 업로드 실패", "파일 업로드 오류, 파일 크기 확인 오류.", "error");
    };
    $scope.uploader.onCancelItem = function(fileItem, response, status, headers) {
      // console.info('onCancelItem', fileItem, response, status, headers);
    };
    $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
      // console.info('onCompleteItem', fileItem, response, status, headers);
      if(fileItem.progress === 0){
        $scope.errMsg = response.message;
        $scope.sucMsg = '';
      }
      else{
        $scope.sucMsg = '파일이 성공적으로 업로드 되었습니다.';
        $scope.errMsg = '';
      }
    };
    // $scope.uploader.onCompleteAll = function() {
    //   console.info('onCompleteAll');
    // };

    $scope.uploader.onAfterAddingFile = function (fileItem) {
      $timeout(function() {
        usSpinnerService.spin('fileUpload');
      }, 50);

      $scope.item = fileItem;

      if(fileItem.file.size > (10*1024*1024)){
        // stop spinner
        $timeout(function() {
          usSpinnerService.stop('fileUpload');
        }, 50); 

        //remove it from queue
        const index = ($scope.uploader.queue.length)-1;
        if(index >= 0){
          $scope.uploader.queue.splice(index, 1);
        }

        $scope.item = ''; 
        $scope.errMsg = '';
        $scope.sucMsg = '';           
        SweetAlert.swal('파일 크기가 크고 최대 크기 (10MB)', '', 'warning');
        return;
      }


      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);
        var extension = fileItem.file.name.split('.').pop().toLowerCase();
        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
            $scope.isImageUploaded = true;
          }, 0);

          // stop spinner
          $timeout(function() {
            usSpinnerService.stop('fileUpload');
          }, 50);
        };
      }
    };


    // Create new Contest
    $scope.create = function (isValid) {

      if(!$rootScope.latestCurrencyRate){
        $timeout(function() {
          $scope.getLatestRate();
        }, 100);
      }

      $scope.error = null; 
      var contest = $scope.contest;

      var Pakages = {
        'pakage_1' : $scope.pakage_1,
        'pakage_2' : $scope.pakage_2,
        'pakage_3' : $scope.pakage_3,
        'private' : $scope.pakage_4,
        'sealed' : $scope.pakage_5,
        'nda' : $scope.pakage_6,
        'urgent' : $scope.pakage_7,
        'gaurantee' : $scope.gaurantee
      };
      contest.additionalPakages = Pakages;
      contest.userInfo = $scope.authentication.user;
      $scope.amountDeducted = 0;
      
      if($scope.totalAmount> 0 ||  $scope.contest.sliderContestBudg>0){

        $scope.totalAmount = parseFloat($scope.totalAmount).toFixed(0);
        // Cofirmation from user
        // if($scope.totalAmount>0){
        //   $scope.amountDeducted = parseInt($scope.totalAmount) + parseInt($scope.contest.sliderContestBudg);
        // }
        // else
        //   $scope.amountDeducted = parseInt($scope.contest.sliderContestBudg);

        SweetAlert.swal({
          title: "콘테스트 등록을 하시겠습니까?",
          text: "회원님께서는 아웃소싱오케이 서비스와 콘테스트 개최를 위한 상금을 지원했습니다. 지원 총금액은 " + $scope.contest.currency.code+  $scope.totalAmount + " 원 입니다. 회원님께서 승인 할 경우 회원님계좌에 있는 예치금에서 자동인출됩니다. 예치금이 부족할 경우 [서비스 이용료 결제]에서 지불하시길 바랍니다.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d0a620",
          confirmButtonText: "등록하기",
          closeOnConfirm: false,
          closeOnCancel: false
        }, 
        function(isConfirm){
            if(isConfirm){
                // When user confirms, 
                if ($rootScope.userAccountBalance.accountBalance[contest.currency.code] >= $scope.totalAmount){
                  $scope.amountToTransfer = parseFloat($scope.totalAmount) + parseFloat($scope.contest.sliderContestBudg);
                  $scope.postContest();
                  $scope.isLoading = true;
                }else if($rootScope.userAccountBalance.accountBalance[contest.currency.code] < $scope.totalAmount){
                  $scope.isLoading = true;

                  var convertedAmount = 0;
                  if(contest.currency.code === 'USD'){
                    convertedAmount = $rootScope.userAccountBalance.accountBalance.USD +  ($rootScope.userAccountBalance.accountBalance.KRW/$rootScope.latestCurrencyRate.KRW);
                  }else if(contest.currency.code === 'KRW'){
                    convertedAmount =  $rootScope.userAccountBalance.accountBalance.KRW + ($rootScope.userAccountBalance.accountBalance.USD*$rootScope.latestCurrencyRate.KRW);
                  }

                  if(convertedAmount>= $scope.totalAmount){
                    // updateAccount
                    Account.updateAccount({
                      ownerId: Authentication.user.username,
                      currency: contest.currency.code,
                      amount: convertedAmount
                    }, function(suc){
                      Account.findOne({
                        filter: {
                          where: {
                            ownerId: $scope.authentication.user.username
                          }
                        }
                      }, function (res) {
                        $rootScope.userAccountBalance = res;
                        // post project
                        $scope.postContest();
                      });

                    }, function(fail){
                      $scope.isLoading = false;
                      SweetAlert.swal('다시 시도하십시오!', '', 'warning');
                    });
                  }else{
                    $scope.isLoading = false;
                    SweetAlert.swal("예치금 잔액부족", "콘테스트 개최를 위해 예치금이 부족합니다. 결제 후 다시 시도하십시오.", "error");
                    $location.path('credit-deposit');
                  }
                }
            } else {
              $scope.isLoading = false;
              SweetAlert.close();
            }
        });
      }

    };

    $scope.postContest = function(){ 
      var contest = $scope.contest;

      var Pakages = {
        'pakage_1' : $scope.pakage_1,
        'pakage_2' : $scope.pakage_2,
        'pakage_3' : $scope.pakage_3,
        'private' : $scope.pakage_4,
        'sealed' : $scope.pakage_5,
        'nda' : $scope.pakage_6,
        'urgent' : $scope.pakage_7,
        'gaurantee' : $scope.gaurantee
      };

      Transactions.transfer({
        Sid : $rootScope.userAccountBalance.id,
        Rid : $rootScope.adminEWalletId,
        amount : parseFloat($scope.totalAmount),
        currency : $scope.contest.currency.code,
        description:{
          'detail':'<b>'+$scope.contest.name+'</b>콘테스트 상금 에스크로 자금 인출',
          'tax':0
        }
      }, function(res){
        Account.findOne({ 
          filter: {
            where: {
              ownerId: $scope.authentication.user.username
            }
          }
        }, function(res){
          $rootScope.userAccountBalance = res;

          if($scope.uploader.queue.length) {
            $scope.imageName = $scope.uploader.queue[0].upload();
          } 
          // $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            // Show success message
            $scope.isLoading = true;
            $scope.success = true;
            // var contest = $scope.contest;
            $scope.contest.additionalPakages = Pakages;
            $scope.contest.userInfo = $scope.authentication.user;
            
            $scope.contest.fileLink = $scope.contestFileLink;
            $scope.contest.fileName = $scope.contestFileName;

            // contest.fileLink = response;
            // contest.fileName = fileItem.file.name;

            delete $scope.contest.$promise;
            delete $scope.contest.$resolved;
            delete $scope.contest.userInfo.newsFeed;
            delete $scope.contest.userInfo.myProjects;
            delete $scope.contest.userInfo.myContests;
            delete $scope.contest.userInfo.projectsAwarded;
            delete $scope.contest.userInfo.contestsAwarded;

            return $http({
               url: '/api/contest/create',
               method: 'POST',
               data: $scope.contest
             }).then(function (response) {
            // contest.$save(function (response) {

              // If additional services are being selected
              if(parseFloat($scope.totalAmount)>response.data.sliderContestBudg){
                //Create service transaction
                Transactions.create({
                  accountId: $rootScope.userAccountBalance.id,
                  transectionType: 'service',
                  transectionFrom: $rootScope.userAccountBalance.ownerId,
                  referenceId: response.data._id,
                  currency: response.data.currency.code,
                  amount: parseFloat($scope.totalAmount)-response.data.sliderContestBudg,
                  description:{
                    'detail': '추가 업그레이드 에스크로 자금 인출'
                  },
                  transactionDate: Date.now()
                });
              }

              $scope.isLoading = false;
              SweetAlert.swal("등록완료!", "콘테스트가 등록 되었습니다.", "success");
              // $location.path('contests/view/' + response._id);
              $location.path('contests/view/' + response.data._id);
            }, function (errorResponse) {

              $scope.isLoading = false;
              SweetAlert.swal("Oops", "죄송합니다. 콘테스트 등록이 실패했습니다. 다시 한번 등록 하시길 바랍니다.", "error");
              Transactions.transfer({
                Sid : $rootScope.adminEWalletId,
                Rid : $rootScope.userAccountBalance.id,
                amount : parseFloat($scope.totalAmount),
                currency : $scope.contest.currency.code,
                description:{
                  'detail':'<b>'+$scope.contest.name+'</b> 콘테스트 등록 실패',
                  'tax':0
                }
              }, function(res){
                Account.findOne({ 
                  filter: {
                    where: {
                      ownerId: $scope.authentication.user.username
                    }
                  }
                }, function(res){
                  $rootScope.userAccountBalance = res;
                });
              });
              $scope.error = errorResponse.data.message;
            });
          
        }, function(err){
          SweetAlert.swal("콘테스트 오류", "죄송합니다! 문제가 발생했습니다.다시 시도하십시오!", "error");
          $scope.isLoading = false;
        });

      }, function(err){
        SweetAlert.warning("예치금 오류", "죄송합니다! 예치금 차감하는 동안 문제가 발생했습니다. 다시 시도하십시오!", "error");
        $scope.isLoading = false;
      });
      return;
    };

    

    $scope.submitBid = function () {

      var bidData = {
        'userId' : $scope.authentication.user._id,
        'bidderName' : $scope.authentication.user.displayName,
        'bidderImageURl': $scope.authentication.user.profileImageURL,
        'created' : Date.now(),
        'yourBid' : $scope.paidYours,
        'deliverInDays' : $scope.deliverDays
      };

      var obj = {
        'bids' : bidData
      };

      return $http({
        url: '/api/contest/placeBid/'+$scope.contest._id,
        method: 'PUT',
        data: obj
      }).then(function(response) {
        // success
        $scope.contest = response.data;
     
      },function(response){
        // failed
        //console.log(response);
      });

    };

    $scope.submitProposal = function () {
      for(var i =0; i< $scope.contest.bids.length;i++) {
        if($scope.authentication.user._id === $scope.contest.bids[i].userId) {
          $scope.bidIndex = i;
          break;
        }
      }

      var proposal = {
        'description' : $scope.description,
        'milestones' : $scope.milestones
      };

      $scope.contest.bids[$scope.bidIndex].proposal = proposal;

      var obj = {
        'data' : $scope.contest.bids[$scope.bidIndex],
        'index' : $scope.bidIndex
      };

      return $http({
        url: '/api/contest/submitProposal/'+$scope.contest._id,
        method: 'PUT',
        data: obj
      }).then(function(response) {
        // success

        $scope.contest = response.data;
        //console.log(response);
      },function(response){
          // failed
        //console.log(response);
      });
    };

    //contest is changed upto here

    // Remove existing Contest
    $scope.remove = function (contest) {
      if (contest) {
        contest.$remove();

        for (var i in $scope.contests) {
          if ($scope.contests[i] === contest) {
            $scope.contests.splice(i, 1);
          }
        }
      } else {
        $scope.contest.$remove(function () {
          $location.path('contests');
        });
      }
    };

    // Update existing Contest
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'contestForm');

        return false;
      }

      var contest = $scope.contest;

      contest.$update(function () {
        $location.path('contests/' + contest._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Contests
  /*  $scope.find = function () {
      $timeout(function() {
        usSpinnerService.spin('contLoader');
      }, 100);
      $scope.contest = Contests.query().$promise.then(function(data) {
        $scope.promiseResolved = true;
        $scope.contest = data;
        $scope.allContests = data;
        $scope.oldData = data;

        //start code for pagination
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.filteredContests = $scope.contest.slice(begin, end);
        //end code for pagination
        //$scope.contestsLength = $scope.contest.length;
        $timeout(function() {
          usSpinnerService.stop('contLoader');
        }, 50);

      }, function(error) {
        $timeout(function() {
        usSpinnerService.stop('contLoader');
      }, 100);
      });
 
    };*/


    // Post entry against contest
    
    $scope.isImageUploaded = false;

    $scope.submitEntry = function () {
      $timeout(function() {
        usSpinnerService.spin('submitEntyLoader');
      }, 100);
      $scope.currentContestId = $stateParams.contestId;

      // Select default contest price if entry price isn't mentioned
      var sellPrice;
      if($scope.contest.entrySellPrice>0){
        sellPrice = $scope.contest.entrySellPrice;
      }
      else
        sellPrice = $scope.thisContest.sliderContestBudg;

      //file uploader
      // var contest = new Contests($scope.contest);
      var contest = $scope.contest;

      if($scope.uploader.queue.length) {
        $scope.imageName = $scope.uploader.queue[0].upload();
      } 
      // //console.log('$scope.imageName',$scope.imageName);
      $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // Show success message
        $scope.success = true;
        contest.file = response;
        $scope.entFileO = contest.file;
        //console.log('$scope.contest.entrySellPrice', $scope.contest.entrySellPrice);
        //new 
        var entryData = {
          'entryPersonUserId' : $scope.authentication.user._id,
          'entryPersonProfId' : $scope.authentication.user.profile_id,
          'entryPersonProfImage' : $scope.authentication.user.profileImageURL,
          'entryPersonUsername' : $scope.authentication.user.username,
          'entryPersonEmail' : $scope.authentication.user.email,
          'entryPersonCountry': $scope.authentication.user.country,
          'created' : Date.now(),
          'entryName' : $scope.contest.entryName,
          'entryDescription' : $scope.contest.entryDescription, 
          'entrySellPrice' : sellPrice,
          'highlight' : $scope.contest.entry_pakage_1,
          'sealed' : $scope.contest.entry_pakage_2,
          'additionalCharges' : $scope.totalEntryAmount,
          'currentContestId' : $scope.currentContestId,
          'youWinner' : 'no',
          'entryFile' : $scope.entFileO
        };



        var obj = {
          'entries' : entryData
        };

        return $http({
          url: '/api/contests/placeEntry/'+$scope.currentContestId,
          method: 'PUT',
          data: obj
        }).then(function(response) {
          // success
          $scope.contest = response.data;
          $scope.totalEntryAmount = 0;
          
          $timeout(function() {
            usSpinnerService.stop('submitEntyLoader');
          }, 50);

          // Notify the user
          Notifications.create({  
            "publisher": Authentication.user.username,  
            "subscriber": $scope.contest.userInfo.username, 
            "description": Authentication.user.username + " 님이 회원님의 콘테스트에 지원했습니다.", 
            "link": $scope.contest._id, 
            "isClicked": false,
            "contest": true
          });

          //Real time comment
          var entryIndex = response.data.entries.length;
          var entry = response.data.entries[entryIndex-1];

          entry.empName = response.data.userInfo.username;
          var message = {
              text: entry
          };

          // Make sure the Socket is connected
          if (!Socket.socket) {
              Socket.connect();
          }

          Socket.emit('contestEntry', message);

          $location.path('contests/view/' + $scope.currentContestId);
          
        },function(err){
          console.log('entry Error', err);
          toastr.error('Uploading entry failed. Something went wrong');
        });
      };

      $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
        $scope.contest = {};
        // Show error message
        $scope.error = response.message;
      };

      if(!$scope.uploader.queue.length) {
        toastr.info('파일을 먼저 업로드하십시오.');
      } 
      // file uploader end 
    };
    // End Post entry against contest

    $scope.entry_pakagePrices = {
      'entry_pakage_1' : 100,
      'entry_pakage_2' : 100
    };


    $scope.checktotalEntryAmount = function (value, pakage_name) {

      if(pakage_name === 'entry_pakage_1'){
        if(value){
          $scope.totalEntryAmount = $scope.totalEntryAmount + $scope.entry_pakagePrices.entry_pakage_1;
        }
        else
          $scope.totalEntryAmount = $scope.totalEntryAmount - $scope.entry_pakagePrices.entry_pakage_1;

      }

      if(pakage_name === 'entry_pakage_2')
      {
        if(value){
          $scope.totalEntryAmount = $scope.totalEntryAmount + $scope.entry_pakagePrices.entry_pakage_2;
        }
        else
           $scope.totalEntryAmount = $scope.totalEntryAmount - $scope.entry_pakagePrices.entry_pakage_2;
      }
    };

    // Find existing Contest
    $scope.findOne = function () {
      // spin spinner
      $timeout(function() {
        usSpinnerService.spin('contestLoader');
      }, 500);

      $scope.isLoading = true;

      $scope.contest = Contests.get({
        contestId: $stateParams.contestId
      }).$promise.then(function(data) {
        $scope.thisContest = data; 

        $scope.isLoading = false;
        
        // Days remaining
        var date1 = new Date(data.created);
        date1.setDate(date1.getDate()+parseInt($scope.thisContest.dayContest));

        var date2 = new Date();

        var timeDiff = date1.getTime() - date2.getTime();
        var remainingDays = Math.round(timeDiff / (1000 * 3600 * 24)); 

        $scope.thisContest.remainingDays = remainingDays;

        // Find the employer
        if(data.user._id === Authentication.user._id){
          $scope.thisContest.userInfo = Authentication.user;
        }else{
          $http({
            url: '/api/hiddenUser/' + data.user._id,
            method: 'GET'
          }).then(function (succ) {
            $scope.thisContest.userInfo = succ.data;
          });
        }

        $timeout(function() {
          usSpinnerService.stop('contestLoader');
        }, 500);

      }, function(error) {
        // error handler
      });
    };


    // Find Similar and Completed contests for contest description
    $scope.getSimilarAndCompletedContests = function(){

      $http({
        url:'/api/contest/similarcontest',
        method:'GET' 
      }).then( function(suc){
        $scope.similarcontest = suc.data.similar;
        $scope.completedContest = suc.data.completed;
      });
    };
    // Calculate % of bid on budget
    $scope.updateValues = function() {
      $scope.contestFee = parseInt($scope.paidYours)*0.05;
      $scope.yourBid = parseInt($scope.contestFee) + parseInt($scope.paidYours);
    };

   /* $scope.$watch('currentPage + numPerPage', function() {
      var begin = (($scope.currentPage - 1) * $scope.numPerPage);
      var end = begin + $scope.numPerPage;
    
      if($scope.promiseResolved) {
        $scope.filteredContests = $scope.contest.slice(begin, end);
      }
    });*/

    $scope.maxSize = 5;
    $scope.numPerPage = 10;
    $scope.currentPage = 1;
 
    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;


    // in contest-post budget
    $scope.sliderContestBudg = {
      minValue: 1,
      maxValue: 100000000,
      options: {
        floor: 1,
        ceil: 100000000,
        step: 1,
        showSelectionBar: true
      }
    };

    // in contest-manage
    $scope.sliderManage = {
      minValue: 50,
      maxValue: 1000,
      options: {
        floor: 1,
        ceil: 100,
        step: 1,
        showSelectionBar: true
      }
    };

    // in contest-list page
    $scope.sliderFixedPrice = {
      minValue: 50,
      maxValue: 1000,
      options: {
        floor: 0,
        ceil: 100,
        step: 1,
        showSelectionBar: true
      }
    };
    $scope.sliderHourly = {
      minValue: 10,
      maxValue: 1000,
      options: {
        floor: 0,
        ceil: 100,
        step: 1,
        showSelectionBar: true
      }
    };
    $scope.sliderContractor = {
      minValue: 50,
      maxValue: 1000,
      options: {
        floor: 0,
        ceil: 100,
        step: 1,
        showSelectionBar: true
      }
    };

    // For Listing types
    $scope.listingTypes =[
      { value: 'nda' , label: 'NDA' },
      { value: 'urgent' , label: 'URGENT' },
      { value: 'featured' , label: 'FEATURED' },
      { value: 'guranteed' , label: 'GURANTEED' },
      { value: 'fulltime' , label: 'FULL TIME' },
      { value: 'qualified' , label: 'QUALIFIED' },
      { value: 'highlight' , label: 'HIGHLIGHT' },
      { value: 'topcontest' , label: 'TOP CONTEST' },
      { value: 'localjob' , label: 'LOCAL JOB' },
      { value: 'sealed' , label: 'SEALED' }
    ];


    // Adding milestones of contest bid
    


      
    $scope.remov = function(index){
      $scope.milestones.splice(index,1);
    };
    
    $scope.add = function(name){
      if($scope.milestones.length<5) {
        $scope.amountCalculated = $scope.totalBidAmount - parseInt($scope.milestones[$scope.milestones.length-1].price);
        if($scope.amountCalculated !== 0) {
          $scope.milestones.push({ 
            description: '',
            price: $scope.amountCalculated
          });
          $scope.totalBidAmount = $scope.amountCalculated;
        } 
      }
    };

    $scope.universalData = function () {
      if($rootScope.univesral){
        $scope.records = $rootScope.universal;
        $scope.typeOfWork = $scope.records.typeOfWork;
        $scope.fixedRate = $scope.records.fixedRate;
        $scope.hourlyRate = $scope.records.hourlyRate;
        $scope.skills = $scope.records.skills;

        $scope.subcatweb = $scope.records.subcatweb;
        $scope.subcatmobile = $scope.records.subcatmobile;
        $scope.subcatwriting = $scope.records.subcatwriting;
        $scope.subcatdesign = $scope.records.subcatdesign;
        $scope.subcatdataentry = $scope.records.subcatdataentry;
        $scope.subcatmanufact = $scope.records.subcatmanufact;
        $scope.subcatsalemarket = $scope.records.subcatsalemarket;
        $scope.subcatlocaljob = $scope.records.subcatlocaljob;
        $scope.commonCurrency = $scope.records.currency;
        $scope.getCommonCurrency();

      }else{
        $scope.universal = UniversalData.query().$promise.then(function(data) {
          $scope.records = data[0];
          $scope.typeOfWork = $scope.records.typeOfWork;
          $scope.fixedRate = $scope.records.fixedRate;
          $scope.hourlyRate = $scope.records.hourlyRate;
          $scope.skills = $scope.records.skills;

          $scope.subcatweb = $scope.records.subcatweb;
          $scope.subcatmobile = $scope.records.subcatmobile;
          $scope.subcatwriting = $scope.records.subcatwriting;
          $scope.subcatdesign = $scope.records.subcatdesign;
          $scope.subcatdataentry = $scope.records.subcatdataentry;
          $scope.subcatmanufact = $scope.records.subcatmanufact;
          $scope.subcatsalemarket = $scope.records.subcatsalemarket;
          $scope.subcatlocaljob = $scope.records.subcatlocaljob;
          $scope.commonCurrency = data[0].currency;
          $scope.getCommonCurrency();
          
          return $scope.records;
        });
      }
    };

    $scope.currency = [];
    $scope.getCommonCurrency = function(){
       var c;
     if($scope.commonCurrency.KRW){
       c = $scope.commonCurrency.KRW;
       $scope.commonCurrency.KRW.cur = $scope.commonCurrency.KRW.name + ' ' + $scope.commonCurrency.KRW.code +' '+$scope.commonCurrency.KRW.symbol_native;
       $scope.currency.push($scope.commonCurrency.KRW);
     }if($scope.commonCurrency.USD){
       c = $scope.commonCurrency.USD;
       $scope.commonCurrency.USD.cur = $scope.commonCurrency.USD.name + ' ' + $scope.commonCurrency.USD.code +' '+$scope.commonCurrency.USD.symbol_native;
       $scope.currency.push($scope.commonCurrency.USD);
     }
 
     if($scope.contest)
      $scope.contest.currency = $scope.currency[0];
    };

    $scope.paginateSearchResults = function (key) {

      $scope.currentPage = 1;
      var begin = (($scope.currentPage - 1) * $scope.numPerPage);
      var end = begin + $scope.numPerPage;
      if($scope.contest){
        $scope.filteredContests = $scope.contest.slice(begin, end);
      }      
      if($scope.contest){
        $scope.contestsLength = $scope.contest.length+1;
      }
    };

    $scope.$watch('searchSkills',function(newValue,oldValue){
      // your code goes here...
      
      if(typeof newValue !== 'undefined' && newValue.length>0) {
        
        angular.copy($scope.contest,$scope.previousData);

        $scope.contest = $scope.contest.filter(function (obj) {
          
          for(var i =0;i<obj.skills.length;i++) {

            if(obj.skills[i].name.includes(newValue[newValue.length-1].name))
              return obj.skills[i].name.includes(newValue[newValue.length-1].name);
          }

        });  

        $scope.paginateSearchResults();
        
      }
 
      else if(typeof newValue !== 'undefined' && newValue.length === 0) {
        $scope.contest = $scope.previousData;
        $scope.contest = $scope.oldData;
        $scope.previousData = [];
        $scope.paginateSearchResults();
      } 
    });

    /*$scope.search = function (key) {
      if (key === 'byDescription') {
        if($scope.searchContest){
          $scope.contest = $scope.oldData;
          $scope.contest = $scope.contest.filter(function (obj) {
            if(obj.description.toUpperCase().includes($scope.searchContest.toUpperCase()) || obj.name.toUpperCase().includes($scope.searchContest.toUpperCase())){
              return obj;
              // return obj.description.includes($scope.searchContest);
            }
          });
        }else{
          $scope.contest = $scope.oldData;
        }
      }
      $scope.paginateSearchResults();
    };*/
    $scope.search = function (key) {
      $http.get('/api/searchContest/'+$scope.searchContest).then(function(res){
        $scope.contestsLength = res.data.length;
        $scope.filteredContests = res.data;
         $scope.oldcontest = res.data;
      })
    };
    $scope.exportInvoice = false;
    $scope.InvoiceExportButton = function(buttonStatus){
      if(buttonStatus === false){
        $scope.exportInvoice = true;
      }else{
        $scope.exportInvoice = false;
      }
    };
    $scope.transcationInvoice = false;
    $scope.transcationExportButton = function(buttonStatus){
      if(buttonStatus === false){
        $scope.transcationInvoice = true;
      }else{
        $scope.transcationInvoice = false;
      }
    };
     $scope.transcationPending = false;
    $scope.transcationPendingButton = function(buttonStatus){
      if(buttonStatus === false){
        $scope.transcationPending = true;
      }else{
        $scope.transcationPending = false;
      }
    };

    $scope.incoming = true;
    $scope.outgoing = false;
    $scope.showIncoming=function(label){
      if(label === 'incoming'){
        $scope.incoming = true;
        $scope.outgoing = false;
      }
      else if(label === 'outgoing'){
        $scope.incoming = false;
        $scope.outgoing = true;
      }
      else{
        $scope.incoming = true;
      }
    };
    $scope.clearFilters = function () {

      $scope.filteredContests = $scope.allContests;
      $scope.contests = $scope.allContests;
      $scope.paginateSearchResults();
    };

    //make one person winner
    //make one person winner
    $scope.makeThisWinner = function(contestId, entryId, index, email){
      var obj = {
        'userEmail' : email,
        'contestId' : contestId,
        'entryId' : entryId,
        'index' : index
      };

      console.log('Smalll:', $scope.thisContest.entries[index].entrySellPrice);

      SweetAlert.swal({
        title: "수상자를 선정하시겠습니까?",
        text: "수상자를 선정할 경우 취소와 환불이 불가능합니다.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5cb85c",
        confirmButtonText: "수상",
        closeOnConfirm: false,
        // closeOnCancel: false
      },function(isConfirm){
        if(isConfirm){
          return $http({
            url: '/api/contest/makeThisWinner/',
            method: 'PUT',
            data: obj
          }).then(function(succ) {
            $scope.thisContest.entries[index].youWinner = 'yes';
            $scope.thisContest.contestStatus = 'closed';

            // Calculate the outsourcingok fee (10% of entry price)
            var tax = $scope.thisContest.entries[index].entrySellPrice * 0.1; // 10% of entry price
            var amtToTransfer = parseInt($scope.thisContest.entries[index].entrySellPrice)-tax;

            Account.findOne({
              filter:{
                where:{
                  ownerId: $scope.thisContest.entries[index].entryPersonUsername
                }
              }
            }, function(userAcc){
              // Release money from admin to freelancer
              // IF ENTRY PRICE AND CONTEST PRICE ARE EQUAL
              if(parseInt($scope.thisContest.entries[index].entrySellPrice) === parseInt($scope.thisContest.sliderContestBudg)){
                Transactions.transfer({
                  Sid : $rootScope.adminEWalletId,
                  Rid : userAcc.id,
                  amount : amtToTransfer,
                  currency : $scope.thisContest.currency.code,
                  description: {
                    'detail': 'Employer accepted your entry <b>'+$scope.thisContest.entries[index].entryName+'</b> against the contest <a href="contests/view/'+$scope.thisContest._id+'">'+$scope.thisContest.name+'</a>',
                    'tax': tax
                  }
                }, function(suc){

                  //Create service transaction
                  Transactions.create({
                    accountId: userAcc.id,
                    transectionType: 'contestfee',
                    transectionFrom: userAcc.ownerId,
                    referenceId: $scope.thisContest._id,
                    currency: $scope.thisContest.currency.code,
                    amount: tax,
                    description:{
                      'detail': 'Contest awarding fee'
                    },
                    transactionDate: Date.now()
                  });

                  SweetAlert.swal("수상자 선정완료!", "수상자를 선정하였습니다.", "success");
                });
              }
              
              //IF ENTRY PRICE AND CONTEST PRICE ARE EQUAL
              else if(parseInt($scope.thisContest.entries[index].entrySellPrice) < parseInt($scope.thisContest.sliderContestBudg)){
                
                // Release fund to freelancer
                Transactions.transfer({
                  Sid : $rootScope.adminEWalletId,
                  Rid : userAcc.id,
                  amount : amtToTransfer,
                  currency : $scope.thisContest.currency.code,
                  description: {
                    'detail': 'Employer accepted your entry <b>'+$scope.thisContest.entries[index].entryName+'</b> against the contest <a href="contests/view/'+$scope.thisContest._id+'">'+$scope.thisContest.name+'</a>',
                    'tax': tax
                  }
                }, function(suc){

                  //Create service transaction
                  Transactions.create({
                    accountId: userAcc.id,
                    transectionType: 'contestfee',
                    transectionFrom: userAcc.ownerId,
                    referenceId: $scope.thisContest._id,
                    currency: $scope.thisContest.currency.code,
                    amount: tax,
                    description:{
                      'detail': 'Contest awarding fee'
                    },
                    transactionDate: Date.now()
                  });

                  SweetAlert.swal("수상자 선정완료!", "수상자를 선정하였습니다.", "success");
                });

                // Return remaining fund to employer
                Transactions.transfer({
                  Sid : $rootScope.adminEWalletId,
                  Rid : $rootScope.userAccountBalance.id,
                  amount : parseInt($scope.thisContest.sliderContestBudg)-parseInt($scope.thisContest.entries[index].entrySellPrice),
                  currency : $scope.thisContest.currency.code,
                  description: {
                    'detail': 'You accepted an entry which had less price than contest price, your extra amount is being returned. <a href="contests/view/'+$scope.thisContest._id+'">'+$scope.thisContest.name+'</a>',
                    'tax': 0
                  }
                }, function(suc){
                  Notification.info({
                    message: '콘테스트 수상자 지원금액이 회원님의 예산보다 낮아서 차액이 발생하여 차액을 회원님의 예치금에 입금하였습니다.', 
                    positionY: 'bottom', 
                    positionX: 'right', 
                    closeOnClick: true, 
                    title: '<i class="glyphicon glyphicon-check"></i> 예치금 입금'
                  });
                  $rootScope.userAccountBalance.accountBalance[$scope.thisContest.currency.code] = $rootScope.userAccountBalance.accountBalance[$scope.thisContest.currency.code] + (parseInt($scope.thisContest.sliderContestBudg)-parseInt($scope.thisContest.entries[index].entrySellPrice));
                });
                
              }

            });

            // Notify the user
            Notifications.create({  
              "publisher": Authentication.user.username,  
              "subscriber": $scope.thisContest.entries[index].entryPersonUsername, 
              "description": Authentication.user.username + " 회원님께서 콘테스트에 지원했습니다. ", 
              "link": $scope.thisContest._id, 
              "isClicked": false,
              "contest": true
            });
            
          },function(err){
            SweetAlert.swal("오류", "문제가 발생했습니다.", "error");
          });
        }
        // else
          // swal("Cancelled");
      });
    };

    // Show the entry on model
    //View entry
    $scope.viewEntry = function (size,entryModelView, index, totalEntries) {
     
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/contests/client/views/modals/contest-entry-view.client.view.html',
        controller: function($scope, $uibModalInstance, $location,$window){
          $scope.user = Authentication.user;
          $scope.imageURL = $scope.user.profileImageURL;
          $scope.entryModelView = entryModelView;
          $scope.entryModelView.index = index;
          $scope.entryModelView.total = totalEntries;

          // $scope.ok=function(){

          // };
          $scope.closeEntryModel=function(){
            $uibModalInstance.dismiss();
          };
        },
        size: size,
        resolve: {
          entryModelView: function() {
            // //console.log('size: ', entryModelView);
            return entryModelView;
          }
        }
      });
    };
    //View entry end


    // Comment on an entry on clarification board
    // $scope.comments = [];
    $scope.commentOnEntry = function(commentEntry){
      $scope.isLoading = true;
      var obj = {
        'userId': $scope.authentication.user._id,
        'userName': $scope.authentication.user.username,
        'userImg': $scope.authentication.user.profileImageURL,
        'cText': commentEntry,
        'created': Date.now()
      };
      
      return $http({
        url: '/api/contest/commentOnEntry/'+ $stateParams.contestId,
        method: 'PUT',
        data: obj
      }).then(function(succ) {

        $scope.isLoading = false;
        $scope.thisContest.comments.unshift(obj);
        $timeout(function() {
          $scope.commentEntry = "";
        }, 10);

        //Real time comment
        obj.contestId = $stateParams.contestId;
        var message = {
            text: obj
        };
        // Make sure the Socket is connected
        if (!Socket.socket) {
            Socket.connect();
        }
        Socket.emit('contestComment', message);
      });

    };
    
    // Transaction History
    $scope.transac = function(){

      $scope.isLoading = true;

      var paymentId = location.search;
      if (paymentId.includes('?paymentId=PAY-')) {
        $scope.withDrawMoneyFromPaypal();
      }

      $scope.transactions = [];

      // start spinner 
      // $timeout(function() {
      //   usSpinnerService.spin('transLoader');
      // }, 500);
      // Find account of the user
      Account.findOne({
        filter:{
          where:{
            ownerId : $scope.authentication.user.username
          }
        }
      }, function(succ){
        // Find all transactions of the user
        Transactions.find({
          filter: {
            where: {
              transectionType: { inq: ['debit', 'Debit', 'credit', 'Credit', 'Deposit'] }
            }
          }
        },function(resp){

          // Find the user Specific
          for(var i=0; i<resp.length; i++){
            if(resp[i].accountId === succ.id){
              $scope.transactions.push(resp[i]);
            }
          }

          $scope.isLoading = false;

        });

      });

    };

    // withdraw money
    $scope.withDrawMoneyFromPaypal = function(){
      return $http({
        url: '/api/users/paymentExecute',
        method: 'POST',
        data: {
          'paymentId':$location.search().paymentId,
          'token':$location.search().token,
          'PayerID':$location.search().PayerID
        }
      
      }).then(function(paySuccess) {
        // Add amount to eWallet
        Account.findOne({
          filter :{
            where :{
              ownerId : $scope.authentication.user.username
            }
          }
        }, function(response){
          //console.log('Amount transfer', response);
          $scope.accountId = response.id;
          Transactions.transfer({
            Sid : $scope.accountId,
            Rid : $rootScope.adminEWalletId,
            amount : parseFloat(paySuccess.data.transactions[0].amount.total),
            currency : paySuccess.data.transactions[0].amount.currency,
            description:{
              'detail': 'withdraw amount via Paypal'
            }
          }, function(res){
            
            Account.findOne({
              filter:{
                where:{
                  ownerId : $scope.authentication.user.username
                }
              }
            }, function(suc){
              //console.log('succccccccc', suc);
              $rootScope.userAccountBalance = suc;
              $location.search({});
              SweetAlert.swal("잔액 이체", "잔액 이체에 성공했습니다.", "success");
              // toastr.success('Amount Transferred successfully.', 'Amount Deposit', {timeOut: 5000});
              // $state.go($state.previous.state.name, $state.previous.params);
            }, function(err){
              //console.log(err);
            });
            
            // //console.log('Amount deposited', resp);
          }, function(err){
            toastr.error('잔액이체 실패.', '잔액 이체', {timeOut: 5000});
            //console.log('Amount deposit err', err);
          });
        }, function(err){
          // //console.log('Amount transfer err', err);
        });

      },function(payError){
        //console.log('payment execution failed');
        toastr.success('이체 작업 실패');
        $location.search({});
      });
    };
    // end withdraw money

    // export the transactions history to excel sheet  //; exportToExcel('#tableToExport')
    $scope.exportToExcel=function(tableId){ // ex: '#my-table'
        var exportHref=Excel.tableToExcel(tableId,'trasactinHistory');
        $timeout(function(){location.href=exportHref;},100); // trigger download
    };
    /** Work by Saad For download file   start....*/
    $scope.downloadFile=function(startDate,endDate,downloadType){  
      var i=0;
      $scope.printArr=[];
      var dateIs;
      for(i;i<$scope.transactions.length;i++){
        dateIs=new Date($scope.transactions[i].transactionDate); 
        if(dateIs>=startDate && dateIs<=endDate){ 
          $scope.printArr.push($scope.transactions[i]);
        }
      }
      console.log($scope.printArr);
    };
     
    $scope.popup = { opened: false };
    $scope.popup2 = { opened: false };

    $scope.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(),
      minDate: new Date(1970, 1, 1),
      startingDay: 1
    };
    $scope.open = function() {
      $scope.popup.opened = true; 
    };
    $scope.open2 = function() {
      $scope.popup2.opened = true;
    }; 
    
    /** end */
    // Show Incoming and Outgoin Milestones
    $scope.showMileStones = function(){

      $scope.outGoMileStone = [];
      $scope.incomMileStone = [];
      var count =0;

      // Get all the Outgoin milstones from the respective projects
      angular.forEach(Authentication.user.myProjects, function (outMS, i) {

        Projects.get({
          projectId: outMS.proj_id
        }).$promise.then(function (proj) {
          var newProj = '';          
          for(var j=0; j<proj.bids.length; j++){
            if (proj.bids[j].awarded === 'yes'){            
              newProj = proj.bids[j].proposal.milestones;
              //find all milestones of the particular project[j] and push into incomeMileStone
              var l=0;
              while(l<newProj.length){
                $scope.outGoMileStone[count] = newProj[l];
                $scope.outGoMileStone[count].projId = proj._id;
                $scope.outGoMileStone[count].projName = proj.name;
                $scope.outGoMileStone[count].bidder = proj.bids[j].bidderInfo.username;
                $scope.outGoMileStone[count].projDate = proj.created;
                l++;
                count++;
              }
            }
            newProj = '';

          }
        }, function (error) {
          // error handler
          //console.log('Outgoin MS Err:',error);
        });
      });

      //console.log("OutGoing MileStones:", $scope.outGoMileStone);

      // Get all the Incoming milstones from the respective projects
      count =0;
      angular.forEach(Authentication.user.projectsAwarded, function (incomMS, i) {

        Projects.get({
          projectId: incomMS.projectId
        }).$promise.then(function (proj) {
          var newProj = '';          
          for(var j=0; j<proj.bids.length; j++){
            if (proj.bids[j].awarded === 'yes' && proj.bids[j].proposal.milestones){              
              newProj = proj.bids[j].proposal.milestones;

              //find all milestones of the particular project[j] and push into incomeMileStone
              var l=0;
              while(l<newProj.length){
                $scope.incomMileStone[count] = newProj[l];
                $scope.incomMileStone[count].projId = proj._id;
                $scope.incomMileStone[count].projName = proj.name;
                $scope.incomMileStone[count].projOwner = proj.userInfo.username;
                $scope.incomMileStone[count].projDate = proj.created;
                l++;
                count++;
              }
            }
            newProj = '';
          }
        }, function (error) {
          // error handler
          //console.log('Incoming MS Err:',error);
        });
      });
    };

    //upload handover file
    $scope.uploadHandOverFile = function (){
      $scope.item.upload();
      $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) { 
        $scope.sucMsg = '파일이 성공적으로 업로드되었습니다'  ;
        $scope.errMsg = ''; 
        $http({
          url:'/api/contest/updateForHandOver',
          method:'POST',
          data:{
            'contestId': $scope.thisContest._id,
            'handOverFileLink': response,
            'handOverFileName': fileItem.file.name
          }
        }).then(function(suc){ 
          $scope.item = '';
        }, function(fail){
          console.log('fail:', fail);
        });
      };
    };

    // Cancel uploading handover file
    $scope.cancelUploadHandOverFile = function (){
      console.log('cancelUploadHandOverFile');
      $scope.item = '';
    };

    // Transaction details - showTransacDetail
    $scope.showTransacDetail = function(trans){
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/contests/client/views/modals/transaction-detail.client.view.html',
        controller: function($scope, $uibModalInstance, $location,$window){
          $scope.user = Authentication.user;
          $scope.trans = trans;

          $scope.ok=function(){
            $uibModalInstance.close();
          };
        },
        size: 'md'
      });

    };
    
  }
]);
