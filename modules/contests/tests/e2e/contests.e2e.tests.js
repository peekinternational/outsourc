'use strict';

describe('Contests E2E Tests:', function () {
  describe('Test contests page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/contests');
      expect(element.all(by.repeater('contest in contests')).count()).toEqual(0);
    });
  });
});
