'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Contest = mongoose.model('Contest'),
 multer = require('multer'),
 Users = mongoose.model('User'),
 nodemailer = require('nodemailer'),
 config = require(path.resolve('./config/config')),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var fs = require('fs');

/*
  Send Email
  */
  exports.searchSkills = function(req,res){
  
  var q = Skills.find({name:new RegExp(req.query.text, 'i')}).limit(100);
  q.exec(function(err,data){
    res.json(data);
  });
  /*Skills.find({name:new RegExp(req.query.text, 'i')}, function (err, data) {
    res.json(data);

  });*/
}
  var emailSending = function (objs, receiverEmail, message, req, res) {


    var template;
    var htmlToSend;
    
    if(objs.notifType === 'contestentry'){

      template = 'modules/contests/server/templates/entry-template.client.view.html';
      fs.readFile(template, 'utf8', function(err, html){
        if(err){
          console.log('fs error:', err);
        }else{
        //var projCurrency =  objs.curSymbol+''+objs.bidAmount;

        // console.log('print', objs);
        htmlToSend = html.replace(/Inayat/g, objs.empName+',');    
        htmlToSend = htmlToSend.replace(/free_name/g, objs.freeName);
        htmlToSend = htmlToSend.replace(/verifyURL/g, objs.url);    
        htmlToSend = htmlToSend.replace(/contest_name/g, objs.contName);
        //htmlToSend = htmlToSend.replace(/bid_amount/g, projCurrency);    

        // console.log('email sending to...:', receiverEmail );

        transporter.sendMail({
          from: '"OutSourcingOk" <no-reply@outsourcingok.com>', 
          to: receiverEmail, 
          subject: 'OutSourcingOk - ' + message, 
          // text: message 
          html: htmlToSend
        }, function(err, suc){
          if (err){
            console.log('email not sent');
            return false;
          }else
          console.log('email sent');
          return;
        });

      }
    });
    }



  // var transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: 'peek.inayat@gmail.com',
  //     pass: '03114186603'
  //   }
  // });
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    host: 'smtp.cafe24.com',
    port: 587,
    secure: false, // use SSL
    // debug: true,
    auth: {
      user: 'no-reply@outsourcingok.com',
      pass: 'link6412'
    },
    tls:{
      rejectUnauthorized: false
    }
  });

  // var mailOptions = {
  //   from: '"OutSourcingOk" <no-reply@outsourcingok.cafe24.com>', // sender address
  //   to: receiverEmail, // list of receivers
  //   subject: 'OutSourcingOk - '+message, // Subject line
  //   text: message // plaintext body
  // };  

  transporter.sendMail({
    from: '"OutSourcingOk" <no-reply@outsourcingok.com>', // sender address
    to: receiverEmail, // list of receivers
    subject: 'OutSourcingOk - '+message, // Subject line
    text: message // plain text body
  }, function(err, suc){
    if (err){
      // res.json(err);
      console.log('email not sent');
      return;
    }else
      // res.json('suc');
      console.log('email sent');
      return;
    });

  // send mail with defined transport object
  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     //console.log('Email error',error);
  //     return false;
  //     // return res.status(400).send({
  //     //   message: 'Email could not been sent.'
  //     // });

  //   } else {
  //     //console.log('Message sent: ' + info.response);
  //     transporter.close();
  //     mailOptions = '';  
  //     return false;
  
  //   }
  // }); 

};
  // dynamic pagination get page data 
exports.dynamicPagination = function(req,res){
  var skip = parseInt(req.params.size) * (parseInt(req.params.page) -1);
  var size = parseInt(req.params.size);
  Contest.find({}).skip(skip).limit(size).sort('-created').populate('user', 'displayName').exec(function(err,data){
    if(err) throw err;
    res.json(data);
  })
  
}
// count all contest record to make pagination
exports.countContestRecord = function(req,res){
  Contest.count({},function(err,count) {
    res.json(count);
  } )
}
// search contest through name and descrioption
exports.searchWord = function(req,res){
  Contest.find({$or:[{name:new RegExp(req.params.word, 'i')},{description:new RegExp(req.params.word, 'i')}]}, function (err, data) {
    res.json(data);

  });
}

