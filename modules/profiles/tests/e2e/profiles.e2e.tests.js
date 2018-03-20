'use strict';

describe('Profiles E2E Tests:', function () {
  describe('Test profiles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/profiles');
      expect(element.all(by.repeater('profiles in profiles')).count()).toEqual(0);
    });
  });
});
