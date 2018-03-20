'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Showcases Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/showcases',
      permissions: '*'
    }, {
      resources: '/api/showcases/:showcaseId',
      permissions: '*'
    }]
  }, {
    roles: ['user','individual', 'company'],
    allows: [{
      resources: [
        '/api/showcases', 
        '/api/showcase/file'
      ],
      permissions: ['get', 'post', 'put']
    }, {
      resources: '/api/showcases/:showcaseId',
      permissions: ['get', 'put', 'delete']
    }, {
      resources: '/api/myshowcases',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/showcases',
      permissions: ['get']
    }, {
      resources: '/api/showcases/:showcaseId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Showcases Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Showcase is being processed and the current user created it then allow any manipulation
  if (req.showcase && req.user && req.showcase.user && req.showcase.user._id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
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
