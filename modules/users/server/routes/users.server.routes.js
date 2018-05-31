'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  
  app.route('/api/users/').get(users.list);
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/hiddenUser/:userId').get(users.read);
  app.route('/api/updateUser/:userId').put(users.updateUser);
  app.route('/api/hiddenUserUpdate/:userId').put(users.updatePartialUser);

  app.route('/api/users/username/:username').get(users.getByUsername);

  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);
  app.route('/api/users/coverPicture').post(users.changeCoverPicture);
  app.route('/api/users/upload/delete').put(users.deletePicture);
  app.route('/api/users/userBid/:userId').put(users.getProjectsById);
  // findPostedProjects
  app.route('/api/users/findPostedProjects/:userId').get(users.findPostedProjects);
  app.route('/api/users/findActivePostedProjects/:userId').get(users.findActivePostedProjects);
  // findPostedContests
  app.route('/api/users/findPostedContests/:userId').get(users.findPostedContests);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);

  // Paypal
  app.route('/api/users/paymenCreate').post(users.payCreate);
  app.route('/api/users/paymentExecute').post(users.payExecute);

  // email verification
  app.route('/api/users/contactForm').post(users.sendMail);
  app.route('/api/users/contactUs').post(users.contactUs);
  // validate phone number
  app.route('/api/users/validatePhone').post(users.validatePhone);
  app.route('/api/users/nicepay').post(users.nicepay);
};
