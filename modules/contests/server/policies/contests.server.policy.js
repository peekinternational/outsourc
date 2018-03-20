'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Contests Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/contests',
      permissions: '*'
    }, {
      resources: '/api/contests/:contestId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'individual', 'company'],
    allows: [{
      resources: '/api/contests',
      permissions: ['get', 'post']
    }, {
      resources: '/api/contests/:contestId',
      permissions: ['get', 'put', 'delete']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/contests',
      permissions: ['get']
    }, {
      resources: '/api/contests/:contestId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Contests Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an contest is being processed and the current user created it then allow any manipulation
  if (req.contest && req.user && req.contest.user.id === req.user.id) {
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
