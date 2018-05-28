'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/font-awesome/css/font-awesome.min.css',
        'public/lib/select2/select2.css',
        'public/lib/angular-xeditable/dist/css/xeditable.css',
        'public/lib/angular-toastr/dist/angular-toastr.css',
        'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.16.1/select.min.css',
        'public/lib/angular-toastr/dist/angular-toastr.css',
        'public/lib/angularjs-slider/dist/rzslider.css',
        'public/lib/sweetalert/dist/sweetalert.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',

        //emojis
        'public/lib/angular-emoji-picker/dist/css/emoji-picker.css',
        'public/lib/textAngular/dist/textAngular.css'
      ],
      js: [
        'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-translate/angular-translate.min.js',
        'public/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',

        //Angulaar sweet-alert
        'public/lib/sweetalert/dist/sweetalert.min.js',
        'public/lib/ngSweetAlert/SweetAlert.js',

        // custom add
        'public/lib/angular-animate/angular-touch.js',
        'public/lib/angular-animate/angular-touch.min.js',
        //ends custom add 
        'public/lib/angular-password/angular-password.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        

        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        // 'public/lib/angular-ui-bootstrap/src/tooltips/tooltips.js',
        // 'public/lib/angular-ui-bootstrap/src/popover/popover.js',
        // 'public/lib/angular-ui-bootstrap/src/position/position.js',

        'https://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.7.0.js',
        
        // 'public/lib/angular-bootstrap/ui-bootstrap-tpls-2.4.0.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls-2.4.0.min.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',

        'public/lib/angular-recaptcha/release/angular-recaptcha.js',
        'public/lib/angular-xeditable/dist/js/xeditable.js',

        'public/lib/angularjs-geolocation/dist/angularjs-geolocation.min.js',
        'public/lib/angularjs-geolocation/src/geolocation.js',
    
        'public/lib/angular-toastr/dist/angular-toastr.tpls.js',
        'public/lib/rtc/dist/rtc.js',
        
        //for video chat, webrtc links 
        'https://simplewebrtc.com/latest-v2.js',
        'public/lib/simplewebrtc/latest.js',  
        'public/lib/ng-simple-webrtc/ng-simple-webrtc.js',  


        //'node_modules/ng-simple-webrtc/ng-simple-webrtc.js',

        //Slider Filter
        'public/lib/angularjs-slider/dist/rzslider.min.js',
        'public/lib/profiles-finance.js',
        'public/lib/angular-uuid2/dist/angular-uuid2.js',

        // Infinite scroll  
        'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.js',  
        'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.min.js',

        // angular notification 
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',  

        //Angular Spinner
        'public/lib/angular-spinner/dist/angular-spinner.min.js', 
        //Angular Audio
        'public/lib/angular-audio/app/angular.audio.js',    
              
        'https://cdn.rawgit.com/indrimuska/angular-selector/master/dist/angular-selector.js',
        'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.16.1/select.min.js',
        // 'https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.5.0/angular-sanitize.js',

        // load momentJS (required for angular-moment)
        'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/0.9.0/angular-moment.min.js',
        'public/lib/textAngular/dist/textAngular-rangy.min.js',
        'public/lib/textAngular/dist/textAngular-sanitize.min.js',
        'public/lib/textAngular/dist/textAngular.min.js'  
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
