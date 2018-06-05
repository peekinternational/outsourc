'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  // mongoose = require('mongoose').set('debug', true),
  multer = require('multer'),
  async = require('async'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  Project = mongoose.model('Project'),
  Contest = mongoose.model('Contest'),
  Profiles = mongoose.model('Profiles'),
  crypto = require('crypto');
  

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find().sort('-created').populate('user.userId', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(users);
    }
  });
};


/*Paypal integration*/
var paypal = require('paypal-rest-sdk');

// FOR SAND BOX
// var configg = {
//   // "port": 3000,
//   "api" : {
//     "host" : "api.sandbox.paypal.com",
//     "port" : "",            
//     "client_id" : "AVcY1SuqAk9yif6suKqfsxLoIMWISLrRoHcWeR-pfWT_whJVLyTMYVoKEhBeHeX-xLpV55gmwKKq-0d8",  // your paypal application client id
//     "client_secret" : "EATFaJ70n5ihuQO0aGRFDw6kIgsyBk4phatQ3EFw3Wt1-fgGkptMxBSfgyvtpipLTJDiHc2CbR3qoHdS" // your paypal application secret id
//   }
// };

// FOR LIVE
var configg = {
  // "port": 3000,
  "api" : {
    // "host" : "api.paypal.com",
    "mode":'live',

    //live acc of outsourcingok
    "client_id" : "AcWAt3H8gegqrUsCel_lQ8mmaKrIv48mHOhXwvItnOVhYjTL8oovw-Y1fg04z10GNUsuQxWS9NVb9Zs_",  // your paypal application client id
    "client_secret" : "EOckxvhELvOlKOw1pgdzlhkSaGHgIlWEIFCJAxzDQH035CWlMilv1Fju_ZNHuzlSz9gfjR3Mun1Gvj6A" // your paypal application secret id

    //Inayat's            
    // "client_id" : "AXasnukk_5X2S03WTgOsEu6KnzP44ftlN6eA63-A3ROev7cv6wOZwbP6Y-i_Dl3VZ8s_84SmPbR_FHYQ",  // your paypal application client id
    // "client_secret" : "EJNZilR5OPvCu7PCHqHGsTU5N0eX55TQnZL1k0MipE4L1hGJgpIpkh5EQOw7As6IEm8XGOBcYd_6c33G" // your paypal application secret id
  }
};

paypal.configure(configg.api);
 
exports.payCreate = function(req, res){

  // for deposit
  var payment ={};

  var return_url;
  var cancel_url;

  if(req.body.paymentVerif){
    return_url = req.headers.origin+'/profile/view/';
    cancel_url = req.headers.origin+'/profile/view/';
  }
  else{
    return_url = req.headers.origin+'/paypal-deposit';
    cancel_url = req.headers.origin+'/paypal-deposit';
  }

  console.log('Return_url:', return_url);
  console.log('Cancel_url:', cancel_url);

  if(req.body.payType === 'deposit'){
    payment = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": return_url,
        "cancel_url": cancel_url,
      },
      "transactions": [{
        "amount": {
          "total":parseInt(req.body.amount.amount),
          "currency":  req.body.amount.currency
        },
        "description": req.body.amount.desc
      }]
    };
  }

  // for withdrawl
  if(req.body.payType === 'withdraw'){
    payment = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": { 
        "return_url": req.headers.origin+'/contests/transcation',
        "cancel_url": req.headers.origin+'/contests/transcation'
      },
      "transactions": [{
        "amount": {
          "total":parseInt(req.body.amount.amount),
          "currency":  req.body.amount.currency
        },
        "payee":{
          "email": req.body.userEmail
        },
        "description": req.body.amount.desc
      }]
    };
  }
  // For Credit Card
  // var payment = {
  //   "intent": "sale",
  //   "payer": {
  //     "payment_method": "credit_card",
  //     "funding_instruments": [{
  //       "credit_card": {
  //         "number": "5500005555555559",
  //         "type": "mastercard",
  //         "expire_month": 12,
  //         "expire_year": 2018,
  //         "cvv2": 111,
  //         "first_name": "Joe",
  //         "last_name": "Shopper"
  //       }
  //     }]
  //   },
  //   "redirect_urls": {
  //     "return_url": 'http://'+req.get('host')+'/contests/transcation',
  //     // "return_url": 'http://' + req.get('host') +"/api/users/paymentExecute",
  //     // "cancel_url": 'http://' + req.get('host') +"/api/users/paymentCancel"
  //     "cancel_url": 'http://'+req.get('host')+'/contests/transcation'
  //   },
  //   "transactions": [{
  //     "amount": {
  //       "total": "5.00",
  //       "currency": "USD"
  //     },
  //     "description": "My awesome payment"
  //   }]
  // };

  // console.log('Payment:', payment);

  // res.json(payment);
 
  paypal.payment.create(payment, function (error, payment) {
    if (error) {
      console.log('create payment error::', error);
      res.json(error);
    } else {
      if(payment.payer.payment_method === 'paypal') {
        req.session.bodypaymentId = payment.id;
        var redirectUrl;
        for(var i=0; i < payment.links.length; i++) {
          var link = payment.links[i];
          if (link.method === 'REDIRECT') {
            redirectUrl = link.href;
          }
        }
        console.log("Hurrayy! Successfull Paypal Integration.");
        // res.redirect(redirectUrl);
        res.json(redirectUrl);
        // exports.payExecute(req, res);
      }
    }
  });
};


