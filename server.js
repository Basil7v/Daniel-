const http = require('http');
const socketIo = require('socket.io');

// Create an HTTP server
const server = http.createServer();

// Attach Socket.io to the server
const io = socketIo(server);

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

// Start the server on port 3000 (Render uses PORT env variable, but 3000 is safe for testing)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
