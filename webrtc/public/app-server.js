
// var https = require('https'),
//     fs = require('fs'), 
//     express = require('express'), 
//     app = express();
    
// var secureServer = https.createServer({
//     key: fs.readFileSync('../ssl/server.key'),
//     cert: fs.readFileSync('../ssl/server.crt'),
//     ca: fs.readFileSync('../ssl/ca.crt'),
//     requestCert: true,
//     rejectUnauthorized: false
// }, app).listen('3001', function() {
//     console.log("Secure Express server listening on port 3001");
// });


// var express = require('express');
// var app = express();
 

 
// app.listen(3000);
// app.use(express.static(__dirname));
// // app.use(express.static(__dirname, { index: 'default.htm' }));

//  console.log(express.static('public'));


var express = require('express');
var app = express();
 

 
app.listen(3001);
app.use(express.static(__dirname));
// app.use(express.static(__dirname, { index: 'default.htm' }));

 console.log(express.static('public'));