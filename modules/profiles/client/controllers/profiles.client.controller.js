'use strict';

// Profiles controller
angular.module('profiles').controller('ProfilesController', ['$window','$scope', '$rootScope','$state', '$uibModal', '$log', '$stateParams', '$filter','$location', '$http', '$timeout', 'Authentication', 'Profiles', 'UniversalData', 'toastr', 'Account', 'Transactions', 'SweetAlert', 'usSpinnerService', 'Notifications', 'UserSchema', 'ProjectSchema', 'Notification',
  function ($window, $scope, $rootScope, $state, $uibModal, $log, $stateParams, $filter,  $location, $http, $timeout, Authentication, Profiles, UniversalData, toastr, Account, Transactions, SweetAlert, usSpinnerService, Notifications, UserSchema, ProjectSchema, Notification) {
    $scope.authentication = Authentication;

    // for amount deposit
    $scope.depositAmount = '';
    $scope.totalDepositAmount = $scope.processFee + $scope.depositAmount;

    $scope.calTotalAmount = function(){
      
      /*calculate charges according to the amount entered*/
      //for <3000 and within South Korea
      if($scope.pay.amount <= 3000){
        $scope.processFee = (($scope.pay.amount*2.9)/100)+0.3;
        $scope.totalDepositAmount = $scope.processFee + $scope.pay.amount;
      }else if($scope.pay.amount > 3000){
        $scope.processFee = (($scope.pay.amount*2.5)/100)+0.3;
        $scope.totalDepositAmount = $scope.processFee + $scope.pay.amount;
      }
    };

    $scope.pricee = 1000;
    $scope.priceeChange = function(){
      $scope.vat = ($scope.pricee/100)*10;
      $scope.totalPricee = $scope.pricee +$scope.vat;
    };

    $scope.view_processing = true;
    // For newsFeeds on dashboard
    $scope.newsLimit = 3;
    $scope.loadMoreNewsFeed = function(){
      var incremented = $scope.newsLimit + 3;
      $scope.newsLimit = incremented > $scope.authentication.user.newsFeed.length ?  $scope.authentication.user.newsFeed.length: incremented;
    };

    // View as Employer/Freelancer
    $scope.viewAsFreelancer = false;
    $scope.viewAsEmployer = true;
    $scope.currencyList = [];

    // Currency rate is being hardcoded here instead of getting the latest rate
    // 1 USD = 1000 KRW
    $rootScope.latestCurrencyRate = { 'USD': 1, 'KRW': 1000 };

    /*if(typeof(JSON.parse(localStorage.getItem('latestCurrencyRate'))) === 'undefined' ){
      $http.get('https://api.fixer.io/latest?base=USD').then(function(res){
        $rootScope.latestCurrencyRate = res.data.rates;
        $rootScope.latestCurrencyRate.USD = 1;
        localStorage.setItem('latestCurrencyRate', JSON.stringify($rootScope.latestCurrencyRate));
        // console.log('rate 1:', $rootScope.latestCurrencyRate);
      });
    }else{
      $rootScope.latestCurrencyRate = JSON.parse(localStorage.getItem('latestCurrencyRate'));      
    }*/

    
    
    // sweet alert
    // $scope.sAlert = function(){
    //   SweetAlert.swal("I'm a  Alert");
      // SweetAlert.swal({
      //     title: "Are you sure?", //Bold text
      //     text: "Your will not be able to recover this imaginary file!", //light text
      //     type: "warning", //type -- adds appropiriate icon
      //     showCancelButton: true, // displays cancel btton
      //     confirmButtonColor: "#DD6B55",
      //     confirmButtonText: "Yes, delete it!",
      //     closeOnConfirm: false, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
      //     closeOnCancel: false
      // }, 
      // function(isConfirm){ //Function that triggers on user action.
      //     if(isConfirm){
      //         SweetAlert.swal("Deleted!");
      //     } else {
      //         SweetAlert.swal("Your file is safe!");
      //     }
      // });

    // };

    // Deposit amount in eWallet
    $scope.deposit = function(){

      Account.findOne({
        filter :{
          where :{
            ownerId : $scope.authentication.user.username
          }
        }
      }, function(response){
        // //console.log('Amount transfer', response);
        $scope.accountId = response.id;
        Transactions.deposit({
          id : $scope.accountId,
          amountDep : parseFloat($scope.totalDepositAmount),
          currency : 'USD'
        }, function(res){
          
          Account.findOne({
            filter:{
              where:{
                ownerId : $scope.authentication.user.username
              }
            }
          }, function(suc){
            // //console.log('succccccccc', suc);
            $rootScope.userAccountBalance = suc;
            // $rootScope.totalBalanceKrw();
            toastr.success('성공적으로 입금완료', '금액 입금', {timeOut: 5000});
            $state.go($state.previous.state.name, $state.previous.params);
          }, function(err){
            //console.log(err);
          });
          
          // //console.log('Amount deposited', resp);
        }, function(err){
          toastr.error('금액 입금 실패', '금액 입금', {timeOut: 5000});
          // //console.log('Amount deposit err', err);
        });
      }, function(err){
        // //console.log('Amount transfer err', err);
      });

    };


    // Find total amount in eWallet
    $scope.findAmount = function(){
      Account.findOne({
        where :{
          filter :{
            ownerId : $scope.authentication.user.username
          }
        }
      }, function(res){
        // //console.log('Amount transfer', res);
        // $scope.accID = res.id;
      }, function(err){
        // //console.log('Amount transfer err', err);
      });
    };

    // Transfer amount from eWallet to eWallet
    $scope.transferAmount = function(){
      // toastr.warning('Amount Transactions.');
      // $scope.findAmount();
      // //console.log('Account ID: ', $scope.accID);
      // Transactions.transfer({
      //   Sid : '5942590b306a632a7c83a029',
      //   Rid : '59412534bd8dc207b3a99d54',
      //   amount : 250,
      //   currency : 'USD'
      // }, function(res){
      //   //console.log('Amount transfer', res);
      //   toastr.success('Amount transfer successfully.', 'Amount transfer', {timeOut: 5000});
      // }, function(err){
      //   //console.log('Amount transfer err', err);
      //   toastr.error('Amount transfer failed.', 'Amount Deposit', {timeOut: 5000});
      // });
    };


    // Withdraw amount from eWallet to eWallet
    // $scope.withdrawAmount = function(){
      
    //   toastr.info('Please wait, you will be redirected to PayPal in short.', 'Paypal');
    //   Transactions.withdraw({
    //     id : $scope.authentication.user.username,
    //     amount : $scope.totalDepositAmount,
    //     currency : 'usd'
    //   }, function(res){
    //     ////console.log('Amount withdrawn', res);
    //   }, function(err){
    //     ////console.log('Amount withdrawn err', err);
    //   });
    // };





    //top right ta
    $scope.hire = {};
    $scope.hire.projectMsg ='안녕하세요. 회원님의 프로필을 보고 우리의 프로젝트에 참여하기를 제안드립니다. ';
    $scope.hire.projectTitle ='';
    $scope.hire.projectDesc ='안녕하세요. 회원님의 프로필을 보고 우리의 프로젝트에 참여하기를 제안드립니다. ';
    
    $scope.calendarControl = {
      experienceStart: {
        maxDate: new Date()
      },
      educationStart: {
        dateFormat: 'yyyy',
        datepickerMode:'year',
        minMode:'year',
        showWeeks:false,
        maxDate: new Date()
      },
      certificateYear: {
        datepickerMode:'year',
        minMode:'year',
        showWeeks:false,
        maxDate: new Date()
      }
    };

    $scope.$watch('experience.start', function(v){
      $scope.experienceEndDate = {
        minDate: v,
        maxDate: new Date()
      };
      
    });

    $scope.$watch('editExperience.start', function(v){
      $scope.editExperienceEndDate = {
        minDate: v,
        maxDate: new Date()
      };
    
    });

    $scope.$watch('education.startYear', function(v){
      $scope.educationEndDate = {
        dateFormat: 'yy',
        datepickerMode:'year',
        minMode:'year',
        showWeeks:false,
        minDate: v,
        maxDate: new Date()
      };
      
    });

    $scope.$watch('editEducation.startYear', function(v){
      $scope.editEducationEndDate = {
        dateFormat: 'yy',
        datepickerMode:'year',
        minMode:'year',
        showWeeks:false,
        minDate: v,
        maxDate: new Date()
      };
    
    });

    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function() {
      $scope.dt = null;
    }; 
    $scope.tabs = [
      { title:'Dynamic Title 1', content:'Dynamic content 1' },
      { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];

    var options = {
      url: 'https://services.groupkt.com/country/',
      method: 'GET',
      cache: true,
      transformResponse: function (data) {
        if(data){
            var result = angular.fromJson(data).RestResponse.result;
            if (!angular.isArray(result)) result = [result];
            return result.map(function (country) {
              return {
                name: country.name,
                code: country.alpha2_code
              };
            });
          }
        }
    };

//Edit Experience
    $scope.editExperinceForm = false;

    $scope.editExperince = function($index,label){

      if (label === 'cancel'){
        $scope.editExperinceForm = false;
      }else if (label === 'save'){

        if($scope.editExperience.currentlyWorking===true) {
          delete $scope.editExperience.end;
        }

        $scope.profile.experience[$scope.index] = $scope.editExperience;
        $scope.editExperinceForm = false;

        $scope.object = {
          'experience' : $scope.profile.experience
        };

        return $http({

          url: '/api/partialProfiles/'+$scope.profile._id,
          method: 'PUT',
          data: $scope.object
        }).then(function(response) {

          $scope.profiles = response;
        },function(response){

          // //console.log(response);
        });
      } else {
        $scope.index = $index;
        $scope.editExperinceForm = true;
        $scope.editExperience = $scope.profile.experience[$index];
        $scope.editExperience.start = new Date($scope.editExperience.start);
        $scope.editExperience.end = new Date($scope.editExperience.end);
      }
    };

    $scope.deleteExperince = function($index){
      if (confirm("확실합니까?")) {
      $scope.profile.experience.splice($index, 1);

      $scope.object = {
        'experience' : $scope.profile.experience
      };

      return $http({

        url: '/api/partialProfiles/'+$scope.profile._id,
        method: 'PUT',
        data: $scope.object
      }).then(function(response) {

        $scope.profiles = response;
      },function(response){
        //console.log(response);
      });
      }
    };
//End Edit Experience
//Start Edit Eduaction
    $scope.editEducationForm = false;

    $scope.editEducations = function($index,label){

      if (label === 'cancel'){
        $scope.editEducationForm = false;
      } else if (label === 'save'){
        $scope.profile.education[$scope.index] = $scope.editEducation;
        $scope.editEducationForm = false;

        $scope.object = {
          'education' : $scope.profile.education
        };

        return $http({
          url: '/api/partialProfiles/'+$scope.profile._id,
          method: 'PUT',
          data: $scope.object
        }).then(function(response) {
          // success
          $scope.profiles = response;
        },function(response){
            // failed
          //console.log(response);
        });
      } else {
        $scope.index = $index;
        $scope.editEducationForm = true;
        $scope.editEducation = $scope.profile.education[$index];
        $scope.editEducation.startYear = new Date($scope.editEducation.startYear);
        $scope.editEducation.endYear = new Date($scope.editEducation.endYear);
      }
    };

    $scope.deleteEducations = function($index){
      if (confirm("확실합니까?")) {
      $scope.profile.education.splice($index, 1);

      $scope.object = {
        'education' : $scope.profile.education
      };

      return $http({
        url: '/api/partialProfiles/'+$scope.profile._id,
        method: 'PUT',
        data: $scope.object
      }).then(function(response) {
        // success
        $scope.profiles = response;
      },function(response){
          // failed
        //console.log(response);
      });
      }
    };
    //End Edit Education
    //Start Edit certificate
    $scope.editCertificateForm = false;

    $scope.editCertificates = function($index,label){
      if (label === 'cancel'){
        $scope.editCertificateForm = false;
      }else if (label === 'save'){

        $scope.profile.certificates[$scope.index] = $scope.editCertificate;
        // //console.log($scope.profile.certificates[$scope.index]);
        $scope.editCertificateForm = false;

        $scope.object = {
          'certificates' : $scope.profile.certificates
        };

        return $http({

          url: '/api/partialProfiles/'+$scope.profile._id,
          method: 'PUT',
          data: $scope.object
        }).then(function(response) {

          $scope.profiles = response;
        },function(response){

          //console.log(response);
        });
      } else {
        $scope.index = $index;
        $scope.editCertificateForm = true;
        $scope.editCertificate = $scope.profile.certificates[$index];
        $scope.editCertificate.date = new Date($scope.editCertificate.date);
      }
    };

    $scope.deleteCertificates = function($index){
      if (confirm("확실합니까?")) {
      $scope.profile.certificates.splice($index, 1);

      $scope.object = {
        'certificates' : $scope.profile.certificates
      };

      return $http({
        url: '/api/partialProfiles/'+$scope.profile._id,
        method: 'PUT',
        data: $scope.object
      }).then(function(response) {
        // success
        $scope.profiles = response;
      },function(response){
          // failed
        //console.log(response);
      });
      }
    };
    //End Edit Certificate
    //Edit Publication 
    $scope.editPublicationForm = false;

    $scope.editPublications = function($index,label){
      
      if (label === 'cancel'){
        $scope.editPublicationForm = false;
      }else if (label === 'save'){
        $scope.profile.publications[$scope.index] = $scope.editPublication;
        // //console.log($scope.profile.publications[$scope.index]);
        $scope.editPublicationForm = false;

        $scope.object = {
          'publications' : $scope.profile.publications
        };

        return $http({
          url: '/api/partialProfiles/'+$scope.profile._id,
          method: 'PUT',
          data: $scope.object
        }).then(function(response) {
          // success
          $scope.profiles = response;
        },function(response){
            // failed
          //console.log(response);
        });
      }
      else {
        $scope.index = $index;
        $scope.editPublicationForm = true;
        $scope.editPublication = $scope.profile.publications[$index];
      }
    };

    $scope.deletePublications = function($index){
      if (confirm("확실합니까?")) {
      $scope.profile.publications.splice($index, 1);

      $scope.object = {
        'publications' : $scope.profile.publications
      };

      return $http({
        url: '/api/partialProfiles/'+$scope.profile._id,
        method: 'PUT',
        data: $scope.object
      }).then(function(response) {
        // success
        $scope.profiles = response;
      },function(response){
          // failed
        //console.log(response);
      });
      }
    };


    //End Edit Publication

    $scope.country = 'SV';

    $scope.remote = angular.copy(options);
    $scope.remote.url += 'search';
    $scope.remoteParam = 'text';

    $scope.remoteValidation = function (value) {
      var settings = angular.copy(options);
      settings.url += 'get/iso2code/' + value;
      return settings;
    };


    //ui model

    $scope.animationsEnabled = true;

    $scope.profileImage = function (size) {
      
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/profiles/client/views/modals/profile-image.client.view.html',
        controller: function($scope, $uibModalInstance, $location, $timeout, $window, Authentication, FileUploader){
          $scope.user = Authentication.user;
          $scope.imageURL = $scope.user.profileImageURL;
          $scope.lastImageURL = $scope.user.profileImageURL;

      // Create file uploader instance
          $scope.uploader = new FileUploader({
            url: 'api/users/picture',
            alias: 'newProfilePicture'
          });

          // Set file uploader image filter
          $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
              var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
              return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
          });

      // Called after the user selected a new picture file
          $scope.uploader.onAfterAddingFile = function (fileItem) {
            if ($window.FileReader) {
              var fileReader = new FileReader();
              fileReader.readAsDataURL(fileItem._file);

              fileReader.onload = function (fileReaderEvent) {
                $timeout(function () {

                  $scope.imageURL = fileReaderEvent.target.result;

                }, 0);
              };
            }
          };

          // Called after the user has successfully uploaded a new picture
      
          $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            // Show success message
            $scope.success = true;

            // Populate user object
            $scope.user = Authentication.user = response;
            $scope.imageURL = $scope.user.profileImageURL;
            // Clear upload buttons
            $scope.cancelUpload();

            if(!$scope.lastImageURL.includes('default')){

              $http({
                url: '/api/users/upload/delete',
                method: 'PUT',
                data: { 'imageURL' : $scope.lastImageURL }
              })
              .then(function(response) {
                // success
                $scope.lastImageURL = $scope.user.profileImageURL;
              }, 
              function(response) {
                // optional
                // failed
                //console.log(response);
              });
            }
            else{
              $scope.lastImageURL = $scope.user.profileImageURL;
            }
          };

          // Called after the user has failed to uploaded a new picture
          $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
            // Clear upload buttons
            $scope.cancelUpload();

            // Show error message
            $scope.error = response.message;
          };

          // Change user profile picture
          $scope.uploadProfilePicture = function () {
            // Clear messages
            $scope.success = $scope.error = null;

            // Start upload
            $scope.uploader.uploadAll();
          };

         // Cancel the upload process
          $scope.cancelUpload = function () {
            $scope.uploader.clearQueue();
            $scope.imageURL = $scope.user.profileImageURL;
          };

          $scope.ok=function(){
            $uibModalInstance.close($scope.imageURL);
          };
          $scope.cancel=function(){
            $uibModalInstance.dismiss('cancel');
          };
        },
        size: size
      });
      modalInstance.result.then(function (image) {
        
        $scope.imageURL = image;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    //Compoany Information Modal
    $scope.comapnyInfo = function (size,profile) {
    
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/profiles/client/views/modals/profile-company-info.client.view.html',
        controller: function($scope, $uibModalInstance, $location){
          $scope.user = Authentication.user;
          $scope.selectDays = [{ day: 'Monday' }, { day: 'Tuesday' }, { day: 'Wedday' }, { day: 'Thursday' }];
          //$scope.imageURL = $scope.user.profileImageURL;

          // //console.log('profile sent::', profile);

          if (!profile.companyInformation) {
            $scope.compInfo = {};
          }
          else
            $scope.compInfo = profile.companyInformation;



          $scope.ok=function(){
            $scope.success = true;
            var object = $scope.compInfo;
            return $http({
              url: '/api/pushCompanyInfo/'+ profile._id,
              method: 'PUT',
              data: object
            }).then(function(response) {
              // success
              $scope.profile = response.data;
              // $scope.profile.compInfo = $scope.profile.compInfo;
              // //console.log('wapis aaa he gia:', $scope.profile);

              $uibModalInstance.close();
            },function(response){
              // failed
              //console.log(response);
            });
            //$uibModalInstance.close();
          }; //ok end


          $scope.cancel=function(){
            $uibModalInstance.dismiss('cancel');
          };
        },
        size: size
      });
    };
    //companyinfo end


    //Portfolio Modal
    $scope.addPortfolio = function (title,size,profile) {
    
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/profiles/client/views/modals/profile-addPortfolio.client.view.html',
        controller: function($scope, $uibModalInstance, $location,FileUploader,$window,profile){
          $scope.user = Authentication.user;
          $scope.selectDays = [{ day: 'Monday' }, { day: 'Tuesday' }, { day: 'Wedday' }, { day: 'Thursday' }];
          $scope.imageURL = $scope.user.profileImageURL;
          $scope.portfolio = {};
          $scope.profile = profile;
          $scope.title = title;
          $scope.sizeError = false;
          
          


          $scope.uploader = new FileUploader({
            url: 'api/profile/portfolioImage',
            alias: 'newPortfolioPicture'
          });

          // Set file uploader image filter
          $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
              var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
              return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
          });

          // Cancel the upload process
          $scope.cancelUpload = function () {
            $scope.uploader.clearQueue();
            $scope.portfolio.image = '';
          };

        // Called after the user selected a new picture file
          $scope.uploader.onAfterAddingFile = function (fileItem) {
            if ($window.FileReader) {
              var fileReader = new FileReader();
              fileReader.readAsDataURL(fileItem._file);
    
              fileReader.onload = function (fileReaderEvent) {
  
                $timeout(function () {

                  var size = fileItem.file.size/1000000;
                  if(size > 5) {
                    
                    $scope.uploader.clearQueue();
                    $scope.sizeError = true;
                    $scope.portfolio.image = '';
                    return false;
                  }

                  $scope.sizeError = false;
                  $scope.portfolio.image = fileReaderEvent.target.result;
                  
                }, 0);
              };
            }
          };

        // Called after the user has successfully uploaded a new picture
    
          $scope.ok=function(){
            
            if($scope.uploader.queue.length) {
              // for(var i =0; i<$scope.uploader.queue.length;i++)
              $scope.imageName = $scope.uploader.queue[0].upload();
              // //console.log(i );
            } 


           $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
              // Show success message

              $scope.success = true;
              $scope.portfolio.image = response;
               
              var object = {
                'portfolio' : $scope.portfolio
              };

              return $http({
                url: '/api/partialProfilesArray/'+$scope.profile._id,
                method: 'PUT',
                data: object
              }).then(function(response) {
                // success
                $scope.profile = response.data;
                $scope.profile.portfolio = $scope.profile.portfolio;
              
                ////console.log($scope.profile);
                $uibModalInstance.close($scope.profile);
              },function(response){
                // failed
                ////console.log(response);
              });

            // Populate user object
           
            };

            $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
              // Clear upload buttons
              //$scope.cancelUpload();
              ////console.log(response);
              $scope.portfolio = {};
              // Show error message
              $scope.error = response.message;
            };

            if(!$scope.uploader.queue.length) {

             
              $scope.portfolio.image = 'modules/profiles/client/img/portfolio/default.png';
              

              var object = {
                'portfolio' : $scope.portfolio
              };

              return $http({
                url: '/api/partialProfilesArray/'+$scope.profile._id,
                method: 'PUT',
                data: object
              }).then(function(response) {
                // success
                $scope.profile = response.data;
                $scope.profile.portfolio = $scope.profile.portfolio;
                $uibModalInstance.close($scope.profile);
                ////console.log($scope.profile);
              },function(response){
                // failed
                ////console.log(response);
              });
              

            } 

          };
          $scope.cancel=function(){
            $uibModalInstance.dismiss('cancel');
          };
        },
        size: size,
        resolve: {
          profile: function() {
            // //console.log('size: ', profile);
            return profile;
          }
        }
      });

      modalInstance.result.then(function (result) {
          $scope.profile = result;
      });
    };


    $scope.editPortfolio = function (title, size,profile,index) {
    
     var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/profiles/client/views/modals/profile-addPortfolio.client.view.html',
        controller: function($scope, $uibModalInstance, $location,FileUploader,$window,profile){
          $scope.user = Authentication.user;
          $scope.selectDays = [{ day: 'Monday' }, { day: 'Tuesday' }, { day: 'Wedday' }, { day: 'Thursday' }];
          $scope.imageURL = $scope.user.profileImageURL;
          $scope.portfolio = {};
          $scope.title = title;
          $scope.profile = profile;
          if(index>=0) {
            $scope.portfolio = $scope.profile.portfolio[index];
          }


          $scope.uploader = new FileUploader({
            url: 'api/profile/portfolioImage',
            alias: 'newPortfolioPicture'
          });

          // Set file uploader image filter
          $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
              var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
              return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
          });

          // Cancel the upload process
          $scope.cancelUpload = function () {
            $scope.uploader.clearQueue();
            $scope.portfolio.image = '';
          };

          // Called after the user selected a new picture file
          $scope.uploader.onAfterAddingFile = function (fileItem) {
            if ($window.FileReader) {
              var fileReader = new FileReader();
              fileReader.readAsDataURL(fileItem._file);

              fileReader.onload = function (fileReaderEvent) {
                $timeout(function () {

                  var size = fileItem.file.size/1000000;
                  if(size > 5) {
                    
                    $scope.uploader.clearQueue();
                    $scope.sizeError = true;
                    $scope.portfolio.image = '';
                    return false;
                  }

                  $scope.portfolio.image = fileReaderEvent.target.result;
                }, 0);
              };
            }
          };

          // Called after the user has successfully uploaded a new picture
      
          $scope.ok=function(){

            if($scope.uploader.queue.length) {
              $scope.imageName = $scope.uploader.queue[0].upload();
            } 


            $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
          // Show success message

              $scope.success = true;
              $scope.portfolio.image = response;
              $scope.profile.portfolio[index] = $scope.portfolio;

              var object = {
                'portfolio' : $scope.profile.portfolio
              };

              return $http({
                url: '/api/partialProfiles/'+$scope.profile._id,
                method: 'PUT',
                data: object
              }).then(function(response) {
                // success
                $scope.profile = response.data;
              
                ////console.log($scope.profile);
                $uibModalInstance.close($scope.profile);
              },function(response){
                // failed
                ////console.log(response);
              });

            // Populate user object
           
            };

            $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
            // Clear upload buttons
              //$scope.cancelUpload();
              ////console.log(response);
              $scope.portfolio = {};
              // Show error message
              $scope.error = response.message;
            };

            if(!$scope.uploader.queue.length) {    

              $scope.profile.portfolio[index] = $scope.portfolio;        

              var object = {
                'portfolio' : $scope.profile.portfolio
              };

              return $http({
                url: '/api/partialProfiles/'+$scope.profile._id,
                method: 'PUT',
                data: object
              }).then(function(response) {
                // success
                $scope.profile = response.data;
                $uibModalInstance.close($scope.profile);
                ////console.log($scope.profile);
              },function(response){
                // failed
               // //console.log(response);
              });
              

            } 

          };
          $scope.cancel=function(){
            $scope.portfolio.image = $scope.profile.portfolio[index].image;
            $uibModalInstance.dismiss('cancel');
          };
        } ,
        size: size,
        resolve: {
          profile: function() {
            // //console.log('size: ', profile);
            return profile;
          },
          index: function() {
          // //console.log('index: ', index);
            return index;
          }
        }
      });
      
      modalInstance.result.then(function (result) {
          $scope.profile = result;
      });
    };


    //star rating
    $scope.rate = 0;
    $scope.max = 5;
    $scope.isReadonly = true;
    $scope.percent = 75;
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
  // add skills 
    $scope.browse =[
      { value: 'Axect' , label: 'Axect' },
      { value: 'NetSole' , label: 'NetSole' },
      { value: 'Nextbridge' , label: 'Nextbridge' }
    ];
    $scope.hobbies =[
      { value: 'php' , label: 'php' },
      { value: 'wordpress' , label: 'wordress' },
      { value: 'laravel' , label: 'laravel' }
    ];
    //Certificates
    $scope.certificateIt =[
      { value: 'Adobe Certifications' , label: 'Adobe Certifications' },
      { value: 'Cisco Certifications' , label: 'Cisco Certifications' },
      { value: 'Oracle Certifications' , label: 'Oracle Certifications' }
    ];
    // $scope.skils =[
    //   { value: 'HTML' , label: 'HTML' },
    //   { value: 'CSS' , label: 'CSS' },
    //   { value: 'Bootstrap' , label: 'Bootstrap' },
    //   { value: 'PHP' , label: 'PHP' },
    //   { value: 'MeanJs' , label: 'MeanJa' },
    //   { value: 'AngularJs' , label: 'AngularJs' }
    // ];
  //show and hide div on button
    $scope.IsHidden = true;
    $scope.publicationStatus=false;
    $scope.experienceStatus=false;
    $scope.educationStatus=false;
    $scope.certificateStatus=false;
    $scope.textareaCompany=false;
   
