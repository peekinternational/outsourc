'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  secure: {
    ssl: true,
    // privateKey: './config/sslcerts/key.pem',
    // certificate: './config/sslcerts/cert.pem'
   // ca  : './config/sslcerts/newssl/outsourcingok_com.ca-bundle',
   privateKey  : './config/sslcerts/outsourcingok_com.key',
   certificate : './config/sslcerts/outsourcingok_com.crt'
  },
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/job-call-me',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      //stream: {
      //  directoryPath: process.cwd(),
      //  fileName: 'access.log',
      //  rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
      //    active: false, // activate to use rotating logs 
      //    fileName: 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
      //    frequency: 'daily',
      //    verbose: false
      //  }
      //}
    }
  },
  app: {
    title: defaultEnvConfig.app.title
    // title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '1391957580842029',
    clientSecret: process.env.FACEBOOK_SECRET || '501f9a1068812b7f969e5ee4ded0e942',
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['email']
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '872895791766-vll254tc26r0i5p2hgmnflvvsp4p81sh.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'A_1tXG0J8xBL-fnUPCjXrGiI',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: true
  },
  mailer: {
    from: process.env.MAILER_FROM || 'no-reply@outsourcingok.com',
    options: {
      // service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
      // auth: {
      //   user: process.env.MAILER_EMAIL_ID || 'peek.inayat@gmail.com',
      //   pass: process.env.MAILER_PASSWORD || '03114186603'
      // }
      host: 'smtp.cafe24.com',
      port: 587,
      secure: false, // use SSL
      // debug: true,
      auth: {
        user: 'no-reply@outsourcingok.com',
        pass: 'link6412'
      },
    }
  },
  livereload: true,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true' ? true : false,
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'false' ? false : true,
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user','admin', 'company','individual']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['company','individual', 'admin', 'user']
      }
    }
  },
  sessionSecret: process.env.SESSION_SECRET || 'super amazing secret'
};
