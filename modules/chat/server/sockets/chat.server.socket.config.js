'use strict';

var users = [];
var connections = [];
var indiviualId;
var myId;
var receiverId;
var callUsername;
var receivername;

// Create the chat configuration
module.exports = function (io, socket) {

    socket.on('disconnect', function (data) {
        users.splice(users.indexOf(socket.username), 1);
        connections.splice(connections.indexOf(socket), 1);
        updateUsernames();
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }
    socket.on('addUser', function (data) {
        socket.username = data.email;
        users.push({
            email: data.email,
            id: socket.id
        });
    });



    // socket.on('NewChatMessage', function (data) {
    //     // console.log("NewChatMessage: ", data);
    //     socket.emit(data.conversationWith + 'chatMessage', {
    //         sender: data.sender,
    //         message: data.message,
    //         conversationWith: data.conversationWith,
    //         time: new Date(),
    //         cid: data.cid
    //     });
    // });

    //Send message (updated)
    socket.on('NewChatMessage', function (data) {
        data.sender = data.sender;
        data.message = data.message;
        data.conversationWith = data.conversationWith;
        data.time = new Date();
        data.cid = data.cid;
        // Emit the 'chatMessage' event
        io.emit(data.conversationWith + 'NewChatMessage', data);
    });

    socket.on("NewVideoCall", function (data) {
        // console.log("NewChatMessage: ", data);
        var receivername;
        if (indiviualId === socket.id) {
            receiverId = myId;
        } else {
            receiverId = indiviualId;
        }
        for (var i = 0; i < users.length; i++) {
            if (receiverId === users[i].id) {
                receivername = users[i].email;
                console.log('This is receivers id ' + receiverId + '  and this is his name ' + receivername);
            }
        }
        io.to(receiverId).emit('videoCall', {
            callUsername: callUsername,
            room: data.room
        });
        io.to(socket.id).emit('videoCall', {
            callUsername: callUsername,
            room: data.room
        });
    });


    // Emit the status event when a new socket client is connected
    // io.emit('chatMessage', {
    //     type: 'status',
    //     text: 'Is now connected',
    //     created: Date.now(),
    //     profileImageURL: socket.request.user.profileImageURL,
    //     username: socket.request.user.username
    // });
    //For call function
    socket.on("NewCall", function (data) {
        // console.log("NewChatMessage: ", data);
        var receivername;
        if (indiviualId === socket.id) {
            receiverId = myId;
        } else {
            receiverId = indiviualId;
        }
        for (var i = 0; i < users.length; i++) {
            if (receiverId === users[i].id)
                receivername = users[i].email;
        }
        io.to(receiverId).emit('call', {
            callUsername: callUsername,
            room: data.room
        });
        io.to(socket.id).emit('call', {
            callUsername: callUsername,
            room: data.room
        });
    });

    //For Videocall function
    socket.on("NewVideoCall", function (data) {
        // console.log("NewChatMessage: ", data);
        var receivername;
        if (indiviualId === socket.id) {
            receiverId = myId;
        } else {
            receiverId = indiviualId;
        }
        for (var i = 0; i < users.length; i++) {
            if (receiverId === users[i].id) {
                receivername = users[i].email;
                console.log('This is receivers id ' + receiverId + '  and this is his name ' + receivername);
            }
        }
        io.to(receiverId).emit('videoCall', {
            callUsername: callUsername,
            room: data.room
        });
        io.to(socket.id).emit('videoCall', {
            callUsername: callUsername,
            room: data.room
        });
    });
    //callnotifications

    socket.on('callnotification', function (_receiver) {
        // console.log("New call notification: ");
        // var receivername;


        if (indiviualId === socket.id) {
            receiverId = myId;
        } else {
            receiverId = indiviualId;
        }
        // for (var i = 0; i < users.length; i++) {
        //     if (receiverId === users[i].id) {
        //         receivername = users[i].email;
        //     } else {
        //         console.log('User not found in notification');
        //     }
        // }
        console.log('This is notification receivers id in empty if ' + receiverId + '  and this is his name ' + receivername);

        console.log('This is notification receivers id in else ' + receiverId + '  and this is his name ' + receivername);
        io.to(receiverId).emit('answernotification', receivername);


    });
    socket.on('answer', function (data) {
        io.to(receiverId).emit('answers', data);
        io.to(myId).emit('answers', data);

        if (receivername === '') {
            
            if (indiviualId === socket.id) {
                receiverId = myId;
            } else {
                receiverId = indiviualId;
            }
            for (var i = 0; i < users.length; i++) {
                if (receiverId === users[i].id) {
                    receivername = users[i].email;
                } else {
                    console.log('User not found in notification');
                }
            }
            console.log('This is notification receivers id in empty if ' + receiverId + '  and this is his name ' + receivername);
        } else {
            console.log('This is notification receivers id in else ' + receiverId + '  and this is his name ' + receivername);
            io.to(receiverId).emit('answernotification', receivername);
        }
        socket.on('answer', function (data) {
            io.to(receiverId).emit('answers', data);
            io.to(myId).emit('answers', data);
        });
    });

    
    // Send a chat messages to all connected sockets when a message is received
    socket.on('contestComment', function (message) {
        message.type = 'message';
        message.created = Date.now();
        message.profileImageURL = socket.request.user.profileImageURL;
        message.username = socket.request.user.username;

        // Emit the 'chatMessage' event
        io.emit(message.text.contestId+'contestComment', message);
    });

    // send the uploaded against any contest to the employer
    socket.on('contestEntry', function (message) {
        io.emit(message.text.empName+'contestEntry', message);
    });

    // send the requested milestone to the employer
    socket.on('requestedMileStone', function (message) {
        io.emit(message.text.empName+'requestedMileStone', message);
    });

    // Project Notification 
    socket.on('ProjectNotif', function (data) {
        io.emit(data.subscriber + 'ProjectNotif', data);
    });

    // Emit the status event when a socket client is disconnected
    // socket.on('chatMessage', function () {
    //     io.emit('contestComment', {
    //         type: 'status',
    //         text: 'disconnected',
    //         created: Date.now(),
    //         username: socket.request.user.username
    //     });
    // });
};
