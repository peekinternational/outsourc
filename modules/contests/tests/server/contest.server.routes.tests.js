'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Contest = mongoose.model('Contest'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, contest;

/**
 * Contest routes tests
 */
describe('Contest CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new contest
    user.save(function () {
      contest = {
        title: 'Contest Title',
        content: 'Contest Content'
      };

      done();
    });
  });

  it('should be able to save an contest if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new contest
        agent.post('/api/contests')
          .send(contest)
          .expect(200)
          .end(function (contestSaveErr, contestSaveRes) {
            // Handle contest save error
            if (contestSaveErr) {
              return done(contestSaveErr);
            }

            // Get a list of contests
            agent.get('/api/contests')
              .end(function (contestsGetErr, contestsGetRes) {
                // Handle contest save error
                if (contestsGetErr) {
                  return done(contestsGetErr);
                }

                // Get contests list
                var contests = contestsGetRes.body;

                // Set assertions
                (contests[0].user._id).should.equal(userId);
                (contests[0].title).should.match('Contest Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an contest if not logged in', function (done) {
    agent.post('/api/contests')
      .send(contest)
      .expect(403)
      .end(function (contestSaveErr, contestSaveRes) {
        // Call the assertion callback
        done(contestSaveErr);
      });
  });

  it('should not be able to save an contest if no title is provided', function (done) {
    // Invalidate title field
    contest.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new contest
        agent.post('/api/contests')
          .send(contest)
          .expect(400)
          .end(function (contestSaveErr, contestSaveRes) {
            // Set message assertion
            (contestSaveRes.body.message).should.match('Title cannot be blank');

            // Handle contest save error
            done(contestSaveErr);
          });
      });
  });

  it('should be able to update an contest if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new contest
        agent.post('/api/contests')
          .send(contest)
          .expect(200)
          .end(function (contestSaveErr, contestSaveRes) {
            // Handle contest save error
            if (contestSaveErr) {
              return done(contestSaveErr);
            }

            // Update contest title
            contest.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing contest
            agent.put('/api/contests/' + contestSaveRes.body._id)
              .send(contest)
              .expect(200)
              .end(function (contestUpdateErr, contestUpdateRes) {
                // Handle contest update error
                if (contestUpdateErr) {
                  return done(contestUpdateErr);
                }

                // Set assertions
                (contestUpdateRes.body._id).should.equal(contestSaveRes.body._id);
                (contestUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of contests if not signed in', function (done) {
    // Create new contest model instance
    var contestObj = new Contest(contest);

    // Save the contest
    contestObj.save(function () {
      // Request contests
      request(app).get('/api/contests')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single contest if not signed in', function (done) {
    // Create new contest model instance
    var contestObj = new Contest(contest);

    // Save the contest
    contestObj.save(function () {
      request(app).get('/api/contests/' + contestObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', contest.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single contest with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/contests/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Contest is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single contest which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent contest
    request(app).get('/api/contests/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No contest with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an contest if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new contest
        agent.post('/api/contests')
          .send(contest)
          .expect(200)
          .end(function (contestSaveErr, contestSaveRes) {
            // Handle contest save error
            if (contestSaveErr) {
              return done(contestSaveErr);
            }

            // Delete an existing contest
            agent.delete('/api/contests/' + contestSaveRes.body._id)
              .send(contest)
              .expect(200)
              .end(function (contestDeleteErr, contestDeleteRes) {
                // Handle contest error error
                if (contestDeleteErr) {
                  return done(contestDeleteErr);
                }

                // Set assertions
                (contestDeleteRes.body._id).should.equal(contestSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an contest if not signed in', function (done) {
    // Set contest user
    contest.user = user;

    // Create new contest model instance
    var contestObj = new Contest(contest);

    // Save the contest
    contestObj.save(function () {
      // Try deleting contest
      request(app).delete('/api/contests/' + contestObj._id)
        .expect(403)
        .end(function (contestDeleteErr, contestDeleteRes) {
          // Set message assertion
          (contestDeleteRes.body.message).should.match('User is not authorized');

          // Handle contest error error
          done(contestDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Contest.remove().exec(done);
    });
  });
});
