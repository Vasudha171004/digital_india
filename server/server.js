const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes    = require('./routes/authRoutes');
const aadhaarRoutes = require('./routes/aadhaarRoutes');
const digilockerRoutes = require('./routes/digilockerRoutes');
const ehospitalRoutes  = require('./routes/ehospitalRoutes');
const quizRoutes    = require('./routes/quizRoutes');
const userRoutes    = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/aadhaar', aadhaarRoutes);
app.use('/api/digilocker', digilockerRoutes);
app.use('/api/ehospital', ehospitalRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🔌 Server started on port ${PORT}`));
