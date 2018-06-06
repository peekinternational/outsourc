'use strict';

// Projects controller
var app = angular.module('projects');

app.controller('ProjectsController', ['$scope', '$rootScope', '$filter', 'Socket', 'Notification', '$state', 'toastr', '$stateParams', '$location', '$http', '$timeout', '$window', 'Authentication', 'Projects', 'geolocation', 'FileUploader', 'UniversalData', 'Account', 'Transactions', 'SweetAlert', 'Conversation', 'usSpinnerService', 'uuid2', 'Notifications', 'ProjectFeed', 'Categories', 'SubCategories', 'Skills', 'Contests',
  function ($scope, $rootScope, $filter, Socket, Notification, $state, toastr, $stateParams, $location, $http, $timeout, $window, Authentication, Projects, geolocation, FileUploader, UniversalData, Account, Transactions, SweetAlert, Conversation, usSpinnerService, uuid2, Notifications, ProjectFeed, Categories, SubCategories, Skills, Contests){
    

    var checkAgreement = {
      userId:Authentication.user._id,
      projectId:$stateParams.projectId
    }
    $http({
        url:"/api/agreement/get",
        method:"post",
        data:checkAgreement
       })
        .then(function(response) {
        /*SweetAlert.swal('Agreement', 'Done Successfully.', 'success');*/
        $rootScope.checkPackage = response.data;
        if(response.data.agreement == true){
          $location.path('projects/view/'+$stateParams.projectId);
        }
    });

    $scope.downloadAgreement =function(){
      $http.post("/api/packageProjects/"+$stateParams.projectId).then(function(res){
        var printWindow = window.open('', '', 'height=1000,width=1500');
        //var printWindow = window.open('', '', 'height=1000,width=1500');
        printWindow.document.write('<html><head><title>Non-Disclosure Agreement</title>');
        printWindow.document.write('</head><body >');
        printWindow.document.write('<h1 style="color:#00CED1">Non-Disclosure Agreement</h1>');
        printWindow.document.write('This non-disclosure agreement (“Agreement”), dated as of the submission time in the electronic form below is made between the user of the freelancer.com site who is the provider of the professional services (“Freelancer”) and the user of such professional services (“Employer”).<br/><br/>');
        printWindow.document.write('For the purposes of enabling the Freelancer to provide the professional services to the Employer, the Employer has agreed to provide the Freelancer with written and oral information (“Confidential Information”) concerning the project which the Freelancer is to complete (“Project”) subject to the terms of this Agreement.<br/><br/>');
        printWindow.document.write('The parties agree as follows:<br/><br/>');
        printWindow.document.write('1. The Confidential Information shall be kept in strict confidence by the Freelancer and shall not be used, without the Employer’s prior written consent, for any purpose other than in connection with the completion of the Project. The Confidential Information shall not be disclosed to any persons other than those Representatives (as defined below) who have a need to know. “Representatives” shall mean the affiliates, directors, officers, employees, professional advisers and agents of the Freelancer. The Freelancer shall inform its Representatives of the confidential nature of the Confidential Information and shall direct its Representatives to hold the Confidential Information in strict confidence.<br/><br/>');
        printWindow.document.write('2. The restrictions in paragraph 1 shall not apply to any information which: (a) is or becomes generally available to the public through no violation of this Agreement; (b) was available to the Freelancer on a non-confidential basis prior to its disclosure to the Freelancer by the Employer; (c) becomes available to the Freelancer on a non-confidential basis from a source other than the Employer provided that such source is not bound by an Agreement with the Employer; or (iv) is required to be disclosed to any court, regulatory authority, other governmental authority or pursuant to any requirement of law.<br/><br/>');
        printWindow.document.write('3. At the request of the Employer, the Freelancer shall return all Confidential Information received from the Employer and shall not retain any copies of, or other reproductions or extracts of, the Confidential Information, except as it may retain in accordance with prudent business practices (any retained material shall remain subject to the provisions of this Agreement without any time limit).<br/><br/>');
        printWindow.document.write('4. The Freelancer acknowledges and agrees that the Employer is not making any representation or warranty, express or implied, as to the accuracy, correctness or completeness of the Confidential Information. The Freelancer agrees that neither the Employer nor any of its affiliates, directors, officers, employees, professional advisors or agents shall have liability to the Freelancer resulting from the use of the Confidential Information by the Freelancer or the Representatives.<br/><br/>');
        printWindow.document.write('5. Notwithstanding any other remedies which may be available to the Employer, the Freelancer indemnifies and must keep the Employer indemnified against any loss or expense suffered or incurred by the Employer directly or indirectly in connection with or arising out of or as a result of the breach by the Freelancer or its Representatives of any of the terms of this Agreement.<br/><br/>');
        printWindow.document.write('6. This Agreement is governed by and shall be construed in accordance with the laws of the State of New South Wales, Australia and the parties irrevocably submit to the non-exclusive jurisdiction of the courts of the State of New South Wales, Australia. The duration of this Agreement is 12 (twelve) months from the date of this Agreement.<br/><br/>');
        printWindow.document.write('<span style="page-break-before:always;">7. This Agreement shall not be amended or modified, and none of the provisions shall be waived, except in writing signed on behalf of the parties or, in the case of a waiver, on behalf of the party making the waiver.<span><br/><br/>');
        printWindow.document.write('---------------------------------------------------------------------------------------------------------------------------------------');
        printWindow.document.write('This Agreement relates to the confidentiality agreed upon for the project:<br/><br/>');
        printWindow.document.write(res.data.name+' listed '+res.data.created);
        printWindow.document.write('<br/><br/><span style="margin-right:150px">Agreed to by the Freelancer</span> ');
        printWindow.document.write('<span style="margin-left:150px">Agreed to by the Employer</span><br/>');
        printWindow.document.write('<span style="margin-right:100px">'+Authentication.user.username+' , '+ moment().format('MMMM Do YYYY, h:mm:ss a')+' </span>');
        printWindow.document.write('<span style="margin-left:100px">'+res.data.userInfo.name+' , '+ moment().format('MMMM Do YYYY, h:mm:ss a')+' </span>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      /*download Agreemnt PDF code*/
     /*  var docDefinition = { content: [
          {
            text:"Non-Disclosure Agreement",
            style:"header",
            margin: [ 0, 10, 0, 10 ]
          },
          {text:"This non-disclosure agreement (“Agreement”), dated as of the submission time in the electronic form below is made between the user of the freelancer.com site who is the provider of the professional services (“Freelancer”) and the user of such professional services (“Employer”)."},
          {text:"For the purposes of enabling the Freelancer to provide the professional services to the Employer, the Employer has agreed to provide the Freelancer with written and oral information (“Confidential Information”) concerning the project which the Freelancer is to complete (“Project”) subject to the terms of this Agreement.",margin:[0,5,0,5]},
          {text:"The parties agree as follows:",margin:[0,0,0,5]},
          {text:"1. The Confidential Information shall be kept in strict confidence by the Freelancer and shall not be used, without the Employer’s prior written consent, for any purpose other than in connection with the completion of the Project. The Confidential Information shall not be disclosed to any persons other than those Representatives (as defined below) who have a need to know. “Representatives” shall mean the affiliates, directors, officers, employees, professional advisers and agents of the Freelancer. The Freelancer shall inform its Representatives of the confidential nature of the Confidential Information and shall direct its Representatives to hold the Confidential Information in strict confidence.",margin:[0,0,0,5]},
          {text:"2. The restrictions in paragraph 1 shall not apply to any information which: (a) is or becomes generally available to the public through no violation of this Agreement; (b) was available to the Freelancer on a non-confidential basis prior to its disclosure to the Freelancer by the Employer; (c) becomes available to the Freelancer on a non-confidential basis from a source other than the Employer provided that such source is not bound by an Agreement with the Employer; or (iv) is required to be disclosed to any court, regulatory authority, other governmental authority or pursuant to any requirement of law.",margin:[0,0,0,5]},
          {text:"3. At the request of the Employer, the Freelancer shall return all Confidential Information received from the Employer and shall not retain any copies of, or other reproductions or extracts of, the Confidential Information, except as it may retain in accordance with prudent business practices (any retained material shall remain subject to the provisions of this Agreement without any time limit).",margin:[0,0,0,5]},
          {text:"4. The Freelancer acknowledges and agrees that the Employer is not making any representation or warranty, express or implied, as to the accuracy, correctness or completeness of the Confidential Information. The Freelancer agrees that neither the Employer nor any of its affiliates, directors, officers, employees, professional advisors or agents shall have liability to the Freelancer resulting from the use of the Confidential Information by the Freelancer or the Representatives.",margin:[0,0,0,5]},
          {text:"5. Notwithstanding any other remedies which may be available to the Employer, the Freelancer indemnifies and must keep the Employer indemnified against any loss or expense suffered or incurred by the Employer directly or indirectly in connection with or arising out of or as a result of the breach by the Freelancer or its Representatives of any of the terms of this Agreement.",margin:[0,0,0,5]},
          {text:"6. This Agreement is governed by and shall be construed in accordance with the laws of the State of New South Wales, Australia and the parties irrevocably submit to the non-exclusive jurisdiction of the courts of the State of New South Wales, Australia. The duration of this Agreement is 12 (twelve) months from the date of this Agreement.",margin:[0,0,0,5],pageBreak: 'after'},
          {text:"7. This Agreement shall not be amended or modified, and none of the provisions shall be waived, except in writing signed on behalf of the parties or, in the case of a waiver, on behalf of the party making the waiver.",margin:[0,0,0,5]},
          {text:"----------------------------------------------------------------------------------------------------------------------------------------------------------",margin:[0,10,0,10]},
          {text:"This Agreement relates to the confidentiality agreed upon for the project:",margin:[0,0,0,5]},
          {text:res.data.name+"  listed "+res.data.created,margin:[0,0,0,5]},
          {
            columns: [
            {
              
              width: '*',
              text: 'Agreed to by the Freelancer'
            },
            {
              
              width: '*',
              text: 'Agreed to by the Employer '
            },
            ],
            margin:[0,0,0,5]
          },
          {
            columns: [
            {
              
              width: '*',
              text: Authentication.user.username+' , '+ moment().format('MMMM Do YYYY, h:mm:ss a')
            },
            {
              
              width: '*',
              text: res.data.userInfo.name+' , '+ moment().format('MMMM Do YYYY, h:mm:ss a')
            }
            ]
          }
          
        ],
        styles:{
          header:{
            fontSize:25,
            color:"skyblue",
          }
        } };
      pdfMake.createPdf(docDefinition).download(); */
      })
    }
    
    
    $scope.company = Authentication.user.username;
    $scope.readagrement = false;
    $scope.model = {upgrade:false};
    $scope.model = {detail:true};
    $scope.authentication = Authentication;
    if (!Socket.socket) {
        Socket.connect();
    }
    $scope.Agreementsubmit = function(){
      var agreementObject = {
        userId:Authentication.user._id,
        projectId:$stateParams.projectId,
        companyName: this.company,
        phone:this.phone,
        address:this.address,
        country:this.country,
        state:this.state,
        city:this.city,
        agreement:true

      }
       $http({
        url:"/api/agreement/save",
        method:"post",
        data:agreementObject
       })
        .then(function(response) {
        /*SweetAlert.swal('Agreement', 'Done Successfully.', 'success');*/
        $rootScope.checkPackage = response.data;
       $location.path('projects/view/'+$stateParams.projectId);
    });
    }

    $scope.view_processing = true;
    // Currency rate is being hardcoded here instead of getting the latest rate
    // 1 USD = 1000 KRW
    $rootScope.latestCurrencyRate = { 'USD': 1, 'KRW': 1000 };
    
    //inner called
    $scope.getLatestRate = function(){
      $rootScope.latestCurrencyRate = { 'USD': 1, 'KRW': 1000 };
    };

    // Add an event listener when freelancer requests milestone
    Socket.on(Authentication.user.username+'requestedMileStone', function (message) {
      if($scope.awardedProject.proposal){
        Notification.warning({
          message: '프리랜서가 대금요청했습니다.', 
          positionY: 'bottom', 
          positionX: 'left', 
          closeOnClick: true, 
          title: '<i class="glyphicon glyphicon-check"></i>대금요청',
          maxCount:6
        });

        $scope.awardedProject.proposal.milestones.push(message.text.data);
      }
    }); 
     
    $scope.detail = true;
    $scope.edit = true;
    /*update project information from project-mange*/
    $scope.updateProject = function(){ 
      $scope.totalAmount = parseInt($scope.totalAmount);
      if($scope.totalAmount>0){
        SweetAlert.swal({
          title: "프로젝트 업그레이드 하시겠습니까?",
          text: "회원님께서는 아웃소싱오케이 서비스를 구매하셨습니다. 금액은 " + "₩" + $scope.totalAmount + " 원 입니다. 회원님께서 승인 할 경우 회원님계좌에 있는 예치금에서 자동인출됩니다. 예치금이 부족할 경우 [서비스 이용료 결제]에서 지불하시길 바랍니다.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#008000",
          confirmButtonText: "업그레이드",
          closeOnConfirm: false,
          closeOnCancel: false
        },
        function (isConfirm) {
          if(isConfirm){
            SweetAlert.close();

            if($rootScope.userAccountBalance.accountBalance[$scope.project.currency.code] >=$scope.totalAmount){
              upgradeProject();
            }else{
              var convertedAmount;
              if($scope.project.currency.code === 'USD'){
                convertedAmount = $rootScope.userAccountBalance.accountBalance.USD +  ($rootScope.userAccountBalance.accountBalance.KRW/$rootScope.latestCurrencyRate.KRW);
              }else if($scope.project.currency.code === 'KRW'){
                console.log('krw');
                convertedAmount =  $rootScope.userAccountBalance.accountBalance.KRW + ($rootScope.userAccountBalance.accountBalance.USD*$rootScope.latestCurrencyRate.KRW);
              }

              if(convertedAmount>= $scope.totalAmount){
                // updateAccount
                Account.updateAccount({
                  ownerId: Authentication.user.username,
                  currency: $scope.project.currency.code,
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
                    upgradeProject();
                  });

                }, function(fail){
                  $scope.isLoading = false;
                  SweetAlert.swal('다시 시도하십시오!', '', 'warning');
                });
              }else{
                $scope.isLoading = false;
                SweetAlert.swal("예치금 잔액부족", "계정에 예치금이 잔액이 부족합니다.", "error");
                $location.path('credit-deposit');
              }
            }
          }
          else{
            SweetAlert.close();
          }
        });
      }else{
        var project = $scope.project;
        project.$update(function (response) {
          $scope.project = response;
          console.log('$scope.project 1 ',$scope.project);
          $scope.totalAmount = 0;
          SweetAlert.swal('업그레이드 완료!', '프로젝트가 성공적으로 업그레이트 되었습니다.', 'success');
        }, function (fail) {
          toastr.error('수정 오류', '문제가 발생했습니다.');
        });
      }
    };

    // Upgrade the project , inner called
    function upgradeProject(){
      Transactions.transfer({
        Sid:$rootScope.userAccountBalance.id,
        Rid:$rootScope.adminEWalletId,
        amount:parseInt($scope.totalAmount),
        currency:$scope.project.currency.code,
        referenceId: $scope.project._id,
        description:{
          'detail': 'Project upgraded with additional features. <a href="projects/project-manage/'+$scope.project._id+'">'+$scope.project.name+'</a>',
          'tax': 0
        }
      }, function(suc){
        var project = $scope.project;
        project.$update(function (response) {
          $scope.project = response;
          console.log('$scope.project 19 ',$scope.project);
          //Create service transaction
          Transactions.create({
            accountId: $rootScope.userAccountBalance.id,
            transectionType: 'service',
            transectionFrom: $rootScope.userAccountBalance.ownerId,
            referenceId: $scope.project._id,
            currency: $scope.project.currency.code,
            amount: parseInt($scope.totalAmount),
            description:{
              'detail': 'Project Upgraded'
            },
            transactionDate: Date.now()
          }, function(res){
            $scope.totalAmount = 0;
          });

          Account.findOne({
            filter: {
              where: {
                ownerId: $scope.authentication.user.username
              }
            }
          }, function (res) {
            $rootScope.userAccountBalance = res;
            SweetAlert.swal('업그레이드 완료!', '프로젝트가 성공적으로 업그레이트 되었습니다.', 'success');
          });
        }, function (fail) {
          // Reverse transaction
          Transactions.transfer({
            Sid:$rootScope.adminEWalletId,
            Rid:$rootScope.userAccountBalance.id,
            amount:parseInt($scope.totalAmount),
            currency:$scope.project.currency.code,
            referenceId: $scope.project._id,
            transactionDate: Date.now(),
            description:{
              'detail': 'Project upgrading failed and deducted amount has been returned'
            }
          });
          toastr.error('수정 오류', '문제가 발생했습니다.');
        });
      }, function(fail){
        SweetAlert.swal('예치금 잔액 부족!', '프로젝트 업그레이드를 위한 예치금이 부족합니다.', 'error');
      });
    }

    //check the project is simple or similar
    if($scope.mainCat !== null && $scope.subCat !== null){ 
      $scope.similarProjectPost = 1;
    }
    else{
      $scope.similarProjectPost = 0;
    }
 
    $scope.reloadRoute = function() {
      $window.location.reload();
    };

    $scope.images = [1, 2, 3, 4, 5, 6, 7, 8];

    $scope.loadMore = function() {
      var last = $scope.images[$scope.images.length - 1];
      for(var i = 1; i <= 8; i++) {
        $scope.images.push(last + i);
      }
    };
    
    $scope.universalData = function () {
      $scope.isLoading = true;

      if($rootScope.univesral){
        $scope.records = $rootScope.univesral;
        $scope.typeOfWork = $scope.records.typeOfWork;
        $scope.fixedRate = $scope.records.fixedRate;
        $scope.hourlyRate = $scope.records.hourlyRate;
        $scope.skills = $scope.records.skills;
        // $scope.project.currency = 'USD';
        $scope.subcatweb = $scope.records.subcatweb;
        $scope.subcatmobile = $scope.records.subcatmobile;
        $scope.subcatwriting = $scope.records.subcatwriting;
        $scope.subcatdesign = $scope.records.subcatdesign;
        $scope.subcatdataentry = $scope.records.subcatdataentry;
        $scope.subcatmanufact = $scope.records.subcatmanufact;
        $scope.subcatsalemarket = $scope.records.subcatsalemarket;
        $scope.subcatlocaljob = $scope.records.subcatlocaljob;

        //Project-post project budget selector
        $scope.rateList = $scope.fixedRate;
        $scope.project.price = $scope.rateList[0];
        $scope.commonCurrency = $rootScope.univesral.currency;
        $scope.isLoading = false;
        $scope.getCommonCurrency();

        return $scope.records;
      }else{
          $scope.universal = UniversalData.query().$promise.then(function (data) {
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

          //Project-post project budget selector
          $scope.rateList = $scope.fixedRate;
          $scope.project.price = $scope.rateList[0];
          $scope.commonCurrency = data[0].currency;
          $scope.isLoading = false;
          $scope.getCommonCurrency();

          return $scope.records;
        });
      }
    };

    //integration of chat module
    $scope.createConversation = function (bid, bool, projectId, projectName) {
      //console.log('bid::', bid);
      //console.log("Conversation Called");
      // Find the existing convo
      Conversation.findOne({
        filter:{
          where:{
            and:[
              {
                projectTitle: projectName,
                userTwo: bid.bidderInfo.username
              }
            ]
          }
        }
      }, function(suc){
           $rootScope.convToOpen = suc;
           $rootScope.convToOpenFromProjects = 1;
           $location.path('chat/inbox/'+suc.id);
      }, function(err){
        // toastr.error('Oops, something went wrong.', 'Conversation')
        Conversation.create({
          "userOne": bid.bidderInfo.username,
          "userTwo": Authentication.user.username,
          "projectTitle": projectName,
          "projectLink": projectId,
          "projectId": projectId,
          "isAwarded": bool,
          "cid": uuid2.newuuid(),
          "hasUnreadMessages": true
        }, function(_resp){

          Conversation.findOne({
            filter:{
              where:{
                and:[
                  {
                    projectTitle: projectName,
                    userTwo: bid.bidderInfo.username
                  }
                ]
              }
            }
          }, function(suc){
            $rootScope.convToOpen = suc;
            $rootScope.convToOpenFromProjects = 1;
            $location.path('chat/inbox/'+suc.id);
          });
          
        }, function(err){
          // $location.path('chat/inbox');
          toastr.success('문제가 발생했습니다.', 'Conversation');
          //console.log(err);
        });
      });
    };

    //chat from freelancer side
    $scope.createConversationFreelancerSide = function (project, bool, projectId, projectName) {
      // Find the existing convo
      Conversation.findOne({
        filter:{
          where:{
            and:[
              {
                projectTitle: projectName,
                userTwo: project.userInfo.username
              }
            ]
          }
        }
      }, function(suc){
           $rootScope.convToOpen = suc;
           $rootScope.convToOpenFromProjects = 1;
           $location.path('chat/inbox/');
      }, function(err){
        // toastr.error('Oops, something went wrong.', 'Conversation')
        Conversation.create({
          "userOne": project.userInfo.username,
          "userTwo": Authentication.user.username,
          "projectTitle": projectName,
          "projectLink": projectId,
          "projectId": projectId,
          "isAwarded": bool,
          "cid": uuid2.newuuid(),
          "hasUnreadMessages": true
        }, function(_resp){
          //console.log("Conversation Created");
          $rootScope.convToOpen = _resp;
          $rootScope.convToOpenFromProjects = 1;
          //console.log('$rootScope.convToOpen in projects', $rootScope.convToOpen);
          $location.path('chat/inbox/');
        }, function(err){
          // $location.path('chat/inbox');
          toastr.success('문제가 발생했습니다.', 'Conversation');
          //console.log(err);
        });
      });
    };

    //end integration of chat module
    // Freelancer Options on myProjects
    $scope.freelancSelected = '';
    $scope.freelancOption = function(id){
      //console.log('msssss', $scope.freelancSelected);
      switch($scope.freelancSelected){
        case 'ms':
          //console.log('ms');
          break;

        case 'ci':
          //console.log('ci');
          break;
        default:

      }
    };

    //minvalue of mile stone input
    $scope.checkValuefn = function () {
      if ($scope.checkValue < 3) {
        $scope.addAlert = function () {
          $scope.alerts.push({
            msg: 'Your Milestones must be a minimun of $3 USD'
          });
        };
      }
    };
 
    $scope.project = {};
    $scope.upgradeProject = {}; 
    $scope.deliverDays = 3;
    $scope.projectFee = 0;
    $scope.yourBid = 0;
    $scope.totalAmount = 0;
    $scope.project.projectRate = 'fixed'; 
    $scope.customizeProjectBudget = false;
    $scope.min = 3;
    $scope.newMilestone = {};
    $scope.items = [];
    $scope.optSub = null;
    $scope.milestoneError = true;
    $scope.dispute = {};
    $scope.tabs = [{text:"First Text",active:false}, {active:true},{active:false},{active:false}];
    $scope.showArbButtonTab2 = false;
    $scope.showArbButtonTab3 = false;
    $scope.currentUserId = $scope.authentication.user._id.toString();

    // Get categories/sucat and skills
    var getCatSubcat = function(){
      Skills.find({}, function(res){
        $scope.allProjectSkills = res;
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
        if(!$scope.project.workRequire){
          $scope.project.workRequire = '';
          $scope.project.skills = '';
          return;
        }
        $scope.subCategories.forEach(function(value1, key1){
          $scope.project.workRequire.subCategories.forEach(function(value2, key2){
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
        if(!$scope.project.subcat){
          $scope.project.subcat = '';
          $scope.project.skills = '';
          return;
        }
        
        if(!$scope.project.subcat.skills)
          return;

        $scope.allProjectSkills.forEach(function(value1, key1){
          $scope.project.subcat.skills.forEach(function(value2, key2){
            if( angular.equals(value1.id, value2)){
              $scope.projSkills.push(value1);
            }
          });
        });

        $scope.project.skills = $scope.projSkills;

      }, 10);
    };
   
    /*
    * Get common currency data
    */
    $scope.currency = [];
    //inner called
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
      $scope.project.currency = $scope.currency[0];
    };

    /*
    * When currency is changed
    */
    $scope.currencyChange = function(){

      if(!$rootScope.latestCurrencyRate){
        $timeout(function() {
          $scope.getLatestRate();
        }, 100);
      }
      
      // Change the total amount to zero and uncheck all additional features 
      $scope.totalAmount = 0;
      $scope.urgent = false;
      $scope.NDA = false;
      $scope.sealed = false;
      $scope.private = false;
      $scope.pakage_2 = false;
      $scope.pakage_3 = false;
      $scope.pakage_1 = false;

      UniversalData.query().$promise.then(function (data) {
        $scope.fixedRate = data[0].fixedRate;
        $scope.hourlyRate = data[0].hourlyRate;
      });

      $scope.tempRate = [];
      $scope.rateListt = [];

      $timeout(function() {
        if($scope.project.projectRate === 'fixed')
          $scope.tempRate = $scope.fixedRate;
        if($scope.project.projectRate === 'hourly')
          $scope.tempRate = $scope.hourlyRate;
          $scope.rateListt = [];
          $scope.project.price = $scope.tempRate[0];
        
          var i =0; 
          var name;
          var curCode;

          if($scope.project.currency){
            curCode = $scope.project.currency.code; 
          }
          
          if(curCode === 'USD'){
            for(i=0; i<$scope.tempRate.length; i++){  
              name = $scope.tempRate[i].name.split('(')[0];

              if(typeof $scope.tempRate[i].value === 'undefined'){
                $scope.max = '';
                $scope.min = '';

              }else{
                $scope.min = $scope.tempRate[i].value.min;
                $scope.max = $scope.tempRate[i].value.max;

                $scope.tempRate[i].value.min = $scope.min;
                $scope.tempRate[i].value.max = $scope.max;
              }
              $scope.optCharg = 1; 
              $scope.tempRate[i].name = name+'('+$scope.project.currency.symbol_native+$scope.min+ '-'+$scope.project.currency.symbol_native+$scope.max+')';
              $scope.rateListt.push($scope.tempRate[i]);
            }
          }
          else{
            for(i=0; i<$scope.tempRate.length; i++){
              name = $scope.tempRate[i].name.split('(')[0];
              if(typeof $scope.tempRate[i].value === 'undefined'){
                $scope.max = '';
                $scope.min = '';
                // $scope.tempRate[i].value.min = $scope.min;
                // $scope.tempRate[i].value.max = $scope.max;
              }else{
                if(curCode === 'KRW'){
                  $scope.optCharg = $rootScope.latestCurrencyRate.KRW; 
                  $scope.max = Math.round(parseFloat($scope.tempRate[i].value.max)*$rootScope.latestCurrencyRate.KRW);
                  if($scope.tempRate[i].value.min === 7.5){
                    $scope.min = Math.round(parseFloat($scope.tempRate[i].value.min)*$rootScope.latestCurrencyRate.KRW)+30;
                  }else{
                    $scope.min = Math.round(parseFloat($scope.tempRate[i].value.min)*$rootScope.latestCurrencyRate.KRW);
                  }
                  $scope.tempRate[i].value.min = $scope.min;
                  $scope.tempRate[i].value.max = $scope.max;
                }

                if(curCode === 'JPY'){
                  $scope.optCharg = $rootScope.latestCurrencyRate.JPY;
                  $scope.max = Math.round(parseFloat($scope.tempRate[i].value.max)*$rootScope.latestCurrencyRate.JPY);
                  $scope.min = Math.round(parseFloat($scope.tempRate[i].value.min)*$rootScope.latestCurrencyRate.JPY);
                  $scope.tempRate[i].value.min = $scope.min;
                  $scope.tempRate[i].value.max = $scope.max;
                }

                if(curCode === 'CNY'){
                  $scope.optCharg = $rootScope.latestCurrencyRate.JPY;
                  $scope.max = Math.round(parseFloat($scope.tempRate[i].value.max)*$rootScope.latestCurrencyRate.CNY);
                  $scope.min = Math.round(parseFloat($scope.tempRate[i].value.min)*$rootScope.latestCurrencyRate.CNY);
                  $scope.tempRate[i].value.min = $scope.min;
                  $scope.tempRate[i].value.max = $scope.max;
                }
              } 
              
              if($scope.project.currency){
                $scope.tempRate[i].name = name+'('+$scope.project.currency.symbol_native+$scope.min+ '-'+$scope.project.currency.symbol_native+$scope.max+')';
                $scope.rateListt.push($scope.tempRate[i]);
              }
            }
          }
      }, 100);
    };
   
    $scope.project.isLocal = false;
    $scope.pakagePrices = {
      'pakage_1': 0,
      'pakage_2': 3,
      'pakage_3': 3,
      'private': 0,
      'sealed': 1,
      'NDA': 1,
      'urgent': 1
    };

    $scope.rate = 0;
    $scope.max = 5;
    $scope.isReadonly = true;

    $scope.hoveringOver = function (value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };

    $scope.ratingStates = [{
        stateOn: 'glyphicon-star',
        stateOff: 'glyphicon-star-empty'
      },
      {
        stateOn: 'glyphicon-star',
        stateOff: 'glyphicon-star-empty'
      },
      {
        stateOn: 'glyphicon-star',
        stateOff: 'glyphicon-star-empty'
      },
      {
        stateOn: 'glyphicon-star',
        stateOff: 'glyphicon-star-empty'
      },
      {
        stateOn: 'glyphicon-star',
        stateOff: 'glyphicon-star-empty'
      },
    ];

    //Calculate Average of Rating stars
    $scope.specifiction = 0;
    $scope.communication = 0;
    $scope.payment = 0;
    $scope.professionl = 0;
    $scope.overall = 0;

    $scope.calculteAvg = function () {
      var sum = $scope.specifiction + $scope.communication + $scope.payment + $scope.professionl + $scope.overall;
      var Avg = sum / 5;
    };

    $scope.checkLocal = function () {
      $scope.project.isLocal = !$scope.project.isLocal;
    };

    // Toggle custom profile fields
    $scope.toggleCustomPrice = function () {
      // //console.log('in');
    };

    $scope.rateToFixed = function () {
      $scope.rateList = $scope.fixedRate;
      $scope.project.price = $scope.rateList[3];
      $scope.project.minRange = '';
      $scope.project.maxRange = '';
    };

    $scope.rateToHourly = function () {
      $scope.rateList = $scope.hourlyRate;
      $scope.project.price = $scope.rateList[2];
      $scope.project.minRange = '';
      $scope.project.maxRange = '';
    };

    // to hide button, bid on this project
    $scope.btnBTP = function () { 
      $scope.btnBidThisPro = true;
    };

    $scope.checktotalAmount = function (value, pakage_name) {
      console.log('checktotalAmount:', value);
      if (pakage_name === 'pakage_1') {
        if (value) {
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.pakage_1*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
          if ($scope.pakage_2 === true) {
            $scope.pakage_2 = false;
            $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_2*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
          }
          if ($scope.pakage_3 === true) {
            $scope.pakage_3 = false;
            $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_3*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
          }

        } else { 
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_1*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        }

      } else if (pakage_name === 'pakage_2') {
        if (value) {
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.pakage_2*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        } else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_2*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        }


      } else if (pakage_name === 'pakage_3') {
        if (value) {
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.pakage_3*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        } else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.pakage_3*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        }

      } else if (pakage_name === 'private') {
        if (value) {
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.private*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        } else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.private*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        }

      } else if (pakage_name === 'sealed') {
        if (value) {
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.sealed*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        } else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.sealed*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        }

      } else if (pakage_name === 'NDA') {
        if (value) {
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.NDA*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        } else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.NDA*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        }

      } else if (pakage_name === 'urgent') {
        if (value) {
          $scope.totalAmount = $scope.totalAmount + ($scope.pakagePrices.urgent*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        } else {
          $scope.totalAmount = $scope.totalAmount - ($scope.pakagePrices.urgent*$rootScope.latestCurrencyRate[$scope.project.currency.code]);
        }

      }
      if($scope.totalAmount < 0){
        $scope.totalAmount = $scope.totalAmount * (-1);
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
            $scope.project.location = address;
          }else{
            Notification.error({
              message: '위치를 찾을 수 없습니다. 다시 시도하십시오.', 
              positionY: 'bottom', 
              positionX: 'right', 
              closeOnClick: true, 
              title: '<i class="glyphicon glyphicon-remove"></i> 위치 오류'
            });
          }
            
        });
      });

    };

    // File Uploader start
    $scope.uploader = new FileUploader({
      url: '/api/project/uploadProjectFile',
      alias: 'newProjectFile'
    });
 
    $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      // console.info('onWhenAddingFileFailed', item, filter, options);
    };
 
    $scope.uploader.onBeforeUploadItem = function(item) {
      // console.info('onBeforeUploadItem', item);
    };
    
    $scope.uploader.onProgressItem = function(fileItem, progress) {
      // console.info('onProgressItem', fileItem, progress);
    };

    var uploadedFileLink;
    var uploadedFileName;
    $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
      uploadedFileLink = response;
      uploadedFileName = fileItem.file.name;
      $scope.sucMsg = '파일이 성공적으로 업로드 되었습니다.'  ;
      $scope.errMsg = '';
    };

    $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
      SweetAlert.swal("File upload failed", "Error in file uploading.", "error");
      $scope.errMsg = response.message;
      $scope.sucMsg = '';
    };
 
    $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) { 
      if(fileItem.progress === 0){
        $scope.errMsg = response.message;
        $scope.sucMsg = '';
      }
      else{
        $scope.sucMsg = '파일이 성공적으로 업로드 되었습니다.';
        $scope.errMsg = '';
      }
    };
   
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      $scope.item = fileItem;

      if(fileItem.file.size > (10*1024*1024)){
        //remove it from queue
        $scope.uploader.clearQueue();

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
        };
      }
    };

    // File Uploader end
    // Get users location
    geolocation.getLocation().then(function(data){
      $scope.coords = { lat:data.coords.latitude, long:data.coords.longitude };
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.coords.lat + ',' + $scope.coords.long + '&sensor=true';
      $http.get(url)
      .then(function(result) {
        if(result.data.results[0]){
          $scope.countryName  = result.data.results[0].address_components[4].long_name;
          $scope.countryCod  = result.data.results[0].address_components[4].short_name;
        }
      });
    });

    /** Create new Project*/ 
    $scope.create = function (isValid) {
      $scope.error = null;
      var project = new Projects($scope.project);

      if(!project.currency){
        SweetAlert.swal('Select currency');
        return;
      }

      // Get users location
      geolocation.getLocation().then(function(data){
        $scope.coords = { lat:data.coords.latitude, long:data.coords.longitude };
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.coords.lat + ',' + $scope.coords.long + '&sensor=true';
        $http.get(url)
        .then(function(result) {
          if(result.data.results[0]){
            $scope.countryName  = result.data.results[0].address_components[4].long_name;
            $scope.countryCod  = result.data.results[0].address_components[4].short_name;
          }
        });
      });

      if($scope.authentication.user.country){
        project.userInfo = {
          'email': $scope.authentication.user.email,
          'name': $scope.authentication.user.displayName,
          'username': $scope.authentication.user.username,
          'imageURL': $scope.authentication.user.profileImageURL,
          'country': $scope.authentication.user.country.name,
          'countryCode': $scope.authentication.user.country.code,
          'created': $scope.authentication.user.created,
          'notifications': $scope.authentication.user.notificationsOnOff
        };
      }
      else if(!$scope.authentication.user.country && $scope.countryName){
        project.userInfo = {
          'email': $scope.authentication.user.email,
          'name': $scope.authentication.user.displayName,
          'username': $scope.authentication.user.username,
          'imageURL': $scope.authentication.user.profileImageURL,
          'country': $scope.countryName,
          'countryCode': $scope.countryCod,
          'created': $scope.authentication.user.created,
          'notifications': $scope.authentication.user.notificationsOnOff
        };
      }
      else if(!$scope.authentication.user.country && !$scope.countryName){
        project.userInfo = {
          'email': $scope.authentication.user.email,
          'name': $scope.authentication.user.displayName,
          'username': $scope.authentication.user.username,
          'imageURL': $scope.authentication.user.profileImageURL,
          'country': 'South Korea',
          'countryCode': 'KOR',
          'created': $scope.authentication.user.created,
          'notifications': $scope.authentication.user.notificationsOnOff
        };
      }
       
      var Pakages = {
        'featured': $scope.pakage_1,
        'pakage_2': $scope.pakage_2,
        'fulltime': $scope.pakage_3,
        'private': $scope.private,
        'sealed': $scope.sealed,
        'NDA': $scope.NDA,
        'urgent': $scope.urgent
      };
      project.additionalPakages = Pakages; 
      if($scope.totalAmount > 0){ /*when additional feature is selected*/

        $scope.totalAmount = parseFloat($scope.totalAmount).toFixed(0);
        
        SweetAlert.swal({
          title: "프로젝트 등록을 하시겠습니까?",
          text: "회원님께서는 아웃소싱오케이 서비스를 구매하셨습니다. 금액은 " + $scope.project.currency.symbol_native + $scope.totalAmount + "  원 입니다. 회원님께서 승인 할 경우 회원님계좌에 있는 예치금에서 자동인출됩니다. 예치금이 부족할 경우 [서비스 이용료 결제]에서 지불하시길 바랍니다.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#2f70a9",
          confirmButtonText: "등록하기",
          closeOnConfirm: false,
          closeOnCancel: false
        },function (isConfirm) {
          if(isConfirm){
            SweetAlert.close();
            if($rootScope.userAccountBalance.accountBalance[$scope.project.currency.code]  >= $scope.totalAmount){
              $scope.postNewProject();
              $scope.isLoading = true;
            }
            else if($rootScope.userAccountBalance.accountBalance[$scope.project.currency.code] < $scope.totalAmount ){
              $scope.isLoading = true;

              var convertedAmount;
              if($scope.project.currency.code === 'USD'){
                console.log('usd');
                convertedAmount = $rootScope.userAccountBalance.accountBalance.USD +  ($rootScope.userAccountBalance.accountBalance.KRW/$rootScope.latestCurrencyRate.KRW);
              }else if($scope.project.currency.code === 'KRW'){
                console.log('krw');
                convertedAmount =  $rootScope.userAccountBalance.accountBalance.KRW + ($rootScope.userAccountBalance.accountBalance.USD*$rootScope.latestCurrencyRate.KRW);
              }

              // console.log('totalAmount',$scope.totalAmount);
              // console.log('wallet wala',$rootScope.userAccountBalance.accountBalance[$scope.project.currency.code]);
              // console.log('coverted', convertedAmount);

              if(convertedAmount>= $scope.totalAmount){
                // updateAccount
                Account.updateAccount({
                  ownerId: Authentication.user.username,
                  currency: $scope.project.currency.code,
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
                    $scope.postNewProject();
                  });

                }, function(fail){
                  $scope.isLoading = false;
                  SweetAlert.swal('Try again!', '', 'warning');
                });
              }else{
                $scope.isLoading = false;
                SweetAlert.swal("예치금 잔액부족", "계정에 예치금이 잔액이 부족합니다.", "error");
                $location.path('credit-deposit');
              }
            }
          }else{
            $scope.viewLoading = false;
            SweetAlert.close();
          }
        }); 
      }else{ /*When no additional feature is selected*/
        if($scope.uploader.queue.length){
          // $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.success = true;
            // project.fileLink = response;
            // project.fileName = fileItem.file.name;
            project.fileLink = uploadedFileLink;
            project.fileName = uploadedFileName;
            console.log('file uploaded');
            $scope.isLoading = true;
            project.$save(function (response) {
              
              /*Project Feed, Notfiy all the users having 
              the same skills as the project posted have*/

              $scope.skillsRequriedForProj = [];
              for(var i=0; i<response.skills.length; i++){
                $scope.skillsRequriedForProj[i] =response.skills[i].name;
              }

              ProjectFeed.create({
                "publisher": Authentication.user.username,
                "description": response.description,
                "skills": $scope.skillsRequriedForProj,
                "link": response._id,
                "project": response.name
              });
              // ends project feed
              $scope.isLoading = false; 

              $location.path('projects/project-manage/' + response._id);
            }, function(fail){
              $scope.isLoading = false;
              SweetAlert.swal("오류!", "죄송합니다.문제가 발생했습니다.", "error");
              toastr.error('오류','문제가 발생했습니다.');
            });
          // };
        }
        else if (!$scope.uploader.queue.length) {
          $scope.isLoading = true;
          project.$save(function (response) {
            
            /*Project Feed, Notfiy all the users having 
            the same skills as the project posted have*/

            $scope.skillsRequriedForProj = [];
            for(var i=0; i<response.skills.length; i++){
              $scope.skillsRequriedForProj[i] =response.skills[i].name;
            }

            ProjectFeed.create({
              "publisher": Authentication.user.username,
              "description": response.description,
              "skills": $scope.skillsRequriedForProj,
              "link": response._id,
              "project": response.name
            });
            // ends project feed
            $scope.isLoading = false;
            $location.path('projects/project-manage/' + response._id);

          }, function (errorResponse) {
            $scope.viewLoading = false;
            SweetAlert.swal("오류!", "죄송합니다.문제가 발생했습니다.", "error");
            $scope.error = errorResponse.data.message;
          });
        }
      }

    };

    // Post the project when there is enough money if additonal features are selected
    $scope.postNewProject  = function (){
      var project = new Projects($scope.project);

      if($scope.authentication.user.country){
        project.userInfo = {
          'email': $scope.authentication.user.email,
          'name': $scope.authentication.user.displayName,
          'username': $scope.authentication.user.username,
          'imageURL': $scope.authentication.user.profileImageURL,
          'country': $scope.authentication.user.country.name,
          'countryCode': $scope.authentication.user.country.code,
          'created': $scope.authentication.user.created,
          'notifications': $scope.authentication.user.notificationsOnOff
        };
      }
      else if(!$scope.authentication.user.country && $scope.countryName){
        project.userInfo = {
          'email': $scope.authentication.user.email,
          'name': $scope.authentication.user.displayName,
          'username': $scope.authentication.user.username,
          'imageURL': $scope.authentication.user.profileImageURL,
          'country': $scope.countryName,
          'countryCode': $scope.countryCod,
          'created': $scope.authentication.user.created,
          'notifications': $scope.authentication.user.notificationsOnOff
        };
      }
      else if(!$scope.authentication.user.country && !$scope.countryName){
        project.userInfo = {
          'email': $scope.authentication.user.email,
          'name': $scope.authentication.user.displayName,
          'username': $scope.authentication.user.username,
          'imageURL': $scope.authentication.user.profileImageURL,
          'country': 'South Korea',
          'countryCode': 'KOR',
          'created': $scope.authentication.user.created,
          'notifications': $scope.authentication.user.notificationsOnOff
        };
      }

      var Pakages = {
        'featured': $scope.pakage_1,
        'pakage_2': $scope.pakage_2,
        'fulltime': $scope.pakage_3,
        'private': $scope.private,
        'sealed': $scope.sealed,
        'NDA': $scope.NDA,
        'urgent': $scope.urgent
      };
      project.additionalPakages = Pakages;
      
      Transactions.transfer({
        Sid: $rootScope.userAccountBalance.id,
        Rid: $rootScope.adminEWalletId,
        amount: parseFloat($scope.totalAmount),
        currency: $scope.project.currency.code,
        referenceId: $scope.project._id,
        description:{
          'detail': '<b>'+$scope.project.name+'</b>프로젝트 업그레이드 추가 에스크로 자금 인출',
          'tax': 0
        }
      }, function(res){
        
        if($scope.uploader.queue.length){ /*If file is attached*/
            $scope.isLoading = true;
            $scope.success = true;
            project.fileLink = uploadedFileLink;
            project.fileName = uploadedFileName;

            project.$save(function (response) {

              //Create service transaction
              Transactions.create({
                accountId: $rootScope.userAccountBalance.id,
                transectionType: 'service',
                transectionFrom: $rootScope.userAccountBalance.ownerId,
                referenceId: response._id,
                currency: $scope.project.currency.code,
                amount: parseFloat($scope.totalAmount),
                description:{
                  'detail': 'Project Posted with extra services'
                },
                transactionDate: Date.now()
              });

              /*Project Feed, Notfiy all the users having 
              the same skills as the project posted have*/

              Account.findOne({
                filter: {
                  where: {
                    ownerId: $scope.authentication.user.username
                  }
                }
              }, function (res) {
                $rootScope.userAccountBalance = res;
              });
              $scope.isLoading = false;
              SweetAlert.swal("프로젝트 등록 완료!", "프로젝트 등록이 성공적으로 완료되었습니다.", "success");

              $scope.skillsRequriedForProj = [];
              for(var i=0; i<response.skills.length; i++){
                $scope.skillsRequriedForProj[i] =response.skills[i].name;
              }

              ProjectFeed.create({
                "publisher": Authentication.user.username,
                "description": response.description,
                "skills": $scope.skillsRequriedForProj,
                "link": response._id,
                "project": response.name
              });
              // ends project feed
              $location.path('projects/project-manage/' + response._id);
            }, function(fail){
              //Reverse the transaction
              $scope.isLoading = false;
              SweetAlert.swal("오류!", "문제가 발생했습니다.", "warning");
              $scope.viewLoading = false;
              Transactions.transfer({
                Sid: $rootScope.adminEWalletId,
                Rid: $rootScope.userAccountBalance.id,
                amount: parseFloat($scope.totalAmount),
                currency: $scope.project.currency.code,
                referenceId: '-',
                description:{
                  'detail': '<b>'+$scope.project.name+'</b>업그레이드 에스크로 자금 환불',
                  'tax': 0
                }
              });
            });
          // };
        }else if(!$scope.uploader.queue.length){ /*If no file is attached*/
          $scope.isLoading = true;
          project.$save(function (response) {

            //Create service transaction
            Transactions.create({
              accountId: $rootScope.userAccountBalance.id,
              transectionType: 'service',
              transectionFrom: $rootScope.userAccountBalance.ownerId,
              referenceId: response._id,
              currency: $scope.project.currency.code,
              amount: parseFloat($scope.totalAmount),
              description:{
                'detail': 'Project Posted with extra services'
              },
              transactionDate: Date.now()
            });

            /*Project Feed, Notfiy all the users having 
            the same skills as the project posted have*/

            Account.findOne({
              filter: {
                where: {
                  ownerId: $scope.authentication.user.username
                }
              }
            }, function (res) {
              $rootScope.userAccountBalance = res;
            });
            SweetAlert.swal("프로젝트 등록 완료!", "프로젝트 등록이 성공적으로 완료되었습니다.", "success");

            $scope.skillsRequriedForProj = [];
            for(var i=0; i<response.skills.length; i++){
              $scope.skillsRequriedForProj[i] =response.skills[i].name;
            }

            ProjectFeed.create({
              "publisher": Authentication.user.username,
              "description": response.description,
              "skills": $scope.skillsRequriedForProj,
              "link": response._id,
              "project": response.name
            });
            // ends project feed

            $scope.isLoading = false;
            $location.path('projects/project-manage/' + response._id);

          }, function (errorResponse) {
            //Reverse the transaction
            $scope.isLoading = false;
            SweetAlert.swal("오류!", "문제가 발생했습니다.", "warning");
            Transactions.transfer({
              Sid: $rootScope.adminEWalletId,
              Rid: $rootScope.userAccountBalance.id,
              amount: parseFloat($scope.totalAmount),
              currency: $scope.project.currency.code,
              referenceId: '-',
              description:{
                'detail': '<b>'+$scope.project.name+'</b>업그레이드 에스크로 자금 환불',
                'tax': 0
              }
            });

          });
        }
          

      }, function(transFail){
        $scope.isLoading = false;
        SweetAlert.swal("오류!", "죄송합니다.문제가 발생했습니다.다시 시도하십시오.", "error");
      });
    };

    // Edit bid once bidded
    $scope.editBid = function (description, deliverDays) { 
      $scope.currentBidId = $stateParams.bidId;
      var bidData = {
        'userId': $scope.authentication.user._id,
        'bidderName': $scope.authentication.user.displayName,
        'bidderEmail': $scope.authentication.user.email,
        'bidId': $stateParams.bidId,
        'bidderImageURl': $scope.authentication.user.profileImageURL,
        'bidderInfo': $scope.authentication.user,
        'created': Date.now(),
        'actualBid': $scope.paidYours,
        'yourBid': $scope.yourBid,
        'awarded': $scope.isAwarded,
        'deliverInDays': deliverDays,
        'proposal': {
          'description': description,
          'milestones': $scope.milestones
        }
      };

      var obj = {
        'bids': bidData
      };

      //console.log('edit bid obj', obj);

      if ($stateParams.bidId) {
        return $http({
          url: '/api/project/editBid/' + $scope.project._id,
          method: 'PUT',
          data: obj
        }).then(function (response) {
          // success 
          $scope.project = response.data;
          console.log('$scope.project 2 ',$scope.project);
          $timeout(function () {
            $scope.findAvgBid();
          }, 100);

          $location.path('projects/view/' + $scope.project._id);
        }, function (response) {
          // failed
          //console.log(response);
        });
      }

    };

    $scope.submitBid = function (deliverDays) {

      if ($scope.authentication.user.remainingBids >0) {
        $scope.isLoading = true;

        var bidderInfo = $scope.authentication.user;
        bidderInfo.myProjects = '';
        bidderInfo.projectsAwarded = '';

        var bidData = {
          'userId': $scope.authentication.user._id,
          'bidderName': $scope.authentication.user.displayName,
          'bidderEmail': $scope.authentication.user.email,
          'bidderImageURl': $scope.authentication.user.profileImageURL,
          'bidderInfo': bidderInfo,
          'created': Date.now(),
          'actualBid': $scope.paidYours,
          'yourBid': $scope.yourBid,
          'awarded': 'no',
          'deliverInDays': deliverDays
        };
        
        var obj = {
          'bids': bidData
        };

        return $http({
          url: '/api/project/placeBid/' + $scope.project._id,
          method: 'PUT',
          data: obj
        }).then(function (response) {
          $scope.isLoading = false;

          $scope.milestones = [{
            description: '1차 대금',
            price: parseInt($scope.yourBid),
            status: 'Requested'
          }];
          $scope.milstoneTotal = $scope.yourBid;
          $scope.totalBidAmount = parseInt($scope.yourBid);
          $scope.project = response.data.project;
          console.log('$scope.project 3 ',$scope.project);
          $scope.authentication.user = response.data.user;
          $timeout(function () {
            $scope.findAvgBid();
          }, 100);

          // Notify the employer
          Notifications.create({  
            "publisher": Authentication.user.username,  
            "subscriber": $scope.project.userInfo.username, 
            "description": $scope.authentication.user.username + " 님이 프로젝트에 지원했습니다.", 
            "link": $scope.project._id, 
            "isClicked": false,
            "project": true
          });

          Socket.emit('ProjectNotif', {
            "publisher": Authentication.user.username,  
            "subscriber": $scope.project.userInfo.username, 
            "description": $scope.authentication.user.username + " 님이 프로젝트에 지원했습니다.", 
            "link": $scope.project._id, 
            "isClicked": false,
            "project": true
          });

        },function(fail){
          $scope.isLoading = false;
          SweetAlert.swal('지원오류', '죄송합니다. 지원금액을 다시 작성하십시오!', 'warning');
        });
      } else {
        SweetAlert.swal('지원 횟수 부족!', '죄송합니다. 지원/입찰 횟수가 부족합니다. 지원 횟수 추가요청을 하십시오!', 'warning');
      }

    };

    $scope.onTime = true;
    $scope.onBudget =true;
    //feedback
    $scope.submitFeedBack = function () {
      $timeout(function() {
        usSpinnerService.spin('feedbackLoader');
      }, 100);

      $timeout(function() {
        usSpinnerService.stop('feedbackLoader');
        $location.path('/thankyou');
      }, 100);
      
      if (!$scope.project.bids) {
        alert('Projec isn\'t assigned to anyone yet!');
        return;
      }

      for (var i = 0; i < $scope.project.bids.length; i++) {
        if ($scope.project.bids[i].awarded === 'no' || $scope.project.bids[i].awarded === 'yes' || $scope.project.bids[i].awarded === 'pending') {
          $scope.bidIndex = i;
          $scope.bidderId = $scope.project.bids[i].userId;
          break;
        }
      } 
      var sum = $scope.specifiction + $scope.communication + $scope.payment + $scope.professionl + $scope.overall;
      var avgRating = sum / 5; 

      var feedbackData = {
        'userId': $scope.authentication.user._id,
        'specifiction': $scope.specifiction,
        'communication': $scope.communication,
        'payment': $scope.payment,
        'professionl': $scope.professionl,
        'overall': $scope.overall,
        'avgRating': avgRating,
        'comment': $scope.comment,
        'onTime': $scope.onTime,
        'onBudget': $scope.onBudget,
        'proj_name': $scope.project.name
      }; 

      var obj = {
        'bids': feedbackData,
        'index': $scope.bidIndex,
        'bidderId': $scope.bidderId,
        'empIdd': $scope.project.user._id,
        'currentUserIdd': $scope.authentication.user._id,
        'projectId': $scope.project._id,
        'ratedDate': Date.now()
      }; 

      return $http({
        url: '/api/project/placeFeedBack/' + $scope.project._id,
        method: 'PUT',
        data: obj
      }).then(function (response) { 
        $scope.project = response.data;
        console.log('$scope.project 4 ',$scope.project);
        $timeout(function() {
          usSpinnerService.stop('feedbackLoader');
          $location.path('/thankyou');
        }, 100);

        //console.log('response', response.data);
      }, function (err) {
        $timeout(function() {
          usSpinnerService.stop('feedbackLoader');
        }, 100); 
        toastr.error('죄송합니다.문제가 발생했습니다.다시 시도하십시오.', 'Error');
      });
    };

    $scope.submitProposal = function (bidDescription, status) {
      $scope.isLoading = true;
      for (var i = 0; i < $scope.project.bids.length; i++) {
        if ($scope.authentication.user._id === $scope.project.bids[i].userId) {
          $scope.bidIndex = i;
          break;
        }
      }

      var proposal = {
        'description': bidDescription,
        'milestones': $scope.milestones
      };

      $scope.project.bids[$scope.bidIndex].proposal = proposal;
      var obj = {
        'data': $scope.project.bids[$scope.bidIndex],
        'index': $scope.bidIndex
      };

      return $http({
        url: '/api/project/submitProposal/' + $scope.project._id,
        method: 'PUT',
        data: obj
      }).then(function (response) {
        $scope.isLoading = false; 
        $scope.project = response.data;
        console.log('$scope.project 5 ',$scope.project); 
      }, function (response) {
        $scope.isLoading = false;
      });
    };

    $scope.award = function (index) {
      var bidData = $scope.project.bids[index];
      bidData.awarded = 'pending';
      var object = {
        'data': bidData,
        'index': index
      };

      $scope.findAwardedProject(); 

      return $http({
        url: '/api/project/projectAwarded/' + $scope.project._id,
        method: 'PUT',
        data: object
      }).then(function (response) { 
        $scope.project = response.data;
        console.log('$scope.project 6 ',$scope.project);
        $scope.project.bids = response.data.bids;

        // Notify the user
        Notifications.create({  
          "publisher": Authentication.user.username,  
          "subscriber": $scope.awardedProject.bidderInfo.username, 
          "description": Authentication.user.username + " 님 프로젝트에 선정되었습니다. 의뢰인께 승인여부를 통보바랍니다.", 
          "link": $scope.project._id, 
          "isClicked": false,
          "project": true
        });

        Socket.emit('ProjectNotif', {
          "publisher": Authentication.user.username,  
          "subscriber": $scope.awardedProject.bidderInfo.username, 
          "description": Authentication.user.username + " 님 프로젝트에 선정되었습니다. 의뢰인께 승인여부를 통보바랍니다.", 
          "link": $scope.project._id, 
          "isClicked": false,
          "project": true
        });

      });
    };

    $scope.acceptProject = function () {
      var bidData = $scope.awardedProject; 
      bidData.awarded = 'yes';
      bidData.projectAcceptDate = Date.now();

      var object = {
        'data': bidData,
        'index': $scope.awardedProjectIndex
      };
      return $http({
        url: '/api/project/acceptProject/' + $scope.project._id,
        method: 'PUT',
        data: object
      }).then(function (response) {
        $scope.project = response.data;
        console.log('$scope.project 7 ',$scope.project);
        $scope.project.bids = response.data.bids;

        // Notify the user
        Notifications.create({  
          "publisher": Authentication.user.username,  
          "subscriber": $scope.project.userInfo.username, 
          "description": Authentication.user.username + " 님이 프로젝트를 승인하였습니다", 
          "link": $scope.project._id, 
          "isClicked": false,
          "project": true
        });

        Socket.emit('ProjectNotif', {
          "publisher": Authentication.user.username,  
          "subscriber": $scope.project.userInfo.username, 
          "description": Authentication.user.username + " 님이 프로젝트를 승인하였습니다", 
          "link": $scope.project._id, 
          "isClicked": false,
          "project": true
        });

      });
    };

    // Reject the awarded project
    $scope.rejectProject = function () {

      var bidData = $scope.awardedProject;
      bidData.awarded = 'no';
      bidData.rejected = true;
      bidData.projectRejectDate = Date.now();
      var object = {
        'data': bidData,
        'index': $scope.awardedProjectIndex
      };
      return $http({
        url: '/api/project/acceptProject/' + $scope.project._id,
        method: 'PUT',
        data: object
      }).then(function (response) {
        // Notify the user
        Notifications.create({  
          "publisher": Authentication.user.username,  
          "subscriber": $scope.project.userInfo.username, 
          "description": Authentication.user.username + " 님이 프로젝트를 거절하였습니다", 
          "link": $scope.project._id, 
          "isClicked": false,
          "project": true
        }, function(suc){
          $location.path('/projects/project-list');

          Socket.emit('ProjectNotif', {
            "publisher": Authentication.user.username,  
            "subscriber": $scope.project.userInfo.username, 
            "description": Authentication.user.username + " 님이 프로젝트를 거절하였습니다", 
            "link": $scope.project._id, 
            "isClicked": false,
            "project": true
          });

        });
      });

    };

    // Delete/Remove existing Project
    $scope.remove = function (project) {
      if (project) {
        project.$remove();

        for (var i in $scope.projects) {
          if ($scope.projects[i] === project) {
            $scope.projects.splice(i, 1);
          }
        }
      } else {
        $scope.project.$remove(function () {
          $location.path('projects');
        });
      }
    };

    // Update existing Project
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'projectForm');

        return false;
      }

      var project = $scope.project;

      project.$update(function () {
        $location.path('projects/' + project._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    var skills=($state.params.skills)?$state.params.skills:0;
    //Get total count at once
    $http.get('/api/totalProjects/'+skills).then(function(totalProjects){
      $scope.totalCount = totalProjects.data.count; 
      $scope.totalprojects = totalProjects.data.count; 
    });
    // Find a list of Projects
    $scope.find = function (pageNo) {
      $scope.projListLoading = true;
      var size = 5;
      var skills=($state.params.skills)?$state.params.skills:0;
      $http.get('/api/projects/'+size+'/'+pageNo+'/'+skills).then(function(proj){ 
        $scope.view_processing = false;
        $scope.projListLoading = false;
        $scope.promiseResolved = true;
        $scope.projects = proj.data.projects;
        $scope.allProjects = proj.data.projects;
        $scope.oldData = $scope.projects;
        $scope.filteredProjects = $scope.projects;
      });
    };

    // getSkillsAndCat
    $scope.getSkillsAndCat = function(){
      if(!$scope.skills.length){
        $scope.view_processing = true;
        // Categories.find({}, function(res){
          // $scope.typeOfWork = res;
          Skills.find({filter:{limit: 300}}, function(res){
            $scope.skills = res;
            $scope.view_processing = false;
          });
        // });
      }
    };

    // Find existing Project
    $scope.findOne = function () {
      // show loader
      $scope.projViewProcess = true;
      $scope.curBidId = $stateParams.bidId;
      $scope.project = Projects.get({
        projectId: $stateParams.projectId
      }).$promise.then(function (data) {
        $scope.projViewProcess = false;
        $scope.project = data;
        console.log('$scope.project 8 ',$scope.project,' $scope ',$scope.totalAmount);
        $scope.projectCur = $scope.project.currency; 

        $scope.getremainingDaysAndHours();
        // Get Latest profile info of bidders
        var length = $scope.project.bids.length; 
        var bids = $scope.project.bids; 
        var i=0;

        while(i<length){
          getUpdatedBidderList(i, bids[i].bidderInfo._id);
          i++;
        }

        if(typeof($scope.curBidId) === 'undefined') {
          $scope.paidToYouAmount = parseInt(parseInt($scope.project.minRange) + parseInt($scope.project.maxRange)) / 2;
          $scope.paidYours = $scope.paidToYouAmount;
          $scope.updateValues($scope.paidYours);

          $scope.milestones = [{
            description: '프로젝트 대금',
            price: parseInt($scope.yourBid)
          }];

          $scope.totalBidAmount = parseInt($scope.yourBid);
          $scope.findAwardedProject();
          $scope.checkBidExists();
          $scope.findAvgBid();
          $scope.projectUserInfo();
        }
      
        if ($scope.project.bids) { 
          $scope.getBidInfo();
          $scope.projectUserInfo();
        } else if ($location.path().includes('edit-bid')) {
          $scope.paidYours = '';
          $scope.projectFee = '';
          $scope.yourBid = '';
          $scope.deliverDays = '';
          $scope.milestones = '';
        }
        
        console.log(' $scope.totalAmount ',$scope.totalAmount);

      }, function (error) {
        $scope.projViewProcess = false;
      });
    };

    // Get Latest profile info of bidders
    function getUpdatedBidderList(index, userId){
      $http({
        url: '/api/hiddenUser/' + userId,
        method: 'GET'
      }).then(function (succ) {
        $scope.project.bids[index].bidderInfo = succ.data;

        if($scope.project.bids[index].awarded === 'yes'){
          $scope.awardedProject.bidderImageURl = succ.data.profileImageURL;
          $scope.awardedProject.bidderName = succ.data.username;
        }
        
      });
    }

    $scope.getremainingDaysAndHours = function () {
      var date_future = new Date($scope.project.created);
      date_future.setDate(date_future.getDate() + 15);
      var date_now = new Date();

      var seconds = Math.floor((date_future - (date_now)) / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      $scope.days = Math.floor(hours / 24);

      $scope.hours = hours - ($scope.days * 24);
    };

    $scope.getBidInfo = function () {

      for (var i = 0; i < $scope.project.bids.length; i++) {

        

        if ($scope.curBidId === $scope.project.bids[i].bidId) {

          $scope.paidYours = $scope.project.bids[i].actualBid;
          $scope.yourBid = $scope.project.bids[i].yourBid;
          $scope.deliverDays = $scope.project.bids[i].deliverInDays;
          $scope.projectFee = parseInt($scope.project.bids[i].yourBid) - parseInt($scope.project.bids[i].actualBid);
          $scope.totalBidAmount = parseInt($scope.project.bids[i].yourBid);
          if ($scope.project.bids[i].proposal) {
            $scope.description = $scope.project.bids[i].proposal.description;
          }

          $scope.milestones = [{
            description: '순차별 프로젝트 대금지금 일정표 제목 입력바랍니다',
            price: parseInt($scope.yourBid)
          }];

          $scope.isAwarded = $scope.project.bids[i].awarded;

          // //console.log('Is Awarded: ', $scope.isAwarded);

          // //console.log('$scope.project.bids[i].awarded;', $scope.project.bids[i].awarded);

          if ($scope.project.bids[i].proposal) {
            $scope.milestones = $scope.project.bids[i].proposal.milestones;
          }
          break;
        }

      }
    };
    
    $scope.findAwardedProject = function () {
      $scope.awardedProjectArray = [];
      for (var j = 0; j < $scope.project.bids.length; j++) {
        if ($scope.project.bids[j].awarded === 'yes' || $scope.project.bids[j].awarded === 'pending') {
          $scope.awardedProject = $scope.project.bids[j];
          $scope.awardedProjectIndex = j;
          // If project is awarded to more than one freelancer 
          $scope.awardedProjectArray.push($scope.project.bids[j]);
        }
      }

      if ($scope.awardedProject) {
        if ($scope.awardedProject.proposal) {
          $scope.totalAmountOfMilestones = 0.0;
          for (var i = 0; i < $scope.awardedProject.proposal.milestones.length; i++) {
   
            if ($scope.awardedProject.proposal.milestones[i].status === 'Created' || $scope.awardedProject.proposal.milestones[i].status === 'Released') {
              $scope.totalAmountOfMilestones = $scope.totalAmountOfMilestones + $scope.awardedProject.proposal.milestones[i].price;
            }
          }
        }
      }

      if($location.absUrl().includes('projects/dispute')) {
 
        if($scope.project.dispute) {
          var date2 = new Date($scope.project.dispute.createdDateExpire);
          var date1 = new Date(Date.now());
 
 
          var seconds = Math.floor((date2 - (date1))/1000);
          var minutes = Math.floor(seconds/60);
          var hours = Math.floor(minutes/60);
          $scope.disputeDaysRemaining = Math.floor(hours/24);
 
          $scope.disputeHoursRemainig = hours-($scope.disputeDaysRemaining*24);
          $scope.disputeMinutesRemainig = minutes-($scope.disputeDaysRemaining*24*60)-($scope.disputeHoursRemainig*60);
          if($scope.disputeDaysRemaining<0){
            $scope.showArbButtonTab2 = true;
          }
 
          if($scope.project.dispute.tab === 3) {
 
            var date4 = new Date($scope.project.dispute.tab2ArbitrationCreatedDateExpire);
            var date3 = new Date(Date.now());
 
            //console.log(date4);
            //console.log(date3);
 
 
            var secondsTab3 = Math.floor((date4 - (date3))/1000);
            var minutesTab3 = Math.floor(secondsTab3/60);
            var hoursTab3 = Math.floor(minutesTab3/60);
            $scope.tab3DaysRemaining = Math.floor(hoursTab3/24);
 
            $scope.tab3HoursRemainig = hoursTab3-($scope.tab3DaysRemaining*24);
            $scope.tab3MinutesRemainig = minutes-($scope.tab3DaysRemaining*24*60)-($scope.tab3HoursRemainig*60);
            if($scope.tab3DaysRemaining<0){
              $scope.showArbButtonTab3 = true;
            }
          }
 
        }
 
        if($scope.selectedMilestone !== null) {
          $scope.initializeMilestoneTotal();
        }
      }

    };

    $scope.checkBidExists = function () {

      $scope.bidExists = false;

      for (var j = 0; j < $scope.project.bids.length; j++) {

        if ($scope.project.bids[j].userId === $scope.authentication.user._id) {
          $scope.bidExists = true;
          break;
        }

      }
    };

    $scope.findAvgBid = function () {

      $scope.avgBid = 0;

      for (var i = 0; i < $scope.project.bids.length; i++) {

        $scope.avgBid = $scope.avgBid + $scope.project.bids[i].yourBid;

      }
      if ($scope.avgBid !== 0)
        $scope.avgBid = ($scope.avgBid / $scope.project.bids.length).toFixed(2);

    };

    $scope.updateValues = function (paidYours) {
      $timeout(function () {
        //console.log('paid yours', paidYours);
        $scope.paidYours  = paidYours;
        $scope.projectFee = parseInt(paidYours) * 0.00;
        $scope.yourBid = parseInt($scope.projectFee) + parseInt(paidYours);

      }, 100);
    };

    $scope.getMinMaxValue = function () {
      $timeout(function () {

        if($scope.project.price){
          if (!$scope.project.price.name.includes('지출예산 직접입력')) {

            $scope.customizeProjectBudget = false;
            $scope.project.minRange = $scope.project.price.value.min;
            $scope.project.maxRange = $scope.project.price.value.max;
          } else {
            $scope.project.minRange = '';
            $scope.project.maxRange = '';
            $scope.customizeProjectBudget = true;
          }
        }
      }, 100);

    };

    $scope.$watch('currentPage + numPerPage', function () {
      $scope.find($scope.currentPage); 
    });

    $scope.maxSize = 10;
    $scope.numPerPage = 10;
    $scope.currentPage = 1;

    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;

    //for slider filter

    // in contest-post budget
    $scope.sliderContestBudg = {
      minValue: 50,
      maxValue: 1000,
      options: {
        floor: 0,
        ceil: 100,
        step: 1,
        showSelectionBar: true
      }
    };

    // in project-manage
    $scope.sliderManage = {
      minValue: 50,
      maxValue: 1000,
      options: {
        floor: 0,
        ceil: 100,
        step: 1,
        showSelectionBar: true
      }
    };

    // in project-list page
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
    $scope.listingTypes = [{
        value: 'nda',
        label: 'NDA'
      },
      {
        value: 'urgent',
        label: 'URGENT'
      },
      {
        value: 'featured',
        label: 'FEATURED'
      },
      {
        value: 'guranteed',
        label: 'GURANTEED'
      },
      {
        value: 'fulltime',
        label: 'FULL TIME'
      },
      {
        value: 'qualified',
        label: 'QUALIFIED'
      },
      {
        value: 'highlight',
        label: 'HIGHLIGHT'
      },
      {
        value: 'topcontest',
        label: 'TOP CONTEST'
      },
      {
        value: 'localjob',
        label: 'LOCAL JOB'
      },
      {
        value: 'sealed',
        label: 'SEALED'
      }
    ];
    // Adding milestones of project bid
    $scope.$watch('milestones', function (newValue) {

      if (typeof (newValue) !== 'undefined') {
        var total = 0;
        for (var i = 0; i < newValue.length; i++) {
          if (typeof (newValue[i].price) === 'undefined') {
            $scope.priceError = 'price should be greater than or equal to 3';
            $scope.milestoneError = false;
            return;
          } else {
            total = total + newValue[i].price;
            $scope.priceError = '';
            $scope.milestoneError = true;
          }
        }
        if (total !== 0)
          $scope.milstoneTotal = total;
      }
    }, true);


    $scope.remov = function (index) { 
      if ($scope.milestones[index].price > $scope.totalBidAmount || $scope.milestones[index].price === null || typeof ($scope.milestones[index].price) === 'undefined') {
        $scope.milestones[index - 1].price = $scope.milestones[index - 1].price + $scope.totalBidAmount;
      } else {
        $scope.milestones[index - 1].price = $scope.milestones[index - 1].price + $scope.milestones[index].price;
      }

      $scope.totalBidAmount = $scope.milestones[index - 1].price;
      $scope.milestones.splice(index, 1);
    };

    $scope.editBidremov = function (index) { 
      if ($scope.milestones[index].price > $scope.totalBidAmount || $scope.milestones[index].price === null || typeof ($scope.milestones[index].price) === 'undefined') {
        $scope.milestones[index - 1].price = $scope.milestones[index - 1].price + $scope.totalBidAmount;
      } else {
        $scope.milestones[index - 1].price = $scope.milestones[index - 1].price + $scope.milestones[index].price;
      }
 
      $scope.milestones.splice(index, 1);
    };

    $scope.editMilestone = function () {
      $scope.amountCalculated = 0;
      if ($scope.milestones.length < 5) {

        for (var k = 0; k < $scope.milestones.length; k++) {
          $scope.amountCalculated = $scope.amountCalculated + parseInt($scope.milestones[k].price);
        } 

        $scope.amountCalculated = $scope.totalBidAmount - parseInt($scope.amountCalculated); 
        if ($scope.amountCalculated !== 0 && $scope.amountCalculated > 0 && $scope.amountCalculated < $scope.totalBidAmount) {
          $scope.milestones.push({
            description: '',
            price: $scope.amountCalculated,
            status: 'Requested'
          }); 
        }
        for (var j = 0; j < $scope.milestones; j++) {
          $scope.milstoneTotal = $scope.milstoneTotal + $scope.milestones[j].price;
        }
      } 
    };

    $scope.add = function (name) {
      if ($scope.milestones.length < 5) { 
        $scope.amountCalculated = parseInt($scope.totalBidAmount) - parseInt($scope.milestones[$scope.milestones.length - 1].price);
       
        if ($scope.amountCalculated !== 0 && $scope.milestones[$scope.milestones.length - 1].price >= 3 && $scope.milestones[$scope.milestones.length - 1].price <= parseInt($scope.totalBidAmount)) {
           
          $scope.milestones.push({
            description: '',
            price: $scope.amountCalculated,
            status: 'Requested'
          });
          $scope.totalBidAmount = $scope.amountCalculated;
        }
        for (var j = 0; j < $scope.milestones; j++) {
          $scope.milstoneTotal = $scope.milstoneTotal + $scope.milestones[j].price;
        } 
      }
    };

    //TAbs button function my project page
    $scope.employee = true;
    $scope.freelancer = false;
    $scope.showEmployee = function (label) {
      if (label === 'employee') {
        $scope.findPostedProjects(); 
        $scope.freelancer = true;
        $scope.employee = false;
      } else if (label === 'freelancer') { 
        $scope.employee = true;
        $scope.freelancer = false;
      } else {
        $scope.employee = true;
      }
    };

    $scope.paginateSearchResults = function (key) {

      $scope.currentPage = 1;
      var begin = (($scope.currentPage - 1) * $scope.numPerPage);
      var end = begin + $scope.numPerPage;
      if($scope.projects){
        
        $scope.filteredProjects = $scope.projects.slice(begin, end);
        $scope.projectsLength = $scope.projects.length + 1;
      }
    };

    $scope.$watch('searchSkills', function (newValue, oldValue) {
       if (typeof newValue !== 'undefined' && newValue.length > 0) {
        angular.copy($scope.projects, $scope.previousData);
         /*make array of object to pass find or query*/
        var array = [];
        for (var i = 0;i < newValue.length; i++) {
            array.push({
             "skills.name": newValue[i].name
            });
        }
        /*send http post request to get All data that matches the array*/
        $http({
          method: 'POST',
          url: '/api/Allprojects',
          data:array
        }).then(function(res){
          $scope.filteredProjects = res.data;
          $scope.totalCount = 9;
          
        })
        /*$scope.projects = $scope.projects.filter(function (obj) {
          for (var i = 0; i < obj.skills.length; i++) {
            for (var j = 0; j < newValue.length; j++) {
              if (obj.skills[i].name.includes(newValue[newValue.length - 1].name)) {
                return obj.skills[i].name.includes(newValue[newValue.length - 1].name);
              }
            }
          }

        });*/
        //$scope.paginateSearchResults();
      } 
      else if(!newValue && !oldValue){
        $scope.projects = $scope.oldData;
        $scope.paginateSearchResults();
      }
      else if (typeof newValue !== 'undefined' && newValue.length === 0) {
        //console.log($scope.previousData);
        $scope.projects = $scope.previousData;
        $scope.projects = $scope.oldData;
        $scope.totalCount = $scope.totalprojects;
        $scope.previousData = [];
        $scope.paginateSearchResults();
      }
    });

    $scope.search = function (key) {
      if (key === 'byDescription') {
        if($scope.searchProject != ''){
          $http({
            method: 'POST',
            url: '/api/searchproject',
            data:{name:$scope.searchProject}
          }).then(function(res){
            $scope.filteredProjects = res.data;
            $scope.totalCount = 9;
            
          })
         /* $scope.projects = $scope.oldData;
          $scope.projects = $scope.projects.filter(function (obj) {
            if(obj.description.toUpperCase().includes($scope.searchProject.toUpperCase()) || obj.name.toUpperCase().includes($scope.searchProject.toUpperCase())){
              return obj;
              // return obj.description.includes($scope.searchProject);
            }
          });
          $scope.totalCount = $scope.projects.length;*/
        }else if($scope.searchProject == ''){
          $scope.totalCount = $scope.totalprojects;
        }else{
          $scope.projects = $scope.oldData;
          $scope.totalCount = $scope.totalprojects;
        }
      }
      
      $scope.paginateSearchResults();
    };

    $scope.clearFilters = function () {

      $scope.filteredProjects = $scope.allProjects;
      $scope.projects = $scope.allProjects;
      $scope.paginateSearchResults();
    };

    $scope.addMilestone = function (bidId, status, identifier) {
      // If created
      if (status === 'Created') {
        // Confirm user wether to Create Milestone
        SweetAlert.swal({
            title: "프로젝트 대금결제를 하시겠습니까?",
            text: "프리랜서가 작업일정대로 완료되어 단계별로 지급계약을 요청한 경우 프리랜서와 협의하기전 의뢰인께서 원하는 금액대로 대금을 지급하시면 안됩니다. 계약에 준하는 대금지급을 권장합니다. 합의한대로 대금을 지급한경우 취소나 환불은 불가능합니다. 그렇지 않을경우 분쟁조정을 신청해야 됩니다. 그래도 대금지급을 지금 승인하시겠습니까? ",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#5cb85c",
            confirmButtonText: "예, 승인!",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function (isConfirm) {
            if (isConfirm) {
              SweetAlert.close();
              // check if user has enough amount in account and then allow to create milestone
              if ($rootScope.userAccountBalance.accountBalance[$scope.project.currency.code] >= parseFloat($scope.newMilestone.price)) {
                $scope.createMS(bidId, status, identifier);
                return;
              }else if($rootScope.userAccountBalance.accountBalance[$scope.project.currency.code] < parseFloat($scope.newMilestone.price)) {
                $scope.findTotalAmountInWallet($scope.project.currency.code);
                if($scope.totalConverted>=parseFloat($scope.newMilestone.price)){  
                  $scope.createMS(bidId, status, identifier);
                  return;
                }
                else{
                  SweetAlert.swal("예치금 잔액부족", "계정에 예치금이 잔액이 부족합니다.", "error");
                  $location.path('credit-deposit');
                }
              }
              // return;
            } else {
              SweetAlert.close();
            }
          });
      } 
      // If Requested
      else if (status === 'Requested') {
        // Confirm user wether to Create Milestone
        SweetAlert.swal({
            title: "대금요청을 하시겠습니까?",
            text: "의뢰인과 계약한 작업일정대로 작업이 완료되었으면 의뢰인께 프로젝트 대금요청을 하실 수 있습니다. 만약 계약에 준하지 않고 일방적으로 대금요청 하시면 경고조치를 받을수있습니다.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#008000",
            confirmButtonText: "예, 대금요청!",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function (isConfirm) {
            if (isConfirm) {
              SweetAlert.close();
              var obj = {
                'price': $scope.newMilestone.price,
                'description': $scope.newMilestone.description,
                'status': status
              };

              var object = {
                'data': obj,
                'bidId': bidId,
                'identifier' : identifier
              };

              return $http({
                url: '/api/project/addMilestone/' + $scope.project._id,
                method: 'PUT',
                data: object
              }).then(function (response) {
                // //console.log(response);
                SweetAlert.swal("대금요청이 완료되었습니다.!", " ", "success");
                $scope.project = response.data;
                console.log('$scope.project 9 ',$scope.project);
                $scope.findAwardedProject();

                // Milestone request event emit
                object.empName = response.data.userInfo.username;
                var message = {
                    text: object
                };

                // Make sure the Socket is connected
                if (!Socket.socket) {
                    Socket.connect();
                }

                Socket.emit('requestedMileStone', message);

                // Notify the user
                Notifications.create({  
                  "publisher": Authentication.user.username,  
                  "subscriber": $scope.project.userInfo.username, 
                  "description": Authentication.user.username + " 님이 프로젝트 대금을 요청했습니다.", 
                  "link": $scope.project._id, 
                  "isClicked": false,
                  "project": true
                });

                Socket.emit('ProjectNotif', {
                  "publisher": Authentication.user.username,  
                  "subscriber": $scope.project.userInfo.username, 
                  "description": Authentication.user.username + " 님이 프로젝트 대금을 요청했습니다.", 
                  "link": $scope.project._id, 
                  "isClicked": false,
                  "project": true
                });

              }, function (response) {
                SweetAlert.swal("계정오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오.! ", "error");
              });
            } else {
              SweetAlert.close();
            }
          });
      }
    };

    // Milestone creation (When employer himself creates)
    $scope.createMS = function(bidId, status, identifier){
      Transactions.transfer({
        Sid: $rootScope.userAccountBalance.id,
        Rid: $rootScope.adminEWalletId,
        amount: parseFloat($scope.newMilestone.price),
        currency: $scope.project.currency.code,
        referenceId: $scope.project._id,
        description: {
          'detail': '<a href="projects/project-manage/'+$scope.project._id+'">'+$scope.project.name+'</a>프로젝트 에스크로 자금 인출',
          'tax': 0
        }
      }, function (tranSucc) {
        // create milestone when amount is being deducted from the user's account
        var obj = {
          'price': $scope.newMilestone.price,
          'description': $scope.newMilestone.description,
          'status': status
        };

        //console.log($scope.awardedProject);
        var object = {
          'data': obj,
          'bidId': bidId,
          'identifier' : identifier,
          'bidderEmail' : $scope.awardedProject.bidderInfo.email

        };

        return $http({
          url: '/api/project/addMilestone/' + $scope.project._id,
          method: 'PUT',
          data: object
        }).then(function (response) {
          $scope.project = response.data;
          console.log('$scope.project 10 ',$scope.project);
          $scope.findAwardedProject();

          Account.findOne({
            filter: {
              where: {
                ownerId: $scope.authentication.user.username
              }
            }
          }, function (suc) {
            $rootScope.userAccountBalance = suc;
            // $rootScope.totalBalanceKrw();
            SweetAlert.swal("대급지급이 완료되었습니다!", " ", "success");
            // Notify the user
            Notifications.create({  
              "publisher": Authentication.user.username,  
              "subscriber": $scope.awardedProject.bidderInfo.username, 
              "description": Authentication.user.username + " 님이 프로젝트 대금지급을 완료했습니다.", 
              "link": $scope.project._id, 
              "isClicked": false,
              "project": true
            });

            Socket.emit('ProjectNotif', {
              "publisher": Authentication.user.username,  
              "subscriber": $scope.awardedProject.bidderInfo.username, 
              "description": Authentication.user.username + " 님이 프로젝트 대금지급을 완료했습니다.", 
              "link": $scope.project._id, 
              "isClicked": false,
              "project": true
            });

          }, function (err) {
            SweetAlert.swal("계정 오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오.! ", "error");
          });

        }, function (response) {
          SweetAlert.swal("계정 오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오! ", "error");
          // reverse the transacttion
          Transactions.transfer({
            Sid: $rootScope.adminEWalletId,
            Rid: $rootScope.userAccountBalance.accountBalance.id,
            amount: parseFloat($scope.newMilestone.price),
            currency: $scope.project.currency.code,
            referenceId: $scope.project._id,
            description: {
              'detail': 'Milestone creation failed for the project <a href="projects/project-manage/'+$scope.project._id+'">'+$scope.project.name+'</a>',
              'tax': 0
            }
          }, function(rTSuc){
            Account.findOne({
              filter:{
                where:{
                  ownerId: Authentication.user.username
                }
              }
            }, function(aSuc){
              $rootScope.userAccountBalance = aSuc;
            });
          });

        });

      }, function (tranFail) {
        SweetAlert.swal("계정 오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오.! ", "error");
        console.log('Trans Err:', tranFail);
        return;
      });
    };

    // Milestone creation (When employer creates on request of Freelancer)
    $scope.createRequestedMileStone = function(index, label){
      Transactions.transfer({
        Sid: $rootScope.userAccountBalance.id,
        Rid: $rootScope.adminEWalletId,
        amount: parseFloat($scope.milestonePrice),
        currency: $scope.project.currency.code,
        referenceId: $scope.project._id,
        description: {
          'detail': '<a href="projects/project-manage/'+$scope.project._id+'">'+$scope.project.name+'</a>프로젝트 에스크로 자금 인출',
          'tax': 0
        }
      }, function (tranSucc) {
        // Change status of milestone when amount is being deducted from the user's account
        $scope.awardedProject.proposal.milestones[index].status = label;
        
        var obj = {
          'data' :  $scope.awardedProject,
          'identifier' : label,
          'milestoneamount' : $scope.milestonePrice
        };

        return $http({
          url: '/api/project/changeMilestonStatus/' + $scope.project._id,
          method: 'PUT',
          data: obj
        }).then(function (response) {
          $scope.project = response.data;
          console.log('$scope.project 11 ',$scope.project);

          $scope.awardedProject.proposal.milestones[index].status = label;
          $scope.milestonePrice = $scope.awardedProject.proposal.milestones[index].price;

          Account.findOne({
            filter: {
              where: {
                ownerId: $scope.authentication.user.username
              }
            }
          }, function (suc) {
            $rootScope.userAccountBalance = suc;
            SweetAlert.swal("예치금 인출을 허락하였습니다!", " ", "success");
            // Notify the user
            Notifications.create({  
              "publisher": Authentication.user.username,  
              "subscriber": $scope.awardedProject.bidderInfo.username, 
              "description": Authentication.user.username + " 님이 프로젝트 대금지급을 완료했습니다.", 
              "link": $scope.project._id, 
              "isClicked": false,
              "project": true
            });

            Socket.emit('ProjectNotif', {
              "publisher": Authentication.user.username,  
              "subscriber": $scope.awardedProject.bidderInfo.username, 
              "description": Authentication.user.username + " 님이 프로젝트 대금지급을 완료했습니다.", 
              "link": $scope.project._id, 
              "isClicked": false,
              "project": true
            });

          }, function (err) {
            SweetAlert.swal("계정 오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오.! ", "error");
          });
        }, function (fail) {
          SweetAlert.swal("오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오.! ", "error");
          // Reverse the transaction
          Transactions.transfer({
            Sid: $rootScope.userAccountBalance.id,
            Rid: $rootScope.adminEWalletId,
            amount: parseFloat($scope.milestonePrice),
            currency: $scope.project.currency.code,    
            referenceId: $scope.project._id,
            description: {
              'detail': 'Milestone creation failed for the project <a href="projects/project-manage/'+$scope.project._id+'">'+$scope.project.name+'</a>',
              'tax': 0
            }
          }, function (tranSucc) {
            Account.findOne({
              filter: {
                where: {
                  ownerId: $scope.authentication.user.username
                }
              }
            }, function (suc) {
              $rootScope.userAccountBalance = suc;
            });
          });
          
        });


      }, function (tranFail) {
        SweetAlert.swal("오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오.! ", "error");
        return;
      });
    };

    $scope.deleteBid = function (bidId) {
      SweetAlert.swal({
        title: "프로젝트 삭제를 원하시나요?",
        type: "warning",
        text : "삭제시 본 프로젝트복원이 불가능하며 재등록 해야 합니다!",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "예, 삭제!",
        closeOnConfirm: true
      },function (isConfirm) {
        if (isConfirm) {
          SweetAlert.close();
          var bid = {
            'bidId': bidId
          };
          return $http({
            url: '/api/project/bid/deleteBid/' + $scope.project._id,
            method: 'PUT',
            data: bid
          }).then(function (response) {
           
            $window.location.reload();
          }, function (response) {
            // failed
            //console.log(response);
          });
          
        }
        else {
          SweetAlert.close();
        }
      });  

    };

    // get user projects
    $scope.getUserProjects = function (label) {
      $scope.items = []; 
      $scope.isLoading = true;
      return $http({
        url: '/api/users/userBid/' + Authentication.user._id,
        method: 'PUT',
        data:{
          'username': Authentication.user.username
        }
      }).then(function (response) {
        $scope.UserProjects = response; 
          $scope.freelancerActiveProjects = [];
          for (var k = 0; k < response.data.length; k++) {
            if (response.data[k].projectStatus === 'no' || response.data[k].projectStatus === 'pending') {
              $scope.freelancerActiveProjects.push(response.data[k]); 
            }
          }

        // } 
        // else if (label === 'CurrentWork') {
          $scope.freelancerCurrentProjects = [];
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].projectStatus === 'awarded') {
              $scope.freelancerCurrentProjects.push(response.data[i]);
              // $scope.items.push(response.data[i]);
            }
          }
        // } 
        // else if (label === 'pastWork') {
          $scope.freelancerPastProjects = [];
          $scope.items = [];
          for (var j = 0; j < response.data.length; j++) {
            if (response.data[j].projectStatus === 'complete') {
              $scope.freelancerPastProjects.push(response.data[j]);
              // $scope.items.push(response.data[j]);
            }
          }

          // console.log('freelancerPastProjects', $scope.freelancerPastProjects);
          // // }
          // // var obj = {
          // //   'key' : 'its working' 
              
          // // };
          // //console.log($scope.authentication);
          // return $http({
          //   url: '/api/hiddenUserUpdate/5969eae5e8d01ffe15d60023',
          //   method: 'PUT',
          //   data: $scope.authentication.user.projectsAwarded
          // }).then(function (response) {
          //   //console.log('findPostedContests', response);
            
          // },  function (error) {
          //   //console.log('error', response);
            
        //console.log($scope.items);
          // });
        // }
        $scope.isLoading = false;
        $scope.searchh();
      }, function (response) {
        $scope.isLoading = false;
      }); 
    };

    // /////////////////////////////////
    var generateData = function () {
      var arr = [];
      var letterWords = ['alpha', 'bravo', 'charlie', 'daniel', 'earl', 'fish', 'grace', 'henry', 'ian', 'jack', 'karen', 'mike', 'delta', 'alex', 'larry', 'bob', 'zelda'];
      for (var i = 1; i < 60; i++) {
        var id = letterWords[Math.floor(Math.random() * letterWords.length)];
        arr.push({
          'id': id + i,
          'name': 'name ' + i,
          'description': 'Description of item #' + i,
          'field3': id,
          'field4': 'Some stuff about rec: ' + i,
          'field5': 'field' + i
        });
      }
      return arr;
    };

    var sortingOrder = 'name'; //default sort

    // init
    $scope.sortingOrder = sortingOrder;
    $scope.pageSizes = [1, 10, 25, 50];
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.myCurrentPage = 0;
    $scope.query = '';

    var searchMatch = function (haystack, needle) {

      if (!needle) {
        return true;
      }
      return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    // init the filtered items
    $scope.searchh = function (query) {
      $scope.query = query;
      $scope.filteredItems = [];
      $scope.filteredItems = $filter('filter')($scope.items, function (item) {
        if (searchMatch(item.projectName, $scope.query)) {
          return true;
        }
        return false;
      });
      // take care of the sorting order
      if ($scope.sortingOrder !== '') {
        $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
      }
      $scope.myCurrentPage = 0;
      // now group by pages
      // //console.log($scope.filteredItems);
      $scope.groupToPages();
    };

    // show items per page
    $scope.perPagee = function (value) {
      $scope.itemsPerPage = value;
      $scope.groupToPages();
    };

    // calculate page in place
    $scope.groupToPages = function () {
      $scope.pagedItems = [];

      for (var i = 0; i < $scope.filteredItems.length; i++) {
        if (i % $scope.itemsPerPage === 0) {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
        } else {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
        }
      }
      //console.log($scope.pagedItems);
    };

    $scope.range = function (start, end) {
      var ret = [];
      if (!end) {
        end = start;
        start = 0;
      }
      for (var i = start; i < end; i++) {
        ret.push(i);
      }
      return ret;
    };

    $scope.prevPage = function () {
      if ($scope.myCurrentPage > 0) {
        $scope.myCurrentPage--;
      }
    };

    $scope.nextPage = function () {
      if ($scope.myCurrentPage < $scope.pagedItems.length - 1) {
        $scope.myCurrentPage++;
      }
    };

    $scope.setPage = function () {
      $scope.myCurrentPage = this.n;
    };

    // functions have been describe process the data for display
    // change sorting order
    $scope.sort_by = function (newSortingOrder) {
      if ($scope.sortingOrder === newSortingOrder)
        $scope.reverse = !$scope.reverse;

      $scope.sortingOrder = newSortingOrder;
    };
    // /////////////////////////////////   


    $scope.projectUserInfo = function () { 
      return $http({
        url: '/api/hiddenUser/' + $scope.project.user._id,
        method: 'GET'
      }).then(function (response) {
        $scope.currentProjectUser = response.data;
      }, function (response) {
        //console.log(response);
      });
    };
 
      //Financial Dashboard
    $scope.financialMilstoneIncoming = true;
    $scope.financialMilstoneOutgoing = false;
    $scope.showMilestoneDetails = function (label) {
      if (label === 'incoming') {
        $scope.financialMilstoneOutgoing = true;
        $scope.financialMilstoneIncoming = false;
      } else if (label === 'outgoing') {
        $scope.financialMilstoneIncoming = true;
        $scope.financialMilstoneOutgoing = false;
      } else {
        $scope.financialMilstoneIncoming = true;
      }
    };

    $scope.milestone = true;
    $scope.requestMilestone = false;
    $scope.invoice = false;
    $scope.transferFunds = false;
    $scope.withdrawal = false;
    $scope.showTranscation = function (label) {

      $scope.outMilestoneRequests();

      if (label === 'milestone') {
        $scope.requestMilestone = false;
        $scope.milestone = true;
        $scope.invoice = false;
        $scope.transferFunds = false;
        $scope.withdrawal = false;
      } else if (label === 'requestMilestone') {
        $scope.requestMilestone = true;
        $scope.milestone = false;
        $scope.invoice = false;
        $scope.transferFunds = false;
        $scope.withdrawal = false;
      } else if (label === 'invoice') {
        $scope.requestMilestone = false;
        $scope.milestone = false;
        $scope.invoice = true;
        $scope.transferFunds = false;
        $scope.withdrawal = false;
      } else if (label === 'transferFunds') {
        $scope.requestMilestone = false;
        $scope.milestone = false;
        $scope.invoice = false;
        $scope.transferFunds = true;
        $scope.withdrawal = false;
      } else if (label === 'withdrawal') {
        $scope.requestMilestone = false;
        $scope.milestone = false;
        $scope.invoice = false;
        $scope.transferFunds = false;
        $scope.withdrawal = true;
      }
       else {
        $scope.milestone = true;
      }
    };

    //Create Mile Stone
    $scope.createMileStone = false;
    $scope.createMileStoneButton = function(createMileStone){
      if($scope.createMileStone === false){
        $scope.createMileStone = true;

      } else if($scope.createMileStone === true) {
        $scope.createMileStone = false;
      }
    };

    //Profit and loss
    $scope.month = true;
    $scope.quarter = false;
    $scope.halfYear = false;
    $scope.year = false;
    $scope.twoYear = false;
    $scope.showProfitLoss = function (label) {
      if (label === 'month') {
        $scope.month = true;
        $scope.quarter = false;
        $scope.halfYear = false;
        $scope.year = false;
        $scope.twoYear = false;
      } else if (label === 'quarter') {
        $scope.month = false;
        $scope.quarter = true;
        $scope.halfYear = false;
        $scope.year = false;
        $scope.twoYear = false;
      } else if (label === 'halfyear') {
        $scope.month = false;
        $scope.quarter = false;
        $scope.halfYear = true;
        $scope.year = false;
        $scope.twoYear = false;
      } else if (label === 'year') {
        $scope.month = false;
        $scope.quarter = false;
        $scope.halfYear = false;
        $scope.year = true;
        $scope.twoYear = false;
      } else if (label === 'twoyear') {
        $scope.month = false;
        $scope.quarter = false;
        $scope.halfYear = false;
        $scope.year = false;
        $scope.twoYear = true;
      }
       else {
        $scope.month = false;
      }
    };
    //
    //Quick States
     //Create Mile Stone
    $scope.employeeStates = true;
    $scope.freelancerStates = false;
    $scope.showQuickStates = function(label){
      if(label === 'employee'){
        $scope.employeeStates = true;
        $scope.freelancerStates = false;

      } else if(label === 'freelancer') {
        $scope.freelancerStates = true;
        $scope.employeeStates = false;
      } else {
        $scope.employeeStates = true;
      }
    };
    //
    //Earning 
    $scope.earning = false;
    $scope.EarningButton = function(earning){
      if($scope.earning === false){
        $scope.earning = true;

      } else if($scope.earning === true) {
        $scope.earning = false;
      }
    };
    //
    //Other Income
    $scope.otherIncome = false;
    $scope.otherIncomeButton = function(otherIncome){
      if($scope.otherIncome === false){
        $scope.otherIncome = true;

      } else if($scope.otherIncome === true) {
        $scope.otherIncome = false;
      }
    };
    //
    //Cost of Sale
    $scope.sale = false;
    $scope.saleButton = function(sale){
      if($scope.sale === false){
        $scope.sale = true;

      } else if($scope.sale === true) {
        $scope.sale = false;
      }
    };
    //
    //Expense expense
    $scope.expense = false;
    $scope.expenseButton = function(expense){
      if($scope.expense === false){
        $scope.expense = true;

      } else if($scope.expense === true) {
        $scope.expense = false;
      }
    };
    //
    //Payments
    $scope.payments = false;
    $scope.paymentsButton = function(payments){
      if($scope.payments === false){
        $scope.payments = true;

      } else if($scope.payments === true) {
        $scope.payments = false;
      }
    };
    
    $scope.isActive = true;
    $scope.outgoingActive = false;
    $scope.toggleActive = function() {
      $scope.isActive = !$scope.isActive;
      $scope.outgoingActive = !$scope.outgoingActive;
    };
    
    $scope.isEmployee = true;
    $scope.freelancerActive = false;

    $scope.toggleActiveStates = function() {
      $scope.isEmployee = !$scope.isEmployee;
      $scope.freelancerActive = !$scope.freelancerActive;
    }; 
 
    $scope.isEmployeeProject = false;
    $scope.freelancerProject = true;
    $scope.toggleMyProject = function() {
      $scope.isEmployeeProject = !$scope.isEmployeeProject;
      $scope.freelancerProject = !$scope.freelancerProject;
    };
    //
    $scope.checkMilestonesAmount = function () {

      $scope.totalAmountOfMilestones = 0.0;
      for (var i = 0; i < $scope.awardedProject.proposal.milestones.length; i++) {

        if ($scope.awardedProject.proposal.milestones[i].status === 'Released') {
          $scope.totalAmountOfMilestones = $scope.totalAmountOfMilestones + $scope.awardedProject.proposal.milestones[i].price;
        }
      } 
      if ($scope.totalAmountOfMilestones >= $scope.awardedProject.yourBid) {
        return true;
      } else {
        return false;
      }
    };

    // Change the Status of mileston to Created or Released
    $scope.changeMilestonStatus = function (index, label) {

      if(typeof $rootScope.userAccountBalance === 'undefined'){
        Notification.error({
        message: '지급과 관련된 작업을 수행 할 수 없게됩니다. 페이지를 새로 고침하고 다시 시도하십시오!', 
        positionY: 'bottom', 
        positionX: 'right', 
        closeOnClick: true, 
        title: '<i class="glyphicon glyphicon-remove"></i> eWallet Error'});
        return;
      }

      // To Create Milestone
      if (label === 'Created') {
        // Confirm user wether to create Milestone
        SweetAlert.swal({
            title: "예치금을 인출 하시겠습니까?",
            text: "예치금 인출을 하실경우 계약 작업일정대로 완료되었다는것을 의미하며 인출한 경우 다음 단계 대금승인을 하시길 바랍니다. 중재를 원할경우 예치금 인출 후 중재를 신청하실 수 있습니다. 프리랜서와  합의하지 않는 이상은 의뢰인께서 예치금 인출을 하게되면 취소나 환불을 할 수 없으며, 합의 또는 중재조정을 신청을 해야합니다. ",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#008000",
            confirmButtonText: "예치금 인출 승인!",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function (isConfirm) {
            if (isConfirm) {
              $scope.milestonePrice = $scope.awardedProject.proposal.milestones[index].price;
              // check if there is enough amount in eWallet
              if ($rootScope.userAccountBalance.accountBalance[$scope.project.currency.code] >= parseFloat($scope.milestonePrice)) {
                // Create Milestone
                $scope.createRequestedMileStone(index, label);
                return;
              } else if($rootScope.userAccountBalance.accountBalance[$scope.project.currency.code] < parseFloat($scope.milestonePrice)) {
                $scope.findTotalAmountInWallet($scope.project.currency.code);

                if($scope.totalConverted>=parseFloat($scope.milestonePrice)){  
                  $scope.createRequestedMileStone(index, label);
                  return;
                }
                else{
                  SweetAlert.swal("예치금 잔액부족", "계정에 예치금이 잔액이 부족합니다!", "error");
                  $location.path('credit-deposit');
                }
              }
              return;
            } else {
              SweetAlert.close();
            }
          });

      }
      // Change milestone status to Released
      else if (label === 'Released') {
              // Confirm user wether to Release Milestone
              SweetAlert.swal({
                  title: "의뢰인께서 지급승인을 할경우 프리랜서에게 대금 지급이 바로 이루어집니다.",
                  text: "대금지급을 승인한 경우 계약 작업일정대로 완료되었다는것을 의미하며 프리랜서와 합의하지 않는 이상은 의뢰인께서 대금지급을  승인을 하게되면 취소나 환불을 할 수 없으며 분쟁조정을 신청하셔야 합니다. 만약 취소을 원할경우 분쟁조정을 신청하셔야 합니다. 그래도 대금지급을 지금 승인하시겠습니까? !",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#008000",
                  confirmButtonText: "예, 지급승인!",
                  closeOnConfirm: false,
                  closeOnCancel: false
                },
                function (isConfirm) {
                  if (isConfirm) {
                    $scope.awardedProject.proposal.milestones[index].status = label;
                    $scope.milestonePrice = $scope.awardedProject.proposal.milestones[index].price;

                    Account.findOne({
                      filter: {
                        where: {
                          ownerId: $scope.awardedProject.bidderInfo.username
                        }
                      }
                    }, function (suc) {

                      $scope.outsourcingFee = parseFloat($scope.milestonePrice) * 0.07;
                      $scope.deductedAmount = parseFloat($scope.milestonePrice) - $scope.outsourcingFee;

                      Transactions.transfer({
                        Sid: $rootScope.adminEWalletId,
                        Rid: suc.id,
                        amount: $scope.deductedAmount,
                        currency: $scope.project.currency.code,
                        referenceId: $scope.project._id,
                        description: {
                          'detail': '<a href="projects/view/'+$scope.project._id+'">'+$scope.project.name+'</a>프로젝트 대금 입금',
                          'tax': $scope.outsourcingFee
                        }
                      }, function (tranSucc) {
                        // Change status of milestone when amount is being deducted from the user's account
                        var obj = {
                          'deductedAmount' : $scope.deductedAmount,
                          'data' :  $scope.awardedProject,
                          'identifier' : label
                        };

                        return $http({
                          url: '/api/project/changeMilestonStatus/' + $scope.project._id,
                          method: 'PUT',
                          data: obj
                        }).then(function (response) {
                          SweetAlert.swal("대금결제가 완료되었습니다!", " ", "success");
                          $scope.project = response.data;
                          console.log('$scope.project 11a ',$scope.project);
                          //Create service transaction
                          Transactions.create({
                            accountId: $rootScope.userAccountBalance.id,
                            transectionType: 'projectfee',
                            transectionFrom: $rootScope.userAccountBalance.ownerId,
                            referenceId: $scope.project._id,
                            currency: $scope.project.currency.code,
                            amount: $scope.outsourcingFee,
                            description:{
                              'detail': 'Project fee on milestone release'
                            },
                            transactionDate: Date.now()
                          });

                          // Notify the user
                          Notifications.create({  
                            "publisher": Authentication.user.username,  
                            "subscriber": $scope.awardedProject.bidderInfo.username, 
                            "description": Authentication.user.username + " 님이 프로젝트 대금결제가 완료되었습니다", 
                            "link": $scope.project._id, 
                            "isClicked": false,
                            "project": true
                          });

                          Socket.emit('ProjectNotif', {
                            "publisher": Authentication.user.username,  
                            "subscriber": $scope.awardedProject.bidderInfo.username, 
                            "description": Authentication.user.username + " 님이 프로젝트 대금결제가 완료되었습니다", 
                            "link": $scope.project._id, 
                            "isClicked": false,
                            "project": true
                          });

                          if ($scope.checkMilestonesAmount()) {

                            $scope.project.status = 'completed';
                            return $http({
                              url: '/api/projects/' + $scope.project._id,
                              method: 'PUT',
                              data: $scope.project
                            }).then(function (response) {

                              return $http({
                                url: '/api/hiddenUser/' + $scope.awardedProject.userId,
                                method: 'GET',
                              }).then(function (response) {

                                $scope.tempUser  = response.data;
                                for(var i =0;i<$scope.tempUser.projectsAwarded.length;i++) {

                                  if($scope.tempUser.projectsAwarded[i].bidId === $scope.awardedProject.bidId) {
                                    $scope.index = i;
                                    break;
                                  }
                                }
                                $scope.tempUser.projectsAwarded[$scope.index].awarded = 'complete';
                                 return $http({
                                    url: '/api/hiddenUserUpdate/' + $scope.tempUser._id,
                                    method: 'PUT',
                                    data: $scope.tempUser.projectsAwarded
                                  }).then(function (response) {

                                    $location.path('projects/feedback/' + $scope.project._id);

                                  }, function (response) {

                                  }); 

                              }, function (response) {
                              });   
                                

                            }, function (response) {
                              // failed
                              SweetAlert.swal("오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오! ", "error");
                            });

                          }


                        }, function (response) {
                          // failed
                          SweetAlert.swal("오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오! ", "error");
                          // Reverse transactions
                          Transactions.transfer({
                            Sid: suc.id,
                            Rid: $rootScope.adminEWalletId,
                            amount: $scope.deductedAmount,
                            currency: $scope.project.currency.code,
                            referenceId: $scope.project._id,
                            description: {
                              'detail': 'Milestone released Failed and transaction being reversed. <a href="projects/view/'+$scope.project._id+'">'+$scope.project.name+'</a>',
                              'tax': $scope.outsourcingFee
                            }
                          });
                        });


                      }, function (tranFail) {
                        SweetAlert.swal("계정 오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오! ", "error");
                        return;
                      });

                    }, function (err) {
                      SweetAlert.swal("계정 오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오! ", "error");
                    });
                    return;
                  } else {
                    SweetAlert.close();
                  }
                });
      }
      // when Milestone is cancelled
      else if (label === 'Cancelled') {
        // Confirm user wether to Cancel Milestone
        SweetAlert.swal({
            title: "예치금을 취소 하시겠습니까?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "지원금액 취소!",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function (isConfirm) {
            if (isConfirm) {

              // If cancelling milestone status is requested then just remove that milestone 
              if($scope.awardedProject.proposal.milestones[index].status === 'Requested'){
                $scope.awardedProject.proposal.milestones.splice(index,1);
                var obj = {
                  'bids': $scope.awardedProject
                };
                return $http({
                  url: '/api/project/editBid/' + $scope.project._id,
                  method: 'PUT',
                  data: obj
                }).then(function (response) {
                  $scope.project = response.data;
                  console.log('$scope.project 12 ',$scope.project);
                  SweetAlert.swal("예치금이 취소 되었습니다!", " ", "success");
                  $location.path('/projects/view/'+$scope.project._id);
                });
              }
              // If cancelling milestone status is created then just remove that milestone and return amount to employer 
              else if($scope.awardedProject.proposal.milestones[index].status === 'Created'){
                $scope.milestonePrice = $scope.awardedProject.proposal.milestones[index].price;
                Account.findOne({
                  filter: {
                    where: {
                      ownerId: $scope.project.userInfo.username
                    }
                  }
                }, function (empAcc) {

                  var tax = parseFloat($scope.milestonePrice) * 0.07;
                  var amtToTransfer = parseFloat($scope.milestonePrice) - tax;

                  // Transfer back amount to employers account
                  Transactions.transfer({
                    Sid: $rootScope.adminEWalletId,
                    Rid: empAcc.id,
                    amount: amtToTransfer,
                    currency: $scope.project.currency.code,
                    referenceId: $scope.project._id,
                    description: {
                      'detail': 'Already created Milestone has been cancelled by freelacer and money has been transferred back to you with deduction of transaction charges. <a href="projects/project-manage/'+$scope.project._id+'">'+$scope.project.name+'</a>',
                      'tax': tax
                    }
                  }, function (tranSucc) {
                    // Change status of milestone when amount is being deducted from the user's account
                    $scope.awardedProject.proposal.milestones.splice(index,1);
                    var obj = {
                      'bids': $scope.awardedProject
                    };
                    return $http({
                      url: '/api/project/editBid/' + $scope.project._id,
                      method: 'PUT',
                      data: obj
                    }).then(function (response) {

                      //Create service transaction
                      Transactions.create({
                        accountId: empAcc.id,
                        transectionType: 'service',
                        transectionFrom: empAcc.ownerId,
                        referenceId: $scope.project._id,
                        currency: $scope.project.currency.code,
                        amount: tax,
                        description:{
                          'detail': 'Created milestone cancelled by freelancer.'
                        },
                        transactionDate: Date.now()
                      });
                      // Notify the user
                      Notifications.create({  
                        "publisher": Authentication.user.username,  
                        "subscriber": $scope.project.userInfo.username, 
                        "description": Authentication.user.username + " 님 예치금이 취소 되었습니다", 
                        "link": $scope.project._id, 
                        "isClicked": false,
                        "project": true
                      });

                      Socket.emit('ProjectNotif', {
                        "publisher": Authentication.user.username,  
                        "subscriber": $scope.project.userInfo.username, 
                        "description": Authentication.user.username + " 님 예치금이 취소 되었습니다", 
                        "link": $scope.project._id, 
                        "isClicked": false,
                        "project": true
                      });
                      
                    }, function (response) {
                      // failed
                      Transactions.transfer({
                        Sid: empAcc.id,
                        Rid: $rootScope.adminEWalletId,
                        amount: amtToTransfer,
                        currency: $scope.project.currency.code,
                        referenceId: $scope.project._id,
                        description: {
                          'detail': 'Freelancer made an unsuccessful attempt to cancel the created milestone of project  <a href="projects/project-manage/'+$scope.project._id+'">'+$scope.project.name+'</a>',
                          'tax': 0
                        }
                      });
                      SweetAlert.swal("계정", "죄송합니다.문제가 발생했습니다.다시 시도하십시오! ", "error");
                    });


                  }, function (tranFail) {
                    SweetAlert.swal("계정 오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오! ", "error");
                  });

                }, function (accErr) {
                  // //console.log('Acc Error', accErr);
                  SweetAlert.swal("Account 오류", "죄송합니다.문제가 발생했습니다.다시 시도하십시오! ", "error");
                  // toastr.error('Sorry, something went wrong, try again!', 'Error');
                });
              }
            } else {
              SweetAlert.close();
            }
          });
      }

    };

    // find posted projects findPostedProjects
    $scope.findPostedProjects = function () { 
        $scope.isLoading = true;
        return $http({
          url: '/api/users/findPostedProjects/' + $scope.authentication.user._id,
          method: 'GET'
        }).then(function (response) { 
          $scope.myProjects = response.data;
          var avgBid = 0;
          $scope.postedProjects = [];
          for (var i = 0; i < $scope.myProjects.length; i++) { 
            var temp = {};
            temp.id = $scope.myProjects[i]._id;
            temp.name = $scope.myProjects[i].name;
            temp.created = $scope.myProjects[i].created;

            if ($scope.myProjects[i].bids.length > 0) {
              temp.bids = $scope.myProjects[i].bids.length;
              for (var j = 0; j < $scope.myProjects[i].bids.length; j++) {
                avgBid = avgBid + $scope.myProjects[i].bids[j].yourBid;
              }
              temp.avgBid = avgBid / temp.bids;
              // //console.log('temp.avgBid', temp.avgBid);
            } else {
              temp.bids = 0;
              temp.avgBid = 0;
              // //console.log('temp.avgBid', temp.avgBid);
            }

            temp.bidEndDate = new Date($scope.myProjects[i].created);
            temp.bidEndDate.setDate(temp.bidEndDate.getDate() + 15);
            temp.currency = $scope.myProjects[i].currency;
            $scope.postedProjects.push(temp);
            avgBid = 0;
          }
          $scope.isLoading = false;
        }, function(err){
          $scope.isLoading = false;
        });
      // }
    };

    // get all projects which are in progress as employer
    $scope.findActivePostedProjects = function(label){ 
        $scope.isLoading = true;

        return $http({
          url: '/api/users/findActivePostedProjects/' + $scope.authentication.user._id,
          method: 'GET'
        }).then(function (response) { 
          $scope.activeProjects = response.data;

          $scope.projInProgress = [];
          $scope.pastProjects = [];
          var i = 0;
          for (i; i < $scope.activeProjects.length; i++) {
            var temp;
            var j;
            //for(var m =0; m< Authentication.user.myProjects.length; m++){
              //console.log('here 1');
              //console.log(Authentication.user.myProjects[m].proj_id,' and ',$scope.activeProjects[i]._id,' feedback ',Authentication.user.myProjects[m].feedback)
              //if(Authentication.user.myProjects[m].proj_id === $scope.activeProjects[i]._id && Authentication.user.myProjects[m].feedback){
              if($scope.activeProjects[i].status=='completed'){
                temp = {};
                temp.id = $scope.activeProjects[i]._id;
                temp.name = $scope.activeProjects[i].name;
                temp.created = $scope.activeProjects[i].created;

                temp.bids = $scope.activeProjects[i].bids.length; 
                for (j = 0; j < $scope.activeProjects[i].bids.length; j++) {
                  temp.freelancer = $scope.activeProjects[i].bids[j].bidderInfo.username;
                  temp.awardedBid = $scope.activeProjects[i].bids[j].yourBid;
                  if($scope.activeProjects[i].bids[j].proposal){
                    temp.milestones = $scope.activeProjects[i].bids[j].proposal.milestones.length;
                  }
                }
                temp.bidEndDate = new Date($scope.activeProjects[i].created);
                temp.bidEndDate.setDate(temp.bidEndDate.getDate() + 15);
                temp.currency = $scope.activeProjects[i].currency;
                $scope.pastProjects.push(temp);
              }
              //else if(Authentication.user.myProjects[m].proj_id === $scope.activeProjects[i]._id && !Authentication.user.myProjects[m].feedback){
              else{ 
                for (j = 0; j < $scope.activeProjects[i].bids.length; j++) {
                  temp = {};
                  temp.id = $scope.activeProjects[i]._id;
                  temp.name = $scope.activeProjects[i].name;
                  temp.created = $scope.activeProjects[i].created;
                  temp.freelancer = $scope.activeProjects[i].bids[j].bidderInfo.username;
                  temp.awardedBid = $scope.activeProjects[i].bids[j].yourBid;
                  if($scope.activeProjects[i].bids[j].proposal){
                    temp.milestones = $scope.activeProjects[i].bids[j].proposal.milestones.length;
                  }
                  temp.bidEndDate = new Date($scope.activeProjects[i].created);
                  temp.bidEndDate.setDate(temp.bidEndDate.getDate() + 15);
                  temp.currency = $scope.activeProjects[i].currency;
                  $scope.projInProgress.push(temp);
                  temp = {};
                }
              }
            //}
          }
          $scope.isLoading = false;
        }, function(err){
          $scope.isLoading = false;
        });
      // }
    };


    // find posted contests findPostedContests
    $scope.findPostedContests = function () { 
      return $http({
        url: '/api/users/findPostedContests/' + $scope.authentication.user._id,
        method: 'GET'
      }).then(function (response) { 
        $scope.myContests = response.data;
      }, function (response) { 
      });
    };


    $scope.removeProject = function() {

      SweetAlert.swal({
        title: "프로젝트 삭제를 원하시나요?",
        type: "warning",
        text : "삭제시 본 프로젝트복원이 불가능하며 재등록 해야 합니다!",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "예, 삭제!",
        closeOnConfirm: true
      },function (isConfirm) {
        if (isConfirm) {
          SweetAlert.close();
            $scope.project.$remove(function () {
            $timeout(function() {
              SweetAlert.swal({
                type: 'success',
                title: '삭제 완료'
              });
            }, 100);
            $location.path('projects/my-project');
          });
        }
        else {
          SweetAlert.close();
        }
      });  
    };

    // redirect to dispute page
    $scope.goToDispute = function(index){
      $scope.disputeMilestoneIndex = index; 
      $location.path('projects/dispute/'+$stateParams.projectId);
    };

    $scope.submitDispute = function(index){
      $scope.commentUploader = new FileUploader({
        url: 'api/project/DisputeCommentFile',
        alias: 'newProjectDisputeCommentFile'
      });

      if ($scope.uploader.queue.length) {
        $scope.commentFileName = $scope.uploader.queue[0].upload();
      }
 
      $scope.dispute.disputeCreatedBy = $scope.authentication.user._id;
      $scope.dispute.disputeCreatedByUsername = $scope.authentication.user.username;

      if($scope.authentication.user._id === $scope.awardedProject.userId){
        $scope.dispute.disputeCreatedfor = $scope.project.user._id;
        $scope.dispute.disputeCreatedforUsername = $scope.project.userInfo.username;
      }
      if($scope.authentication.user._id === $scope.project.user._id){
        $scope.dispute.disputeCreatedfor = $scope.awardedProject.userId;
        $scope.dispute.disputeCreatedforUsername = $scope.awardedProject.bidderInfo.username;
      }
      
      
      $scope.dispute.tab = 2;
      $scope.dispute.createdDate = Date.now();

      var date = new Date(Date.now());
      $scope.dispute.createdDateExpire = date.setDate(date.getDate()+15);

      $scope.dispute.totalDisputedAmount = $scope.selectedMilestoneTotal;
      $scope.project.dispute = {};
      $scope.dispute.milestones = [];
 
      for(var i =0; i<$scope.disputedMilestones.length;i++) {
        $scope.dispute.milestones.push($scope.awardedProject.proposal.milestones[i]);
      }
      $scope.dispute.tab2Comments = [];

      var obj = {
        'dispute': $scope.dispute,
        'status' : 'disputeCreated'
      };

      $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // Show success message

        $scope.success = true;

        $scope.dispute.file = response;
        return $http({
          url: '/api/project/manageDispute/' + $scope.project._id,
          method: 'PUT',
          data: obj
        }).then(function (response) {
          $scope.project = response.data;
          console.log('$scope.project 13 ',$scope.project);
          $timeout(function () {
            $state.reload();
          }, 1000);
          

        }, function (response) {
          //console.log(response);
        });
       
      };
      if (!$scope.uploader.queue.length) {

        return $http({
          url: '/api/project/manageDispute/' + $scope.project._id,
          method: 'PUT',
          data: obj
        }).then(function (response) {
          $scope.project = response.data;
          console.log('$scope.project 14 ',$scope.project);
          $timeout(function () {
            $state.reload();
          }, 1000);
          

        }, function (response) {
          //console.log(response);
        });
      }
    };
 
    $scope.selectedMilestoneTotal = 0;
    $scope.disputedMilestones = [];
    $scope.initializeMilestoneTotal = function(){
      
      $scope.selectedMilestoneTotal = parseFloat($scope.awardedProject.proposal.milestones[$scope.selectedMilestone].price);
      $scope.disputedMilestones.push({
        'index' : $scope.selectedMilestone
      });
    };

    $scope.checking = function(prod,index){
      if(prod.selected === true) {
        $scope.selectedMilestoneTotal = $scope.selectedMilestoneTotal + parseFloat(prod.price);
        $scope.disputedMilestones.push({
        'index' : index
      });
      }
      else {
        $scope.selectedMilestoneTotal = $scope.selectedMilestoneTotal - parseFloat(prod.price); 
        angular.forEach($scope.disputedMilestones, function(i, el){
          if (el.index === index){
              $scope.disputedMilestones.splice(i, 1);
          }
        });
      }
      //console.log($scope.selectedMilestoneTotal);
      //console.log($scope.disputedMilestones);
    };

    $scope.disputeComments = function(comment ,tab) {
      $scope.commentUploader = new FileUploader({
        url: 'api/project/DisputeCommentFile',
        alias: 'newProjectDisputeCommentFile'
      });
      if ($scope.uploader.queue.length) {
        $scope.commentFileName = $scope.uploader.queue[0].upload();
      }
      $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // Show success message
        $scope.success = true;

        var data = {
          'image': $scope.authentication.user.profileImageURL,
          'username' :  $scope.authentication.user.username,
          'id' :  $scope.authentication.user._id,
          'date_created' : Date.now(),
          'comment' : comment,
          'file' : response
        };
        var obj = {
          'data' : data,
          'tab' : tab
        };
        //console.log(obj);
        return $http({
          url: '/api/project/manageDisputeComments/' + $scope.project._id,
          method: 'PUT',
          data: obj
        }).then(function (response) {

          if(tab === 3)
            $scope.project.dispute.tab3Comments = response.data.dispute.tab3Comments;
          if(tab === 2)
            $scope.project.dispute.tab2Comments = response.data.dispute.tab2Comments;

        }, function (response) {
          //console.log(response);
        });
      };

      $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {

        //console.log(response);
        $scope.project = {};
        // Show error message
        $scope.error = response.message;
      };

      if (!$scope.uploader.queue.length) {

        var data = {
          'image': $scope.authentication.user.profileImageURL,
          'username' :  $scope.authentication.user.username,
          'id' :  $scope.authentication.user._id,
          'date_created' : Date.now(),
          'comment' : comment
        };
        var obj = {
          'data' : data,
          'tab' : tab
        };
        //console.log(obj);
        return $http({
          url: '/api/project/manageDisputeComments/' + $scope.project._id,
          method: 'PUT',
          data: obj
        }).then(function (response) {

          if(tab === 3)
            $scope.project.dispute.tab3Comments = response.data.dispute.tab3Comments;
          if(tab === 2)
            $scope.project.dispute.tab2Comments = response.data.dispute.tab2Comments;

        }, function (response) {
          //console.log(response);
        });
      }

      


    };

    $scope.initializeDisputeCommmentImage = function () {

      $scope.uploader = new FileUploader({
        url: 'api/project/uploadProjectFile',
        alias: 'newProjectDisputeFileUploade'
      });

      $scope.uploader.onAfterAddingFile = function (fileItem) {
        if ($window.FileReader) {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(fileItem._file);
          // $scope.disputeFilename = fileItem.file.name.split('.').pop().toLowerCase();
          $scope.disputeFilename = fileItem.file.name;
          //console.log('extension', fileItem.file.name);
          fileReader.onload = function (fileReaderEvent) {
            $timeout(function () {
              $scope.imageURL = fileReaderEvent.target.result;
              //console.log('$scope.sdffsdfsd', $scope.imageURL);
            }, 0);
          };
        }
      };

    };

    $scope.placeNewOffer = function(offer) {
      if(offer < $scope.project.dispute.amountOffer)
      {
        var obj = null;
        if($scope.project.dispute.disputeCreatedBy === $scope.currentUserId) {
          obj = {
            'dispute.amountOffer' : offer
          };
        }
        
        if($scope.project.dispute.disputeCreatedfor === $scope.currentUserId) { 
          obj = {
            'dispute.secondUserAmountOffer' : offer
          };
        }

        return $http({
          url: '/api/project/updateField/' + $scope.project._id,
          method: 'PUT',
          data: obj
        }).then(function (response) {

          $state.reload();

        }, function (response) {
          //console.log(response);
        });

      }
      else {
        alert('이전단계에서 제시한 금액보다 적은 금액을 입력 바랍니다.');
      }
    };

    $scope.proceedToArbitrationTab2 = function() {
      SweetAlert.swal({
        title: "수수료 지불에 동의합니까?",
        text: "동의할 경우 대한상사중재원의 결정전까지 예치금액은 지급 및 인출이 보류됩니다.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008000",confirmButtonText: "예, 동의합니다!",
        cancelButtonText: "아니오, 취소합니다!",
        closeOnConfirm: false,
        closeOnCancel: false }, 
        function(isConfirm){ 
          if (isConfirm) {
            SweetAlert.close();
            Account.findOne({
              filter: {
                where: {
                  ownerId: $scope.authentication.user.username
                }
              }
            }, function (suc) {

              $scope.outsourcingFee = parseFloat($scope.project.dispute.amountOffer) * 0.07;

              Transactions.transfer({
                Sid: suc.id,
                Rid: $rootScope.adminEWalletId,
                amount: $scope.outsourcingFee,
                currency: $scope.project.currency.code,
                referenceId: $scope.project._id,
                description: {
                  'detail': 'Disputed project'
                }
              }, function (tranSucc) {
                //console.log('wah g wah');
                $scope.dispute = $scope.project.dispute;
                $scope.dispute.tab = 3;
                $scope.dispute.tab2ArbitrationCreatedDate = Date.now();
                var date = new Date(Date.now());
                $scope.dispute.tab2ArbitrationCreatedDateExpire = date.setDate(date.getDate()+4);
                $scope.dispute.userPayFirst = $scope.authentication.user._id;
                $scope.dispute.tab3Comments = [];

                var obj = {
                  'dispute': $scope.dispute,
                  'status' : 'ProceedToTab3'
                };

                return $http({
                  url: '/api/project/manageDispute/' + $scope.project._id,
                  method: 'PUT',
                  data: obj
                }).then(function (response) {
                  $scope.project = response.data;
                  console.log('$scope.project 15 ',$scope.project); 
                $state.reload();
                  SweetAlert.swal("보냈습니다!", "금액을 보냈습니다.", "success");
                }, function (response) {
                  //console.log(response);
                });
                

              }, function(err){
                //console.log('ahhhhhhhhh');
              });
            }, function(err){
                //console.log('ohhh no');
            });
            
          } else {
            SweetAlert.swal("취소 되었습니다.", "중재가 취소되었습니다.", "error");
          }
      });
    };

    $scope.proceedToArbitrationTab3 = function() {

      SweetAlert.swal({
        title: "수수료 지불에 동의합니까?",
        text: "동의할 경우 대한상사중재원의 결정전까지 예치금액은 지급 및 인출이 보류됩니다.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008000",confirmButtonText: "예, 동의합니다!",
        cancelButtonText: "아니오, 취소합니다!",
        closeOnConfirm: false,
        closeOnCancel: false }, 
      function(isConfirm){ 

        if (isConfirm) {
          SweetAlert.close();
          Account.findOne({
            filter: {
              where: {
                ownerId: $scope.authentication.user.username
              }
            }
          }, function (suc) {

            $scope.outsourcingFee = parseFloat($scope.project.dispute.amountOffer) * 0.07;

            Transactions.transfer({
              Sid: suc.id,
              Rid: $rootScope.adminEWalletId,
              amount: $scope.outsourcingFee,
              currency: $scope.project.currency.code,
              referenceId: $scope.project._id,
              description: {
                'detail': 'Disputed project'
              }
            }, function (tranSucc) {
              //console.log('wah g wah');
              $scope.dispute = $scope.project.dispute;
              $scope.dispute.tab = 4;
              $scope.dispute.userPaySecond = $scope.authentication.user._id;
              $scope.dispute.adminCanView = 'yes';

              var obj = {
                'dispute': $scope.dispute,
                'status' : 'ProceedToTab4'
              };

              return $http({
                url: '/api/project/manageDispute/' + $scope.project._id,
                method: 'PUT',
                data: obj
              }).then(function (response) {
                $scope.project = response.data;
                console.log('$scope.project 16 ',$scope.project);
                $state.reload();
                SweetAlert.swal("보냈습니다!", "금액을 보냈습니다.", "success");
              }, function (response) {
                //console.log(response);
              }); 
            }, function(err){
               //console.log('ahhhhhhhhh');
            });
          }, function(err){
              //console.log('ohhh no');
          });
          
        } else {
          SweetAlert.close();
        }
      });
    };

    $scope.acceptOffer = function() {

      if($scope.project.dispute.disputeCreatedBy  === $scope.currentUserId ) {

        SweetAlert.swal({
          title: "합의가 확실합니까?",
          text: "승인을 하시면 금액 조정해 합의를 하게됩니다.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",confirmButtonText: "예, 승인!",
          cancelButtonText: "아니오, 취소!",
          closeOnConfirm: false,
          closeOnCancel: false }, 
        function(isConfirm){ 

          if (isConfirm) {
            SweetAlert.close();
            Account.findOne({
              filter: {
                where: {
                  ownerId: $scope.project.dispute.disputeCreatedByUsername
                }
              }
            }, function (suc) {

              $scope.outsourcingFee = parseFloat($scope.project.dispute.secondUserAmountOffer) * 0.07;
              var remainingAmount = $scope.project.dispute.secondUserAmountOffer - $scope.outsourcingFee; 

              Transactions.transfer({
                Sid: $rootScope.adminEWalletId,
                Rid: suc.id,
                amount: parseFloat(remainingAmount),
                currency: $scope.project.currency.code,
                referenceId: $scope.project._id,
                description: {
                  'detail': 'Disputed project'
                }
              }, function (tranSucc) {

                  Account.findOne({
                  filter: {
                    where: {
                      ownerId: $scope.project.dispute.disputeCreatedforUsername
                    }
                  }
                }, function (succ) {

                var moneyBack = parseFloat($scope.project.dispute.totalDisputedAmount) - parseFloat($scope.project.dispute.amountOffer) * 0.07;

                Transactions.transfer({
                    Sid: $rootScope.adminEWalletId,
                    Rid: succ.id,
                    amount: parseFloat(moneyBack),
                    currency: $scope.project.currency.code,
                    referenceId: $scope.project._id,
                    description: {
                      'detail': 'Disputed project'
                    }
                  }, function (tranSucc) {

                    for(var i =0 ; i<$scope.project.dispute.milestones.length;i++){
                      for(var j =0 ; j<$scope.awardedProject.proposal.milestones.length; j++){
                        if($scope.project.dispute.milestones[i].description === $scope.awardedProject.proposal.milestones[j].description && $scope.project.dispute.milestones[i].price === $scope.awardedProject.proposal.milestones[j].price){
                          $scope.awardedProject.proposal.milestones[j].status = "Released";
                          break;
                        }
                      }
                    }
                   
                    var obj = {
                      'dispute': {},
                      'status' : 'offerAccepted'
                    };

                    return $http({
                      url: '/api/project/manageDispute/' + $scope.project._id,
                      method: 'PUT',
                      data: obj
                    }).then(function (response) {

                      $scope.project = response.data;
                      console.log('$scope.project 17 ',$scope.project); 
                      $location.path('projects/view/' + $scope.project._id);
                      SweetAlert.swal("보냈습니다!", "금액을 보냈습니다.", "success");
                      
                    }, function (response) {
                      //console.log(response);
                    }); 
                  });

                }, function(err){
                   //console.log('ahhhhhhhhh');
                });

              }, function(err){
                 //console.log('ahhhhhhhhh');
              });
            }, function(err){
                //console.log('ohhh no');
            });
            
          }else{
            SweetAlert.close();
          }
        });

      }
      else if($scope.project.dispute.disputeCreatedfor  === $scope.currentUserId) {
        SweetAlert.swal({
          title: "승인에 동의합니까?",
          text: "동의할 경우 예치금액은 지급 및 인출이 보류됩니다.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#008000",confirmButtonText: "Yes, 동의합니다!",
          cancelButtonText: "아니오, 취소합니다!",
          closeOnConfirm: false,
          closeOnCancel: false }, 
        function(isConfirm){ 

          if (isConfirm) {
            SweetAlert.close();
            Account.findOne({
              filter: {
                where: {
                  ownerId: $scope.project.dispute.disputeCreatedByUsername
                }
              }
            }, function (suc) {

              $scope.outsourcingFee = parseFloat($scope.project.dispute.amountOffer) * 0.07;
              var remainingAmount = $scope.project.dispute.amountOffer - $scope.outsourcingFee; 

              Transactions.transfer({
                Sid: $rootScope.adminEWalletId,
                Rid: suc.id,
                amount: parseFloat(remainingAmount),
                currency: $scope.project.currency.code,
                referenceId: $scope.project._id,
                description: {
                  'detail': 'Disputed project'
                }
              }, function (tranSucc) {

                 Account.findOne({
                  filter: {
                    where: {
                      ownerId: $scope.project.dispute.disputeCreatedforUsername
                    }
                  }
                }, function (succ) {
                var moneyBack = parseFloat($scope.project.dispute.totalDisputedAmount) - parseFloat($scope.project.dispute.amountOffer) * 0.07;

                Transactions.transfer({
                    Sid: $rootScope.adminEWalletId,
                    Rid: succ.id,
                    amount: parseFloat(moneyBack),
                    currency: $scope.project.currency.code,
                    referenceId: $scope.project._id,
                    description: {
                      'detail': 'Disputed project'
                    }
                  }, function (tranSucc) {

                    for(var i =0 ; i<$scope.project.dispute.milestones.length;i++){
                      for(var j =0 ; j<$scope.awardedProject.proposal.milestones.length; j++){
                        if($scope.project.dispute.milestones[i].description === $scope.awardedProject.proposal.milestones[j].description && $scope.project.dispute.milestones[i].price === $scope.awardedProject.proposal.milestones[j].price){
                          $scope.awardedProject.proposal.milestones[j].status = "Released";
                          break;
                        }
                      }
                    }
                   
                    var obj = {
                      'dispute': {},
                      'status' : 'offerAccepted'
                    };

                    return $http({
                      url: '/api/project/manageDispute/' + $scope.project._id,
                      method: 'PUT',
                      data: obj
                    }).then(function (response) {

                      $scope.project = response.data;
                      console.log('$scope.project 18 ',$scope.project);
                      var obj = {
                        'deductedAmount' : $scope.outsourcingFee,
                        'data' :  $scope.awardedProject,
                        'identifier' : 'Released'
                      };

                      return $http({
                        url: '/api/project/changeMilestonStatus/' + $scope.project._id,
                        method: 'PUT',
                        data: obj
                      }).then(function (response) {
                        //console.log($scope.awardedProject);
                        $location.path('projects/view/' + $scope.project._id);
                        SweetAlert.swal("보냈습니다!", "금액을 보냈습니다.", "success");
                      }, function (response) {
                        //console.log(response);
                      }); 

                    }, function (response) {
                      //console.log(response);
                    }); 
                  });

              }, function(err){
                 //console.log('ahhhhhhhhh');
              });
            }, function(err){
                //console.log('ohhh no');
            });
            
          } , function(err){
                 //console.log('ahhhhhhhhh');
          });
        }else{
          SweetAlert.close();
        }
      });
      }
    };

    $scope.cancelDipsute = function() {

      var obj = {
        'dispute': [],
        'status' : 'cancel'
      };

      return $http({
        url: '/api/project/manageDispute/' + $scope.project._id,
        method: 'PUT',
        data: obj
      }).then(function (response) {

        $location.path('projects/view/' + $scope.project._id);

      }, function (response) {
        //console.log(response);
      });
    };


    //showCatagories 
    $scope.showCatagories = function(){

      Categories.find({}, function(suc){
        $scope.skillsCategories = suc;
      });

    };

    //show showSubCat  
    $scope.showSubCategories = function(){
      $scope.subCategories = [];
      // Find the Category first
      Categories.find({
        filter:{
          where:{
            _id: $stateParams.categoryId
          }
        }
      }, function(catSuc){
        $scope.catName = catSuc[0].name;
        angular.forEach(catSuc[0].subCategories, function(cat, i){

          SubCategories.find({
            filter:{
              where:{
                _id: cat
              }
            }
          }, function(suc){
            $scope.subCategories.push(suc[0]);
          });

        });

      });
    };

    // show showSubCatSkills
    $scope.showSubCatSkills = function (skills){

      $scope.subCatSkill = [];

      angular.forEach(skills, function(skill, i){
        Skills.findOne({
          filter:{
            where:{
              _id: skill
            }
          }
        }, function (rsltSkill) {
          $scope.subCatSkill.push(rsltSkill);
        });
      });
      //console.log("subCatSkill:", $scope.subCatSkill);
      setTimeout(function() {
        // alert($scope.subCatSkill.join('\n'));
        alert(JSON.stringify($scope.subCatSkill));
      }, 100);
    };

    /*
    * Check if user account has enough amount in eWallet for payment related activities

    --  if user hasn't enough amount in the currecny in which project has been posted, 
        get sum of all other currencies coverted in that particular currency.
    --  withdraw amount from all accounts if there is any amount 
    --  deposit the account with calculated sum of currencies in related currency
    */
    $scope.findTotalAmountInWallet = function(cur){
      var actualWallet = $rootScope.userAccountBalance.accountBalance; //{USD:0, KRW:0, JPY:0}
      var curRate = $rootScope.latestCurrencyRate; // currency rate agains 1 USD
      var totalConvertedAmount = 0;
      var inUSD =0;
      var key;
      if(!$rootScope.latestCurrencyRate){
        Notification.error({
        message: '지급과 관련된 작업을 수행 할 수 없게됩니다. 페이지를 새로 고침하고 다시 시도하십시오.', 
        positionY: 'bottom', 
        positionX: 'right', 
        closeOnClick: true, 
        title: '<i class="glyphicon glyphicon-remove"></i> eWallet Error'});
        return;
      }
      if(cur !== 'USD'){
        for(key in actualWallet){
          if(key === cur){
            totalConvertedAmount = totalConvertedAmount + actualWallet[key];
          }else if(key === 'USD'){
            totalConvertedAmount = totalConvertedAmount + actualWallet[key]*curRate[cur]; 
          }else if(key === 'CNY'){
            inUSD = actualWallet[key]/curRate[key];
            totalConvertedAmount = totalConvertedAmount + inUSD*curRate[cur];
          }else if(key === 'JPY'){
            inUSD = actualWallet[key]/curRate[key];
            totalConvertedAmount = totalConvertedAmount + inUSD*curRate[cur];
          }
        }
      }else{  /*When USD=0 and othre currencies are changed to USD*/   
        for(key in actualWallet){
          if(key === cur){
            totalConvertedAmount = totalConvertedAmount + actualWallet[key];
          }else if(key === 'CNY'){
            inUSD = actualWallet[key]/curRate[key];
            totalConvertedAmount = totalConvertedAmount + inUSD;
          }else if(key === 'JPY'){
            inUSD = actualWallet[key]/curRate[key];
            totalConvertedAmount = totalConvertedAmount + inUSD;
          }else if(key === 'KRW'){
            inUSD = actualWallet[key]/curRate[key];
            totalConvertedAmount = totalConvertedAmount + inUSD;
          }
        }
      }

      if(totalConvertedAmount>0){
        //Withdraw amount from all accounts
        $timeout(function() {
          for(var key in actualWallet){
            Transactions.withdraw({
              id:$rootScope.userAccountBalance.id,
              amountWit:actualWallet[key],
              currency:key
            });
          }
        }, 400);

        //Now deposit the converted amount in the relevent currency
        $timeout(function() {
          Transactions.deposit({
            id : $rootScope.userAccountBalance.id,
            amountDep : totalConvertedAmount,
            currency : cur
          }, function(suc){
            Account.findOne({
              filter :{
                where :{
                  ownerId : $scope.authentication.user.username
                }
              }
            }, function(suc){
              $rootScope.userAccountBalance = suc;
            });
          });
        }, 500);
      }

      $scope.totalConverted = totalConvertedAmount;
    };

    //purchaseBid
    $scope.purchaseBid = function (){
      SweetAlert.swal({
        title: '자동인출에 동의하시나요?',
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: "예!동의",
        closeOnConfirm: false,
        closeOnCancel: false
        }, function (isConfirm){
          if(isConfirm){
            SweetAlert.close();
            if($rootScope.userAccountBalance.accountBalance.USD>=2){
              Transactions.transfer({
                Sid:$rootScope.userAccountBalance.id,
                Rid:$rootScope.adminEWalletId,
                amount:2,
                currency: 'USD',
                description: {
                  'detail': 'You have bought 50 Bids.',
                  'tax':0
                }
              }, function(suc){
                // update the user's bid 
                $scope.authentication.user.remainingBids = $scope.authentication.user.remainingBids + 50;
                return $http({
                  url: '/api/updateUser/'+Authentication.user._id,
                  method: 'PUT',
                  data: $scope.authentication.user
                }).then(function(res){
                  $rootScope.userAccountBalance.accountBalance.USD = $rootScope.userAccountBalance.accountBalance.USD - 2;
                  $scope.bidPurchase = false;
                  $scope.authentication.user = res.data;
                  SweetAlert.swal('감사합니다! 회원님께서는 50회를 추가로 지원할 수 있습니다!', '', 'success');

                  //Create service transaction
                  Transactions.create({
                    accountId: $rootScope.userAccountBalance.id,
                    transectionType: 'service',
                    transectionFrom: $rootScope.userAccountBalance.ownerId,
                    referenceId: '-',
                    currency: 'USD',
                    amount: 2,
                    description:{
                      'detail': 'User bought 50 bids'
                    },
                    transactionDate: Date.now()
                  });

                }, function(fail){
                  //Reverse the transaction
                  $scope.authentication.user.remainingBids = $scope.authentication.user.remainingBids - 50;
                  Transactions.transfer({
                    Sid:$rootScope.adminEWalletId,
                    Rid:$rootScope.userAccountBalance.id,
                    amount:2,
                    currency: 'USD',
                    description: {
                      'detail': 'Bid purchasing failed.',
                      'tax':0
                    }
                  }, function(suc){
                    $scope.bidPurchase = false;
                    SweetAlert.swal('오류!', '죄송합니다.문제가 발생했습니다.', 'info');
                    $rootScope.userAccountBalance.accountBalance.USD = $rootScope.userAccountBalance.accountBalance.USD + 2;
                  });
                });

              });
            }else{
              $scope.bidPurchase = false;
              SweetAlert.swal('오류!', '죄송합니다. 예치금이 부족하여 지원횟수 추가을 받을 수 없습니다.', 'error');
            }
          }else{
            $scope.bidPurchase = false;
            SweetAlert.close();
          }
      });
    }; 

    /*
    *  To get all the My Contests 
    */
    $scope.getAllMyContests = function(){
      $scope.awardedContests = [];
      $scope.isLoading = true;
      $http({
        url: '/api/contest/getAllMyContests',
        method: 'PUT',
        data: {
          'userId': Authentication.user._id
        }
      }).then( function(suc){
        $scope.awardedContests = suc.data;
        $scope.isLoading = false;
      }, function(err){
        $scope.isLoading = false;
      }); 
    };

    /*
    *  get all contests in progress
    */
    $scope.getContestInProgress = function(){
      var contests = {};
      $scope.awardedContests = [];
      $scope.contestsWithEntry = []; 
      $scope.isLoading = true;
      $http({
        url: '/api/contest/getAllContestsAwarded',
        method: 'PUT',
        data: {
          'userId': Authentication.user._id
        }
      }).then( function(suc){
        $scope.awardedContests = suc.data;
        //Get the entry makers
        if($scope.awardedContests){
          var awarded = $scope.awardedContests;
          for(var j=0; j<awarded.length; j++){
            if(awarded[j].entries.length>0){ 
              for(var k=0; k<awarded[j].entries.length; k++){
                //Push only awarded entry
                if(awarded[j].entries[k].youWinner === 'yes'){
                  contests.id = awarded[j]._id;
                  contests.name = awarded[j].name;
                  contests.created = awarded[j].created;
                  contests.freelancer = awarded[j].entries[k].entryPersonUsername;
                  contests.entryName = awarded[j].entries[k].entryName;
                  contests.entryPrize = awarded[j].entries[k].entrySellPrice;
                  contests.freelancerId = awarded[j].entries[k].entryPersonProfId;
                  $scope.contestsWithEntry.push(contests);
                  contests = {};
                }
              }
            }
          }
        }
        $scope.isLoading = false;
      }, function(err){
        $scope.isLoading = false;
      }); 
    };

    /*
    * getAllActiveContests freelancer side
    */

    $scope.getAllActiveContests = function (){
      $scope.activeContests = []; 
      $scope.isLoading = true;
      $http({
        url: '/api/contest/getAllActiveContests',
        method: 'PUT',
        data: {
          'userId': Authentication.user._id
        }
      }).then( function(suc){
        $scope.activeContests = suc.data;
        $scope.isLoading = false;
      }, function(err){
        $scope.isLoading = false;
      }); 
    };

    /*
    * getAllPastContests freelancer side
    */
    $scope.getAllPastContests = function (){
      $scope.pastContests = []; 
        $scope.isLoading = true;
        $http({
          url: '/api/contest/getAllPastContests',
          method: 'PUT',
          data: {
            'userId': Authentication.user._id
          }
        }).then( function(suc){
          $scope.pastContests = suc.data;
          $scope.isLoading = false;
        }, function(err){
          $scope.isLoading = false;
        }); 
    };

    /*
    *  Financial dashboard
    */
    // Transaction History
    $scope.transac = function(){
      $scope.transactions = [];
      // start spinner 
      $timeout(function() {
        usSpinnerService.spin('transLoader');
      }, 500);

      $scope.showOutGoingMileStones();

      // Find the user Specific
      Transactions.find({},function(resp){
        for(var i=0; i<resp.length; i++){
          if(resp[i].accountId === $rootScope.userAccountBalance.id){
            $scope.transactions.push(resp[i]);
          }
        }
        // stop spinner
        $timeout(function() {
          usSpinnerService.stop('transLoader');
        }, 500);

      }, function(err){
        // stop spinner
        $timeout(function() {
          usSpinnerService.stop('transLoader');
        }, 500);
      });

    };

    // Show Outgoin Milestones
    $scope.showOutGoingMileStones = function(){
      var newProj = '';
      var count = 0;

      if( typeof($scope.outGoMileStone) === 'undefined'){
        $scope.outGoMileStone = [];
        
        $http({
          url: '/api/project/allOutGoinglMilestones',
          method: 'PUT',
          data: {
            'userId': Authentication.user._id
          }
        }).then( function(suc){
          $scope.projOutWithMileStone = suc.data;

          angular.forEach($scope.projOutWithMileStone, function(proj, i){
            for(var j=0; j<proj.bids.length; j++){
              if ( typeof(proj.bids[j].proposal) !== 'undefined' && proj.bids[j].awarded === 'yes'){ 
                newProj = proj.bids[j].proposal.milestones;
                var l=0;
                for(l; l<newProj.length; l++){
                  if(newProj[l].status === 'Created'){
                    $scope.outGoMileStone[count] = newProj[l];
                    $scope.outGoMileStone[count].projId = proj._id;
                    $scope.outGoMileStone[count].projName = proj.name;
                    $scope.outGoMileStone[count].bidder = proj.bids[j].bidderInfo.username;
                    $scope.outGoMileStone[count].bidderProfId = proj.bids[j].bidderInfo.profile_id;
                    $scope.outGoMileStone[count].projDate = proj.created;
                    count ++;
                  }
                }
              }
            }
          });
        });
      }
    };

    // Show Incoming Milestones
    $scope.showIncomingMileStones = function(){
      var newProj = '';
      var count = 0;

      if( typeof($scope.incomMileStone) === 'undefined'){
        $scope.incomMileStone = [];

        $http({
          url: '/api/project/allIncominglMilestones',
          method: 'PUT',
          data: {
            'userId': Authentication.user._id
          }
        }).then( function(suc){
          $scope.projIncomWithMileStone = suc.data;
          for (var i =0;  i<$scope.projIncomWithMileStone.length; i++) {
            for(var j=0; j<$scope.projIncomWithMileStone[i].bids.length; j++){
              if ( typeof($scope.projIncomWithMileStone[i].bids[j].proposal) !== 'undefined' && $scope.projIncomWithMileStone[i].bids[j].awarded === 'yes'){ 
                newProj = $scope.projIncomWithMileStone[i].bids[j].proposal.milestones;
                var l=0;
                for(l; l<newProj.length; l++){
                  if(newProj[l].status === 'Created'){
                    $scope.incomMileStone[count] = newProj[l];
                    $scope.incomMileStone[count].projId =  $scope.projIncomWithMileStone[i]._id;
                    $scope.incomMileStone[count].projName =  $scope.projIncomWithMileStone[i].name;
                    $scope.incomMileStone[count].projOwner =  $scope.projIncomWithMileStone[i].userInfo.username;
                    $scope.incomMileStone[count].projDate =  $scope.projIncomWithMileStone[i].created;
                    count++;
                  }
                }
              }
            }
          }
        });
      }
    };

    // Show  Milestones Requests
    $scope.outMilestoneRequests = function(){
      var newProj = '';
      var count = 0;

      if( typeof($scope.projOutWithMileStone) === 'undefined'){
        $scope.outReqMileStone = [];
        $http({
          url: '/api/project/allOutGoinglMilestones',
          method: 'PUT',
          data: {
            'userId': Authentication.user._id
          }
        }).then( function(suc){
          $scope.projOutWithMileStone = suc.data;
          for (var i =0;  i<$scope.projOutWithMileStone.length; i++) {
            for(var j=0; j<$scope.projOutWithMileStone[i].bids.length; j++){
              if ( typeof($scope.projOutWithMileStone[i].bids[j].proposal) !== 'undefined' && $scope.projOutWithMileStone[i].bids[j].awarded === 'yes'){ 
                newProj = $scope.projOutWithMileStone[i].bids[j].proposal.milestones;
                var l=0;
                for(l; l<newProj.length; l++){
                  if(newProj[l].status === 'Requested'){
                    $scope.outReqMileStone[count] = newProj[l];
                    $scope.outReqMileStone[count].projId = $scope.projOutWithMileStone[i]._id;
                    $scope.outReqMileStone[count].projName = $scope.projOutWithMileStone[i].name;
                    $scope.outReqMileStone[count].bidder = $scope.projOutWithMileStone[i].bids[j].bidderInfo.username;
                    $scope.outReqMileStone[count].bidderProfId = $scope.projOutWithMileStone[i].bids[j].bidderInfo.profile_id;
                    $scope.outReqMileStone[count].projDate = $scope.projOutWithMileStone[i].created;
                    count ++;
                  }
                }
              }
            }
          }
        });
      }else{
        $scope.outReqMileStone = [];
        for (var i =0;  i<$scope.projOutWithMileStone.length; i++) {
          for(var j=0; j<$scope.projOutWithMileStone[i].bids.length; j++){
            if ( typeof($scope.projOutWithMileStone[i].bids[j].proposal) !== 'undefined' && $scope.projOutWithMileStone[i].bids[j].awarded === 'yes'){ 
              newProj = $scope.projOutWithMileStone[i].bids[j].proposal.milestones;
              var l=0;
              for(l; l<newProj.length; l++){
                if(newProj[l].status === 'Requested'){
                  $scope.outReqMileStone[count] = newProj[l];
                  $scope.outReqMileStone[count].projId = $scope.projOutWithMileStone[i]._id;
                  $scope.outReqMileStone[count].projName = $scope.projOutWithMileStone[i].name;
                  $scope.outReqMileStone[count].bidder = $scope.projOutWithMileStone[i].bids[j].bidderInfo.username;
                  $scope.outReqMileStone[count].bidderProfId = $scope.projOutWithMileStone[i].bids[j].bidderInfo.profile_id;
                  $scope.outReqMileStone[count].projDate = $scope.projOutWithMileStone[i].created;
                  count ++;
                }
              }
            }
          }
        }
      }
    };

    // Show Incoming Milestones requests
    $scope.incomMilestoneRequests = function(){
      var newProj = '';
      var count = 0;

      if( typeof($scope.projIncomWithMileStoneprojIncomWithMileStone) === 'undefined'){
        $scope.incomReqMileStone = [];

        $http({
          url: '/api/project/allIncominglMilestones',
          method: 'PUT',
          data: {
            'userId': Authentication.user._id
          }
        }).then( function(suc){
          $scope.projIncomWithMileStone = suc.data;
          for (var i =0;  i<$scope.projIncomWithMileStone.length; i++) {
            for(var j=0; j<$scope.projIncomWithMileStone[i].bids.length; j++){
              if ( typeof($scope.projIncomWithMileStone[i].bids[j].proposal) !== 'undefined' && $scope.projIncomWithMileStone[i].bids[j].awarded === 'yes'){ 
                newProj = $scope.projIncomWithMileStone[i].bids[j].proposal.milestones;
                var l=0;
                for(l; l<newProj.length; l++){
                  if(newProj[l].status === 'Requested'){
                    $scope.incomReqMileStone[count] = newProj[l];
                    $scope.incomReqMileStone[count].projId =  $scope.projIncomWithMileStone[i]._id;
                    $scope.incomReqMileStone[count].projName =  $scope.projIncomWithMileStone[i].name;
                    $scope.incomReqMileStone[count].projOwner =  $scope.projIncomWithMileStone[i].userInfo.username;
                    $scope.incomReqMileStone[count].projDate =  $scope.projIncomWithMileStone[i].created;
                    count++;
                  }
                }
              }
            }
          }
        });
      }else{
        $scope.incomReqMileStone = [];
        for (var i =0;  i<$scope.projIncomWithMileStone.length; i++) {
            for(var j=0; j<$scope.projIncomWithMileStone[i].bids.length; j++){
              if ( typeof($scope.projIncomWithMileStone[i].bids[j].proposal) !== 'undefined' && $scope.projIncomWithMileStone[i].bids[j].awarded === 'yes'){ 
                newProj = $scope.projIncomWithMileStone[i].bids[j].proposal.milestones;
                var l=0;
                for(l; l<newProj.length; l++){
                  if(newProj[l].status === 'Requested'){
                    $scope.incomReqMileStone[count] = newProj[l];
                    $scope.incomReqMileStone[count].projId =  $scope.projIncomWithMileStone[i]._id;
                    $scope.incomReqMileStone[count].projName =  $scope.projIncomWithMileStone[i].name;
                    $scope.incomReqMileStone[count].projOwner =  $scope.projIncomWithMileStone[i].userInfo.username;
                    $scope.incomReqMileStone[count].projDate =  $scope.projIncomWithMileStone[i].created;
                    count++;
                  }
                }
              }
            }
          }
      }
    };
  }
]);
