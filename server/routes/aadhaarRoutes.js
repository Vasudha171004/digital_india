// routes/aadhaarRoutes.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');

// 📤 POST: Send OTP (mock)
router.post('/send-otp', (req, res) => {
  const { aadhaarNumber } = req.body;
  if (!aadhaarNumber || aadhaarNumber.length !== 12) {
    return res.status(400).json({ message: 'Invalid Aadhaar number' });
  }
  const otp = '654321';
  res.status(200).json({ message: 'OTP sent', otp });
});

// 🔐 POST: Verify OTP (mock)
router.post('/verify-otp', protect, async (req, res) => {
  const { otp } = req.body;
  if (otp !== '654321') {
    return res.status(401).json({ message: 'Invalid OTP' });
  }
  res.json({ message: 'OTP verified' });
});

// 📝 POST: Submit Address Form
router.post('/address-form', protect, async (req, res) => {
  const { house, street, district, state, pincode } = req.body;
  if (!house || !district || !state || !pincode) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.aadhaarAddress = { house, street, district, state, pincode };
    user.aadhaarStatus = 'pending';
    await user.save();

    res.status(200).json({ message: 'Address saved' });
  } catch (err) {
    console.error('Address save error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔍 GET: Preview Saved Address
router.get('/address/preview', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.aadhaarAddress) {
      return res.status(404).json({ message: 'No address found' });
    }

    res.status(200).json({ address: user.aadhaarAddress });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching address' });
  }
});

// 📦 GET: Aadhaar Update Status
router.get('/address/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ status: user.aadhaarStatus });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching status' });
  }
});

module.exports = router;
