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
    ref: 'User',
    index: true
  }
});

mongoose.model('Project', ProjectSchema);

var CategorySchema = new Schema({
  description: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  subCategories: {
    type: Array
  },
},{ collection: 'Categories' });

mongoose.model('Categories', CategorySchema);


var subCatSchema = new Schema({
  description: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  skills: {
    type: Array
  }
},{ collection: 'SubCategories' });

mongoose.model('SubCategories', subCatSchema);

var skillsSchema = new Schema({
  description: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    default: '',
    trim: true
  }
},{ collection: 'Skills' });

mongoose.model('Skills', skillsSchema);

var NDASchema = new Schema({
  userId: {
    type: String,
    trim: true
  },
  projectId: {
    type: String,
    trim: true
  },
  agreement: {
    type: Boolean,
    default:false
  },
  companyName:{
    type:String,
    trim:true
  },
  phone:{
    type:Number,
    trim:true
  },
  address:{
    type:String,
    trim:true
  },
  country:{
    type:String,
    trim:true
  },
  state:{
    type:String,
    trim:true
  },
  city:{
    type:String,
    trim:true
  }
},{ collection: 'Agreement' });

mongoose.model('Agreement', NDASchema);