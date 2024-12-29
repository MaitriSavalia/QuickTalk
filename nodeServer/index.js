const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

http.listen(8000, () => {
    console.log('Server running on port 8000');
});