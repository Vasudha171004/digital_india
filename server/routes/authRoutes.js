// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 🔐 Helper: Generate JWT Token 
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not set in environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// 📌 POST /api/auth/register – Register New User
router.post('/register', async (req, res) => {
  const { fullName, email, phoneNumber, address, password, gender, dob } = req.body;
  if (!fullName || !email || !phoneNumber || !address || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  try {
    // Check if user already exists by email or phone
    const existingEmail = await User.findOne({ email });
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingEmail || existingPhone) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }
    // Hash password and create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
  fullName,
  email,
  phoneNumber,
  address,
  password: hashedPassword,
  gender,
  dob
});
    // Return user info and token if creation was successful
    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        token: token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          address: user.address,
          completedModules: user.completedModules,
          quizStatus: user.quizStatus
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// 🔐 POST /api/auth/login – Authenticate User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Successful login: return token and user details (excluding password)
    const token = generateToken(user._id);
    res.status(200).json({
      token: token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        completedModules: user.completedModules,
        quizStatus: user.quizStatus
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
