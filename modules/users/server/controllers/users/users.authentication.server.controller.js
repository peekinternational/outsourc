'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  Universal = mongoose.model('Universal');

// for http
var request = require('request');
var fs = require('fs');

// email verif/send
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  host: 'smtp.cafe24.com',
  port: 587,
  secure: false, // use SSL
  auth: {
    user: 'no-reply@outsourcingok.com',
    pass: 'link6412'
  },
  tls:{
    rejectUnauthorized: false
  }
});


// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];


/**
* Send email when user is registered
*/
var sendEmail = function (receiverEmail, username, verifUrl, req, res) {
 fs.readFile('modules/users/client/views/authentication/verify-template.client.view.html', 'utf8', function(err, html){
    if(err){
      console.log('fs error:', err);
    }else{
      var htmlToSend;
      htmlToSend = html.replace(/Inayat/g, username+',');
      htmlToSend = htmlToSend.replace(/verifyURL/g, verifUrl);
       
      transporter.sendMail({
        from: '"OutSourcingOk" <no-reply@outsourcingok.com>', // sender address
        to: receiverEmail, // list of receivers
        subject: '아웃소싱오케이 이메일 확인입니다.', // Subject line
        // text: data.message.contact_msg, // plain text body
        html: htmlToSend
      }, function(err, suc){
        if (err){
          //res.json(err);
	       console.log('err email');
        }else
         console.log('email succ');
         //res.json(suc);
      });
    }
  });
};

/**
 * Signup
 */

 //status offline
 exports.signOutServer = function (req, res){
  
  var currentPersonUserId = req.body.currentPersonUserId;
  var status = req.body.status;
  //console.log('currentPersonUserId', currentPersonUserId);
  //console.log('status', status);

  //now update user status offine
  User.findOneAndUpdate({ '_id' : currentPersonUserId} , { $set : { 'status' : status} }, { new: true },function (err,user) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(user);
    }
  });

 };

 /*exports.signup = function (req, res) {
   // For security measurement we remove the roles from the req.body object
   delete req.body.roles;
   // Init Variables
   var user = new User(req.body);
   user.userType = req.body.userType;
   user.companyName = req.body.companyName;
   user.companyRegNum = req.body.companyRegNum;
   user.companyTel = req.body.companyTel;
   user.personInChargeNum = req.body.personInChargeNum;
   user.companyExt = req.body.companyExt;
   user.mobileNumber = req.body.mobileNumber;
   user.userRole = req.body.userRole;

   var roles = [req.body.userType];

   user.roles = roles;
   // //console.log(roles);

   user.country = req.body.country;
   user.interest = req.body.interest;
   user.subscribe = req.body.subscribe;
   var message = null;
   // //console.log(user);

   // Add missing user fields
   user.provider = 'local';
   if(user.firstName==='' && user.lastName===''){
     user.firstName = user.companyName;
   }
   user.displayName = user.firstName + ' ' + user.lastName;
   // Then save the user
   user.save(function (err) {
     if (err) {
       return res.status(400).send({
         message: errorHandler.getErrorMessage(err),
         user: req.body
       });
     } else {
       // Remove sensitive data before login
       user.password = undefined;
       user.salt = undefined;

       // Send email for registered user
       var host = req.headers.origin;
       var verifUrl = host+'/profile/view/?'+user._id;
       sendEmail(user.email, user.username, verifUrl);

       req.login(user, function (err) {
         if (err) {
           res.status(400).send(err);
         } else {
           res.json(user);
         }
       });
     }
   });
 };*/

 exports.signup = function (req, res) {
   // For security measurement we remove the roles from the req.body object
   delete req.body.roles;
   // Init Variables
   var user = new User(req.body);
   user.userType = req.body.userType;
   user.companyName = req.body.companyName;
   user.companyRegNum = req.body.companyRegNum;
   user.companyTel = req.body.companyTel;
   user.personInChargeNum = req.body.personInChargeNum;
   user.companyExt = req.body.companyExt;
   user.mobileNumber = req.body.mobileNumber;
   user.userRole = req.body.userRole;
   user.username= req.body.username;
   var roles = [req.body.userType];

   user.roles = roles;
   user.country = req.body.country;
   user.interest = req.body.interest;
   user.subscribe = req.body.subscribe;
   var message = null;

   // Add missing user fields
   user.provider = 'local';
   if(user.firstName==='' && user.lastName===''){
     user.firstName = user.companyName;
   }
   user.displayName = user.firstName + ' ' + user.lastName;

   // restricted usernames
    var protUserName=['admin','outsok','null','unknown','user','undefined','api','password','anonymous']; 
    if(protUserName.indexOf(req.body.username)>=0){
      return res.status(400).send({
        message: 'Given username is not allowed',
        user: req.body
      });
    }
    
    
   // Check for existing username and email (its unique in model but not working on live server)
   User.findOne({
     $or: [{username: req.body.username}, {email: req.body.email}]
   }, function(err, exist){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err),
          user: req.body
        });
      }
     
      if(exist){
        var msg;
        if(user.email == exist.email && user.username == exist.username){
          msg = 'Username and email already exists';
        }
        else if(user.email == exist.email){
          msg = 'Email already exists';
        }
        else if(user.username == exist.username){
          msg = 'Username already exists';
        }
        return res.status(400).send({
          message: msg,
          user: req.body
        });
      }
     if(!exist){

       // Then save the user
       user.save(function (err) {
         if (err) {
           return res.status(400).send({
             message: errorHandler.getErrorMessage(err),
             user: req.body
           });
         } else {
          
           // Remove sensitive data before login
           user.password = undefined;
           user.salt = undefined;

           // Send email for registered user
           var host = req.headers.origin;
           var verifUrl = host+'/profile/view/?'+user._id;
           sendEmail(user.email, user.username, verifUrl);

           req.login(user, function (err) {
             if (err) {
               res.status(400).send(err);
             } else {
               res.json(user);
             }
           });
         }
       });
     }
   });
 };

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  //req.logout(); not working this line of code 
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
  
};