// <<<<<<< HEAD
    $scope.editProfile = false;
    $scope.profileEditButton = function(buttonStatus){
      if(buttonStatus === false){
        $scope.editProfile = true;
      }else{
        $scope.editProfile = false;
      }
    };
    $scope.publictionSave=function(publicationStatus){

      if(publicationStatus === 'cancel'){

        $scope.publicationStatus = false;
        $scope.publication = {};
      
      }else if (publicationStatus === 'save'){
        var object = {
          'publications' : $scope.publication
        };

        return $http({
          url: '/api/partialProfilesArray/'+$scope.profile._id,
          method: 'PUT',
          data: object
        }).then(function(response) {
          // success
          $scope.profile = response.data;
          $scope.publicationStatus = false;
          $scope.publication = {};
          ////console.log($scope.profile);
        },function(response){
          // failed
          ////console.log(response);
        });
      }     

      if(publicationStatus === false){
        $scope.publicationStatus = true;
      }else{
        $scope.publicationStatus = false;
      }        
    };
    $scope.educationSave = function(educationStatus){

      if(educationStatus === 'cancel'){

        $scope.educationStatus = false;
        $scope.education = {};
      
      }else if (educationStatus === 'save'){
        var object = {
          'education' : $scope.education
        };

        return $http({
          url: '/api/partialProfilesArray/'+$scope.profile._id,
          method: 'PUT',
          data: object
        }).then(function(response) {
          // success
          $scope.profile = response.data;
          $scope.educationStatus = false;
          $scope.education = {};
         // //console.log($scope.profile);
        },function(response){
          // failed
         // //console.log(response);
        });
      }       
    };

    $scope.experienceSave=function(experienceStatus){

      if(experienceStatus === 'cancel'){

        $scope.experienceStatus = false;
        $scope.education = {};
      
      }else if (experienceStatus === 'save'){

        if($scope.experience.currentlyWorking === true) {
          delete $scope.experience.end;
        }
        
        var object = {
          'experience' : $scope.experience
        };

        return $http({
          url: '/api/partialProfilesArray/'+$scope.profile._id,
          method: 'PUT',
          data: object
        }).then(function(response) {
          // success
          $scope.profile = response.data;
          $scope.experienceStatus = false;
          $scope.experience = {};
         // //console.log($scope.profile);
        },function(response){
          // failed
        //  //console.log(response);
        });
      }        
    };
    $scope.certificateSave=function(certificateStatus){

      if(certificateStatus === 'cancel'){

        $scope.certificateStatus = false;
        $scope.education = {};

      }else if (certificateStatus === 'save'){
        var object = {
          'certificates' : $scope.certificate
        };

        return $http({
          url: '/api/partialProfilesArray/'+$scope.profile._id,
          method: 'PUT',
          data: object
        }).then(function(response) {
          // success
          $scope.profile = response.data;
          $scope.certificateStatus = false;
          $scope.certificate = {};
         // //console.log($scope.profile);
        },function(response){
          // failed
        //  //console.log(response);
        });
      }        
    };

    // $scope.skillsSave=function(){

    //   $scope.skills = false;
    //   var object = {
    //     'skills': $scope.profile.skills
    //   };

    //   return $http({
    //     url: '/api/partialProfiles/'+$scope.profile._id,
    //     method: 'PUT',
    //     data: object
    //   }).then(function(response) {
    //     // success
    //     $scope.profile = response.data;
    //     //console.log('ssss', $scope.profile.skills);
    //   },function(response){
    //     // failed
    //     //console.log(response);
    //   });       
    // };

    $scope.certificationSave=function(){

      $scope.certification = false;
      var object = {
        'certifications': $scope.profile.certifications
      };

      // console.log('certifications', $scope.profile);

      return $http({
        url: '/api/partialProfiles/'+$scope.profile._id,
        method: 'PUT',
        data: object
      }).then(function(response) {
        $scope.profile = response.data;
        $scope.skillls = response.data.skills;
        $scope.skillsToAdd = response.data.skills;
        $scope.certifications = response.data.certifications;
        $scope.profile.certifications = response.data.certifications;
      },function(response){
        // failed
      });       
    };

    $scope.skillsSave=function(){
      
      $scope.newSkillSet = false;

      var object = {
        'skills': $scope.skillsToAdd
      };

      // console.log('Skill:', object);
      return $http({
        url: '/api/partialProfiles/'+$scope.profile._id,
        method: 'PUT',
        data: object
      }).then(function(response) {
        $scope.profile = response.data;
        $scope.skillls = response.data.skills;
        $scope.skillsToAdd = response.data.skills;
        $scope.certifications = response.data.certifications;
        $scope.profile.certifications = response.data.certifications;
        console.log('response:', response);
      });       
    };
    
    $scope.experienceStart = function() {
      $scope.experienceStart.opened = true;
    };
    $scope.experienceEnd = function() {
      $scope.experienceEnd.opened = true;
    };
    $scope.StartYearDate = function() {
      $scope.StartYearDate.opened = true;
    };
    $scope.EndYearDate = function() {
      $scope.EndYearDate.opened = true;
    };


    $scope.open2 = function() {
      $scope.popup2.opened = true;
    };
    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };
    $scope.popup2 = {
      opened: false
    };
   
    $scope.ShowHide = function () {
      $scope.IsHidden = $scope.IsHidden ? false : true;
    };

    $scope.createFunction = function (input) {
     // format the option and return it
      return {
        value: input.toLowerCase(),
        label: input
      };
    };  

    $scope.createFunctionLower = function (input) {
     // format the option and return it
      return {
        value: input.toLowerCase(),
        label: input
      };
    };  

    //radio butn
    $scope.fixedHourly = {
      name: 'hourly rate'
    };
    //select  currency
    $scope.currencies = [
      { new_currency : 'KRW' },
      { new_currency : 'USD' }
    ]; 
    $scope.saveUser = function() {
    // $scope.user already updated!

      var object = {
        'affiliation' : $scope.profile.affiliation,
        'companyRepresentative' : $scope.profile.companyRepresentative
      };

      return $http({
        url: '/api/partialProfiles/'+$scope.profile._id,
        method: 'PUT',
        data: object
      }).then(function(response) {
        // success
        $scope.profile = response.data;
      },function(response){
        // failed
        ////console.log(response);
      });
    };

    $scope.updateUserInfo = function(data,label) {

      var object ={};

      if(label === 'country') {
        // //console.log('$scope.countryName', $scope.countryName);
        // //console.log('data',data);
        object = {
          'userInfo.country' : {
            name: $scope.countryName,
            code: data
          }
        };

      }
      else if(label === 'companyName')
      {
        object = {
          'userInfo.companyName' : data
        };
        ////console.log('companyName', object);
      }
     
     
      return $http({
        url: '/api/userInfoUpdate/'+$scope.profile._id,
        method: 'PUT',
        data: object
      
      }).then(function(response) {
        // success
        $scope.profile = response.data.profile;
        $scope.authentication.user = response.data.user;
        $scope.countryEdit = !$scope.countryEdit;
        ////console.log(response);
      },function(response){
          // failed
        ////console.log(response);
       
      });
    }; 

    $scope.updateProfile = function(data,label) {
      // //console.log(label);
      var profile = $scope.profile;
      $scope.object ={};
      
      if(label === 'affiliation')
      {
        $scope.object = {
          'affiliation' : data
        };
      }
      else if(label === 'shortProfessionalHeadline') {

        $scope.object = {
          'shortProfessionalHeadline' : data
        };

      }
      else if(label === 'perHourRate') {

        $scope.object = {
          'perHourRate' : data
        };

      }
      else if(label === 'indInfo') {

        ////console.log('indInfo', data);

        $scope.object = {
          'indInfo' : data
        };

        $scope.textareaInd = false;

      }
      else if(label === 'companyIntro'){
        $scope.textareaCompany = !$scope.textareaCompany;
        $scope.object = {
          'companyIntro' : data
        };
      }

     
      return $http({
        url: '/api/partialProfiles/'+$scope.profile._id,
        method: 'PUT',
        data: $scope.object
      
      }).then(function(response) {
        // success
        ////console.log(response);
        $scope.profiles = response;
      },function(response){
          // failed
       // //console.log(response);
         // //console.log(response);
      });
    }; 

    // Create new profiles
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'profileForm');

        return false;
      }

      // Create new profiles object
      var profile = new Profiles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      profile.$save(function (response) {
        $location.path('profiles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing profiles
    $scope.remove = function (profile) {
      if (profile) {
        profile.$remove();

        for (var i in $scope.profiles) {
          if ($scope.profiles[i] === profile) {
            $scope.profiles.splice(i, 1);
          }
        }
      } else {
        $scope.profile.$remove(function () {
          $location.path('profiles');
        });
      }
    };

    // Update existing profiles
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'profileForm');

        return false;
      }

      var profile = $scope.profile;

      profile.$update(function () {
        $location.path('profiles/' + profile._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Profiles
    $scope.find = function () {

      $timeout(function() {
        usSpinnerService.spin('profLoader');
      }, 100);

      if(!$scope.authentication.user.profile_id) {
        
        $http({
          url: '/api/profiles',
          method: 'POST' 
        }).then(function(response) {
          $scope.profile = response.data.profile;
          $scope.coverImageURL = $scope.profile.userInfo.coverImageURL;          
          $scope.imageURL = $scope.profile.userInfo.profileImageURL;
          $scope.authentication.user = response.data.user;

          $timeout(function() {
            usSpinnerService.stop('profLoader');
          }, 100);
         
        },function(err){
        });
      } 
      else {
        // Check if there is payment verification token in url
        var paymentId = location.search;
        if (paymentId.includes('?paymentId=PAY-')){
          $scope.verifyPaymentPaypal();
        }

        $http({
          url: '/api/profiles/' + $scope.authentication.user.profile_id,
          method: 'GET' 
        }).then(function(response) {

          $scope.profile = response.data;
          $scope.profile.certifications = response.data.certifications;
          // $scope.profile.skills = response.data.skillsArray;
         
          $scope.certifications = response.data.certifications;
          $scope.skillls = response.data.skills;
          $scope.profile.skills = $scope.skills;

          // $scope.inayat = {};
          // $scope.inayat.muaz = response.data.skillsArray;
          // $scope.nabeel = response.data.skillsArray;
          
          $scope.coverImage = $scope.profile.userInfo.coverImageURL;
          
          $scope.imageURL = $scope.profile.userInfo.profileImageURL;

          // console.log('profile:', $scope.skillls);
          

          $timeout(function() {
            usSpinnerService.stop('profLoader');
          }, 100);

        },function(response){

        });
        // Profiles.get({
        //   profileId: $scope.authentication.user.profile_id
        // }).$promise.then(function(data) {
          
          //$scope.myTopSkills = $scope.profile.skills;
          
       // });
      }

      $scope.bannerValues(Authentication.user.projectsAwarded);
    };

    
    // As a Freelancer Rating
    ////////////////////////////////////////////////////////////////////////

    if($scope.authentication.user.finalUserRattingBaseOnProjectAwarded)
    {
      $scope.rateStars = $scope.authentication.user.finalUserRattingBaseOnProjectAwarded;
    }
    else{
      $scope.rateStars = 0.0;
    }
    //no of reviews
    if($scope.authentication.user.noOfReviewBaseOnProjectAwarded)
    {
      $scope.noOfReviews = $scope.authentication.user.noOfReviewBaseOnProjectAwarded;
    }
    else{
      $scope.noOfReviews = 0;
    }

    // Find Rater and the project detail
    angular.forEach(Authentication.user.projectsAwarded, function (pAwd, i) {

        if(pAwd.feedback){
          // //console.log('pAwd::', pAwd);
          UserSchema.findOne({
              filter: {
                  where: {
                      id: pAwd.feedback.userId
                  },
                  fields: ['username','profileImageURL','country']
              }
          }, function (rater) {
              // //console.log('XXXXXX  users : ', rater);
              $scope.authentication.user.projectsAwarded[i].raterImage = rater.profileImageURL;
              $scope.authentication.user.projectsAwarded[i].raterUsername = rater.username;
              Object.assign(pAwd, rater);
              //console.log("pAwd::", pAwd);
          });

          // find the project
          ProjectSchema.findOne({
              filter: {
                  where: {
                      id: pAwd.projectId
                  },
                  fields: ['name']
              }
          }, function (proj) {
              $scope.authentication.user.projectsAwarded[i].projName = proj.name;
              Object.assign(pAwd, proj);
              //console.log("Proj awd", pAwd);
          });
        }

    });
    // End as a Freelancer Rating
    // //////////////////////////////////////////////////////////////////////


    // As a Employer Rating
    // ///////////////////////////////////////////////////////
    if($scope.authentication.user.finalUserRattingBaseOnMyProject)
    {
      $scope.empStars = $scope.authentication.user.finalUserRattingBaseOnMyProject;
    }
    else{
      $scope.empStars = 0.0;
    }
    //no of reviews
    if($scope.authentication.user.noOfReviewBaseOnMyProject)
    {
      $scope.empNoReview = $scope.authentication.user.noOfReviewBaseOnMyProject;
    }
    else{
      $scope.empNoReview = 0;
    }

    // Find Rater and the project detail
    angular.forEach(Authentication.user.myProjects, function (myProj, i) {

        if(myProj.feedback){
          // //console.log('myProj::', myProj);
          UserSchema.findOne({
              filter: {
                  where: {
                      id: myProj.feedback.userId
                  },
                  fields: ['username','profileImageURL','country']
              }
          }, function (rater) {
              // //console.log('XXXXXX  users : ', rater);
              $scope.authentication.user.myProjects[i].raterImage = rater.profileImageURL;
              $scope.authentication.user.myProjects[i].raterUsername = rater.username;
              Object.assign(myProj, rater);
              // //console.log(rater);
          });
        }
    });
    // //////////////////////////////////////////////////////
    // End as a Employer Rating


    // Find freelancer profile
    $scope.findOne = function () {

      $timeout(function() {
        usSpinnerService.spin('profLoader');
      }, 100);
      
      // //console.log('$stateParams.prof._id',$stateParams.profileId);    
      $http({
        url: '/api/profiles/' + $stateParams.profileId,
        method: 'GET' 
      }).then(function(response) {
        //console.log(response);
        $scope.profile = response.data.profile; 
        $scope.bhindi = response.data.profile.skills;  
        $scope.certifications = response.data.profile.certifications;  

        // As Freelancer
        if($scope.profile.finalUserRattingBaseOnProjectAwarded)
        {
          $scope.finalUserRattingBaseOnProjectAwarded = $scope.profile.finalUserRattingBaseOnProjectAwarded;
        }
        else{
          $scope.finalUserRattingBaseOnProjectAwarded = 0.0;
        }
        //no of reviews
        if($scope.profile.noOfReviewBaseOnProjectAwarded)
        {
          $scope.noOfReviewBaseOnProjectAwarded = $scope.profile.noOfReviewBaseOnProjectAwarded;
        }
        else{
          $scope.noOfReviewBaseOnProjectAwarded = 0;
        }
        // End As Freelaner

        // As Employer
        if($scope.profile.finalUserRattingBaseOnMyProject)
        {
          $scope.finalUserRattingBaseOnMyProject = $scope.profile.finalUserRattingBaseOnMyProject;
        }
        else{
          $scope.finalUserRattingBaseOnMyProject = 0.0;
        }
        //no of reviews
        if($scope.profile.noOfReviewBaseOnMyProject)
        {
          $scope.noOfReviewBaseOnMyProject = $scope.profile.noOfReviewBaseOnMyProject;
        }
        else{
          $scope.noOfReviewBaseOnMyProject = 0;
        }
        // End As Employer
        //console.log('bhindi', $scope.bhindi);      
        $scope.cover = $scope.profile.userInfo.coverImageURL;        
        $scope.imageURL = $scope.profile.userInfo.profileImageURL;

        // Get the userInfo freelancer
        return $http({
          url: '/api/hiddenUser/' + $scope.profile.userInfo._id,
          method: 'GET'
        }).then(function (succ) {
          $scope.flUserInfo = succ.data;
          $scope.awardedProjects = $scope.flUserInfo.projectsAwarded;
          var awardedProjects = $scope.flUserInfo.projectsAwarded;
          $scope.myProjects = $scope.flUserInfo.myProjects;

          $timeout(function() {
            usSpinnerService.stop('profLoader');
          }, 50);

          $scope.bannerValues(awardedProjects);
          // console.log('$scope.flUserInfo.projectsAwarded:', $scope.flUserInfo.projectsAwarded);

        }, function (err) {
          //console.log('user failed',err);
        });

      },function(err){
        //console.log(err);
      });
      
    };

    $scope.universalData = function () {

      $scope.countryData = [];
      $scope.universitiesData = [];
      $scope.skills = [];
      
      // start spinner
      $timeout(function() {
        usSpinnerService.spin('spinnerDashboard');
      }, 100);

      $scope.universal = UniversalData.query().$promise.then(function(data) {

        $scope.profileProgressBar();
        $scope.view_processing = false;
        $scope.records = data[0];
        $scope.countryData = $scope.records.countryData;
        $scope.universitiesData = $scope.records.universities;
        $scope.skills = $scope.records.skills;
        $scope.skillsNew = $scope.records.skills;
        
        $scope.hourlyRate = $scope.records.hourlyRate;
        $scope.rateList = $scope.hourlyRate;
        $scope.price = $scope.rateList[3];

        // stop spinner
        $timeout(function() {
          usSpinnerService.stop('spinnerDashboard');
        },50);
        for(var key in data[0].currency ){
          if(key === 'KRW' ||key === 'USD'){
          // if(key === 'KRW' ||key === 'USD' ||key === 'JPY' ||key === 'CNY'){
            $scope.currencyList.push(key);
          }
        }

        return $scope.records;
      }, function(error) {
        //console.log('error universlel data');
      });

    };

    $scope.getCountryName = function () {

      $timeout(function() {
      
        angular.forEach($scope.countryData, function(value, key) {

          if(value.code === $scope.profile.userInfo.country.code)
          {
            $scope.countryName = value.name;
            // $scope.country = value.name;
          }
        });
      },200);

    };

    //for outsoucing freelancers page
    // Find a list of OutSoucingOKs
    // $scope.getAllProfiles = function () {
    //   // //console.log('List of OutSoucingOKs');

    //   $http({
    //     url: '/api/freelancers',
    //     method: 'GET'
    //   }).then(function(response) {
    //       // success
    //     //console.log('success Data');

    //     var allProfiles; 
    //     $scope.allProfiles = response.data;
    //     //console.log($scope.allProfiles);

    //   },function(response){
    //       // failed
    //     //console.log('failed getAllProfiles data  response');
    //   });
    // };
    $scope.maxSize = 5;
    $scope.numPerPage = 10;
    $scope.currentPage = 1;


    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;

    $scope.getAllProfiles = function () {
      $scope.isLoading = true;

      $scope.profile = Profiles.query().$promise.then(function(data) {
        $scope.promiseResolved = true;
        $scope.profile = data;
        $scope.allProfiles = data;
        $scope.oldData = data;

        $scope.isLoading = false;

       // start code for pagination
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.filteredProfiles = $scope.profile.slice(begin, end);
        //end code for pagination

        $scope.profilesLength = $scope.profile.length;

      }, function(error) {
        $scope.isLoading = false;
      });
    };

    $scope.$watch('currentPage + numPerPage', function() {
      var begin = (($scope.currentPage - 1) * $scope.numPerPage);
      var end = begin + $scope.numPerPage;
    
      if($scope.promiseResolved) {
        $scope.filteredProfiles = $scope.profile.slice(begin, end);

        // //console.log('ilteredProfiles', $scope.filteredProfiles);
      }
    });

    // search a freelancer by professional headline

    $scope.search = function (key) {
      if (key === 'byProfession') {
        $scope.profile = $scope.oldData;
        if($scope.searchProfile){
          $scope.profile = $scope.profile.filter(function (obj) {
            if((obj.userInfo.username).toLowerCase().includes($scope.searchProfile.toLowerCase()) ||
              (obj.userInfo.displayName.toLowerCase()).includes($scope.searchProfile.toLowerCase())){
              return obj;
            }
          });
        }else{
          $scope.profile = $scope.oldData;
        }
      }
      $scope.paginateSearchResults();
    };

    // search by skills
    $scope.$watch('searchBySkill',function(newValue,oldValue){
      
      if(typeof newValue !== 'undefined' && newValue.length>0) {
        angular.copy($scope.profile, $scope.previousData);
        $scope.profile = $scope.profile.filter(function (obj) {
            
            for(var i = 0;i < obj.skills.length;i++) {
                for(var j = 0;j < newValue.length;j++) {
                    
                    if(obj.skills[i].name == newValue[j].name){
                      return obj;
                    }
                }
            }

        });  
        $scope.paginateSearchResults();
      }
      else if(!newValue && !oldValue){
        $scope.profile = $scope.oldData;
        $scope.paginateSearchResults();
      }
      else if(typeof newValue !== 'undefined' && newValue.length === 0) {
        $scope.profile = $scope.previousData;
        $scope.profile = $scope.oldData;
        $scope.previousData = [];
        $scope.paginateSearchResults();
      } 
    });

    // search by Country
    $scope.$watch('searchByCountry',function(newValue,oldValue){
      
      if(typeof newValue !== 'undefined' && newValue.length>0) {
       
        $scope.profile = $scope.oldData;
       
        $scope.profile = $scope.profile.filter(function (obj) {
         
          if(obj.userInfo.country.name){
            for(var i = 0;i < newValue.length; i++) {
              
              if(obj.userInfo.country.name == newValue[i].name){
                return obj;
              }

            }

          }

        });  
        $scope.paginateSearchResults();
      }
      else if(!newValue && !oldValue){
        $scope.profile = $scope.oldData;
        $scope.paginateSearchResults();
      }
      else if(typeof newValue !== 'undefined' && newValue.length === 0) {
        $scope.profile = $scope.previousData;
        $scope.profile = $scope.oldData;
        $scope.previousData = [];
        $scope.paginateSearchResults();
      } 
    });


    $scope.paginateSearchResults = function (key) {
      $scope.currentPage = 1;
      var begin = (($scope.currentPage - 1) * $scope.numPerPage);
      var end = begin + $scope.numPerPage;
      if($scope.profile){
        $scope.filteredProfiles = $scope.profile.slice(begin, end);      
        $scope.profilesLength = $scope.profile.length+1;
      }

    };
    


    // find a profile to show 
    $scope.findOutSoucingOK = function () {
      
      if($stateParams.profileId !== '')
      $scope.profile = Profiles.get({
        profileId: $stateParams.profileId
      }).$promise.then(function(data) {
        $scope.profile = data; 


        $scope.myTopSkills = $scope.profile.skills;
      }, function(error) {
      });
    };


    //View Portfolio
    $scope.viewPortfolio = function (size,profile, index) {
     
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/profiles/client/views/modals/view-portfolio.client.view.html',
        controller: function($scope, $uibModalInstance, $location,FileUploader,$window,profile){
          $scope.user = Authentication.user;
          $scope.selectDays = [{ day: 'Monday' }, { day: 'Tuesday' }, { day: 'Wedday' }, { day: 'Thursday' }];
          $scope.imageURL = $scope.user.profileImageURL;
          $scope.portfolio = {};
          $scope.profile = profile;

          if(!$scope.profile.finalUserRattingBaseOnProjectAwarded){
            $scope.profile.finalUserRattingBaseOnProjectAwarded = 0;
          }
          
          if(index>=0) {
            $scope.portfolio = $scope.profile.portfolio[index];
          }
             
          $scope.ok=function(){

          };
          $scope.cancel=function(){
            $uibModalInstance.dismiss('cancel');
          };
        },
        size: size,
        resolve: {
          profile: function() {
            // //console.log('size: ', profile);
            return profile;
          }
        }
      });
    };
    //View portfolio end

    //when hire me button is clicked
    $rootScope.hireMe = function (size, profile, hiree) {

      SweetAlert.swal({
        title: "프리랜서와 계약을 원하시나요?", 
        text: "프리랜서께 "+hiree.selectedCurrency+' '+hiree.fixedPrice+"원에 제안합니다.", 
        type: "warning", 
        showCancelButton: true, 
        confirmButtonColor: "#5cb85c",
        confirmButtonText: "예!",
        closeOnConfirm: false, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
        closeOnCancel: false
      }, 
      function(isConfirm){ //Function that triggers on user action.
        if(isConfirm){
          SweetAlert.close();

          // Post a project as awarded project
          var cur;
          if(hiree.selectedCurrency === 'USD'){
            cur = {
              'code': hiree.selectedCurrency,
              'symbol_native': '$'
            };
          }else if(hiree.selectedCurrency === 'KRW'){
            cur = {
              'code': hiree.selectedCurrency,
              'symbol_native': '₩'
            };
          }

          var obj = {
            'currency' : cur,
            'projectRate' : 'fixed',
            'user' : Authentication.user._id,
            'name' : hiree.projectTitle,
            'description' : hiree.projectDesc,
            'minRange' : 1,
            'maxRange' : hiree.fixedPrice,
            'userInfo' : Authentication.user,
            'skills': profile.skills
          };

          return $http({
            url: '/api/projects',
            method: 'POST',
            data: obj
          }).then(function(response) {

            // Place an auto bid from hiree
            var userId = profile.userInfo._id;
            var yourBid = (parseInt(hiree.fixedPrice) * 0.00)+parseInt(hiree.fixedPrice);
            
            var bidData = {
              'userId': profile.userInfo._id,
              'bidderName': profile.userInfo.username,
              'bidderEmail': profile.userInfo.email,
              'bidderImageURl': profile.userInfo.profileImageURL,
              'bidderInfo': profile.userInfo,
              'created': Date.now(),
              'actualBid': hiree.fixedPrice,
              'yourBid': yourBid,
              'awarded': 'pending',
              'deliverInDays': 3
            };
            
            var objj = {
              'bids': bidData
            };

            return $http({
              url: '/api/project/placeBid/' + response.data._id,
              method: 'PUT',
              data: objj
            }).then(function (response) {
              var txt = '회원님의 프로젝트를 '+profile.userInfo.username+'를 선정하였습니다. 프리랜서께서 확인 후 수락을 하시면 프로젝트가 작업이 시작됩니다.';
              Notification.success({message: txt, positionY: 'bottom', positionX: 'right', closeOnClick: true, title: '<i class="glyphicon glyphicon-check"></i> 프로젝트 선정완료'});

              // Notify the user
              Notifications.create({  
                "publisher": Authentication.user.username,  
                "subscriber": profile.userInfo.username, 
                "description": Authentication.user.username + "회원님께서 등록한 프로젝트의 수락을 요청하셨습니다. 수락여부를 알려주시길 바랍니다.", 
                "link": response.data.project._id, 
                "isClicked": false,
                "project": true
              });

              // When all set, open modal for milestone creattion
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modules/profiles/client/views/modals/hire-me.client.view.html',
                controller: function($scope, $uibModalInstance, $location,FileUploader,$window, profile, Authentication){
                  $scope.user = Authentication.user;
                  $scope.profile = profile;
                  $scope.hired = hiree;
                  $scope.project = response.data.project;

                  $scope.ok=function(){

                    // Update bid with propopsal
                    var proposal = {
                      'description': $scope.project.description,
                      'milestones':[
                        {
                          'status': 'Requested',
                          'description': $scope.hireme_milestone_desc,
                          'price': $scope.hireme_amount
                        }
                      ]
                    };

                    $scope.project.bids[0].proposal = proposal;

                    var obj = {
                      'data': $scope.project.bids[0],
                      'index': 0
                    };

                    return $http({
                      url: '/api/project/submitProposal/' + $scope.project._id,
                      method: 'PUT',
                      data: obj
                    }).then(function (response) {
                      $uibModalInstance.dismiss();
                      Notification.info({message: '예치금이 성공적으로 추가 되었습니다.', positionY: 'bottom', positionX: 'right', closeOnClick: true, title: '<i class="glyphicon glyphicon-check"></i> 예치금 추가'});
                    }, function (response) {
                      $uibModalInstance.dismiss();
                    });

                  };

                  $scope.cancel=function(){
                    $uibModalInstance.dismiss('cancel');
                  };
                },
                size: size,
                resolve: {
                  profile: function() {
                    return profile;
                  }
                }
              });

            }, function (fail) {
              Notification.error({message: '문제가 발생했습니다. 다시 시도하십시오.', positionY: 'bottom', positionX: 'right', closeOnClick: true, title: '<i class="glyphicon glyphicon-remove"></i> 채용실패 '});
            });


          },function(fail){
            Notification.error({message: '문제가 발생했습니다. 다시 시도하십시오.', positionY: 'bottom', positionX: 'right', closeOnClick: true, title: '<i class="glyphicon glyphicon-remove"></i>  채용실패'});
          });
        }else{
          SweetAlert.close();
        }
      });

    };
    //View of Hire Me end

    //WithDraw amount Modal
    $scope.withdrawamount = function (size,entryModelView, index, totalEntries) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/profiles/client/views/modals/withdraw-amount.client.view.html',
        controller: function($scope, $rootScope, $uibModalInstance, $location, $window, $http, UniversalData){
          
          if(!$rootScope.latestCurrencyRate){
            alert('reload the page and try again');
            $window.location.reload();
            // $uibModalInstance.dismiss();
          }

          $scope.view_processing = true;
          
          var amountInWallet = $rootScope.userAccountBalance.accountBalance;
          $scope.totalKrwAmount = 0;

          $scope.recordsss = UniversalData.query().$promise.then(function(data) {
            for(var key in data[0].currency ){
              if(key === 'KRW' ||key === 'USD'){
              // if(key === 'KRW' ||key === 'USD' ||key === 'JPY' ||key === 'CNY'){
                $scope.currencyList.push(key);
              }
            }
            $scope.selectedCurrency = $scope.currencyList[0];
          });

          /*
          * Calculate total amount in wallet and show the sum in KRW
          */
          if($rootScope.userAccountBalance.accountBalance){
            var len = Object.keys(amountInWallet).length;
            for(var key in amountInWallet){
              if(key==='KRW'){
                $scope.totalKrwAmount = amountInWallet[key]/$rootScope.latestCurrencyRate.KRW+$scope.totalKrwAmount;
                // console.log('OBJ:',key + ' total:', $scope.totalKrwAmount);
              }else if(key==='USD'){
                $scope.totalKrwAmount = amountInWallet[key]+$scope.totalKrwAmount;
                // $scope.totalKrwAmount = amountInWallet[key]*$rootScope.latestCurrencyRate.KRW;
                // console.log('OBJ:',key + ' total:', $scope.totalKrwAmount);
              }
              // else if(key==='CNY'){
              //   var cny = amountInWallet[key]/$rootScope.latestCurrencyRate.CNY;
              //   cny = cny*$rootScope.latestCurrencyRate.KRW;
              //   $scope.totalKrwAmount = $scope.totalKrwAmount+cny;
              // }else if(key==='JPY'){
              //   var jpy = amountInWallet[key]/$rootScope.latestCurrencyRate.JPY;
              //   jpy = jpy*$rootScope.latestCurrencyRate.KRW;
              //   $scope.totalKrwAmount = $scope.totalKrwAmount+jpy;
              // }
              // else if(key==='PKR'){
              //   var pkr = amountInWallet[key]/105;
              //   pkr = pkr*$rootScope.latestCurrencyRate.KRW;
              //   $scope.totalKrwAmount = $scope.totalKrwAmount+pkr;  
              //   // console.log('OBJ:',amountInWallet[key] + ' total:', $scope.totalKrwAmount);              
              // }

            }
            $scope.amountToWithdraw = $scope.totalKrwAmount;
          } 

          /*
          * On changing currency
          */
          // $scope.selectedCur = function(){
          //   $timeout(function() {
            
              //with selected currency change the amount
              if($scope.selectedCurrency && $scope.amountToWithdraw){
                
                // console.log($scope.selectedCurrency);
                //convert the amount in given currency and check if certain amount exists
                var usd;
                if($scope.selectedCurrency === 'USD'){
                  // usd = $scope.totalKrwAmount/$rootScope.latestCurrencyRate.KRW;
                  $scope.finalAmountToWithDraw = usd;
                  $scope.amountToWithdraw = $scope.finalAmountToWithDraw;

                }
                // else if($scope.selectedCurrency === 'PKR'){
                //   usd = $scope.totalKrwAmount/$rootScope.latestCurrencyRate.KRW;
                //   $scope.finalAmountToWithDraw = usd*105;
                //   $scope.amountToWithdraw = $scope.finalAmountToWithDraw;

                // }
                // else if($scope.selectedCurrency === 'JPY'){
                //   usd = $scope.totalKrwAmount/$rootScope.latestCurrencyRate.KRW;
                //   $scope.finalAmountToWithDraw = usd*$rootScope.latestCurrencyRate.JPY;
                //   $scope.amountToWithdraw = $scope.finalAmountToWithDraw;

                // }
                // else if($scope.selectedCurrency === 'CNY'){
                //   usd = $scope.totalKrwAmount/$rootScope.latestCurrencyRate.KRW;
                //   $scope.finalAmountToWithDraw = usd*$rootScope.latestCurrencyRate.CNY;
                //   $scope.amountToWithdraw = $scope.finalAmountToWithDraw;
                // }
                else if($scope.selectedCurrency === 'KRW'){
                  $scope.finalAmountToWithDraw = $scope.totalKrwAmount*$rootScope.latestCurrencyRate.KRW;
                  $scope.amountToWithdraw = $scope.totalKrwAmount;
                }
              }

          //   }, 10);
          // };

          $scope.ok=function(){
            $timeout(function() {
              usSpinnerService.spin('payLoader');
            },50);
            // Check the amount in eWallet
            if(($scope.amountToWithdraw < 30) || $scope.amountToWithdraw > $scope.totalKrwAmount){
              SweetAlert.swal("오류","이체할 예치금이 부족합니다!", "error");
              $uibModalInstance.dismiss();
              return;
            }
            var paymentObj = {};
            $scope.pay = {
              'amount': $scope.amountToWithdraw, 
              'currency': $scope.selectedCurrency, 
              'desc': 'withdraw amount to user\'s paypal\'s account.' 
            };

            paymentObj = {
              'amount': $scope.pay,
              'payType': 'withdraw',
              'userEmail': $scope.verifiedPaypalEmail
            };

            // console.log("Payment Object:", paymentObj);
            toastr.info('Please wait, you will be redirected to PayPal in short.', 'Paypal');

            $uibModalInstance.dismiss();

            //update account first 
            return $http({
              url: '/api/users/paymenCreate',
              method: 'POST',
              data: paymentObj
            }).then(function(response){       
              // console.log('wit', response);
              // if(response.data)
                $window.location.href = response.data;
              $timeout(function() {
                usSpinnerService.stop('payLoader');
              },50);

            }, function(err){
              $timeout(function() {
                usSpinnerService.stop('payLoader');
              },50);
              toastr.error('We are sorry, something went wrong.', 'Paypal');
              //console.log('failed payment::', err);
            });
          };
          
          $scope.cancel=function(){
            $uibModalInstance.dismiss();
          };
        },
        size: size,
        resolve: {
          entryModelView: function() {
            // console.log('size: ', entryModelView);
            return entryModelView;
          }
        }
      });
    };
    // End withdraw amount

    // for email verifcatin of user
    $scope.sendMail= function(){
      $scope.sendVerifLink = true;
      // var urll = $location.absUrl().split('profile')[0];
      var urll = $location.absUrl().split('verify')[0];
      var data = {
        username: Authentication.user.username,
        userId: Authentication.user._id,
        contact_email : $scope.profile.userInfo.email,
        verifUrl: urll+'profile/view/?'+Authentication.user._id,
        contact_msg : '감사합니다' + Authentication.user.username + '님!. 이메일 주소를 확인하려면 여기를 클릭하십시오. '+urll+'profile/view/?' + Authentication.user._id
      };
      // toastr.success('Email verification link sent!', 'Email verification');
      return $http({
        url: '/api/users/contactForm',
        method: 'POST' ,
        data: { 'message' : data }
      }).then(function(response) {
        toastr.success('이메일 확인 메일이 전송되었습니다!', '이메일 확인');
        $scope.sendVerifLink = false;
      },function(response){
        toastr.error('이메일 확인 전송실패, 다시 한번 하시길 바랍니다!', '이메일 확인');
        $scope.sendVerifLink = false;
      });
    };

      
    // };  

    //Verify User's email
    $scope.verifyEmail = function(){

      // console.log('called');

      var userId = location.search;
      if (userId.includes('?') && $scope.authentication.user._id===userId.substr(1)) {
        var object = {
          'userInfo.verEmail' : true
        };

        return $http({
          url: '/api/userInfoUpdate/'+ $scope.authentication.user.profile_id,
          method: 'PUT',
          data: object
        
        }).then(function(response) {
          $scope.profile = response.data.profile;
          $scope.authentication.user = response.data.user;
          SweetAlert.swal("이메일 확인 완료!", "이메일 확인이 성공적으로 완료되었습니다.", "success");
          $location.search({});
        },function(response){
          toastr.error('이메일 확인 실패, 다시한번 하시길 바랍니다!', '이메일 확인');
          $location.search({});
        });

      }
      // else if(userId.includes('?')){
      //   toastr.error('Email verification error, try again!', 'Email verification');
      //   $location.search({});
      // }
      // else if(userId.includes('?token')){
      //   $location.search({});
      // }
    };

    // Verify Paypal Account
    $scope.verifyPayment = function(){
      toastr.info('Please wait, you will be redirected to PayPal in short.', 'Paypal');
      $scope.pay = {
        'amount': 1,
        'currency': 'USD',
        'desc':'Payment verification'
      };

      var paymentObj = {
        'amount': $scope.pay,
        'payType': 'deposit',
        'paymentVerif': true
      };
      console.log("$scope.pay:", $scope.pay);

      return $http({
        url: '/api/users/paymenCreate',
        method: 'POST',
        data: paymentObj
      }).then(function(response){       
        // console.log('success payment::', response);
        // $location.path(response.data);
        $window.location.href =response.data;
        $timeout(function() {
          usSpinnerService.stop('payVer');
        },50);

      }, function(err){
        $timeout(function() {
          usSpinnerService.stop('payVer');
        },50);
        toastr.error('We are sorry, something went wrong.', 'Paypal');
        //console.log('failed payment::', err);
      });

    };

    // start payment verif via paypal 
    $scope.verifyPaymentPaypal = function () {
      return $http({
        url: '/api/users/paymentExecute',
        method: 'POST',
        data: {
          'paymentId':$location.search().paymentId,
          'token':$location.search().token,
          'PayerID':$location.search().PayerID
        }
      
      }).then(function(paySuccess) {

        // Verify the payment, if its not verified already
        if(!Authentication.user.verPayment){
          var object = {
            'userInfo.verPayment' : true
          };
          return $http({
            url: '/api/userInfoUpdate/'+ $scope.authentication.user.profile_id,
            method: 'PUT',
            data: object
          
          }).then(function(response) {
            $scope.profile = response.data.profile;
            $scope.authentication.user = response.data.user;
            SweetAlert.swal("Payment Verified!", "Payment verified successfully", "success");
            $location.search({});
            // $location.path('/profile/view/');
          },function(response){
            toastr.error('Payment verification error, try again!', 'Payment verification');
            // $location.search({});
          });
        }
        // Payment verfication end

      },function(payError){
        //console.log('payment execution failed');
        SweetAlert.swal("Payment Verification", "Payment Verification failed", "error");
        $location.search({});
      });
    };
    // end payment verif via paypal

    // Payment via Paypal
    $scope.paynow = function(label){

      $timeout(function() {
          usSpinnerService.spin('payLoader');
        },50);
      var date = new Date();

      $scope.pay.currency = $scope.dpCur;
      $scope.pay.amount = $scope.totalDepositAmount;
      $scope.pay.desc = 'Deposit fund by '+Authentication.user.username+' on OutSoucingOK dated '+date;

      var paymentObj = {};
      if(label === 'deposit'){
        toastr.info('You will be redirected to paypal for fund deposit, please wait.', 'Please wait');
        paymentObj = {
          'amount': $scope.pay,
          'payType': label
        };
      }

      // console.log("Label:", paymentObj);
      // console.log("$scope.pay:", $scope.pay);

      return $http({
        url: '/api/users/paymenCreate',
        method: 'POST',
        data: paymentObj
      }).then(function(response){       
        console.log('success payment::', response);
        // $location.path(response.data);
        $window.location.href =response.data;
        $timeout(function() {
          usSpinnerService.stop('payLoader');
        },50);

      }, function(err){
        $timeout(function() {
          usSpinnerService.stop('payLoader');
        },50);
        toastr.error('We are sorry, something went wrong.', 'Paypal');
        //console.log('failed payment::', err);
      });
    };

   // Check if Paid by Paypal
   $scope.paypalPaid = function(){
     //console.log('PayPal Paid called');
     var paymentId = location.search;
     if (paymentId.includes('?paymentId=PAY-')) {
       
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
           Transactions.deposit({
             id : $scope.accountId,
             amountDep : parseFloat(paySuccess.data.transactions[0].amount.total),
             currency : paySuccess.data.transactions[0].amount.currency
           }, function(res){
             
             Account.findOne({
               filter:{
                 where:{
                   ownerId : $scope.authentication.user.username
                 }
               }
             }, function(suc){
               // //console.log('succccccccc', suc);
               $rootScope.userAccountBalance = suc;
               // $rootScope.totalBalanceKrw();
               $location.search({});
               toastr.success('Amount deposited successfully.', 'Amount Deposit', {timeOut: 5000});
               $state.go($state.previous.state.name, $state.previous.params);
             }, function(err){
               //console.log(err);
             });
             
             // //console.log('Amount deposited', resp);
           }, function(err){
             toastr.error('Amount deposit failed.', 'Amount Deposit', {timeOut: 5000});
             //console.log('Amount deposit err', err);
           });
         }, function(err){
           // //console.log('Amount transfer err', err);
         });

       },function(payError){
         //console.log('payment execution failed');
         toastr.success('Payment execution failed');
         $location.search({});
       });

     }
     else if(paymentId.includes('?')){
       toastr.error('PAYEMENT ERROR!');
       // $location.search({});
     }

   };

    // Progress Bar for profile completiion
    $scope.profileProgressBar = function() {
      $scope.profileProgressStatus = 30;
      $scope.maxBar = 100;
      var type;

      if(Authentication.user.verEmail){ 
         $scope.profileProgressStatus = $scope.profileProgressStatus + 20;
      }
      if( Authentication.user.verLocation){ 
         $scope.profileProgressStatus = $scope.profileProgressStatus + 15;
      }
      if(Authentication.user.verPhone){ 
         $scope.profileProgressStatus = $scope.profileProgressStatus + 10;
      }
      if(Authentication.user.verPayment){ 
         $scope.profileProgressStatus = $scope.profileProgressStatus + 25;
      }

      if ($scope.profileProgressStatus <= 30) {
        type = 'danger';
      } else if ($scope.profileProgressStatus < 51) {
        type = 'warning';
      } else if ($scope.profileProgressStatus < 76) {
        type = 'info';
      } else {
        type = 'success';
      }
      $scope.type = type;
    };


    $scope.bannerValues = function(projectsAwarded){
      /*
      * Jobs completed, Repeat Time, On time, On budget,   
      */
      // if(Authentication.user){
        if(projectsAwarded.length>0){
          $scope.repeatRate =0;
          $scope.onTime =0;
          $scope.onBudget =0;

          var repeatCount =0;
          var compOnBudg =0;
          var compOnTime =0;

          var projectsDone = projectsAwarded;
          $scope.employers = [];
          for(var i =0; i<projectsDone.length; i++){
            if(projectsDone[i].feedback){
              $scope.jobsCompleted = 100;
              $scope.employers.push(projectsDone[i].feedback.userId);
              if(projectsDone[i].feedback.onTime  === true)
                compOnTime++;
              if(projectsDone[i].feedback.onBudget === true)
                compOnBudg++;
            }              
          }
          // console.log('employers:', $scope.employers);

          /*count the repeatition*/
          var result = {};
          for(var j = 0; j < $scope.employers.length; ++j) {
              if(!result[$scope.employers[j]])
                  result[$scope.employers[j]] = 0;
              ++result[$scope.employers[j]];
          }
          // console.log('result:', result);
          // console.log('result:', Object.keys(result).length);
          Object.keys(result).forEach(function(key) {
              // console.log(key, result[key]);
              if(result[key]>1)
                repeatCount++;
          });
          // console.log('repeatCount:', repeatCount);
          var totalNoEmp = Object.keys(result).length;
          $scope.repeatRate = (repeatCount/totalNoEmp)*100;
          $scope.onTime = (compOnTime/$scope.employers.length)*100;
          $scope.onBudget = (compOnBudg/$scope.employers.length)*100;

        }else{
          $scope.jobsCompleted = 0;
          $scope.repeatRate =0;
          $scope.onTime =0;
          $scope.onBudget =0;          
        }
      // }
    };


    /*Verify Phone number*/
    $scope.verifyPhone = function(){
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/profiles/client/views/modals/verify-phone.client.view.html',
        controller: function($scope, $rootScope, $uibModalInstance, $location, $window, $http, Authentication){

          $scope.theUser = Authentication.user;
          $scope.codeSent = false;

          if(!Authentication.user.mobileNumber){
            $scope.theUser.mobileNumber = "";
          }

          $scope.sendCode = function(){
            $scope.isLoading = true;
            return $http({
              url: '/api/users/validatePhone',
              method: 'POST',
              data: {
                'phone': $scope.theUser.mobileNumber
              }
            }).then(function(res){
              if(res.data.code){
                $scope.codeNotSent = true;
                $scope.isLoading = false;
                $scope.codeSent = false;
                $scope.errMsg = res.data.message;
              }else{
                $scope.codeSent = true;
                $scope.isLoading = false;
                Authentication.user = res.data;
              }
            }, function (err){
              $scope.codeNotSent = true;
              $scope.isLoading = false;
              $scope.codeSent = false;
            });

          };

          $scope.ok=function(){
            if(Authentication.user.phoneAuthToken === $scope.confirmCode){
              /*
              * Update the user and profile
              */
              var object = {
                'userInfo.verPhone' : true
              };

              return $http({
                url: '/api/userInfoUpdate/'+ Authentication.user.profile_id,
                method: 'PUT',
                data: object
              
              }).then(function(res) {

                $scope.profile = res.data.profile;
                SweetAlert.swal({
                  type:'success',
                  title: '핸드폰 인증 완료',
                  text: ''
                });
                $uibModalInstance.close($scope.profile);

              },function(err){
                toastr.error('핸드폰 인증 실패!다시 하시길 바랍니다!', '핸드폰 인증');
              });
            }else{
              SweetAlert.swal({
                type:'error',
                title: '유효하지 않은 코드',
                text: '인증 코드가 잘못되었습니다.'
              });
              $uibModalInstance.dismiss();
            }
          };
          
          $scope.cancel=function(){
            $uibModalInstance.dismiss();
          };
        },
        resolve: {
          Authentication: function() {
            return Authentication;
          }
        }
      });

      modalInstance.result.then(function (result) {
        $scope.profile = result;
      });
    };

    /*NICE PAY */

    $scope.nicepay = function(){

      // Set the Content-Type 
      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

      // Delete the Requested With Header
      delete $http.defaults.headers.common['X-Requested-With'];

      // // Set the Content-Type 
      // $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

      // // Delete the Requested With Header
      // delete $http.defaults.headers.common['X-Requested-With'];

      // var data = $.param({
      //     json: JSON.stringify({
      //         foo: $scope.foo
      //     })
      // });

      var data = {
        goodscount: $scope.goodscount,
        goodsName: $scope.goodsName,
        price: $scope.price,
        buyerName: $scope.buyerName,
        tel: $scope.tel,
        Email: $scope.Email
      };

      console.log('nicepay:', data);

      $http({
        method: 'POST',
        url: 'https://192.168.100.8/nicepay/payRequest.php',
        data: data
      }).then( function(suc){
        console.log('Suc:', suc);
      }, function(fail){
        console.log('fail', fail);
      });
    };
        
  }
]);
