'use strict';

(function () {
  // Profiles Controller Spec
  describe('Profiles Controller Tests', function () {
    // Initialize global variables
    var ProfilesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Profiles,
      mockProfiles;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Profiles_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Profiles = _Profiles_;

      // create mock profiles
      mockProfiles = new Profiles({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Profiles about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Profiles controller.
      ProfilesController = $controller('ProfilesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one profiles object fetched from XHR', inject(function (Profiles) {
      // Create a sample profiles array that includes the new profiles
      var sampleProfiles = [mockProfiles];

      // Set GET response
      $httpBackend.expectGET('api/profiles').respond(sampleProfiles);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.profiles).toEqualData(sampleProfiles);
    }));

    it('$scope.findOne() should create an array with one profiles object fetched from XHR using a profilesId URL parameter', inject(function (Profiles) {
      // Set the URL parameter
      $stateParams.profilesId = mockProfiles._id;

      // Set GET response
      $httpBackend.expectGET(/api\/profiles\/([0-9a-fA-F]{24})$/).respond(mockProfiles);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.profiles).toEqualData(mockProfiles);
    }));

    describe('$scope.create()', function () {
      var sampleProfilesPostData;

      beforeEach(function () {
        // Create a sample profiles object
        sampleProfilesPostData = new Profiles({
          title: 'An Profiles about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Profiles about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Profiles) {
        // Set POST response
        $httpBackend.expectPOST('api/profiles', sampleProfilesPostData).respond(mockProfiles);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the profiles was created
        expect($location.path.calls.mostRecent().args[0]).toBe('profiles/' + mockProfiles._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/profiles', sampleProfilesPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock profiles in scope
        scope.profiles = mockProfiles;
      });

      it('should update a valid profiles', inject(function (Profiles) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/profiles\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/profiles/' + mockProfiles._id);
      }));

      it('should set scope.error to error response message', inject(function (Profiles) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/profiles\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(profiles)', function () {
      beforeEach(function () {
        // Create new profiles array and include the profiles
        scope.profiles = [mockProfiles, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/profiles\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockProfiles);
      });

      it('should send a DELETE request with a valid profilesId and remove the profiles from the scope', inject(function (Profiles) {
        expect(scope.profiles.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.profiles = mockProfiles;

        $httpBackend.expectDELETE(/api\/profiles\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to profiles', function () {
        expect($location.path).toHaveBeenCalledWith('profiles');
      });
    });
  });
}());
