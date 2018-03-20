'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Showcase Schema
 */
var ShowcaseSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Showcase name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  showcaseType: {
    type: Object
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  file: {
    type: Object
  },
  description: {
    type: String
  },
  budget: {
    type: Object
  },
  likes: {
    type: Array,
    default: [] 
  },
  cat: {
    type: Object
  },
  subCat: {
    type: Object
  },
  status:{
    type: String,
    default: 'pending'
  } 
});

mongoose.model('Showcase', ShowcaseSchema);