// Execute the payment in paypal
exports.payExecute = function(req, res){
  console.log('req.session', req.session);
  console.log("req.body", req.body);

  var paymentId = req.body.paymentId;
  var payerId = req.body.PayerID;
  var token = req.body.token;
  // var payerId = req.params('PayerID');

  var details = { "payer_id": payerId };
  paypal.payment.execute(paymentId, details, function (error, payment) {
    if (error) {
      console.log(error);
      res.status(400).send(error);
    } else {
      // res.send("Hell yeah!");
      res.json(payment);
    }
  });
};

/*End of Paypal payment*/

//Get user getByUsername
exports.getByUsername = function (req, res) {
  var name = req.params.username;
  User.findOne({
    username:  req.params.username
  }).exec(function (err, user) {
    if (err) {
      return res.status(400).send({
        message: '사용자가 잘못되었습니다.'
      });
    } else{
      res.json(user);
    }
  });
};


/**
 * Update user details
 */
exports.update = function (req, res) {

  // Init Variables

  var user = req.user;
  
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;


  if (user) {
    // Merge existing user
    
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    // Remove $promise and $ resolve 
    if(user.projectsAwarded.length){
      for(var i=0; i<user.projectsAwarded.length; i++){
        if(user.projectsAwarded[i]. $promise || user.projectsAwarded[i]. $resolved){
          delete user.projectsAwarded[i].$promise
          delete user.projectsAwarded[i].$resolved
        }
      }
    }
    
    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            Profiles.findByIdAndUpdate(user.profile_id , { $set: {userInfo: user} } , { new: true }, function (err,profile) {
              if (err) {
                // //console.log(err);
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {

                // profiles.userInfo.coverImageURL = user.coverImageURL;
                // profiles.userInfo.profileImageURL = user.profileImageURL;
                // profiles.userInfo._id = user._id;

                // var data = {
                //   'user' : user,
                //   'profile' : profiles
                // };
                res.json(user);
              }
            });

            // res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: '사용자가 로그인하지 않았습니다.'
    });
  }
};


exports.updatePartialUser = function (req, res) {
  // Init Variables
  // console.log(req.body);
  // console.log(req.params.userId);
  var id = req.params.userId;
  var data = req.body;

  User.findByIdAndUpdate(id , { $set: { projectsAwarded: data } }, { new: true }, function (err,user) {

     if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else{
      res.json(user);
    }

  });
 
  
};

/*Find all Bidded/Awarded projects of any user*/

