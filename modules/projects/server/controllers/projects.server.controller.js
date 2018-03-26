'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  schedule = require('node-schedule'),
  Project = mongoose.model('Project'),
  AsyncLock = require('node-async-locks').AsyncLock,
  Users = mongoose.model('User'),
  Profiles = mongoose.model('Profiles'),
  ObjectID = require('mongodb').ObjectID,
  multer = require('multer'),
  nodemailer = require('nodemailer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a project
 */

var lock = new AsyncLock();

var fs = require('fs');
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


var emailSending = function (objs, receiverEmail, message, req, res) {

  var template;
  var htmlToSend;
  
  if(objs.notifType === 'projectBid'){

    template = 'modules/projects/server/templates/bid-template.client.view.html';
    fs.readFile(template, 'utf8', function(err, html){
      if(err){
        console.log('fs error:', err);
      }else{
        var projCurrency =  objs.curSymbol+''+objs.bidAmount;

        // console.log('print', objs);
        htmlToSend = html.replace(/Inayat/g, objs.empName+',');    
        htmlToSend = htmlToSend.replace(/free_name/g, objs.freeName);
        htmlToSend = htmlToSend.replace(/verifyURL/g, objs.url);    
        htmlToSend = htmlToSend.replace(/project_name/g, objs.projName);
        htmlToSend = htmlToSend.replace(/bid_amount/g, projCurrency);    

        // console.log('email sending to...:', receiverEmail );

        transporter.sendMail({
          from: '"OutSourcingOk" <no-reply@outsourcingok.cafe24.com>', 
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
  else if(objs.notifType === 'projectAward'){

    template = 'modules/projects/server/templates/projectAwarded-template.client.view.html';

    fs.readFile(template, 'utf8', function(err, html){
      if(err){
        console.log('fs error:', err);
      }else{

        // console.log('print', objs);
        htmlToSend = html.replace(/Inayat/g, objs.freeName+',');    
        htmlToSend = htmlToSend.replace(/emplyee/g, objs.empName);
        htmlToSend = htmlToSend.replace(/verifyURL/g, objs.url);    
        htmlToSend = htmlToSend.replace(/project_name/g, objs.projectName);
        // htmlToSend = htmlToSend.replace(/bid_amount/g, projCurrency);    

        // console.log('email sending to...:', receiverEmail );

        transporter.sendMail({
          from: '"아웃소싱오케이" <no-reply@outsourcingok.cafe24.com>', 
          to: receiverEmail, 
          subject: '아웃소싱오케이 - ' + message, 
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
  else if(objs.notifType === 'projectAccept'){

    template = 'modules/projects/server/templates/projectAccept-template.client.view.html';

    fs.readFile(template, 'utf8', function(err, html){
      if(err){
        console.log('fs error:', err);
      }else{

        // console.log('print', objs);
        htmlToSend = html.replace(/Inayat/g, objs.empName+',');
        htmlToSend = htmlToSend.replace(/free_name/g, objs.freeName);
        htmlToSend = htmlToSend.replace(/proj_name/g, objs.projectName);
        htmlToSend = htmlToSend.replace(/verifyURL/g, objs.url); 
        // htmlToSend = htmlToSend.replace(/bid_amount/g, projCurrency);    

        // console.log('email sending to...:', receiverEmail );

        transporter.sendMail({
          from: '"아웃소싱오케이" <no-reply@outsourcingok.cafe24.com>', 
          to: receiverEmail, 
          subject: '아웃소싱오케이 - ' + message, 
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
  else if(objs.notifType === 'projectReject'){

    template = 'modules/projects/server/templates/projectReject-template.client.view.html';

      fs.readFile(template, 'utf8', function(err, html){
        if(err){
          console.log('fs error:', err);
        }else{

          // console.log('print', objs);
          htmlToSend = html.replace(/Inayat/g, objs.empName+',');
          htmlToSend = htmlToSend.replace(/proj_name/g, objs.projectName);
          htmlToSend = htmlToSend.replace(/verifyURL/g, objs.url); 
          // htmlToSend = htmlToSend.replace(/bid_amount/g, projCurrency);    

          // console.log('email sending to...:', receiverEmail );

          transporter.sendMail({
            from: '"아웃소싱오케이" <no-reply@outsourcingok.cafe24.com>', 
            to: receiverEmail, 
            subject: '아웃소싱오케이 - ' + message, 
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
  else if(objs.notifType === 'requestMS'){

    template = 'modules/projects/server/templates/milestone-request-template.client.view.html';

      fs.readFile(template, 'utf8', function(err, html){
        if(err){
          console.log('fs error:', err);
        }else{

          // console.log('print', objs);
          htmlToSend = html.replace(/Inayat/g, objs.empName+',');
          htmlToSend = htmlToSend.replace(/free_name/g, objs.freeName);
          htmlToSend = htmlToSend.replace(/project_name/g, objs.projectName);
          htmlToSend = htmlToSend.replace(/milestone_amount/g, objs.currency+objs.milestoneAmount);
          htmlToSend = htmlToSend.replace(/milestone_des/g, objs.milestonesDes);
          htmlToSend = htmlToSend.replace(/verifyURL/g, objs.url); 
          // htmlToSend = htmlToSend.replace(/bid_amount/g, projCurrency);    

          // console.log('email sending to...:', receiverEmail );

          transporter.sendMail({
            from: '"아웃소싱오케이" <no-reply@outsourcingok.cafe24.com>', 
            to: receiverEmail, 
            subject: '아웃소싱오케이 - ' + message, 
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
  else if(objs.notifType === 'createMS'){

    template = 'modules/projects/server/templates/milestone-create-template.client.view.html';
    
    fs.readFile(template, 'utf8', function(err, html){
      if(err){
        console.log('fs error:', err);
      }else{

        // console.log('print', objs);
        htmlToSend = html.replace(/Inayat/g, objs.freeName+',');
        htmlToSend = htmlToSend.replace(/emp_name/g, objs.empName);
        htmlToSend = htmlToSend.replace(/proj_name/g, objs.projectName);
        htmlToSend = htmlToSend.replace(/milestone_amount/g, objs.currency+objs.milestoneAmount);
        htmlToSend = htmlToSend.replace(/milestone_des/g, objs.milestonesDes);
        htmlToSend = htmlToSend.replace(/verifyURL/g, objs.url); 
        // htmlToSend = htmlToSend.replace(/bid_amount/g, projCurrency);    

        // console.log('email sending to...:', receiverEmail );

        transporter.sendMail({
          from: '"아웃소싱오케이" <no-reply@outsourcingok.cafe24.com>', 
          to: receiverEmail, 
          subject: '아웃소싱오케이 - ' + message, 
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
  else if(objs.notifType === 'releaseMS'){

    template = 'modules/projects/server/templates/milestone-release-template.client.view.html';
    
    fs.readFile(template, 'utf8', function(err, html){
      if(err){
        console.log('fs error:', err);
      }else{

        // console.log('print', objs);
        htmlToSend = html.replace(/Inayat/g, objs.freeName+',');
        htmlToSend = htmlToSend.replace(/emp_name/g, objs.empName);
        htmlToSend = htmlToSend.replace(/proj_name/g, objs.projectName);
        htmlToSend = htmlToSend.replace(/milestone_amount/g, objs.currency+objs.milestoneAmount);
        htmlToSend = htmlToSend.replace(/verifyURL/g, objs.url); 
        // htmlToSend = htmlToSend.replace(/bid_amount/g, projCurrency);    

        // console.log('email sending to...:', receiverEmail );

        transporter.sendMail({
          from: '"아웃소싱오케이" <no-reply@outsourcingok.cafe24.com>', 
          to: receiverEmail, 
          subject: '아웃소싱오케이 - ' + message, 
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
  else if(objs.notifType === 'empRating'){

    template = 'modules/projects/server/templates/empRating-template.client.view.html';
    
    fs.readFile(template, 'utf8', function(err, html){
      if(err){
        console.log('fs error:', err);
      }else{

        // console.log('print', objs);
        htmlToSend = html.replace(/Inayat/g, objs.empName+',');
        htmlToSend = htmlToSend.replace(/user_name/g, objs.freeName+',');   

        transporter.sendMail({
          from: '"아웃소싱오케이" <no-reply@outsourcingok.cafe24.com>', 
          to: receiverEmail, 
          subject: '아웃소싱오케이 - ' + message, 
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
  else if(objs.notifType === 'userRating'){

    template = 'modules/projects/server/templates/userRating-template.client.view.html';
    
    fs.readFile(template, 'utf8', function(err, html){
      if(err){
        console.log('fs error:', err);
      }else{

        // console.log('print', objs);
        htmlToSend = html.replace(/Inayat/g, objs.freeName+',');
        htmlToSend = htmlToSend.replace(/user_name/g, objs.empName+',');   

        transporter.sendMail({
          from: '"아웃소싱오케이" <no-reply@outsourcingok.cafe24.com>', 
          to: receiverEmail, 
          subject: '아웃소싱오케이 - ' + message, 
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
  else if(objs.notifType === 'dispute'){

    template = 'modules/projects/server/templates/dispute-template.client.view.html';
    
    fs.readFile(template, 'utf8', function(err, html){
      if(err){
        console.log('fs error:', err);
      }else{

        // console.log('print', objs);
        htmlToSend = html.replace(/Inayat/g, objs.freeName+',');
        htmlToSend = htmlToSend.replace(/emp_name/g, objs.empName);

        transporter.sendMail({
          from: '"아웃소싱오케이" <no-reply@outsourcingok.cafe24.com>', 
          to: receiverEmail, 
          subject: '아웃소싱오케이 - ' + message, 
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
  else{
    console.log('이메일을 보내지 못했습니다!');
  }
  // var transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: 'peek.inayat@gmail.com',
  //     pass: '03114186603'
  //   }
  // });


  // var mailOptions = {
  //   from: '"OutSourcingOk" <no-reply@outsourcingok.cafe24.com>', // sender address
  //   to: receiverEmail, // list of receivers
  //   subject: 'OutSourcingOk - ' + message, // Subject line
  //   text: message // plaintext body
  // };  

  // send mail with defined transport object 
  // if(notif === true){
  //   console.log('email sending to...:', receiverEmail );
  //   transporter.sendMail({
  //     from: '"OutSourcingOk" <no-reply@outsourcingok.com>', 
  //     to: receiverEmail, 
  //     subject: 'OutSourcingOk - ' + message, 
  //     text: message 
  //   }, function(err, suc){
  //     if (err){;
  //       console.log('email not sent');
  //       return false;
  //     }else
  //       console.log('email sent');
  //       return;
  //   });

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     return false;
    //     // return res.status(400).send({
    //     //   message: 'Email could not  sent.'
    //     // });

    //   } else {
    //     transporter.close();
    //     mailOptions = '';  
    //     return true;
        
    //   }
    // }); 
  

};

exports.create = function (req, res) {
  var project = new Project(req.body);
  project.user = req.user;
  project.userInfo.myProjects = undefined;
  project.userInfo.projectsAwarded = undefined;
  project.userInfo.contestsAwarded = undefined;
  project.userInfo.myContests = undefined;
  project.userInfo.newsFeed = undefined;
  // project.currency = 
  project.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var someDate = new Date(project.created);
    
      someDate.setMinutes(someDate.getDate()+15);
      
      var j = schedule.scheduleJob(someDate, function(){
        var id = mongoose.Types.ObjectId(project._id);
        Project.findByIdAndUpdate(id , { $set: { 'status': 'inactive' } }, { new: true }, function (err,project) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            // ////console.log('helll');
            // res.json(project);
          }
        });
      });


      var user_id = project.user._id;

      var proj = {
        'proj_id': project._id,
        'proj_name': project.name
      };

      Users.findByIdAndUpdate({ '_id': user_id }, { $push: { 'myProjects' : proj} }, { new: true }, function (err,user) {
        if (err) {
          // ////console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {

          // ////console.log('Only User:');
          
          // res.json(user);           
        }
      });

      res.json(project);
    }
  });
};


/**
 * Show the current project
 */
exports.read = function (req, res) {
  res.json(req.project);
};

/**
 * Update a project
 */
exports.update = function (req, res) {
  // console.log('Project Updating...', req.project.name);
  // console.log('Project Updating...', req.project.description);
  // var project = req.project;
  // project.status = req.body.status;

  // project.update(function (err) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(project);
  //   }
  // });

  var obj = req.body;
  var id = mongoose.Types.ObjectId(req.params.projectId);

  Project.findByIdAndUpdate( id , req.body, {new: true}, function (err,project) {
    if (err) {
       console.log('project update', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(project);
    }
  });

};

exports.updateProjectSpecificField = function (req, res) {

  
  var id = mongoose.Types.ObjectId(req.params.projectId);
  var obj = req.body;
  
  Project.findByIdAndUpdate(id , { $set: obj }, { new: true }, function (err,project) {
    if (err) {
      ////console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } 
    else {
      ////console.log(project);
      res.json(project);
    }
  });
  
};

exports.manageDispute = function (req, res) {

  
  var id = mongoose.Types.ObjectId(req.params.projectId);
  var obj = {
    'dispute' : req.body.dispute
  };

  var status = req.body.status;
  if(status === 'disputeCreated')
  obj.dispute.createdDateServer = Date.now();
  
  Project.findByIdAndUpdate(id , { $set: obj }, { new: true }, function (err,project) {
    if (err) {
      ////console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } 
    else {
      //////console.log(project);
      if(status === 'disputeCreated') {
        var someDate = new Date(project.dispute.createdDateServer);
        // ////console.log('hi--- ',someDate.getMinutes());
        someDate.setDate(someDate.getDate()+15);

        ////console.log(someDate);

        var j = schedule.scheduleJob(project._id.toString(),someDate, function(){
          
          // request.post('https://203.99.61.173:3030/explorer/transaction', {
          //   Sid: project.dispute.disputeCreatedfor.toString(),
          //   Rid: project.dispute.disputeCreatedBy.toString(),
          //   amount: project.dispute.totalDisputedAmount,
          //   currency: 'USD'
          // });

        });

        var userId = mongoose.Types.ObjectId(project.dispute.disputeCreatedfor);
        Users.findById({ '_id' : userId },{ email : 1 }).exec(function (err,user) {
          if (err) {
            // ////console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            ////console.log(user);
            var message = '회원님께서 프로젝트 대금을 거절하셨습니다.' + '\n 자세한 내용은 다음 링크를 통해서 확인하시기 바랍니다. \n';
            var url = 'https://outsourcingok.com/projects/dispute/' + project._id;
              // emailSending(true, user.email, message , req, res );
              var objsDispute = {
                'url': url,
                'empName': project.userInfo.username,
                'freeName':user.username,
                'notifType': 'dispute',
              };
              emailSending(objsDispute, user.email, message , req, res );
             
          }
        });

        
    }
    else if(status === 'ProceedToTab3') {

      var my_job = schedule.scheduledJobs[id.toString()];

      if(my_job) {
        my_job.cancel();
      }
      var userPaySecond = '';
      if( project.dispute.disputeCreatedfor.toString() === project.dispute.userPayFirst.toString()) {
        userPaySecond = project.dispute.disputeCreatedBy.toString();
      }
      else if (project.dispute.disputeCreatedBy.toString() === project.dispute.userPayFirst.toString()){
        userPaySecond = project.dispute.disputeCreatedfor.toString();
      }

        var someDate2 = new Date(project.dispute.createdDateServer);
        // ////console.log('hi--- ',someDate2.getMinutes());
        someDate2.setDate(someDate2.getDate()+4);

        var uniqueName = project._id.toString();
        var k = schedule.scheduleJob(project._id.toString(),someDate2, function(){
          
          // request.post('https://203.99.61.173:3030/explorer/transaction', {
          //   Sid: userPaySecond,
          //   Rid: project.dispute.userPayFirst.toString(),
          //   amount: project.dispute.totalDisputedAmount,
          //   currency: 'USD'
          // });

        });

    }

    else if(status === 'ProceedToTab4') {

      var job = schedule.scheduledJobs[id.toString()];

      if(job) {
        job.cancel();
      }

      Project.findByIdAndUpdate(id , { $set: obj }, { new: true }, function (err,project) {
        if (err) {
          ////console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } 
        else {
         //here we have to send email.
        }
      });
    }

    else if(status === 'cancelled') {

      var job2 = schedule.scheduledJobs[id.toString()];

      if(job2) {
        job2.cancel();
      }
      //here we have to send email.
    }

    else if(status === 'offerAccepted') {

      var job3 = schedule.scheduledJobs[id.toString()];

      if(job3) {
        job3.cancel();
      }
      //here we have to send email.
    }

      res.json(project);
    }
  });
  
};

exports.manageDisputeComments = function (req, res) {

  
  var id = mongoose.Types.ObjectId(req.params.projectId);
  var obj = req.body.data;
  var tab = req.body.tab;

  var my_job = schedule.scheduledJobs[id.toString()];

  if(my_job) {
    if(obj.id.toString() === req.project.dispute.disputeCreatedfor.toString()){
      my_job.cancel();
      ////console.log('-------------------------------------');
    }
  }

  if(tab === 2) {
    Project.findByIdAndUpdate(id , { $push: {'dispute.tab2Comments' : obj} }, { new: true }, function (err,project) {
      if (err) {
        ////console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } 
      else {
        res.json(project);
      }
    });
  }
  else if(tab === 3)  {
    Project.findByIdAndUpdate(id , { $push: {'dispute.tab3Comments' : obj} }, { new: true }, function (err,project) {
      if (err) {
        ////console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } 
      else {
        res.json(project);
      }
    });
  }
  
  
};


/**
 * Delete an project
 */
exports.delete = function (req, res) {
  var project = req.project;

  project.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(project);
    }
  });
};
/**
 * Total Projects
 */
exports.totalProjects = function (req, res) {
  Project.count({}, function(err, count){
    if(err){
      return res.status(400).send({
        message: err
      });
    }else{
      var data ={
        count: count, 
      };
      res.json(data);
    }
  });
};
/**
 * List of Projects
 */
exports.list = function (req, res) {
  var skip = parseInt(req.params.size * (req.params.page_num-1));
  var limit = parseInt(req.params.size);

  Project.find({},'_id name description skills bids.bidId created currency.symbol_native minRange maxRange projectRate user status additionalPakages')
  .skip(skip)
  .limit(limit)
  .sort('-created')
  .lean()
  .exec(function(err, projects) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else { 
      var data ={
        count: projects.length,
        projects: projects
      };
      res.json(data); 
    }
  });
};

exports.placeBid = function (req, res) {
  console.log('place bid');
  if (req.user.remainingBids > 0) {
    lock.enter(function (token) {
      var obj = req.body;
      obj.bids.bidId = new ObjectID().toString();
      var id = mongoose.Types.ObjectId(req.params.projectId);

      Project.findByIdAndUpdate(id , { $push: {bids: obj.bids} }, { new: true }, function (err,project) {
        if (err) {
          console.log('1 err:', err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } 
        else {
          var userId = mongoose.Types.ObjectId(obj.bids.userId);
          var news = {
            'bidderId': obj.bids.userId,
            'bidderName': obj.bids.bidderName,
            'bidderImage': obj.bids.bidderImageURl,
            'bidId': obj.bids.bidId,
            'projectId': project._id,
            'projectName': project.name,
            'activity': 'Bidded',
            'date': Date.now() 
          };
      
          var information = {
            'projectId' :  id,
            'bidId' : obj.bids.bidId,
            'bidPrice' : obj.bids.yourBid,
            'awarded' : 'no'
          };

          Users.update({ '_id' : userId } , { $push: { 'projectsAwarded' : information, 'newsFeed' : news }, $inc : { 'remainingBids' : -1 } }, { new: true }, function (err,user) {
            if (err) {
              console.log('2 err:', err);
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              /*For NewsFeed on dashboard*/ 
              Users.findById({ '_id' : userId }, function (err,user) {
                if (err) {
                  console.log('1 err:', err);
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                   lock.leave(token); 
          		   //console.log('freelancer:', user);
          		   Users.find({username: project.userInfo.username}, function(err, employer){
                    if(err){
                      console.log('1 err:', err);
                      return false;
                      // return res.status(400).send({
                      //   message: errorHandler.getErrorMessage(err)
                      // });
                    }else{
		                  // console.log('emp:', employer);
                      var message = '프리랜서가 회원님의 프로젝트에 지원/입찰 하였습니다.' + '\n 자세한 내용은 다음 링크를 통해서 확인하시기 바랍니다. \n';
                      var url = 'https://outsourcingok.com/projects/project-manage/' + project._id;

                        if(employer[0].notificationsOnOff.bidRetracted)
                          // emailSending(employer[0].notificationsOnOff.bidRetracted, project.userInfo.email, req, res );  
                          {
                            var objs = {
                              'project': project,
                              'user': user,
                              'url': url,
                              'receiverEmail': project.userInfo.email,
                              'empName': project.userInfo.username,
                              'freeName': news.bidderName,
                              'bidAmount': information.bidPrice,
                              'curSymbol': project.currency.symbol,
                              'projName': project.name,
                              'notifType': 'projectBid'
                            };
                            emailSending(objs, project.userInfo.email, message, req, res);
                        } 
                    }
                  });
                
		              var obj = {
                    'project': project,
                    'user': user
                  };
                  res.json(obj);
                   
                }
              });
              // ////console.log('updated user:', user);

              // res.json(project);
              // lock.leave(token);   
            }
          });
        }
      });
    });
  }
  else{
    res.json('Please recharge your bids!');
  }

};

//user Rating
 var userRatting = function (userTobeRatedId, label) {
    ////console.log('userRatting is called ');

    Users.findById(userTobeRatedId).exec(function (err, userTobeRatedd) {
      if (err) {
        ////console.log('error');
      } else {
        var userTobeRated = userTobeRatedd;
        //when its employee
        if(label === 'rateFreelancer')
        {
          ////console.log('its rateFreelancer is callED');
          //rating formula
          var userRatting1 = 0;
          var sumOfPrice = 0;
          var counter = 0;
          for(var i =0; i<userTobeRated.projectsAwarded.length; i++) {
              if(userTobeRated.projectsAwarded[i].rateYesNo === 'include' && typeof(userTobeRated.projectsAwarded[i].feedback) !=='undefined')
               { counter = counter + 1;
                userRatting1 = userRatting1 + (userTobeRated.projectsAwarded[i].bidPrice*userTobeRated.projectsAwarded[i].feedback.avgRating);
                sumOfPrice = sumOfPrice + userTobeRated.projectsAwarded[i].bidPrice;
              }          
          }
          var finalUserRattingBaseOnProjectAwarded = userRatting1/sumOfPrice;
          var noOfReviewBaseOnProjectAwarded = counter;
          
          ////console.log('finalUserRattingBaseOnProjectAwarded', finalUserRattingBaseOnProjectAwarded);
          ////console.log('noOfReviewBaseOnProjectAwarded', noOfReviewBaseOnProjectAwarded);
          Users.findByIdAndUpdate(userTobeRated  , { $set  : {finalUserRattingBaseOnProjectAwarded:finalUserRattingBaseOnProjectAwarded, noOfReviewBaseOnProjectAwarded:noOfReviewBaseOnProjectAwarded} }, { new : true } , function (err, userLater) {
            if (err) {
              return;
              // return res.status(400).send({
              //   message: errorHandler.getErrorMessage(err)
              // });
            } 
            else {
              return;
            }
          });

          //update profile
          var profileId = mongoose.Types.ObjectId(userTobeRated.profile_id);
          ////console.log('profileId', profileId);
          Profiles.findByIdAndUpdate(profileId  , { $set  : {finalUserRattingBaseOnProjectAwarded:finalUserRattingBaseOnProjectAwarded, noOfReviewBaseOnProjectAwarded:noOfReviewBaseOnProjectAwarded} }, { new : true } , function (err, userLater) {
           if (err) {
             ////console.log('EEEEEEEEEEErrror to update profile');
             
           } else {
              // ////console.log(userLater);
           }
          });
          }

        
        //when its bidder 
        else if(label === 'rateEmployee')
        {
          ////console.log('its rateEmployee is callED');
          var userRatting2 = 0;
          var sumOfPrice2 = 0;
          var counter2 = 0;
          var a = 0;
          for(a; a<userTobeRated.myProjects.length; a++) {
            if(userTobeRated.myProjects[a].rateYesNo === 'include' && typeof(userTobeRated.myProjects[a].feedback) !=='undefined')
             { 
              counter2 = counter2 + 1;
              userRatting2 = userRatting2 + (userTobeRated.myProjects[a].bidPrice*userTobeRated.myProjects[a].feedback.avgRating);
              sumOfPrice2 = sumOfPrice2 + userTobeRated.myProjects[a].bidPrice;
            }
          }

          var finalUserRattingBaseOnMyProject = userRatting2/sumOfPrice2;
          var noOfReviewBaseOnMyProject = counter2;
          ////console.log('finalUserRattingBaseOnMyProject', finalUserRattingBaseOnMyProject);
          ////console.log('noOfReviewBaseOnMyProject', noOfReviewBaseOnMyProject);

          Users.findByIdAndUpdate(userTobeRated  , { $set  : {finalUserRattingBaseOnMyProject:finalUserRattingBaseOnMyProject, noOfReviewBaseOnMyProject:noOfReviewBaseOnMyProject} }, { new : true } , function 
(err, userLater) {
            if (err) {
              // ////console.log('EEEEEEEEEError in myProjects');
            } 
            else{
              return;
            }
          });
          //update profile
          var profileId2 = mongoose.Types.ObjectId(userTobeRated.profile_id);
          ////console.log('profileId2', profileId2);
          Profiles.findByIdAndUpdate(profileId2  , { $set  : {finalUserRattingBaseOnMyProject:finalUserRattingBaseOnMyProject, noOfReviewBaseOnMyProject:noOfReviewBaseOnMyProject} }, { new : true } , function 
(err, userLater) {
            if (err) {
                ////console.log('EEEEEEEEEError to update profile');
            } else {
               // ////console.log(userLater);
            }
          });
        }  

      }
     
    });  
};
//place feedback
exports.placeFeedBack = function (req, res) {

  ////console.log('placeFeedBack');

  var dataa = req.body.bids;
  var projectIdd = req.body.projectId;
  var index = req.body.index;
  var bidderId = req.body.bidderId;
  var empId = req.body.empIdd;
  var currentUserId = req.body.currentUserIdd;

  var projIndex = '';
  var oldData = '';

  // If employer is rating
  if(currentUserId === empId){
    ////console.log('Employer is rating now.');
    // Check if rateYesNo exists 
    Users.findById(currentUserId).exec(function (err, currentUserId) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
              
        for(var i =0; i<currentUserId.myProjects.length; i++) {

          if(currentUserId.myProjects[i].proj_id.toString() === projectIdd.toString())
           { 
            projIndex = i;
            oldData = currentUserId.myProjects[i];
            break;
          }
        }

        var obj = {};
        // ////console.log('proj index', projIndex );
        // ////console.log('currentUserId.myProjects[projIndex].rateYesNo', currentUserId.myProjects[projIndex] );
        if(currentUserId.myProjects[projIndex].rateYesNo )
          { 
            oldData.rateYesNo = 'include';
            obj['myProjects.' + projIndex] = oldData;

          }
        else
        {
         oldData.rateYesNo = 'exclude';
         obj['myProjects.' + projIndex] = oldData;
        }
        
        // Update the employer with new myProjects array
        Users.findByIdAndUpdate({ '_id' : empId } , { $set  : obj }, { new : true } , function (err, updatedEmployer) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } 
          else{
            // res.json(userLater);
            if(updatedEmployer.myProjects[projIndex].rateYesNo === 'include')
            { ////console.log('it is include in myProjects so userRatting is called and it will rate the employee');
              userRatting(empId , 'rateEmployee');
            }

            //Email Message check he rateme or not
             var messageToBidder;
             var url;
            if(updatedEmployer.myProjects[projIndex].feedback)
              { 
                messageToBidder = '의뢰인께서 사용자 평가를 했습니다.' + '\n 프로필에 사용자 평가가 반영되었습니다.\n';
              }
            else
            {
             messageToBidder = '의뢰인께서 회원님의 사용자평가를 위하여 ' + '\n 아웃소싱오케이에 접속하였습니다. \n';
             url ='https://outsourcingok.com/projects/feedback/' + projectIdd;
            }
            //Email End

            // Now find the freelancer and rate
            // ////console.log('Now its going to find the bidder to rate');
            var bidderOldData = {};
            Users.findById(bidderId).exec(function (err, bidderr) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                var userTobeRated = bidderr;
                        
                for(var i =0; i<userTobeRated.projectsAwarded.length; i++) {
                  if(userTobeRated.projectsAwarded[i].projectId.toString() === projectIdd.toString())
                   {
                    projIndex = i;
                    bidderOldData = userTobeRated.projectsAwarded[i];
                    break;
                  }
                }

                var obj = {};
                if(userTobeRated.projectsAwarded[projIndex].rateYesNo)
                {          
                  ////console.log('include is added to projectsAwarded');
                  bidderOldData.rateYesNo = 'include';
                  bidderOldData.feedback = dataa;
                  obj['projectsAwarded.' + projIndex] = bidderOldData;
                }
                else
                {
                  ////console.log('exclude is added to projectsAwarded');
                  bidderOldData.rateYesNo = 'exclude';
                  bidderOldData.feedback = dataa;
                  obj['projectsAwarded.' + projIndex] = bidderOldData;
                }

                Users.findByIdAndUpdate({ '_id' : bidderId } , { $set  : obj }, { new : true } , function (err, updatedFreelancer) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {

                      var objsRate = {
                        'url': url,
                        'freeName': updatedFreelancer.username,
                        'empName' : updatedEmployer.username,
                        'notifType': 'userRating'
                      };
                      //email to bidder to inform him
                      // emailSending(true, updatedFreelancer.email,messageToBidder, req, res );
                      emailSending(objsRate, updatedFreelancer.email,messageToBidder, req, res );

                      if(updatedFreelancer.projectsAwarded[projIndex].rateYesNo === 'include')
                      { ////console.log('it is include in projectsAwarded so userRatting is called and it will rate the freelancer');
                        
                        userRatting(bidderId, 'rateFreelancer');
                      }
                      else
                      res.json(updatedFreelancer);
                      
                  }
                });
              }
             
            });
          }

        });
      }
     
    });
  }

  // If Freelancer/Bidder is rating
  else if (currentUserId === bidderId){
    var bidPrice;   
    var empOldData ={};
    ////console.log('Freelancer/Bidder is rating');
    Users.findById(currentUserId).exec(function (err, currentUserId) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {

        for(var i =0; i<currentUserId.projectsAwarded.length; i++) {
          if(currentUserId.projectsAwarded[i].projectId.toString() === projectIdd.toString())
           {
            projIndex = i;
            oldData = currentUserId.projectsAwarded[i];
            break;
          }
        }
        var obj = {};
        if(currentUserId.projectsAwarded[projIndex].rateYesNo)
        { 
         oldData.rateYesNo = 'include';
         obj['projectsAwarded.' + projIndex] = oldData;
        }
        else
        {
          oldData.rateYesNo = 'exclude';
          obj['projectsAwarded.' + projIndex] = oldData;
        }       

        Users.findByIdAndUpdate({ '_id' : bidderId } , { $set  : obj }, { new : true } , function (err, updatedFreelancer2) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } 
          else {
            // res.json(userLater);
            if(updatedFreelancer2.projectsAwarded[projIndex].rateYesNo === 'include')
            {
              userRatting(bidderId, 'rateFreelancer');
            }

            //Email Message check he rateme or not
            var messageToEmployer;
            var url;
            if(updatedFreelancer2.projectsAwarded[projIndex].feedback)
              { 
              messageToEmployer = '프리랜서께서 회원님의 사용자평가를 했습니다.' + '\n 프로필에 사용자 평가가 반영되었습니다.\n';
              }
            else
            {
              messageToEmployer = '프리랜서께서 회원님의 사용자 평가를 위해서' + '\n 아웃소싱오케이에 접속하였습니다. \n';
              url = ' https://outsourcingok.com/projects/feedback/' + projectIdd;
            }
            //Email End

            //if this project and this user then take bidprice
            Project.findById(projectIdd).exec(function (err, projectToBeRated) {
              if (err) {
                ////console.log('error');
              } else {
                // ////console.log('no errror to find bid price');
                for(var i =0; i<projectToBeRated.bids.length; i++) {
                  if(projectToBeRated.bids[i].userId.toString() === bidderId.toString())
                   { 
                    bidPrice = projectToBeRated.bids[i].yourBid;
                  }
                }

                Users.findById(empId).exec(function (err, employerData) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {

                    ////console.log('emp data:', employerData.myProjects[0]);
                    ////console.log('emp data:', projectIdd);
                    for(var i =0; i<employerData.myProjects.length; i++) {
                      if(employerData.myProjects[i].proj_id.toString() === projectIdd.toString())
                       {
                        ////console.log('khali khali');
                        projIndex = i;
                        empOldData = employerData.myProjects[i];
                        break;
                      }
                    }
                    ////console.log('khali tou nhi?:', empOldData);
                    var obj = {};
                    if(employerData.myProjects[projIndex].rateYesNo)
                    {
                      empOldData.rateYesNo = 'include';
                      empOldData.bidPrice = bidPrice;
                      empOldData.feedback = dataa;
                      obj['myProjects.' + projIndex] = empOldData;
                    }
                    else
                    {
                      empOldData.rateYesNo = 'exclude';
                      empOldData.bidPrice = bidPrice;
                      empOldData.feedback = dataa;
                      obj['myProjects.' + projIndex] = empOldData;
                    }

                    Users.findByIdAndUpdate({ '_id' : empId } , { $set  : obj }, { new : true } , function (err, updatedEmployer2) {
                      if (err) {
                        return res.status(400).send({
                          message: errorHandler.getErrorMessage(err)
                        });
                      } 
                      else {

                        var objsRate = {
                          'url' : url,
                          'freeName' : updatedFreelancer2.username,
                          'empName' : updatedEmployer2.username,
                          'notifType' : 'empRating'
                        };
                        //send email to empoyee to inform him
                        // emailSending(true, updatedEmployer2.email, messageToEmployer, req, res );
                        emailSending(objsRate, updatedEmployer2.email, messageToEmployer, req, res );

                        if(updatedEmployer2.myProjects[projIndex].rateYesNo === 'include')
                        { 
                          userRatting(empId , 'rateEmployee');
                        }
                        res.json(updatedEmployer2);
                      }
                    });
                  }
                 
                }); 
              }
            });
          }
        });
      }
     
    });
  }

  ////console.log('********* End placeFeedBack');
};

exports.editBid = function (req, res) {

  var obj = req.body;
  var bidId = obj.bids.bidId;
  var projectId = mongoose.Types.ObjectId(req.params.projectId);

  Project.update({ '_id' : projectId , 'bids.bidId': bidId } , { $set: { 'bids.$' : obj.bids } } , { new: true, upsert: true } , function (err,project) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Project.findById(projectId).exec(function (err, project) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else if (!project) {
          return res.status(404).send({
            message: '프로젝트를 찾을 수 없습니다.'
          });
        }
        res.json(project);
       
      });
    }
  });
};

exports.deleteBid = function (req, res) {

  ////console.log('hello');
  //res.json('hello');

  var bidId = req.body.bidId;

  var projectId = mongoose.Types.ObjectId(req.params.projectId);

  ////console.log(bidId);
  ////console.log(projectId);

  Project.findById(projectId).exec(function (err,project) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      for(var i =0; i< project.bids.length; i++) {

        if(project.bids[i].bidId.toString() === bidId.toString()) {
          project.bids.splice(i,1);
        }
      }
      project.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(project);
        }
      });
    }
  });
};

exports.submitProposal = function (req, res) {

  var data = req.body.data;
  var obj = {};
  obj['bids.' + req.body.index] = data;
  
  var userId = mongoose.Types.ObjectId(req.user._id);
  var id = mongoose.Types.ObjectId(req.params.projectId);

  Project.findByIdAndUpdate({ '_id' : id } , { $set : obj }, {new: true} , function (err,project) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log('proposal:', project);
      res.json(project);
    }
  });
};

exports.projectAwarded = function (req, res) {

  lock.enter(function (token) {
    var data = req.body.data;
    ////console.log('Request Body:', data);
    var obj = {};
    obj['bids.' + req.body.index] = data;
    
    var id = mongoose.Types.ObjectId(req.params.projectId);

    Project.findByIdAndUpdate({ '_id' : id } , { $set : obj } , { new: true }, function (err,project) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        ////console.log('Project project::: ', project);
        var userId = mongoose.Types.ObjectId(project.bids[req.body.index].userId);
        var freelancer = project.bids[req.body.index].bidderInfo;
        // console.log('why free:', freelancer.notificationsOnOff.bidRetracted);
        
        var information = {
          'projectId' :  id,
          'awarded' : 'pending'
        };

        Users.update({ '_id': userId, 'projectsAwarded.projectId': id } , { $set: { 'projectsAwarded.$.awarded' : 'pending' } }, { new: true }, function (err,user) {
          if (err) {
            // ////console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {

            // res.json(project);
            /*For NewsFeed on dashboard*/ 
            var news = {
              'bidderId': data.userId,
              'bidderName': data.bidderName,
              'bidderImage': data.bidderImageURl,
              'bidId': data.bidId,
              'projectId': project._id,
              'projectName': project.name,
              'activity': 'Awarded',
              'date': Date.now() 
            };
            ////console.log('Project news::: ', news);

            Users.update({ '_id' : data.userId } , { $push: {'newsFeed' : news } }, { new: true }, function (err,user) {
              if (err) {
                // ////console.log(err);
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {

              lock.leave(token);  
              }
            });

            Users.find({username: freelancer.username}, function(err, freelanc){
              if(err){
                return false;
		            /*return res.status(400).send({
                 message: errorHandler.getErrorMessage(err)
                });*/
              }else{
                var message = '프로젝트에 회원님께서 선정되었습니다.' + '\n' + '아래 링크주소를 클릭하면 아웃소싱오케이로 이동합니다.' + '\n';
                var url =  'https://outsourcingok.com/projects/view/' + project._id;
                  // emailSending(freelanc[0].notificationsOnOff.bidRetracted, project.bids[req.body.index].bidderEmail,message);
                  if(freelanc[0].notificationsOnOff.bidRetracted)
                  {
                  var objsAwarded ={
                      'empName': project.userInfo.username,
                      'url': url,
                      'freeName': news.bidderName,
                      'projectName': project.name,
                      'notifType': 'projectAward'
                    };
                    emailSending(objsAwarded, project.bids[req.body.index].bidderEmail, message, req, res);
                  }
              }
            });

            res.json(project);   
          }
        });   
      }
    });
  });
};



exports.acceptProject = function (req, res) {

  lock.enter(function (token) {
    var data = req.body.data;
    var obj = {};
    obj['bids.' + req.body.index] = data;
    
    var id = mongoose.Types.ObjectId(req.params.projectId);

    Project.findByIdAndUpdate({ '_id' : id } , { $set : obj } , { new: true }, function (err,project) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var userId = mongoose.Types.ObjectId(project.bids[req.body.index].userId);
        var information = {
          'projectId' :  id,
          'awarded' : 'accepted',
          'projectAcceptDate' : Date.now()
        };

        Users.update({ '_id': userId, 'projectsAwarded.projectId': id } , { $set: { 'projectsAwarded.$.awarded' : 'awarded' ,'projectsAwarded.$.projectAcceptDate' : Date.now() } }, { new: true }, function (err,user) {
          if (err) {
            // ////console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {

            // res.json(project);

            /*For NewsFeed on dashboard*/ 
            var news;

            if(data.rejected){
              news = {
                'bidderId': data.userId,
                'bidderName': data.bidderName,
                'bidderImage': data.bidderImageURl,
                'bidId': data.bidId,
                'projectId': project._id,
                'projectName': project.name,
                'activity': 'Rejected',
                'date': Date.now() 
              };
            }else{
              news = {
                'bidderId': data.userId,
                'bidderName': data.bidderName,
                'bidderImage': data.bidderImageURl,
                'bidId': data.bidId,
                'projectId': project._id,
                'projectName': project.name,
                'activity': 'Accepted',
                'date': Date.now() 
              };
            }

            Users.update({ '_id' : data.userId } , { $push: {'newsFeed' : news } }, { new: true }, function (err,user) {
              if (err) {
                // ////console.log(err);
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {

                /**/ 
                // ////console.log('updated user:', user);
                Users.update({ '_id' : project.user } , { $push: {'newsFeed' : news } }, { new: true }, function (err,user) {
                  if (err) {
                    // ////console.log(err);
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {

                  }
                });

                // res.json(project);
                // lock.leave(token);
              }
            });

            lock.leave(token);
            // console.log('project.userInfo.notifications.bidRetracted:', project.userInfo);
            // console.log('project.userInfo.notifications.bidRetracted:', project.userInfo.notifications.bidRetracted);
            Users.find({username: project.userInfo.username}, function(err, employer){
              if(err){
		            return false;
                //return res.status(400).send({
                 // message: errorHandler.getErrorMessage(err)
                //});
              }else{
                var message;
                var url;
                var objsAccept;
                if(data.rejected){
                  message = '프리랜서께서 프로젝트를 거절하였습니다.' + '\n 프로젝트 관리는 아래링크를 클릭하면 이동합니다. \n';
                  url = 'https://outsourcingok/projects/project-manage/' + project._id;
                    if(employer[0].notificationsOnOff.bidRetracted){

                      objsAccept = {
                        'empName': employer[0].username,
                        'url': url,
                        'projectName': news.projectName,
                        'notifType': 'projectReject'
                      }; 

                      emailSending(objsAccept, project.userInfo.email, message, req, res ); 
                    }

                }else{
                  message = '프리랜서께서 프로젝트를 수락하였습니다.' + '\n 프로젝트 관리는 아래링크를 클릭하면 이동합니다. \n';
                  url = 'https://outsourcingok/projects/project-manage/' + project._id;

                  if(employer[0].notificationsOnOff.bidRetracted){

                    objsAccept = {
                      'empName': employer[0].username,
                      'url': url,
                      'freeName': req.body.data.bidderName,
                      'projectName': news.projectName,
                      'notifType': 'projectAccept'
                  };
                  emailSending(objsAccept, project.userInfo.email, message, req, res ); 
                  }
                }
                // emailSending(employer[0].notificationsOnOff.bidRetracted, project.userInfo.email,message );
              }
            });
            
            res.json(project);   
          }
        });   
      }
    });
  });
};

exports.addMilestone = function (req, res) {

  var data = req.body.data;
  var bidId = req.body.bidId;
  var identifier = req.body.identifier;
  var projectId = mongoose.Types.ObjectId(req.params.projectId);

  Project.update({ '_id' : projectId , 'bids.bidId': bidId } , { $push: { 'bids.$.proposal.milestones' : data } } , { new: true, upsert: true } , function (err,project) {

    if (err) {
      ////console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      var proj = project;

      Project.findById(projectId).exec(function (err, project) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else if (!project) {
          return res.status(404).send({
            message: '프로젝트를 찾을 수 없습니다.'
          });
        }
        else {
          // Find the bidder
          var freelancer;
          for(var i=0; i<project.bids.length; i++){
            if(project.bids[i].bidId === bidId){
              freelancer = project.bids[i].bidderInfo;
            }
          }
          // console.log('identifier', identifier);
          // console.log('employer', project.userInfo.notifications.bidRetracted);

          var message = '';
          var url;
          var objsMilestone;
          //console.log('rami:', project.userInfo.name);
          if(identifier === 'freelancer') {
            Users.find({username: project.userInfo.username}, function(err, suc){
              if(err){
                return false;
                // return res.status(400).send({
                //   message: errorHandler.getErrorMessage(err)
                // });
              }else{
		//console.log('freelancer', suc[0]);
                message = freelancer.username + ' 님이 프로젝트 대금지급을 요청하였습니다.' + project.name + '\n 아래링크를 클릭하시면 프로젝트 관리페이지로 이동합니다.\n';
                url =  'https://outsourcingok.com/projects/project-manage/' + project._id;
                // emailSending(suc[0].notificationsOnOff.bidRetracted, project.userInfo.email, message);
                if(suc[0].notificationsOnOff.bidRetracted){
                  objsMilestone = {
                    'url': url,
                    'empName': project.userInfo.username,
                    'freeName': freelancer.username,
                    'projectName': project.name,
                    'currency': project.currency.symbol_native,
                    'milestoneAmount': data.price,
                    'milestonesDes': data.description,
                    'notifType': 'requestMS'
                  };
                  emailSending(objsMilestone, project.userInfo.email, message, req, res);

                }
              }
            }); 
	  }
          else if(identifier === 'employer') {
            Users.find({username: freelancer.username}, function(err, succ){
              if(err){
                return false;
                // return res.status(400).send({
                //   message: errorHandler.getErrorMessage(err)
                // });
              }else{
                message = req.user.username + ' 님이 프로젝트 대금을 입금하였습니다. ' + project.name + ' 아래링크를 클릭하시면 진행상황을 확인하실 수 있습니다.\n';
                url = 'https://outsourcingok.com/projects/view/' + project._id;
                  // emailSending(succ[0].notificationsOnOff.bidRetracted, req.body.bidderEmail, message);
                  if(succ[0].notificationsOnOff.bidRetracted){
                    objsMilestone = {
                      'url': url,
                      'empName': project.userInfo.username,
                      'freeName': freelancer.username,
                      'projectName': project.name,
                      'currency': project.currency.symbol_native,
                      'milestoneAmount': data.price,
                      'milestonesDes': data.description,
                      'notifType': 'createMS'
                    };
                    emailSending(objsMilestone, req.body.bidderEmail, message, req, res);
                  }
              }
            }); 
	  }

          res.json(project);
        }

        
       
      });

    }
  });  

  
};



exports.uploadProjectFile = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.projectFileUpload).single('newProjectFile');

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: '프로젝트 파일을 업로드하는 중에 오류가 발생했습니다.'
        });
      } else {
        var fileURL = config.uploads.projectFileUpload.dest + req.file.filename;
        return res.json(fileURL);
      }
    });
  } else {
    res.status(400).send({
      message: '사용자가 로그인하지 않았습니다.'
    });
  }
};


exports.uploadProjectDisputeFile = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.projectDisputeFileUpload).single('newProjectDisputeFileUploade');
  //var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // ////console.log('hello');
  // var fs = require('fs');
  // var filePath =  "/Users/abubakar/Sites/meanjs/wecanact_dev/modules/projects/client/img/09822d9823d69e3fddd013f9decd2a25" ; 
  // fs.unlinkSync(filePath);

  // Filtering to upload only images
  //upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: '프로젝트 파일을 업로드하는 중에 오류가 발생했습니다.'
        });
      } else {
        var fileURL = config.uploads.projectDisputeFileUpload.dest + req.file.filename;
        return res.json(fileURL);
      }
    });
  } else {
    res.status(400).send({
      message: '사용자가 로그인하지 않았습니다.'
    });
  }
};

/**
 * Project middleware
 */
exports.projectByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: '프로젝트가 유효하지 않습니다.'
    });
  }

  Project.findById(id).populate('user', 'displayName').exec(function (err, project) {
    if (err) {
      return next(err);
    } else if (!project) {
      return res.status(404).send({
        message: '프로젝트를 찾을 수 없습니다.'
      });
    }
    req.project = project;
    next();
  });
};


// when hire Me is clicked on someones profile
exports.hiredProject = function (req, res) {
  var project = new Project(req.body);
  ////console.log(req.body);
  project.user = req.body.user;
  // project.currency = 
  project.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } 
    else {
      var someDate = new Date(project.created);
    
      someDate.setMinutes(someDate.getDate()+15);
      
      var j = schedule.scheduleJob(someDate, function(){
        var id = mongoose.Types.ObjectId(project._id);
        Project.findByIdAndUpdate(id , { $set: { 'status': 'inactive' } }, { new: true }, function (err,project) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            ////console.log('helll');
            // res.json(project);
          }
        });
      });


      var user_id = project.user;

      // var proj = {
      //   'proj_id': project._id,
      //   'proj_name': project.name,
      //   'proj_description': project.description
      // };

      Users.findByIdAndUpdate({ '_id': user_id }, { $push: { 'myProjects' : project } }, { new: true }, function (err,user) {
        if (err) {
          // ////console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {

          // res.json(user);           
        }
      });

      // res.json(project);
    }
  });
};


// Change the status of 
exports.changeMilestonStatus = function(req, res){

  // ////console.log(req.body.proposal.milestones);
  var projectId = mongoose.Types.ObjectId(req.params.projectId);
  ////console.log('Project ID:', projectId);


  Project.update({ '_id' : projectId , 'bids.bidId': req.body.data.bidId } , { $set: { 'bids.$.proposal.milestones' : req.body.data.proposal.milestones } } , { new: true, upsert: true } , function 
(err,project) {

    if (err) {
      ////console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Project.findById(projectId).exec(function (err, project) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else if (!project) {
          return res.status(404).send({
            message: '해당 프로젝트를 찾을 수 없습니다.'
          });
        }
        else {
          var freelancer = req.body.data.bidderInfo;

          var message = '';
          var url;
          var objsMilestone;
          if(req.body.identifier === 'Released') {
            Users.find({username: freelancer.username}, function(err, free){
              if(err){
                return false;
              }else{
                message  =  project.userInfo.username + ' 님이 '+project.name + ' 프로젝트에 대해 "' + req.body.deductedAmount + '원을 회원님께 대금지급을 하였습니다."';
                url =  'https://outsourcingok.com/projects/project-manage/' + project._id;
                  // emailSending(free[0].notificationsOnOff.bidRetracted, freelancer.email, message);
                  if (free[0].notificationsOnOff.bidRetracted) {
                    objsMilestone = {
                      'url': url,
                      'empName': project.userInfo.username,
                      'freeName': freelancer.username,
                      'projectName': project.name,
                      'currency': project.currency.symbol_native,
                      'milestoneAmount': req.body.deductedAmount,
                      'notifType': 'releaseMS'
                    };
                     emailSending(objsMilestone,freelancer.email, message, req, res);
                  }
              }
            });
	        }
          else if(req.body.identifier === 'Created'){
	          Users.find({username: freelancer.username}, function(err, free){
              if(err){
                return false;
              }else{
                message  =  project.userInfo.username + ' 님이 '+project.name + ' 프로젝트에 대해 "' + req.body.milestoneamount + '원을 입금하였습니다."';
                url = 'https://outsourcingok.com/projects/view/' + project._id;
                  // emailSending(free[0].notificationsOnOff.bidRetracted, freelancer.email, message);
                  if(free[0].notificationsOnOff.bidRetracted){
                    objsMilestone = {
                      'url': url,
                      'empName': project.userInfo.username,
                      'freeName': freelancer.username,
                      'projectName': project.name,
                      'currency': project.currency.symbol_native,
                      'milestoneAmount': req.body.milestoneamount,
                      'milestonesDes': req.body.description,
                      'notifType': 'createMS'
                    };
                    emailSending(objsMilestone, freelancer.email, message,req, res);
                  }
              }
            });
          }
          res.json(project);
        }
       
      });

    }
  }); 

};

/*
* alOutGoinglMilestones => Show all the milestones of the projects which you have posted
*/

exports.alOutGoinglMilestones = function(req, res){
  var userId = req.body.userId;
  // Project.find({ bids: { $elemMatch: { 'awarded': 'yes'}}, user: userId }, {'bids.$': 1}, function(err, projects){
  Project.find({ bids: { $elemMatch: { 'awarded': 'yes'}}, user: userId }, function(err, projects){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      res.json(projects);
    }
  });
};

/*
* allIncominglMilestones => Show all the milestones of the projects which are awarded to you
*/

exports.allIncominglMilestones = function(req, res){
  var userId = req.body.userId;
  Project.find({ bids: { $elemMatch: { 'bidderInfo._id':userId,  'awarded': 'yes'}} }, function(err, projects){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      res.json(projects);
    }
  });
};
