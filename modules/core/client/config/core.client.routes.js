  'use strict';

// Setting up route
angular.module('core').config(['$translateProvider','$stateProvider', '$urlRouterProvider',
  function ($translateProvider,$stateProvider, $urlRouterProvider) {
  // Register a loader for the static files
    $translateProvider.useStaticFilesLoader({
      prefix: './modules/core/client/config/Languages-local/', //       //./public/lib/lang/local/
      suffix: '.json'
    });
  $translateProvider.preferredLanguage('kr');
    // Redirect to 404 when route not found
    // $urlRouterProvider.otherwise(function ($injector, $location) {
    //   $injector.get('$state').transitionTo('not-found', null, {
    //     location: false
    //   });
    // });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      // templateUrl: 'modules/core/client/views/home.client.view.html'
      templateUrl: 'modules/core/client/views/landingPage.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })

    .state('verify', {
      url: '/verify',
      templateUrl: 'modules/core/client/views/verify.client.view.html',
      data: {
        ignoreState: true
      }
    })  

    // after login redirect here
    // .state('profile.view', {
    //   url: '/view',
    //   templateUrl: 'modules/profiles/client/views/view-profile.client.view.html',
    //   data: {
    //     roles: ['individual', 'company']
    //   }
    // })

    
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    })

    // lates routes start
    .state('about', {
      abstract: true,
        url: '/about',
        template: '<ui-view/>', 
      autoscroll: true
    })

    // 
    .state('about.outsource', {
      url: '/outsource',
      templateUrl: 'modules/core/client/views/footer/outsourcingok.client.view.html', 
      autoscroll: true
    })

    .state('about.overview', {
      url: '/overview',
      templateUrl: 'modules/core/client/views/footer/overview.client.view.html'
    })

    .state('about.team', {
      url: '/team',
      templateUrl: 'modules/core/client/views/footer/team.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })

    .state('about.security', {
      url: '/security',
      templateUrl: 'modules/core/client/views/footer/security.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })

    .state('about.feesandcharges', {
      url: '/feesandcharges',
      templateUrl: 'modules/core/client/views/footer/feesandcharges.client.view.html', 
      autoscroll: true
    })

    .state('about.quotes', {
      url: '/quotes',
      templateUrl: 'modules/core/client/views/footer/quotes.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })
    
    .state('testimonial', {
      url: '/testimonial',
      templateUrl: 'modules/core/client/views/footer/testimonial.client.view.html'
    })  

    .state('about.sitemap', {
      url: '/sitemap',
      templateUrl: 'modules/core/client/views/footer/sitemap.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })

    .state('about.services', {
      url: '/services',
      templateUrl: 'modules/core/client/views/footer/services.client.view.html'
    })

    .state('awards', {
      url: '/awards',
      templateUrl: 'modules/core/client/views/footer/awards.client.view.html'
    })
    .state('codeofconduct', {
      url: '/codeofconduct',
      templateUrl: 'modules/core/client/views/footer/codeofconduct.client.view.html'
    })
    .state('copyright-policy', {
      url: '/copyright-policy',
      templateUrl: 'modules/core/client/views/footer/copyright-policy.client.view.html'
    })
    .state('privacy-policy', {
      url: '/privacy-policy',
      templateUrl: 'modules/core/client/views/footer/privacy-policy.client.view.html'
    })
    .state('support-career', {
      url: '/support-career',
      templateUrl: 'modules/core/client/views/footer/support-career.client.view.html'
    })
    .state('about.media', {
      url: '/media',
      templateUrl: 'modules/core/client/views/footer/media.client.view.html',
      data: {
        roles: ['individual', 'company']
      }
    })

   .state('about.press', {
     url: '/press',
     templateUrl: 'modules/core/client/views/footer/press.client.view.html'
   })

   .state('about.contact', {
     url: '/contact',
     templateUrl: 'modules/core/client/views/footer/contact.client.view.html'
   })

  .state('term-condition', {
    url: '/term-condition',
    templateUrl: 'modules/core/client/views/footer/term-condition.client.view.html'
  })
   .state('Privacy-term-condition', {
    url: '/Privacy-term-condition',
    templateUrl: 'modules/core/client/views/footer/Privacy-term-condition.client.view.html'
  })

  .state('advertisement', {
    url: '/advertisement',
    templateUrl: 'modules/core/client/views/footer/advertisement.client.view.html'
   })

  // Get support pages routes
  .state('support', {
    url: '/support',
    templateUrl: 'modules/core/client/views/footer/get-support.client.view.html'
  })

  .state('support-general', {
    url: '/support-general',
    templateUrl: 'modules/core/client/views/support/general-support.client.view.html'
  })

  .state('support-project', {
    url: '/support-project',
    templateUrl: 'modules/core/client/views/support/project-support.client.view.html'
   })

  .state('support-contest', {
    url: '/support-contest',
    templateUrl: 'modules/core/client/views/support/contest-support.client.view.html'
   })

  .state('support-payment', {
    url: '/support-payment',
    templateUrl: 'modules/core/client/views/support/payment-support.client.view.html'
   })

  .state('support-membership', {
    url: '/support-membership',
    templateUrl: 'modules/core/client/views/support/membership-support.client.view.html'
   })
  
  .state('support-profile', {
    url: '/support-profile',
    templateUrl: 'modules/core/client/views/support/profile-support.client.view.html'
   });
  
  }
]);
