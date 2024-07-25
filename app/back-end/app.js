const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes'); // Combined routes file
const { handleConnection } = require('./controllers/socketController'); // Socket controller
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Socket.io connection
handleConnection(io);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
