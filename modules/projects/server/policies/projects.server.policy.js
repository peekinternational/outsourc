'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Projects Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/projects',
      permissions: '*'
    }, {
      resources: '/api/projects/:projectId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'individual', 'company'],
    allows: [{
      resources: '/api/projects',
      permissions: ['get', 'post']
    },
    {
      resources: '/api/totalProjects/:skills?',
      permissions: ['get']
    }, 
    /*{
      resources: '/api/projectsCat/:catId',
      permissions: ['get']
    },*/ 
    {
      resources: '/api/projects/:projectId',
      permissions: ['get', 'put', 'delete']
    }]
  }, { // Newly added resources
    roles: ['individual', 'company'],
    allows: [{
      resources: [
        '/api/project/placeBid/:projectId',   
        '/api/project/placeFeedBack/:projectId',  
        '/api/project/editBid/:projectId',    
        '/api/project/submitProposal/:projectId',   
        '/api/project/projectAwarded/:projectId',   
        '/api/project/acceptProject/:projectId',    
        '/api/project/addMilestone/:projectId',     
        '/api/project/manageDispute/:projectId',    
        '/api/project/manageDisputeComments/:projectId',    
        '/api/project/updateField/:projectId',    
        '/api/project/changeMilestonStatus/:projectId',   
        '/api/project/bid/deleteBid/:projectId',    
        '/api/project/allOutGoinglMilestones',    
        '/api/project/allIncominglMilestones'     
      ],
      permissions: ['put']
    },{
      resources: [
        '/api/project/projectFile',   
        '/api/project/uploadProjectFile',   
        '/api/project/hiredProject',  
      ],
      permissions: ['post']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/projects',
      permissions: ['get']
    },
    {
      resources: '/api/totalProjects/:skills?',
      permissions: ['get']
    }, 
    /*{
      resources: '/api/projectsCat/:catId',
      permissions: ['get']
    },*/ 
    {
      resources: '/api/projects/:projectId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Projects Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // console.log(req.project.user.id);
  //console.log(req.project.user.id.toString() === req.user.id.toString());
  // If an project is being processed and the current user created it then allow any manipulation
  if (req.project && req.user && req.project.user._id.toString() === req.user.id.toString()) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
