'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  workRequire: {
    type: Object
  },
  subcat: {
    type: Object
  },
  location : {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isLocal: {
    type: Boolean
  },
  fileLink: {
    type: String
  },
  fileName: {
    type: String
  },
  projectRate: {
    type: String
  },
  currency: {
    type: Object
  },
  price: {
    type: Object
  },
  maxRange: {
    type: String
  },
  minRange: {
    type: String
  },
  skills: {
    type: Array
  },
  bids: {
    type: Array
  },
  additionalPakages: {
    type: Object
  },
  userInfo : {
    type : Object
  },
  status : {
    type : String,
    default: 'active'
  },
  dispute : {
    type : Object
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Project', ProjectSchema);
