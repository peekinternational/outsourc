'use strict';

/**
 * Module dependencies.
 */
var profilesPolicy = require('../policies/profiles.server.policy'),
  profiles = require('../controllers/profiles.server.controller');

module.exports = function (app) {
  // Profiles collection routes
  app.route('/api/profiles').all(profilesPolicy.isAllowed)
    .get(profiles.list)
    .post(profiles.create);

  // Single profiles routes
  app.route('/api/profiles/:profilesId').all(profilesPolicy.isAllowed)
    .get(profiles.read)
    .put(profiles.update)
    .delete(profiles.delete);

  app.route('/api/portfolioImage/delete').put(profiles.deletePortfolioPicture);

  app.route('/api/profile/portfolioImage').post(profiles.uploadPortfolioPicture);

  app.route('/api/profile/:userName')
    .get(profiles.getUserProfile);
  app.route('/api/partialProfiles/:profilesId').all(profilesPolicy.isAllowed)
    .put(profiles.partialProfileUpdate);
  app.route('/api/userInfoUpdate/:profilesId').all(profilesPolicy.isAllowed)
    .put(profiles.userInfoUpdate); 
  app.route('/api/partialProfilesArray/:profilesId').all(profilesPolicy.isAllowed)
    .put(profiles.partialProfileArrayUpdate);

  // fetching all profiles
  app.route('/api/freelancers').get(profiles.getAllProfiles);

  // for hire me
  app.route('/api/profiles/hire/:userId').put(profiles.hireme);

  // seach a profile
  app.route('/api/search/:searchName').get(profiles.searchByName);

  //company info code
  app.route('/api/pushCompanyInfo/:profilesId').put(profiles.pushCompanyInfoUpdate);

  // Finish by binding the profiles middleware
  app.param('userName', profiles.profileByUsername);
  app.param('profilesId', profiles.profilesByID);

};
