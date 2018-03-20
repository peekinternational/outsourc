'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Profiles = mongoose.model('Profiles'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Users = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a profiles
 */
exports.create = function (req, res) {
  var profiles = new Profiles(req.body);
  if(req.user.roles[0] === 'company'){
    profiles.companyInformation = {
      'companyName': req.user.companyName,
      'companyReg': req.user.companyRegNum,
      'email': req.user.email,
      'phoneNumber': req.user.companyTel
    };
  }

  profiles.userInfo = req.user;  
  
  profiles.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      var user = req.user;
      user.profile_id = profiles._id;

      user.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var data = {
            'user' : user,
            'profile' : profiles
          };
          res.json(data);
        }
      });
    }
  });
};


/**
 * Show the current profiles
 */
exports.read = function (req, res) {
  // //console.log('------------------------sjfhkdsjh');
  var profile = req.profiles;
  profile.skills = req.profiles.skills;
  var obj = {
    'profile' :  profile,
    'skillsArray' : profile.skills
  };

  res.json(obj);

};

exports.getUserProfile = function (req, res) {
  ////console.log('------------------------hello');
  res.json(req.profileByUsername);
};

/**
 * Update a profiles
 */
exports.partialProfileUpdate = function (req, res) {
  
  var obj = req.body;
  //console.log('indInfo', obj);
  var id = mongoose.Types.ObjectId(req.params.profilesId);

  Profiles.findByIdAndUpdate(id , { $set: req.body }, { new: true }, function (err,profiles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profiles);
    }
  });
};

exports.userInfoUpdate = function (req, res) {
  
  var obj = req.body;
  var id = mongoose.Types.ObjectId(req.params.profilesId);


  Profiles.findByIdAndUpdate(id , { $set: obj }, { new: true }, function (err,profiles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      var userId = mongoose.Types.ObjectId(req.user._id);

      
      delete profiles.userInfo._id;
      delete profiles.userInfo.coverImageURL;
      delete profiles.userInfo.profileImageURL;

      var object = {};
      object = profiles.userInfo;
      // //console.log(object);
      Users.findByIdAndUpdate(userId , { $set: profiles.userInfo } , { new: true }, function (err,user) {
        if (err) {
          // //console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {

          profiles.userInfo.coverImageURL = user.coverImageURL;
          profiles.userInfo.profileImageURL = user.profileImageURL;
          profiles.userInfo._id = user._id;

          var data = {
            'user' : user,
            'profile' : profiles
          };
          res.json(data);
        }
      });

      //res.json(profiles);
    }
  });
};

exports.partialProfileArrayUpdate = function (req, res) {
  
  var obj = req.body;
  var id = mongoose.Types.ObjectId(req.params.profilesId);

  // //console.log(obj);

  Profiles.findByIdAndUpdate(id , { $push: obj }, { new: true }, function (err,profiles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profiles);
    }
  });
};

exports.update = function (req, res) {
  
  // var obj = req.body;
  // var id = mongoose.Types.ObjectId(req.params.profilesId);

  // Profiles.findByIdAndUpdate( id , req.body, {new: true}, function (err,profiles) {
  //   if (err) {
  //      //console.log(err);
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(profiles);
  //   }
  // });
};

/**
 * Delete an profiles
 */
exports.delete = function (req, res) {
  var profiles = req.profiles;

  profiles.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profiles);
    }
  });
};


exports.deletePortfolioPicture = function (req, res) {
  var message = null;
  //console.log(req.body);
  // var fs = require('fs');
  // var path1 = __dirname.split('modules');
  // var path2 = req.body.imageURL.split('modules/');
  // var imagepath = '';
  // var filePath = '';

  // if(process.platform ==='win32') {
  //   imagepath = path1[0].replace(/\\/g,'/');
  //   filePath = imagepath +'modules\/'+ path2[1];
  // }
  // else {
  //   filePath = path1[0] +'modules/' + path2[1];

  // }

  // fs.unlinkSync(filePath);
  // res.json(filePath);

};

/**
 * List of Profiles
 */
exports.list = function (req, res) {
  Profiles.find({ 'userInfo.userRole': { $ne: "hire" } }).sort('-created').populate('user', 'displayName').exec(function (err, profiles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profiles);
    }
  });
};

exports.uploadPortfolioPicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profilePortfolioUpload).single('newPortfolioPicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // //console.log('hello');
  // var fs = require('fs');
  // var filePath =  "/Users/abubakar/Sites/meanjs/wecanact_dev/modules/projects/client/img/09822d9823d69e3fddd013f9decd2a25" ; 
  // fs.unlinkSync(filePath);

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: '이미지용량을 2mb 이하로 올려주세요'
        });
      } else {
        var imageURL = config.uploads.profilePortfolioUpload.dest + req.file.filename;
        return res.json(imageURL);
      }
    });
  } else {
    res.status(400).send({
      message: '로그인을 하십시오.'
    });
  }
};

/**
 * Profiles middleware
 */
exports.profilesByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Profiles is invalid'
    });
  }

  Profiles.findById(id).populate('user', 'displayName').exec(function (err, profiles) {
    if (err) {
      return next(err);
    } else if (!profiles) {
      return res.status(404).send({
        message: '해당 프로필을 찾을 수 없습니다.'
      });
    }
    req.profiles = profiles;
    //console.log('---------sd---------', profiles);
    // //console.log('---------sd---------', req.profiles);
    next();
  });
};

exports.profileByUsername = function (req, res, next, username) {

  Profiles.findOne({ 'userInfo.username':username }).exec(function (err, profiles) {
    if (err) {
      return next(err);
    } else if (!profiles) {
      return res.status(404).send({
        message: '해당 프로필을 찾을 수 없습니다.'
      });
    }
    req.profileByUsername = profiles;
    // //console.log('-------hggd-----------', req.profiles);
    // //console.log('-------hggd-----------', req.profiles);

    next();
  });


};

//get all Profiles
exports.getAllProfiles = function (req, res) {
  //console.log('get all Profiles');
  Profiles.find({}).exec(function (err, docs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {  
      //console.log(docs);

      res.json(docs);
    }
  });
};

//my code company info
exports.pushCompanyInfoUpdate = function (req, res) {
  //console.log(req.body);
  //console.log('server fn pushCompanyInfoUpdate');
  var obj = req.body;
  var id = mongoose.Types.ObjectId(req.params.profilesId);

  // //console.log(obj);

  Profiles.findByIdAndUpdate(id , { $set: { companyInformation: obj } }, { new: true }, function (err,profiles) {
    if (err) { 
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profiles);
    }
  });
};

// When hire me is clicked  
exports.hireme = function (req, res) {
  var obj = req.body;
  var userId = req.body.userId;

  Users.findByIdAndUpdate({ '_id': userId }, { $push: { 'myProjects' : obj } }, { new: true }, function (err,user) {
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
* Find the freelancer by name (search)
*/
exports.searchByName = function(req, res){
  console.log('searchName:', req.params.searchName);
  var pattern = req.params.searchName;

  Profiles.find({'userInfo.username':{$regex: pattern}}, function(err, profile){
  // Users.find({username: { $regex: pattern}}, function(err, profile){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      console.log('Length of result::',profile.length);
      res.json(profile);
    }
  });
};