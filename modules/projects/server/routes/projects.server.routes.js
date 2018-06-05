'use strict';

/**
 * Module dependencies.
 */
var projectsPolicy = require('../policies/projects.server.policy'),
  projects = require('../controllers/projects.server.controller');

module.exports = function (app) {
  // Projects collection routes
  app.route('/api/packageProjects/:projectId').post(projects.projectdetail);
  app.route('/api/agreement/save').post(projects.agreementSave);
  app.route('/api/agreement/get').post(projects.getAgreement);
  app.route('/api/totalProjects/:skills?').get(projects.totalProjects);
  app.route('/api/projects/:size/:page_num/:skills?').get(projects.list);
  app.route('/api/subCatSkills/:catId').get(projects.subCatSkills);
  app.route('/api/activeProjects/:catId').get(projects.activeProjects);
  app.route('/api/Allprojects').post(projects.Allprojects);
  app.route('/api/searchproject').post(projects.searchprojectbyname);

  app.route('/api/projects').all(projectsPolicy.isAllowed)
    .post(projects.create);
  
  // Single project routes

  app.route('/api/projects/:projectId').all(projectsPolicy.isAllowed)
    .get(projects.read)
    .put(projects.update)
    .delete(projects.delete);

  
  app.route('/api/project/placeBid/:projectId').put(projects.placeBid);
  app.route('/api/project/placeFeedBack/:projectId').put(projects.placeFeedBack);
  app.route('/api/project/editBid/:projectId').put(projects.editBid);
  app.route('/api/project/submitProposal/:projectId').put(projects.submitProposal);
  app.route('/api/project/projectAwarded/:projectId').put(projects.projectAwarded);
  app.route('/api/project/acceptProject/:projectId').put(projects.acceptProject);
  app.route('/api/project/addMilestone/:projectId').put(projects.addMilestone);
  app.route('/api/project/projectFile').post(projects.uploadProjectDisputeFile);
  app.route('/api/project/uploadProjectFile').post(projects.uploadProjectFile);
  app.route('/api/project/manageDispute/:projectId').put(projects.manageDispute);
  app.route('/api/project/manageDisputeComments/:projectId').put(projects.manageDisputeComments);
  app.route('/api/project/updateField/:projectId').put(projects.updateProjectSpecificField);
  app.route('/api/project/allOutGoinglMilestones').put(projects.alOutGoinglMilestones);
  app.route('/api/project/allIncominglMilestones').put(projects.allIncominglMilestones);
  
  
  app.route('/api/project/changeMilestonStatus/:projectId').put(projects.changeMilestonStatus);

  app.route('/api/project/bid/deleteBid/:projectId').put(projects.deleteBid);

  app.route('/api/project/hiredProject').post(projects.hiredProject);

  // Finish by binding the project middleware
  app.param('projectId', projects.projectByID);
};