exports.getProjectsById = function(req,res) {

  var id = mongoose.Types.ObjectId(req.params.userId);
  id = JSON.stringify(id);
  // console.log('id:', id);

  // User.findById(id, { projectsAwarded : 1 }).exec(function (err, user) {

  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else{
  //     var data = [];

  //     // console.log('ssss:',user.projectsAwarded);
      
  //     async.eachSeries(user.projectsAwarded, function runProjectBid(value, callback) {
  
  //       Project.find({ '_id' : value.projectId, 'bids.bidId' : value.bidId }, { 'bids.$' : 1 }).exec(function (err, projectBid) {
          
  //         if(projectBid.length !== 0){

  //           var temp = {};

  //           temp = projectBid[0].bids[0];

  //           temp.projectStatus = value.awarded;
  //           var AvgBids = 0;
  //           var oneDay = 24*60*60*1000;
  //           var firstDate = new Date(temp.projectAcceptDate);
  //           firstDate.setDate(firstDate.getDate() + parseInt(temp.deliverInDays));
  //           var secondDate = new Date();
  //           temp.bidDiffDays = Math.round(Math.abs((secondDate.getTime() - firstDate.getTime())/(oneDay)));
  //           // console.log(temp.bidDiffDays);
  //           Project.find({_id: value.projectId}).exec(function (err, bidsLength) {
  //             bidsLength = bidsLength[0];
  //             temp.bidsLength = bidsLength.bids.length;
  //             // if(bidsLength.bids.proposal){
  //             //   temp.mileStoneLength = bidsLength.bids.proposal.milestones.length;
  //             // }
  //             // else{
  //             //   temp.mileStoneLength = 0;
  //             // }

  //             for(var k = 0 ; k<bidsLength.bids.length; k++) {
  //               AvgBids = AvgBids + parseInt(bidsLength.bids[k].yourBid);
  //               if (bidsLength.bids[k].bidId === value.bidId) {
  //                 if(bidsLength.bids[k].proposal){
  //                   temp.mileStoneLength = bidsLength.bids[k].proposal.milestones.length;
  //                 }
  //                 else{
  //                   temp.mileStoneLength = 0;
  //                 }
  //               }
  //             }

  //             var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  //             var lastDate = new Date(bidsLength.created);
  //             lastDate.setDate(lastDate.getDate() + 7);
  //             var startDate = new Date();
  //             var diffDays = Math.round(Math.abs((startDate.getTime() - lastDate.getTime())/(oneDay)));



  //             temp.daysRemaining = diffDays;
  //             temp.projectId = bidsLength._id;
  //             temp.name = bidsLength.userInfo.name;
  //             temp.avgBids = AvgBids;
  //             temp.projectName = bidsLength.name;
  //             temp.currency = bidsLength.currency;
  //             bidsLength = '';
  //             data.push(temp);
  //             callback();
  //           });

  //         }

  //       });
      
  //     }, function allRan(err) {
  //       res.json(data);
  //     });
  //   }
  // });

  Project.find({$and: [ {"bids.bidderInfo.username": req.body.username}]}, function(err, projects){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      // console.log('projectsAwarded:', req.user.projectsAwarded.length);
      // console.log('projects:', projects.length);
      var projectsAwarded = req.user.projectsAwarded;
      var data = [];

      for(var i=0; i<projects.length; i++){
        for(var j=0; j<projectsAwarded.length; j++){
          if(String(projects[i]._id) === String(projectsAwarded[j].projectId)){
            var AvgBids = 0;
            for(var k=0; k<projects[i].bids.length; k++){
              if(projects[i].bids[k].bidId === projectsAwarded[j].bidId){
                //process here
                var temp = {};
                temp = projects[i].bids[k];
                temp.projectStatus = projectsAwarded[j].awarded;
                
                var oneDay = 24*60*60*1000;
                var firstDate = new Date(temp.projectAcceptDate);
                firstDate.setDate(firstDate.getDate() + parseInt(temp.deliverInDays));
                var secondDate = new Date();
                temp.bidDiffDays = Math.round(Math.abs((secondDate.getTime() - firstDate.getTime())/(oneDay)));

                var bidsLength = projects[i];
                temp.bidsLength = bidsLength.bids.length;
                AvgBids = AvgBids + parseInt(projects[i].bids[k].yourBid);
                if(bidsLength.bids[k].proposal){
                  temp.mileStoneLength = bidsLength.bids[k].proposal.milestones.length;
                }else{
                  temp.mileStoneLength = 0;
                }

                var lastDate = new Date(bidsLength.created);
                lastDate.setDate(lastDate.getDate() + 7);
                var startDate = new Date();
                var diffDays = Math.round(Math.abs((startDate.getTime() - lastDate.getTime())/(oneDay)));

                temp.daysRemaining = diffDays;
                temp.projectId = bidsLength._id;
                temp.name = bidsLength.userInfo.username;
                temp.avgBids = AvgBids;
                temp.projectName = bidsLength.name;
                temp.currency = bidsLength.currency;
                bidsLength = '';
                data.push(temp);
              }
            }
          }
        }
      }
      res.json(data);
    }
  });
};

