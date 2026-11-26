const io = require('socket.io')(3000);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // When YOU click on the web dashboard
    socket.on('control-command', (data) => {
        // data contains { type: 'click', x: 100, y: 200 }
        // Broadcast to the specific phone
        io.to(socket.id).emit('execute-command', data);
    });

    // When the PHONE sends screen data
    socket.on('screen-data', (data) => {
        // Save to database or stream to dashboard
        console.log('Phone screen update:', data);
    });
});
