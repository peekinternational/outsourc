'use strict';

/**
 * Module dependencies.
 */
var contestsPolicy = require('../policies/contests.server.policy'),
  contests = require('../controllers/contests.server.controller');

module.exports = function (app) {
  // Contests collection routes
  app.route('/api/contests').all(contestsPolicy.isAllowed)
    .get(contests.list)
    .post(contests.create);

  // Single contest routes
  app.route('/api/contests/:contestId').all(contestsPolicy.isAllowed)
    .get(contests.read)
    .put(contests.update)
    .delete(contests.delete);
  // search contest through skills 
  app.route('/api/searchContest/skills').post(contests.searchContestSkills);
  // this route use to search contest as a name and description
  app.route('/api/searchContest/:word').get(contests.searchWord);
  // count contest record to make pagination
  app.route('/countContestRecord').get(contests.countContestRecord);
  // contest dynamic pagination route
  app.route('/contestRecord/:size/:page').get(contests.dynamicPagination);
  app.route('/api/contests/placeEntry/:contestId').put(contests.update);
  app.route('/api/contest/create').post(contests.create);
  app.route('/api/contest/makeThisWinner/').put(contests.makeThisWinnerServer);
  app.route('/api/contest/commentOnEntry/:contestId').put(contests.commentOnEntry);
  app.route('/api/contest/similarcontest').get(contests.similarcontest);
  //Get all contests where you have uploaded entries
  app.route('/api/contest/getAllActiveContests').put(contests.getAllActiveContests);
  app.route('/api/contest/getAllPastContests').put(contests.getAllPastContests);
  app.route('/api/contest/getAllMyContests').put(contests.getAllMyContests);
  app.route('/api/contest/getAllContestsAwarded').put(contests.getAllContestsAwarded);
  // app.route('/api/contests/submitProposal/:contestId').put(contests.submitProposal);

  app.route('/api/contests/update/:contestId').put(contests.updateContest);

  app.route('/api/contest/contestFile').post(contests.uploadContestFile);
  app.route('/api/contest/updateForHandOver').post(contests.updateForHandOver);

  // Finish by binding the contest middleware
  app.param('contestId', contests.contestByID);
};