const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const therapistRoutes = require('./routes/therapists');
const chatRoutes = require('./routes/chat');
// const bookingRoutes = require('./routes/bookings')(io); // moved below
const journalRoutes = require('./routes/journal');
const moodRoutes = require('./routes/mood');
const adminRoutes = require('./routes/admin');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/auth');

const app = express();
const server = createServer(app);

// Trust proxy headers (needed on Render/other proxies for correct client IPs)
app.set('trust proxy', 1);

// Serve static files for uploads (avatars, etc.)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: 'https://mindease-two-iota.vercel.app',
    methods: ["GET", "POST"]
  }
});

// Now that io is defined, import bookingRoutes
const bookingRoutes = require('./routes/bookings')(io);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindease', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Security middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS configuration (must be BEFORE rate limiting and routes)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://mindease-two-iota.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser tools and same-origin
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate limiting (AFTER CORS so even 429 has CORS headers)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
  // Do not rate-limit CORS preflight requests
  skip: (req) => req.method === 'OPTIONS'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user-specific room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Handle private messages
  socket.on('privateMessage', (data) => {
    const { recipientId, message } = data;
    socket.to(recipientId).emit('newMessage', message);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(data.recipientId).emit('userTyping', data);
  });

  socket.on('stopTyping', (data) => {
    socket.to(data.recipientId).emit('userStoppedTyping', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };