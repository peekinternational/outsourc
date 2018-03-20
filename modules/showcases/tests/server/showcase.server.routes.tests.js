'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Showcase = mongoose.model('Showcase'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  showcase;

/**
 * Showcase routes tests
 */
describe('Showcase CRUD tests', function () {

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

    // Save a user to the test db and create new Showcase
    user.save(function () {
      showcase = {
        name: 'Showcase name'
      };

      done();
    });
  });

  it('should be able to save a Showcase if logged in', function (done) {
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

        // Save a new Showcase
        agent.post('/api/showcases')
          .send(showcase)
          .expect(200)
          .end(function (showcaseSaveErr, showcaseSaveRes) {
            // Handle Showcase save error
            if (showcaseSaveErr) {
              return done(showcaseSaveErr);
            }

            // Get a list of Showcases
            agent.get('/api/showcases')
              .end(function (showcasesGetErr, showcasesGetRes) {
                // Handle Showcases save error
                if (showcasesGetErr) {
                  return done(showcasesGetErr);
                }

                // Get Showcases list
                var showcases = showcasesGetRes.body;

                // Set assertions
                (showcases[0].user._id).should.equal(userId);
                (showcases[0].name).should.match('Showcase name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Showcase if not logged in', function (done) {
    agent.post('/api/showcases')
      .send(showcase)
      .expect(403)
      .end(function (showcaseSaveErr, showcaseSaveRes) {
        // Call the assertion callback
        done(showcaseSaveErr);
      });
  });

  it('should not be able to save an Showcase if no name is provided', function (done) {
    // Invalidate name field
    showcase.name = '';

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

        // Save a new Showcase
        agent.post('/api/showcases')
          .send(showcase)
          .expect(400)
          .end(function (showcaseSaveErr, showcaseSaveRes) {
            // Set message assertion
            (showcaseSaveRes.body.message).should.match('Please fill Showcase name');

            // Handle Showcase save error
            done(showcaseSaveErr);
          });
      });
  });

  it('should be able to update an Showcase if signed in', function (done) {
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

        // Save a new Showcase
        agent.post('/api/showcases')
          .send(showcase)
          .expect(200)
          .end(function (showcaseSaveErr, showcaseSaveRes) {
            // Handle Showcase save error
            if (showcaseSaveErr) {
              return done(showcaseSaveErr);
            }

            // Update Showcase name
            showcase.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Showcase
            agent.put('/api/showcases/' + showcaseSaveRes.body._id)
              .send(showcase)
              .expect(200)
              .end(function (showcaseUpdateErr, showcaseUpdateRes) {
                // Handle Showcase update error
                if (showcaseUpdateErr) {
                  return done(showcaseUpdateErr);
                }

                // Set assertions
                (showcaseUpdateRes.body._id).should.equal(showcaseSaveRes.body._id);
                (showcaseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Showcases if not signed in', function (done) {
    // Create new Showcase model instance
    var showcaseObj = new Showcase(showcase);

    // Save the showcase
    showcaseObj.save(function () {
      // Request Showcases
      request(app).get('/api/showcases')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Showcase if not signed in', function (done) {
    // Create new Showcase model instance
    var showcaseObj = new Showcase(showcase);

    // Save the Showcase
    showcaseObj.save(function () {
      request(app).get('/api/showcases/' + showcaseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', showcase.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Showcase with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/showcases/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Showcase is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Showcase which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Showcase
    request(app).get('/api/showcases/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Showcase with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Showcase if signed in', function (done) {
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

        // Save a new Showcase
        agent.post('/api/showcases')
          .send(showcase)
          .expect(200)
          .end(function (showcaseSaveErr, showcaseSaveRes) {
            // Handle Showcase save error
            if (showcaseSaveErr) {
              return done(showcaseSaveErr);
            }

            // Delete an existing Showcase
            agent.delete('/api/showcases/' + showcaseSaveRes.body._id)
              .send(showcase)
              .expect(200)
              .end(function (showcaseDeleteErr, showcaseDeleteRes) {
                // Handle showcase error error
                if (showcaseDeleteErr) {
                  return done(showcaseDeleteErr);
                }

                // Set assertions
                (showcaseDeleteRes.body._id).should.equal(showcaseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Showcase if not signed in', function (done) {
    // Set Showcase user
    showcase.user = user;

    // Create new Showcase model instance
    var showcaseObj = new Showcase(showcase);

    // Save the Showcase
    showcaseObj.save(function () {
      // Try deleting Showcase
      request(app).delete('/api/showcases/' + showcaseObj._id)
        .expect(403)
        .end(function (showcaseDeleteErr, showcaseDeleteRes) {
          // Set message assertion
          (showcaseDeleteRes.body.message).should.match('User is not authorized');

          // Handle Showcase error error
          done(showcaseDeleteErr);
        });

    });
  });

  it('should be able to get a single Showcase that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Showcase
          agent.post('/api/showcases')
            .send(showcase)
            .expect(200)
            .end(function (showcaseSaveErr, showcaseSaveRes) {
              // Handle Showcase save error
              if (showcaseSaveErr) {
                return done(showcaseSaveErr);
              }

              // Set assertions on new Showcase
              (showcaseSaveRes.body.name).should.equal(showcase.name);
              should.exist(showcaseSaveRes.body.user);
              should.equal(showcaseSaveRes.body.user._id, orphanId);

              // force the Showcase to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Showcase
                    agent.get('/api/showcases/' + showcaseSaveRes.body._id)
                      .expect(200)
                      .end(function (showcaseInfoErr, showcaseInfoRes) {
                        // Handle Showcase error
                        if (showcaseInfoErr) {
                          return done(showcaseInfoErr);
                        }

                        // Set assertions
                        (showcaseInfoRes.body._id).should.equal(showcaseSaveRes.body._id);
                        (showcaseInfoRes.body.name).should.equal(showcase.name);
                        should.equal(showcaseInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Showcase.remove().exec(done);
    });
  });
});
