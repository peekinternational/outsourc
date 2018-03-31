'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Profiles Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/profiles',
      permissions: '*'
    }, {
      resources: '/api/profiles/:profilesId',
      permissions: '*'
    }]
  }, {
    roles: ['company','individual'],
    allows: [{
      resources: '/api/profiles',
      permissions: ['get', 'post']
    }, {
      resources: '/api/profiles/:profilesId',
      permissions: ['get', 'put']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/profiles',
      permissions: ['get']
    }, {
      resources: '/api/profiles/:profilesId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Profiles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];
// 
  // console.log(req.profiles);
  // console.log(req.user);
  // console.log(req.profiles.userInfo._id);
  // console.log(req.user._id);
  // If an profiles is being processed and the current user created it then allow any manipulation
  if (req.profiles && req.user && JSON.stringify(req.profiles.userInfo._id) === JSON.stringify(req.user._id)) {
    
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
