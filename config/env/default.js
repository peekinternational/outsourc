'use strict';

module.exports = {
  app: {
    title: 'OutSourcingOk',
    description: '아웃소싱오케이 세계최초국내일등 IT 프로젝트 콘테스트 화상채팅중개전문',
    keywords: 'outsource, outsourcing, , free, freelancer, freelancing, outsok, out, source, korea, outsourcing, job, jobcallme, mongodb, express, angularjs, node.js, mongoose, passport',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: 3000,
  // port: process.env.PORT || 3000,
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './modules/users/client/img/profile/uploads/', // Profile image upload destination path
      limits: {
        fileSize: 5*1024*1024 // Max file size in bytes (5 MB)
      }
    },
    coverUpload: {
      dest: './modules/users/client/img/cover/uploads/', // Profile cover image upload destination path
      limits: {
        fileSize: 10*1024*1024 // Max file size in bytes (10 MB)
      }
    },
    profilePortfolioUpload: {
      dest: './modules/profiles/client/img/portfolio/', // Profile portfolio image upload destination path
      limits: {
        fileSize: 5*1024*1024 // Max file size in bytes (5 MB)
      }
    },
    projectFileUpload: {
      dest: './modules/projects/client/img/uploads/', // Project file upload destination path
      limits: {
        fileSize: 10*1024*1024 // Max file size in bytes (10 MB)
      }
    },
    projectDisputeFileUpload: {
      dest: './modules/projects/client/img/dispute/', // Project dispute file upload destination path
      limits: {
        fileSize: 10*1024*1024 // Max file size in bytes (10MB)
      }
    },
    contestFileUpload: {
      dest: './modules/contests/client/img/uploads/', // Contest file upload destination path
      limits: {
        fileSize: 10*1024*1024 // Max file size in bytes (10 MB) 
      }
    },
    showCaseFileUpload: {
      dest: './modules/showcases/client/img/uploads/', // showcase upload destination path
      limits: {
        fileSize: 10*1024*1024 // Max file size in bytes (10 MB) 
      }
    }
  }
}; 