/*Find all projects posted by the user*/
exports.findPostedProjects = function(req,res) {

  var id = mongoose.Types.ObjectId(req.params.userId);

  // console.log('req.params.userId)::', req.params.userId);

  // User.findById(id, { myProjects : 1 }).exec(function (err, user) {

  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else{
  //     var data = [];


  //     // console.log('user::', user.myProjects);

      
  //     async.eachSeries(user.myProjects, function runProjectBid(value, smallback) {
  //       console.log('value:', value);
  
  //       Project.find({ '_id' : value.proj_id}).exec(function (err, projectInfo) {
          
  //         // console.log('projectInfo::', projectInfo[0]);
  //         if(projectInfo[0]){
  //           data.push(projectInfo[0]);
  //         }
  //         smallback();

  //       });
      
  //     }, function allRan(err) {
  //       res.json(data);
  //     });
  //   }
  // });
  // Project.find({ user : id}).exec(function (err, projects) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else{
  //     res.json(projects);
  //   }

  // });

  // get only current projects
  // Project.find({$and: [{ user : id}, { $or: [ {'bids.awarded': 'no'}, {'bids.awarded': 'pending'}, { 'bids': { $size: 0 } }  ]} ]}).exec(function (err, projects) {
    Project.find({$and: [{ user : id}, { $and: [ {'bids.awarded': {$ne:'yes'}}, {'bids.awarded': {$ne:'pending'}} ]} ]}).exec(function (err, projects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else{
      res.json(projects);
    }

  });
};

/*Find all active/past projects of the employer*/
exports.findActivePostedProjects = function(req, res){
  var id = mongoose.Types.ObjectId(req.params.userId);
  // Project.find({$and: [{ user : id}, {'bids.awarded': 'yes'}] }).exec(function (err, projects) {
    Project.find({$and: [{ user : id},  { $or: [ {'bids.awarded': 'yes'}, {'bids.awarded': 'pending'} ]} ] }).exec(function (err, projects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else{
      // console.log('xxxx',projects.length);
      res.json(projects);
    }

  });
};

/*Find all contests posted by the user*/
exports.findPostedContests = function(req,res) {

  var id = mongoose.Types.ObjectId(req.params.userId);

  console.log('req.params.userId:', req.params.userId);

  User.findById(id, { myContests : 1 }).exec(function (err, user) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else{
      var data = [];

      // console.log('user::', user);
      var count =0 ;
      async.eachSeries(user.myContests, function runContest(value, smallback) {
  
        Contest.find({ '_id' : value.cont_id}).exec(function (err, contestInfo) {
          
          count ++;
          console.log('Contest connter::', count);
          if(contestInfo[0]){
            data.push(contestInfo[0]);
          }
          smallback();

        });
      
      }, function allRan(err) {
        res.json(data);
      });
    }
  });
};


 /*
  * Updating userInfo object in Profile
 */
exports.updateUserInfo = function (user){
  var userProfId = user.profile_id;
  Profiles.findByIdAndUpdate(userProfId , { $set: { userInfo: user } }, { new: true }, function (err,profiles) {

  });

};

 // changeProfilePicture 

exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  
  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: '프로필 사진을 업로드하는 중에 오류가 발생했습니다. 파일용량을 2mb이하로 업로드 하십시오'
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                exports.updateUserInfo(user); 
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: '사용자가 로그인하지 않았습니다.'
    });
  }
};

exports.changeCoverPicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.coverUpload).single('newCoverPicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  
  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: '프로필 사진을 업로드하는 중에 오류가 발생했습니다. 파일용량을 2mb이하로 업로드 하십시오'
        });
      } else {
        user.coverImageURL = config.uploads.coverUpload.dest + req.file.filename;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                exports.updateUserInfo(user); 
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: '사용자가 로그인하지 않았습니다.'
    });
  }
};

exports.deletePicture = function (req, res) {
  var user = req.user;
  var message = null;

  var fs = require('fs');
  var path1 = __dirname.split('modules');
  var path2 = req.body.imageURL.split('modules/');
  var imagepath = '';
  var filePath = '';

  if(process.platform ==='win32') {
    imagepath = path1[0].replace(/\\/g,'/');
    filePath = imagepath +'modules\/'+ path2[1];
  }
  else {
    filePath = path1[0] +'modules/' + path2[1];

  }
  console.log(filePath);
  fs.unlinkSync(filePath);
  res.json(filePath);

};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};

/**
 *Phone Verification
 */

