'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contest Schema
 */
var ContestSchema = new Schema({
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
  sliderContestBudg: {
    type: String
  },
  dayContest:{
    type: String
  },
  skills: {
    type: Array
  },
  entries: {
    type: Array
  },
  additionalPakages: {
    type: Object
  },
  userInfo: {
    type: Object
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  comments: {
    type: Array
  },
  contestStatus:{
    type: String
  },
  handOverFileName:{
    type:String,
    default: ''
  },
  handOverFileLink:{
    type:String,
    default: ''
  }
});

mongoose.model('Contest', ContestSchema);