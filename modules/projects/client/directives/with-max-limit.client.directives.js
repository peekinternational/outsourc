'use strict';

/**
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors 
 */

angular.module('projects')
	.directive("limitTo", ['$timeout' , function($timeout) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(event) {
            	var that = this;
            	$timeout(function () {
		            var value = parseInt(that.value);
	            	console.log('value : ', value);
	            	console.log('limit : ', limit);
	            	// console.log(value > limit);
	                if (value > limit) {
	                	console.log(value > limit);
	                	 event.preventDefault();
	                }
		        }, 0);
            	
            });
        }
    };
}]);