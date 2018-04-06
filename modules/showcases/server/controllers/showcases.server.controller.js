'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Showcase = mongoose.model('Showcase'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Showcase
 */
exports.create = function(req, res) {
  var showcase = new Showcase(req.body);
  showcase.user = req.user;

  showcase.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(showcase);
    }
  });
};

/**
 * Show the current Showcase
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var showcase = req.showcase ? req.showcase.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  showcase.isCurrentUserOwner = req.user && showcase.user && showcase.user._id.toString() === req.user._id.toString();

  res.jsonp(showcase);
};

/**
 * Update a Showcase
 */
exports.update = function(req, res) {
  var showcase = req.showcase;

  showcase = _.extend(showcase, req.body);

  showcase.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(showcase);
    }
  });
};

/**
 * Delete an Showcase
 */
exports.delete = function(req, res) {
  var showcase = req.showcase;

  showcase.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(showcase);
    }
  });
};

/**
 * List of Showcases
 */
exports.list = function(req, res) { 
  Showcase.find({'status':'active'})
  .sort({_id:-1})
  .populate('user', 'displayName country profile_id profileImageURL username')
  .lean().exec(function(err, showcases) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(showcases);
    }
  });
};

/**
 * List of myShowcases
 */
exports.getMyShowcases = function(req, res) {
  Showcase.find({user: req.user.id}).sort('-created').populate('user', 'displayName').exec(function(err, showcases) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(showcases);
    }
  });
};

/**
 * Showcase middleware
 */
exports.showcaseByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Showcase is invalid'
    });
  }

  Showcase.findById(id).populate('user', 'displayName').exec(function (err, showcase) {
    if (err) {
      return next(err);
    } else if (!showcase) {
      return res.status(404).send({
        message: 'No Showcase with that identifier has been found'
      });
    }
    req.showcase = showcase;
    next();
  });
};


/**
* File upload  
*/
exports.uploadShowCaseFile = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.showCaseFileUpload).single('newShowcaseFile');
  var showCaseFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = showCaseFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        var imageURL = config.uploads.showCaseFileUpload.dest + req.file.filename;
        console.log('uploaded:', imageURL);
        return res.json(imageURL);
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};