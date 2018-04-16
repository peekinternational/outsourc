'use strict';

/**
 * Module dependencies
 */
var showcasesPolicy = require('../policies/showcases.server.policy'),
  showcases = require('../controllers/showcases.server.controller');

module.exports = function(app) {
  // Showcases Routes
  app.route('/api/showcases').all(showcasesPolicy.isAllowed)
    .get(showcases.list)
    .post(showcases.create);

  app.route('/api/showcases/:showcaseId').all(showcasesPolicy.isAllowed)
    .get(showcases.read)
    .put(showcases.update)
    .delete(showcases.delete);
  app.route('/api/showcasesType').all(showcasesPolicy.isAllowed) 
    .post(showcases.getByType);
   
  app.route('/api/showcase/file').post(showcasesPolicy.isAllowed, showcases.uploadShowCaseFile);
  app.route('/api/myshowcases').get(showcasesPolicy.isAllowed, showcases.getMyShowcases);
  // Finish by binding the Showcase middleware
  app.param('showcaseId', showcases.showcaseByID);
};
