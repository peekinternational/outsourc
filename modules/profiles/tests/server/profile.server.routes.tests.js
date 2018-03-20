'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Profiles = mongoose.model('Profiles'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, profiles;

/**
 * Profiles routes tests
 */
describe('Profiles CRUD tests', function () {

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

    // Save a user to the test db and create new profiles
    user.save(function () {
      profiles = {
        title: 'Profiles Title',
        content: 'Profiles Content'
      };

      done();
    });
  });

  it('should be able to save an profiles if logged in', function (done) {
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

        // Save a new profiles
        agent.post('/api/profiles')
          .send(profiles)
          .expect(200)
          .end(function (profilesSaveErr, profilesSaveRes) {
            // Handle profiles save error
            if (profilesSaveErr) {
              return done(profilesSaveErr);
            }

            // Get a list of profiles
            agent.get('/api/profiles')
              .end(function (profilesGetErr, profilesGetRes) {
                // Handle profiles save error
                if (profilesGetErr) {
                  return done(profilesGetErr);
                }

                // Get profiles list
                var profiles = profilesGetRes.body;

                // Set assertions
                (profiles[0].user._id).should.equal(userId);
                (profiles[0].title).should.match('Profiles Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an profiles if not logged in', function (done) {
    agent.post('/api/profiles')
      .send(profiles)
      .expect(403)
      .end(function (profilesSaveErr, profilesSaveRes) {
        // Call the assertion callback
        done(profilesSaveErr);
      });
  });

  it('should not be able to save an profiles if no title is provided', function (done) {
    // Invalidate title field
    profiles.title = '';

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

        // Save a new profiles
        agent.post('/api/profiles')
          .send(profiles)
          .expect(400)
          .end(function (profilesSaveErr, profilesSaveRes) {
            // Set message assertion
            (profilesSaveRes.body.message).should.match('Title cannot be blank');

            // Handle profiles save error
            done(profilesSaveErr);
          });
      });
  });

  it('should be able to update an profiles if signed in', function (done) {
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

        // Save a new profiles
        agent.post('/api/profiles')
          .send(profiles)
          .expect(200)
          .end(function (profilesSaveErr, profilesSaveRes) {
            // Handle profiles save error
            if (profilesSaveErr) {
              return done(profilesSaveErr);
            }

            // Update profiles title
            profiles.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing profiles
            agent.put('/api/profiles/' + profilesSaveRes.body._id)
              .send(profiles)
              .expect(200)
              .end(function (profilesUpdateErr, profilesUpdateRes) {
                // Handle profiles update error
                if (profilesUpdateErr) {
                  return done(profilesUpdateErr);
                }

                // Set assertions
                (profilesUpdateRes.body._id).should.equal(profilesSaveRes.body._id);
                (profilesUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of profiles if not signed in', function (done) {
    // Create new profiles model instance
    var profilesObj = new Profiles(profiles);

    // Save the profiles
    profilesObj.save(function () {
      // Request profiles
      request(app).get('/api/profiles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single profiles if not signed in', function (done) {
    // Create new profiles model instance
    var profilesObj = new Profiles(profiles);

    // Save the profiles
    profilesObj.save(function () {
      request(app).get('/api/profiles/' + profilesObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', profiles.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single profiles with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/profiles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Profiles is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single profiles which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent profiles
    request(app).get('/api/profiles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No profiles with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an profiles if signed in', function (done) {
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

        // Save a new profiles
        agent.post('/api/profiles')
          .send(profiles)
          .expect(200)
          .end(function (profilesSaveErr, profilesSaveRes) {
            // Handle profiles save error
            if (profilesSaveErr) {
              return done(profilesSaveErr);
            }

            // Delete an existing profiles
            agent.delete('/api/profiles/' + profilesSaveRes.body._id)
              .send(profiles)
              .expect(200)
              .end(function (profilesDeleteErr, profilesDeleteRes) {
                // Handle profiles error error
                if (profilesDeleteErr) {
                  return done(profilesDeleteErr);
                }

                // Set assertions
                (profilesDeleteRes.body._id).should.equal(profilesSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an profiles if not signed in', function (done) {
    // Set profiles user
    profiles.user = user;

    // Create new profiles model instance
    var profilesObj = new Profiles(profiles);

    // Save the profiles
    profilesObj.save(function () {
      // Try deleting profiles
      request(app).delete('/api/profiles/' + profilesObj._id)
        .expect(403)
        .end(function (profilesDeleteErr, profilesDeleteRes) {
          // Set message assertion
          (profilesDeleteRes.body.message).should.match('User is not authorized');

          // Handle profiles error error
          done(profilesDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Profiles.remove().exec(done);
    });
  });
});
