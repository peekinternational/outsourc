(function () {
  'use strict';

  describe('Showcases Route Tests', function () {
    // Initialize global variables
    var $scope,
      ShowcasesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ShowcasesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ShowcasesService = _ShowcasesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('showcases');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/showcases');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ShowcasesController,
          mockShowcase;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('showcases.view');
          $templateCache.put('modules/showcases/client/views/view-showcase.client.view.html', '');

          // create mock Showcase
          mockShowcase = new ShowcasesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Showcase Name'
          });

          // Initialize Controller
          ShowcasesController = $controller('ShowcasesController as vm', {
            $scope: $scope,
            showcaseResolve: mockShowcase
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:showcaseId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.showcaseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            showcaseId: 1
          })).toEqual('/showcases/1');
        }));

        it('should attach an Showcase to the controller scope', function () {
          expect($scope.vm.showcase._id).toBe(mockShowcase._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/showcases/client/views/view-showcase.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ShowcasesController,
          mockShowcase;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('showcases.create');
          $templateCache.put('modules/showcases/client/views/form-showcase.client.view.html', '');

          // create mock Showcase
          mockShowcase = new ShowcasesService();

          // Initialize Controller
          ShowcasesController = $controller('ShowcasesController as vm', {
            $scope: $scope,
            showcaseResolve: mockShowcase
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.showcaseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/showcases/create');
        }));

        it('should attach an Showcase to the controller scope', function () {
          expect($scope.vm.showcase._id).toBe(mockShowcase._id);
          expect($scope.vm.showcase._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/showcases/client/views/form-showcase.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ShowcasesController,
          mockShowcase;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('showcases.edit');
          $templateCache.put('modules/showcases/client/views/form-showcase.client.view.html', '');

          // create mock Showcase
          mockShowcase = new ShowcasesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Showcase Name'
          });

          // Initialize Controller
          ShowcasesController = $controller('ShowcasesController as vm', {
            $scope: $scope,
            showcaseResolve: mockShowcase
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:showcaseId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.showcaseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            showcaseId: 1
          })).toEqual('/showcases/1/edit');
        }));

        it('should attach an Showcase to the controller scope', function () {
          expect($scope.vm.showcase._id).toBe(mockShowcase._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/showcases/client/views/form-showcase.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
