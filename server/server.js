// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables and connect to DB
dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Route Imports
const authRoutes    = require('./routes/authRoutes');
const aadhaarRoutes = require('./routes/aadhaarRoutes');
const digilockerRoutes = require('./routes/digilockerRoutes');
const ehospitalRoutes  = require('./routes/ehospitalRoutes');
const quizRoutes    = require('./routes/quizRoutes');
const userRoutes    = require('./routes/userRoutes');

// ✅ Route Mounting (use proper base paths for each router)
app.use('/api/auth', authRoutes);         // Auth routes (register, login)
app.use('/api/aadhaar', aadhaarRoutes);   // Aadhaar-related routes
app.use('/api/digilocker', digilockerRoutes);
app.use('/api/ehospital', ehospitalRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);

// Root Route (for basic API check)
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🔌 Server started on port ${PORT}`));
