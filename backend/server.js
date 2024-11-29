// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');

// MongoDB session store (for persistent sessions)
const MongoStore = require('connect-mongo');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', // Secret key to sign the session ID cookie
    resave: false, // Don't save session if it wasn't modified
    saveUninitialized: false, // Don't create session until something is stored
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // Use MongoDB to store sessions
      ttl: 14 * 24 * 60 * 60, // Session expiration time (14 days)
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Only set secure cookies in production
      maxAge: 14 * 24 * 60 * 60 * 1000, // Session cookie expires in 14 days
      httpOnly: true, // Helps mitigate XSS attacks
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
