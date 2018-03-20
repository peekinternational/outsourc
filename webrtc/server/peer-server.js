var PeerServer = require('peer').PeerServer;
var server = PeerServer({port: 9001, path: '/peerjs'});

// var fs = require('fs');
// var PeerServer = require('peer').PeerServer;

// var server = PeerServer({
//   port: 9000,
//   ssl: {
//     key: fs.readFileSync('../ssl/ca.key'),
//     cert: fs.readFileSync('../ssl/ca.crt')
//   }
// });

// console.log("hello server " + server);