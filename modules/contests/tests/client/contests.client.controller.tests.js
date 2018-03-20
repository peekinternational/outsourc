'use strict';

(function () {
  // Contests Controller Spec
  describe('Contests Controller Tests', function () {
    // Initialize global variables
    var ContestsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Contests,
      mockContest;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Contests_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Contests = _Contests_;

      // create mock contest
      mockContest = new Contests({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Contest about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Contests controller.
      ContestsController = $controller('ContestsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one contest object fetched from XHR', inject(function (Contests) {
      // Create a sample contests array that includes the new contest
      var sampleContests = [mockContest];

      // Set GET response
      $httpBackend.expectGET('api/contests').respond(sampleContests);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.contests).toEqualData(sampleContests);
    }));

    it('$scope.findOne() should create an array with one contest object fetched from XHR using a contestId URL parameter', inject(function (Contests) {
      // Set the URL parameter
      $stateParams.contestId = mockContest._id;

      // Set GET response
      $httpBackend.expectGET(/api\/contests\/([0-9a-fA-F]{24})$/).respond(mockContest);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.contest).toEqualData(mockContest);
    }));

    describe('$scope.create()', function () {
      var sampleContestPostData;

      beforeEach(function () {
        // Create a sample contest object
        sampleContestPostData = new Contests({
          title: 'An Contest about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Contest about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Contests) {
        // Set POST response
        $httpBackend.expectPOST('api/contests', sampleContestPostData).respond(mockContest);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the contest was created
        expect($location.path.calls.mostRecent().args[0]).toBe('contests/' + mockContest._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/contests', sampleContestPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock contest in scope
        scope.contest = mockContest;
      });

      it('should update a valid contest', inject(function (Contests) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/contests\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/contests/' + mockContest._id);
      }));

      it('should set scope.error to error response message', inject(function (Contests) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/contests\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(contest)', function () {
      beforeEach(function () {
        // Create new contests array and include the contest
        scope.contests = [mockContest, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/contests\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockContest);
      });

      it('should send a DELETE request with a valid contestId and remove the contest from the scope', inject(function (Contests) {
        expect(scope.contests.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.contest = mockContest;

        $httpBackend.expectDELETE(/api\/contests\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to contests', function () {
        expect($location.path).toHaveBeenCalledWith('contests');
      });
    });
  });
}());
