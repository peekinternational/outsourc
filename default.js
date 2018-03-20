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
        'public/lib/angular-toastr/dist/angular-toastr.css'
        // 'https://unpkg.com/angular-toastr/dist/angular-toastr.css'
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',

        // custom add
        'public/lib/angular-animate/angular-touch.js',
        'public/lib/angular-animate/angular-touch.min.js',
        //ends custom add 
        'public/lib/angular-password/angular-password.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        

        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'https://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.7.0.js',
        
        // 'public/lib/angular-bootstrap/ui-bootstrap-tpls-2.4.0.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls-2.4.0.min.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',

        'public/lib/angular-recaptcha/release/angular-recaptcha.js',
        'public/lib/angular-xeditable/dist/js/xeditable.js',
    
        'public/lib/angular-toastr/dist/angular-toastr.tpls.js',
        'public/lib/rtc/dist/rtc.js',
          
          
        'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.2/socket.io.js',
        'public/lib/angular-socket-io/socket.js',
        
        //for video chat, webrtc links 
        // 'public/lib/simplewebrtc/latest.js',  
        'https://simplewebrtc.com/latest-v2.js',
        // 'public/lib/angular.uudi2/dist/angular-uuid2.min.js',
        // 'public/lib/ng-simple-webrtc/ng-simple-webrtc.js',  
        // 'node_modules/ng-simple-webrtc/ng-simple-webrtc.js',


        'https://cdn.rawgit.com/indrimuska/angular-selector/master/dist/angular-selector.js'
        // 'public/lib/angular-toastr/dist/angular-toastr.min.js'
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