/**
 * UniversalData
 */
exports.tags = function (req, res) {
  Universal.find({}).exec(function (err, Universal) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(Universal);
    }
  });
};


/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;

    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        // return res.redirect(redirectURL || sessionRedirectURL || '/');    
        return res.redirect('/');    
        // return res.redirect(typeof redirectURL == 'string' ? redirectURL : sessionRedirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            if(providerUserProfile.provider === 'google'){
              user = new User({
                firstName: providerUserProfile.firstName,
                lastName: providerUserProfile.lastName,
                username: availableUsername,
                displayName: providerUserProfile.displayName,
                email: providerUserProfile.email,
                profileImageURL: providerUserProfile.providerData.image.url,
                provider: providerUserProfile.provider,
                providerData: providerUserProfile.providerData
              });
            } else{
              user = new User({
                firstName: providerUserProfile.firstName,
                lastName: providerUserProfile.lastName,
                username: availableUsername,
                displayName: providerUserProfile.displayName,
                email: providerUserProfile.email,
                profileImageURL: providerUserProfile.profileImageURL,
                provider: providerUserProfile.provider,
                providerData: providerUserProfile.providerData
              });
            }

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });

            // //console.log('Created user:', user);
            // // Create a Payment account 
            // request.post('https://203.99.61.173:3030/explorer/account', {
            //   // ownerId:'zerakshigri',
            //   ownerId: user.username,
            //   creationDate: Date.now(),
            //   accountBalance: {
            //     "USD": 0
            //   }
            // });

          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      return done(new Error('사용자가 이미 연결되었습니다.'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: '사용자가 인증되지 않았습니다.'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};

/*
*New Email verification
*/

// var handlebars = require('handlebars');
exports.sendMail = function (req, res) {
  var htm;
  var template;
  var data = req.body; 

  fs.readFile('modules/users/client/views/authentication/verify-template.client.view.html', 'utf8', function(err, html){
    if(err){
      console.log('fs error:', err);
    }else{
      var htmlToSend;
      htmlToSend = html.replace(/Inayat/g, data.message.username+'');
      htmlToSend = htmlToSend.replace(/verifyURL/g, data.message.verifUrl);
       
      transporter.sendMail({
        from: '"OutSourcingOk" <no-reply@outsourcingok.com>', // sender address
        to: data.message.contact_email, // list of receivers
        subject: '아웃소싱오케이 이메일 확인입니다.', // Subject line
        // text: data.message.contact_msg, // plain text body
        html: htmlToSend
      }, function(err, suc){
        if (err){
          res.json(err);
        }else
         res.json(suc);
      });

    }
  });
};
