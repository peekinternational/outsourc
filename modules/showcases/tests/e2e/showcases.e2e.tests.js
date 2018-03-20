'use strict';

describe('Showcases E2E Tests:', function () {
  describe('Test Showcases page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/showcases');
      expect(element.all(by.repeater('showcase in showcases')).count()).toEqual(0);
    });
  });
});
