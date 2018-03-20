'use strict';

// Projects controller
angular.module('projects').controller('ProjectsMyskillsController', ['$scope', '$filter' ,'$stateParams', '$location','$http', '$timeout', '$window', 'Authentication', 'Projects','geolocation', 'FileUploader', 'UniversalData',
  function ($scope, $filter, $stateParams, $location, $http, $timeout, $window, Authentication, Projects, geolocation, FileUploader, UniversalData) {
    $scope.authentication = Authentication;

    // Find a list of Projects
    $scope.find = function () {
      $scope.projects = Projects.query().$promise.then(function(data) {
        $scope.promiseResolved = true;
        $scope.projects = data;
        $scope.allProjects = data;
        $scope.items = data;

        $scope.search();
        $scope.projectsLength = $scope.projects.length;

      }, function(error) {
        // error handler
      });
    };
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




    $scope.universalData = function () {
      
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

        // //console.log('web subtcat', $scope.subcatweb);

        //code for project-post project budget selector
        $scope.rateList = $scope.fixedRate;
        $scope.project.price = $scope.rateList[3];
        
        return $scope.records;
      }, function(error) {
        // error handler
      });
    };

    ///////////////////////////////////

    var sortingOrder = 'name'; //default sort
     
    // init
    $scope.sortingOrder = sortingOrder;
    $scope.pageSizes = [5,10,25,50];
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];

    var searchMatch = function (haystack, needle) {
      if (!needle) {
        return true;
      }
      return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };
    
    // init the filtered items
    $scope.search = function (query, label) {
      if(label === 'simple' || (!query || label === '')){
        $scope.query = query;
        // //console.log('$scope.query ', $scope.query );
        $scope.filteredItems = [];

        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
          
            if (searchMatch(item.description, $scope.query))
              return true;
          
          return false;
        });
        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
          $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.myCurrentPage = 0;
        // now group by pages
        $scope.groupToPages();
      }
      else{

        //console.log('hello skill');
        //console.log('hello skill', $scope.query);

        $scope.query = query;
        //console.log('$scope.query ', $scope.query );
        $scope.filteredItems = [];

        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
          
            if (searchMatch(item.skill.name, $scope.query))
              return true;
          
          return false;
        });
        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
          $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.myCurrentPage = 0;
        // now group by pages
        $scope.groupToPages();

      }
    };
    
    // show items per page
    $scope.perPage = function () {
      $scope.groupToPages();
    };
    
    // calculate page in place
    $scope.groupToPages = function () {
      $scope.pagedItems = [];
      
      for (var i = 0; i < $scope.filteredItems.length; i++) {
        if (i % $scope.itemsPerPage === 0) {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
        } else {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
        }
      }

      // //console.log('pagedItems', $scope.pagedItems);
    };
    
     $scope.deleteItem = function (idx) {
          var itemToDelete = $scope.pagedItems[$scope.myCurrentPage][idx];
          var idxInItems = $scope.items.indexOf(itemToDelete);
          $scope.items.splice(idxInItems,1);
          $scope.search();
          
          return false;
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
    // $scope.search();
   
    
    // change sorting order
    $scope.sort_by = function(newSortingOrder) {
      if ($scope.sortingOrder === newSortingOrder)
        $scope.reverse = !$scope.reverse;
      
      $scope.sortingOrder = newSortingOrder;
    };
  }
]);
