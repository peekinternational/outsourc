'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: ''
    // validate: [validateLocalStrategyProperty, 'Please fill in your first name']
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
    // validate: [validateLocalStrategyProperty, 'Please fill in your last name']
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    default: '',
    required: true
  },
  userType: {
    type: String
  },
  companyName: {
    type: String,
    trim: true
  },
  companyRegNum: {
    type: String,
    trim: true
  },
  companyTel: {
    type: String  
  },

  verEmail: {
    type: Boolean,
    default: false
  },
  verLocation: {
    type: Boolean,
    default: true
  },
  verPayment: {
    type: Boolean,
    default: false
  },
  verPhone: {
    type: Boolean,
    default: false
  },
  verDeposit: {
    type: Boolean,
    default: false
  },
  verIdentity: {
    type: Boolean,
    default: false
  },
  verProCompleted: {
    type: Boolean,
    default: false
  },


  profile_id: {
    type: String  
  },
  personInChargeNum: {
    type: String  
  },
  companyExt: {
    type: String
  },
  mobileNumber: {
    type: String
  },
  userRole: {
    type: String
  },
  country: {
    type: Object
  },
  subscribe: {
    type: Boolean
  },
  projects: {
    type: Array
  },
  projectsAwarded: {
    type: Array
  },
  contestsAwarded: {
    type: Array
  },
  password: {
    type: String,
    default: ''
  },
  salt: {
    type: String
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  coverImageURL: {
    type: String,
    default: 'modules/users/client/img/cover/default-cover.png'
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},

  roles: {
    type: [{
      type: String,
      enum: ['individual', 'company', 'admin', 'user']
    }],
    default: ['individual'],
    required: 'Please provide at least one role'
  },

  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  // for setting profile
  address: {
    type: String,
    trim: true,
    default: ''
  },
  city: {
    type: String,
    trim: true,
    default: ''
  },
  zipcode:{
    type: String,
    trim: true,
    default: ''
  },
  stateprovince:{
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true
  },
  timezone: {
    type: Object,
    trim: true
  },
  notEmailFormate: {
    type: String,
    trim: true,
    default: ''
  },
  notPostedProjets: {
    type: String,
     trim: true,
     default: ''
  },
  notEmailFrequency: {
    type: String,
     trim: true,
     default: ''
  },
  whyClosingAccount: {
    type: String,
     trim: true,
     default: ''
  },
  feedbackBeforeClosing: {
    type: String,
     trim: true,
     default: ''
  },
  contactAfterClosing: {
    type: String,
    trim: true,
    default: ''
  },

  notificationsOnOff: {
    bidRetracted:{
      type: Boolean,
      default: true
    },
    receiveEntry:{
      type: Boolean,
      default: true
    },
    hireMeForProjects:{
      type: Boolean,
      default: true
    },
    allowFollowMe:{
      type: Boolean,
      default: true
    }
  },

  myProjects: {
    type: Array
  },

  myContests: {
    type: Array
  },

  remainingBids: {
    type: Number,
    default : 300
  },
  
  finalUserRatting : {
    type: Number
  },

  finalUserRattingBaseOnProjectAwarded : {
    type: Number,
    default: 0.0
  },
  
  finalUserRattingBaseOnMyProject : {
    type: Number,
    default: 0.0
  },

  noOfReviewBaseOnProjectAwarded :{
   type: Number,
   default: 0
  },

  noOfReviewBaseOnMyProject :{
    type: Number,
   default: 0
  },

  newsFeed : {
    type: Array
  },
  status: {
    type: String
  },
  autToken: {
    type: String
  },
  authTokenExpires: {
    type: Date
  },
  phoneAuthToken: {
    type: String
  }

});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    var result = owasp.test(this.password);
    if (result.errors.length) {
      var error = result.errors.join(' ');
      this.invalidate('password', error);
    }
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username.toLowerCase() + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

/**
* Generates a random passphrase that passes the owasp test.
* Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
* NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
*/
UserSchema.statics.generateRandomPassphrase = function () {
  return new Promise(function (resolve, reject) {
    var password = '';
    var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // iterate until the we have a valid passphrase. 
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present.
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      // check if we need to remove any repeating characters.
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
      reject(new Error('An unexpected problem occured while generating the random passphrase'));
    } else {
      // resolve with the validated passphrase
      resolve(password);
    }
  });
};

mongoose.model('User', UserSchema);