/**
 * Create a contest
 */
 exports.create = function (req, res) {
  var contest = new Contest(req.body);
  // var contest = req.body;
  contest.$resolved = undefined;
  contest.$promise = undefined;
  contest.user = req.user;


  // Contest.create(contest, function(err, contest) {
    contest.save(function (err) {
      if (err) {
        console.log('err:', err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
      // Populate myContests and newsFeed in userSchema
      var user_id = contest.user._id;

      var cont = {
        'cont_id': contest._id,
        'cont_name': contest.name
      };

      var news = {
        'contest_id': contest._id,
        'contest_name': contest.name,
        'date': Date.now(),
        'contest': true,
        'postContest': true 
      };

      Users.findByIdAndUpdate({ '_id': user_id }, { $push: { 'myContests' : cont, 'newsFeed' : news  } }, { new: true }, function (err,user) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          // res.json(user);           
        }
      });
      res.json(contest);
    }
  });
  };

/**
 * Show the current contest
 */
 exports.read = function (req, res) {
  res.json(req.contest);
};

/**
 * Update a contest
 */
 exports.update = function (req, res) {
  // console.log('update contest');
  var obj = req.body;
  var id = mongoose.Types.ObjectId(req.params.contestId);
  var username = req.body.entries.entryPersonUsername;
  var entryPersonUserId = req.body.entries.entryPersonUserId;

  var entryIdd = mongoose.Types.ObjectId();
  entryIdd = entryIdd.toString();
  obj.entries.entryId = entryIdd;

  Contest.findByIdAndUpdate(id , { $push: obj }, { new: true }, function (err,contest) {
    if (err) {
      console.log('1 entry upload:', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      //update the user, fill contests awarded array in USER
      var contestInfo = {
        'cont_id': contest._id,
        'cont_name': contest.name
      };

      var news = {
        'contest_id': contest._id,
        'contest_name': contest.name,
        'date': Date.now(),
        'contest': true,
        'entryUpload': true 
      };

      Users.findByIdAndUpdate({ '_id': entryPersonUserId }, { $push: { 'contestsAwarded' : contestInfo, 'newsFeed' : news  } }, { new: true }, function (err,user) {
        if (err) {
          console.log('1 entry upload:', err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          // when an entry is placed, send email to employer
          var email = contest.userInfo.email;
          var message = username + ' 님이 "' + contest.name + '" 콘테스트에 \n 지원 업로드 하였습니다. 아래의 링크를 클릭하시면 이동합니다.\n'; 

          var url = 'https://outsourcingok.com/contests/view/' + id;

          var objs = {
            'contest': contest,
            'user': user,
            'url': url,
            'receiverEmail': email,
            'empName': contest.userInfo.username,
            'freeName': username,    
            'contName': contest.name,
            'notifType': 'contestentry'
          };
          
          emailSending(objs, email , message);

          res.json(contest);         
        }
      });

      
    }
  });
};


/**
 * Update contest
 */
 exports.updateContest = function (req, res) {

  // Remove $promise and $ resolve 
  // if(req.body.projectsAwarded.length){
  //   for(var i=0; i<req.body.projectsAwarded.length; i++){
  //     if(req.body.projectsAwarded[i]. $promise || req.body.projectsAwarded[i]. $resolved){
  //       delete req.body.projectsAwarded[i].$promise
  //       delete req.body.projectsAwarded[i].$resolved
  //     }
  //   }
  // }
  req.body.userInfo = req.user;

  var id = mongoose.Types.ObjectId(req.params.contestId);
  Contest.findByIdAndUpdate( {user: req.user._id, _id: id }, req.body, {new: true}, function (err,contest) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contest);
    }
  });

};


/**
 * Delete an contest
 */
 exports.delete = function (req, res) {
  var contest = req.contest;

  contest.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contest);
    }
  });
};

/**
 * List of Contests
 */
 exports.list = function (req, res) {
  Contest.find().sort('-created').populate('user', 'displayName').limit(5).exec(function (err, contests) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contests);
    }
  });
};


exports.uploadContestFile = function (req, res) {
  var message = null;
  var upload = multer(config.uploads.contestFileUpload).single('newContestFile');

  upload(req, res, function (uploadError) {
    if(uploadError) {
      console.log('uploadError', uploadError);
      return res.status(400).send({
        message: '파일을 업로드하는 중에 오류가 발생했습니다.'
      });
    } else {
      var fileURL = config.uploads.contestFileUpload.dest + req.file.filename;
      return res.json(fileURL);
    }
  });
};

