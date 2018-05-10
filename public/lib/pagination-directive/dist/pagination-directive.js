/**
* Angularjs Pagination Directive
* https://github.com/DevTeamHub/pagination-directive
* (c) 2016 Dev Team Inc. http://dev-team.com
* License: MIT
*/

var paginationModule = angular.module('dev-team-pagination', []);

paginationModule.directive("dtPagination", dtPaginationDirective);

function dtPaginationController($scope) {
    var skip = 0;

    this.isActive = function (page) {
        return $scope.currentPage == page;
    };

    this.selectPage = function (page) {
        if (!this.isActive(page)) {
            $scope.currentPage = page;
            $scope.onSelectPage({ page: page });
        }
    }

    this.pageCount = function () {
        var pages = [];
        if ($scope.numPages) {

            if ($scope.numPages == 1) return pages;

            var viewCount = $scope.numPages;
            if ($scope.maxPages && $scope.maxPages < $scope.numPages) {
                viewCount = $scope.maxPages;
            }
            for (var i = 1; i <= viewCount; i++) {
                pages.push(skip + i);
            }
        }
        return pages;
    }

    this.noPrevious = function () {
        return $scope.currentPage < 2;
    }

    this.noNext = function () {
        return $scope.currentPage >= $scope.numPages;
    }

    this.selectNext = function () {
        if (!this.noNext()) {
            if ($scope.currentPage - skip == $scope.maxPages) skip++;
            this.selectPage($scope.currentPage + 1);
        }
    }

    this.selectPrevious = function () {
        if (!this.noPrevious()) {
            if ($scope.currentPage - skip == 1) skip--;
            this.selectPage($scope.currentPage - 1);
        }
    }
}

function dtPaginationDirective() {
    return {
        restrict: 'E',
        scope: {
            numPages: '=',
            currentPage: '=',
            onSelectPage: '&',
            maxPages: '@'
        },
        templateUrl: templateSelector,
        replace: true,
        controller: ['$scope', dtPaginationController],
        controllerAs: "ctrl"
    };

    function templateSelector(element, attrs) {
        if (attrs.templateUrl) {
            return attrs.templateUrl;
        }
        return "dt-pagination.tmpl.html";
    }
}

paginationModule.run(["$templateCache", function ($templateCache) {
    $templateCache.put("dt-pagination.tmpl.html",
	"<ul class=\"pagination no-select\"><li ng-class=\"{disabled: ctrl.noPrevious()}\"><a ng-click=\"ctrl.selectPrevious()\">Сюда<\/a><\/li><li ng-repeat=\"page in ctrl.pageCount()\" ng-class=\"{active: ctrl.isActive(page)}\"><a ng-click=\"ctrl.selectPage(page)\">{{page}}<\/a><\/li><li ng-class=\"{disabled: ctrl.noNext()}\"><a ng-click=\"ctrl.selectNext()\">Туда<\/a><\/li><\/ul>");
}]);