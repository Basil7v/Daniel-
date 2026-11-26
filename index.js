const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Added to help find the file

// Create an HTTP server
const server = http.createServer();

// Attach Socket.io to the server
const io = socketIo(server);

// IMPORTANT: Serve the Socket.IO client library so the Android app can load it
server.on('request', (req, res) => {
    if (req.url === '/socket.io/socket.io.js') {
        res.sendFile(path.join(__dirname, 'node_modules', 'socket.io-client', 'dist', 'socket.io.js'));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

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
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