// Sending an SMS using the Twilio API
exports.validatePhone = function(req, res){
  // const accountSid = 'ACfa6d141c3581fd73392222670bf50624';    //Inayat's account (demo)
  // const authToken = 'bba07496757c5004b19125d085cc4da5';    //Inayat's account (demo)
  const accountSid = 'AC4036fed3dc5c16f54ce32b927aff0449';
  const authToken = 'eb2bc67f2aacbfbba1204fe8231d01b5';

  // require the Twilio module and create a REST client
  const client = require('twilio')(accountSid, authToken);

  // async generate token and send it to user
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex').substring(0, 4);
        done(err, token, req.user);
      });
    },
    function (token, user, done) {
      user.phoneAuthToken = token;
      user.mobileNumber = req.body.phone;

      // Send message
      console.log('Sending SMS to:', req.body.phone);
      client.messages
        .create({
          to: req.body.phone,
          from: '+18443355297',
          // from: '+16195471227', //Inayat's account (demo)
          body: "안녕하세요 "+user.username+' 회원님, \n 회원님의 인증코드: '+token+' \n 아웃소싱 오케이 고객지원팀 \n https://outsourcingok.com',
        }).then (function(suc){ 
          console.log("twilio Successfull");
          user.save(function (err) {  

            user.password = undefined;
            user.salt = undefined;
            
            res.json(user);
          });
          // res.json(suc);
        }, function(err){
          console.log("twilio error", err);
          res.json(err);
        });
    }

  ], function (err) {
    if (err) {
      return (err);
    }
  });

};

/*
* Update the user
*/
exports.updateUser = function(req, res){
  var id = mongoose.Types.ObjectId(req.params.userId);

  User.findByIdAndUpdate( id , req.body, {new: true}, function (err,user) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(user);
    }
  });
};

/*
* Contact us form
*/
exports.contactUs = function(req, res){
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    host: 'smtp.cafe24.com',
    port: 587,
    secure: false, // use SSL
    auth: {
      user: 'support@outsourcingok.com',
      pass: 'link6412'
    },
    tls:{
      rejectUnauthorized: false
    }
  });

  transporter.sendMail({
    // from: req.body.email, 
    from: req.body.email, 
    to: 'support@outsourcingok.com', 
    subject: 'Contact us - ' + req.body.subject,
    text: req.body.message 
  }, function(err, suc){
    if (err){
      console.log('email not sent');
      res.json(err);
    }else
      console.log('Contact usemail sent');
      res.json(suc);
  });
};

// NICE PAY (Recieve params from API sent from PHP Script)
exports.nicepay = function(req, res) {
  var data =  JSON.parse(JSON.stringify(req.body));

  var LoopbackClient = require('loopback-nodejs-client');
  var loopbackClient = new LoopbackClient('https://admin.outsourcingok.com/api'); 
  var Account = loopbackClient.getModel('accounts');
  var Transaction = loopbackClient.getModel('transactions');

  data.buyerName = data.buyerName.replace(/ /g,'');
  data.amt = parseFloat(data.amt);

  Account.find({ filter: {where: {ownerId: data.buyerName}  }})
    .then(function (acc) { 
      if(acc.length>0){
        var account = acc[0];
        console.log('Account Found:', account);  
        // Update Account
        var updatedAcc = {
          "ownerId": account.ownerId,  
          "creationDate": account.creationDate,
          "accountBalance" :{
            "USD": account.accountBalance.USD,
            "KRW": parseFloat(account.accountBalance.KRW) + data.amt
          }  
        };

        Account.updateAll({
          where: {
            id: account.id
          }
        }, updatedAcc).then(function (updAcc) {
          console.log('account updated:', updAcc);

          // Create Transaction
          Transaction.create({
            description: "나이스페이 입금",
            accountId: account.id,
            transectionType: "credit",
            transectionFrom: "입금",
            amount: data.amt,
            currency: 'KRW'
          })
          .then(function (suc) {
            console.log('Transaction Suc');
            res.json("Transaction Completed");
          })
          .catch(function (err) {
            console.log('Transaction Error');
            res.json("Transaction Error");
          });

        })
        .catch(function (err) {
          console.log(err);
          res.json('Account update Query Error');
        });

      }else{
        res.json('Account NOT Found:');
      }
    })
    .catch(function (err) {
      console.log('Account err:',err);
      res.json('Account Find Error');
    });
};