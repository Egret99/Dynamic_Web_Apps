const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
})

io.on('connection', (socket) => {
    console.log("User connected");
    socket.broadcast.emit('chat message', "New user joined.");
    socket.on('disconnect', () => {
        console.log("user disconnected");
        socket.broadcast.emit('chat message', 'A user left.');
    });

    socket.on('chat message', (msg, name) => {
        io.emit('chat message', `${name}: ${msg}`);
    })
});

http.listen(3000, () => {
    console.log("App running on 3000");
});