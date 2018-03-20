'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'OutSourcingOk';
  var applicationModuleVendorDependencies = [
  'ngResource', 
  'ngAnimate', 
  'ngMessages', 
  'ui.router', 
  'ui.bootstrap', 
  'ui.utils', 
  'angularFileUpload', 
  'vcRecaptcha',
  'selector',
  'xeditable',
  'ngPassword', 
  'ui.select',
  'toastr', 
  'ngSanitize', 
  'geolocation', 
  'rzModule', 
  'lbServices', 
  'oitozero.ngSweetAlert', 
  'angularUUID2', 
  'angularSpinner',  
  'ngAudio',
  'ui-notification',
  'angularMoment',
  'textAngular'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();
