'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Profiles Schema
 */
var ProfilesSchema = new Schema({
  
  trophyIcon: {
    type: String,
    default: '',
    trim: true
  },
  shortProfessionalHeadline: {
    type: String,
    trim: true
  },
  indInfo: {
    type: String,
    trim: true
  },
  companyIntro: {
    type: String,
    trim: true
  },
  companyInformation: {
    type: Object
  },
  location: {
    type: String,
    trim: true
  },
  perHourRate: {
    type: String,
    trim: true
  },
  companyRepresentative: {
    type: String,
    trim: true
  },
  companyType: {
    type: String,
    trim: true
  },
  listing: {
    type: String,
    trim: true
  },
  sectors: {
    type: String,
    trim: true
  },
  businessContents: {
    type: String,
    trim: true
  },
  affiliation: {
    type: String,
    trim: true
  },
  affiliatedIndustrialComplex: {
    type: String,
    trim: true
  },
  capital: {
    type: String,
    trim: true
  },
  take: {
    type: String,
    trim: true
  },
  companyNationality: {
    type: String,
    trim: true
  },
  jobsCompleted: {
    type: Number
  },
  notCompletedJobs: {
    type: Number
  },
  rating: {
    type: Number
  },
  noOfEmployees: {
    type: Number
  },
  establishYear: {
    type: Date
  },
  companyClub: {
    type: Array
  },
  skills: {
    type: Array
  },
  certifications: {
    type: Array
  },
  certificates: {
    type: Array
  },
  experience: {
    type: Array
  },
  education: {
    type: Array
  },
  publications: {
    type: Array
  },
  workHistory: {
    type: Array
  },
  portfolio: {
    type: Array
  },
  userInfo: {
    type: Object,
    default: {country:{name:null}}
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }, 
  
  finalUserRattingBaseOnProjectAwarded : {
      type: Number
    },
    
    finalUserRattingBaseOnMyProject : {
      type: Number
    },

    noOfReviewBaseOnProjectAwarded :{
     type: Number
    },

    noOfReviewBaseOnMyProject :{
      type: Number
    }
});

mongoose.model('Profiles', ProfilesSchema);
