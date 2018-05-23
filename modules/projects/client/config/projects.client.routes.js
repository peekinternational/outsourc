'use strict';

// Setting up route
angular.module('projects').config(['$stateProvider',
  function ($stateProvider) {

    
    // Projects state routing 
    // for header file
    $stateProvider
    .state('projects', {
      abstract: true,
      url: '/projects',
      templateUrl: 'modules/projects/client/views/header-projects.client.view.html',

      data: {
        roles: ['individual', 'company']
      }
    })  
    //browse contest
    .state('projects.work-contest', {
      url: '/work-contest',
      templateUrl: 'modules/projects/client/views/work-contest.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    //simple post project
    .state('projects.project-post', {
      url: '/project-post',
      templateUrl: 'modules/projects/client/views/project-post.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    //post project like this
    .state('projects.similarProjects-post', {
      url: '/similarProjects-post',
      templateUrl: 'modules/projects/client/views/similarProjects-post.client.view.html',
      data: {
        roles: ['individual', 'company']
      },
      params: {
        mainCat: {
          value: null
        },
        subCat: {
          value: null
        }
      },
      controller: function($scope, $stateParams) {
        $scope.mainCat = $stateParams.mainCat;
        $scope.subCat = $stateParams.subCat;
      }
    })
    
    //project dashboard
    .state('projects.project-dash', {
      url: '/project-dash/:projectId',
      templateUrl: 'modules/projects/client/views/project-dashboard.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    //project management
    .state('projects.project-manage', {
      url: '/project-manage/:projectId',
      templateUrl: 'modules/projects/client/views/project-manage.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    //post contest
    .state('projects.project-contest', {
      url: '/project-contest',
      templateUrl: 'modules/projects/client/views/contest-post.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })

    //project description
    .state('projects.view', {
      url: '/view/:projectId',
      templateUrl: 'modules/projects/client/views/project-bid.client.view.html',
      autoscroll : true,
      data: {
        roles: ['individual', 'company']
      }
    })
    // NDA link 
    .state('projects.NDA', {
      url: '/NDA/:projectId',
      templateUrl: 'modules/projects/client/views/project-NDA.client.view.html',
      autoscroll : true,
      data: {
        roles: ['individual', 'company']
      }
    })
      
    //Editproject description
    .state('projects.editproject-bid', {
      url: '/editproject-bid',
      templateUrl: 'modules/projects/client/views/editproject-bid.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })

    // dispute page
    // dispute page
    .state('projects.dispute', {
      url: '/dispute/:projectId',
      templateUrl: 'modules/projects/client/views/dispute.client.view.html',
      data: {
        roles: ['individual', 'company']
      },
      params: {
        id: {
          value: null
        }
      },
      controller: function($scope, $stateParams) {
        $scope.selectedMilestone = $stateParams.id;
      }
    })
    //upload contest entry
    .state('projects.upload-contest-entry', {
      url: '/upload-contest-entry',
      templateUrl: 'modules/projects/client/views/upload-contest-entry.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })

      //work --> Entities
    .state('projects.work-entities', {
      url: '/work-entities',
      templateUrl: 'modules/projects/client/views/work-entities.client.view.html',
      data: {
        roles: ['individual', 'company'],
        pageTitle: 'Work Entities'
      }
    })

      //project-list
    .state('projects.project-list', {
      url: '/project-list/:skills',
      templateUrl: 'modules/projects/client/views/project-list.client.view.html',
      data: {
        roles: ['individual', 'company'],
        pageTitle: 'Work Entities'
      }
    })

    .state('projects.my-project', {
      url: '/my-project',
      templateUrl: 'modules/projects/client/views/my-project.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    .state('projects.browse-category', {
      url: '/browse-category',
      templateUrl: 'modules/projects/client/views/browse-category.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    .state('projects.browse-category-detail', {
      url: '/browse-category-detail/:categoryId',
      templateUrl: 'modules/projects/client/views/browse-category-detail.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    .state('thankyou', {
      url: '/thankyou',
      templateUrl: 'modules/projects/client/views/thank-you.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    .state('projects.edit-bid', {
      url: '/edit-bid/:projectId',
      templateUrl: 'modules/projects/client/views/editproject-bid.client.view.html',
      data: {
        roles: ['individual', 'company']
      },
      params: {
        bidId: {
          value: null
        }
      },
      controller: function($scope, $stateParams) {
        $scope.bidId = $stateParams.bidId;
      }
    })
    .state('projects.feedback', {
      url: '/feedback/:projectId',
      templateUrl: 'modules/projects/client/views/feedback.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    .state('projects.financial-dashboard', {
      url: '/financial-dashboard',
      templateUrl: 'modules/projects/client/views/financial-dashboard.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    .state('projects.myskills', {
      url: '/myskills',
      templateUrl: 'modules/projects/client/views/project-myskills.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    .state('projects.get-bids', {
      url: '/get-bids',
      templateUrl: 'modules/projects/client/views/get-bids.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    });
  }
]);