/**
 * Contest middleware
 */
 exports.contestByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: '콘테스트에 문제가 발생했습니다.'
    });
  }

  Contest.findById(id).populate('user', 'displayName').exec(function (err, contest) {
    if (err) {
      return next(err);
    } else if (!contest) {
      return res.status(404).send({
        message: '해당 콘테스트를 찾을 수 없습니다.'
      });
    }
    req.contest = contest;
    next();
  });
};

/*Accept the entry of contest*/
exports.makeThisWinnerServer = function (req, res) {
  var obj = req.body;
  // //console.log('xxxx', obj);

  var email = req.body.userEmail;
  var contestId = req.body.contestId;
  var entryId = req.body.entryId;
  var index = req.body.index;

  entryId = entryId.toString();
  Contest.findOneAndUpdate({ '_id' : contestId, 'entries.entryId': entryId } , { $set : { 'entries.$.youWinner' : 'yes', 'contestStatus' : 'closed' } }, { new: true },function (err,contest) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // when an entry is accepted, send email to freelancer
      var message = contest.userInfo.username + ' 님이 "' + contest.name + '" 콘테스트에 선정되었습니다. \n 아래의 링크를 클릭하시면 이동합니다.\n https://outsourcingok.com/contests/view/' + contest._id;
      emailSending(email, message);
      res.json(contest);
    }
  });
  
};

/*Comment on entry of Contest*/
exports.commentOnEntry = function (req, res) {
  var id = mongoose.Types.ObjectId(req.params.contestId);
  
  Contest.findOneAndUpdate({ '_id' : id,  } , { $push : { 'comments' : req.body } }, { new: true },function (err,contest) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contest);
    }
  });
  
};

/*
*  getAllActiveContests where you have uploaded entry
*/
exports.getAllActiveContests = function(req, res){
  // db.contests.find({ entries: { $elemMatch: {'entryPersonUsername':'inayatt'} } }).pretty()
  var userId = req.body.userId;
  Contest.find({ $and: [ {entries: { $elemMatch: { 'entryPersonUserId': userId }}}, {contestStatus: { $exists: false}} ]}, function(err, contests){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      res.json(contests);
    }
  });
};

/*
*  getAllPastContests where you have uploaded entry
*/
exports.getAllPastContests = function(req, res){
  // db.contests.find({ entries: { $elemMatch: {'entryPersonUsername':'inayatt'} } }).pretty()
  var userId = req.body.userId;
  Contest.find({ $and: [ {entries: { $elemMatch: { 'entryPersonUserId': userId, 'youWinner': 'yes' }}}, {contestStatus: {$exists: true}}]}, function(err, contests){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      res.json(contests);
    }
  });
};

/*
*  getAllMyContests which you have posted
*/
exports.getAllMyContests = function(req, res){
  // db.contests.find({ entries: { $elemMatch: {'entryPersonUsername':'inayatt'} } }).pretty()
  var userId = req.body.userId;
  Contest.find({ $and: [{user: userId},{ contestStatus: { $exists: false} } ]}, function(err, contests){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      res.json(contests);
    }
  });
};

/*
*  getAllMyContests which you have posted
*/
exports.getAllContestsAwarded = function(req, res){
  // db.contests.find({ entries: { $elemMatch: {'entryPersonUsername':'inayatt'} } }).pretty()
  var userId = req.body.userId;
  Contest.find({ $and: [ {user: userId}, {contestStatus: 'closed'} ]}, function(err, contests){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      res.json(contests);
    }
  });
};

/*
* updateForHandOver (adding handover file)
*/
exports.updateForHandOver = function(req, res){
  Contest.findByIdAndUpdate({'_id': req.body.contestId}, {$set:{ handOverFileLink: req.body.handOverFileLink, handOverFileName: req.body.handOverFileName }}, function(err, contest){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      res.json(contest);
    }
  });
};

/*
* Get Similar Contests)
*/
exports.similarcontest = function(req, res){
  Contest.find({}, function(err, similarcontests){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{

      Contest.find({contestStatus: 'closed'}, function(err, completedContests){
        if(err){
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }else{
          var obj ={
            'similar': similarcontests,
            'completed': completedContests
          };

          res.json(obj);
        }
      }).limit(5).sort({created: -1});

    }
  }).limit(5).sort({created: -1});

};
