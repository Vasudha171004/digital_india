const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const protect = require('../middleware/protectDigi');
const DigiLockerUser = require('../models/digilockerUser');

// Step 1: Login with phone number
router.post('/login', async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = '123456'; // mock OTP

  let user = await DigiLockerUser.findOne({ phoneNumber });
  if (!user) user = await DigiLockerUser.create({ phoneNumber, otp });
  else {
    user.otp = otp;
    await user.save();
  }

  res.status(200).json({ message: 'OTP sent', otp });
});

// Step 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const user = await DigiLockerUser.findOne({ phoneNumber });

  if (!user || user.otp !== otp) {
    return res.status(401).json({ message: 'Invalid OTP' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'OTP verified', token, user });
});

// Step 3: Fetch document list
router.get('/documents', protect, async (req, res) => {
  const user = await DigiLockerUser.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ documents: user.documents || [] });
});

// Step 4: Download document (mock URL)
router.get('/download/:docId', protect, async (req, res) => {
  const user = await DigiLockerUser.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // 🔥 Make sure toString() is used here
  const document = user.documents.find(doc => doc._id.toString() === req.params.docId);

  if (!document) return res.status(404).json({ message: 'Document not found' });

  res.json({ message: 'Download initiated', url: document.fileUrl });
});

// Dev-only: insert mock documents
router.post('/mock-docs', protect, async (req, res) => {
  const user = await DigiLockerUser.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.documents = [
    {
      name: 'PAN Card',
      type: 'ID',
      issuedBy: 'Income Tax Department',
      issueDate: '2018-05-10',
      fileUrl: 'https://example.com/mock_pan.pdf'
    },
    {
      name: 'Driving License',
      type: 'License',
      issuedBy: 'RTO Chennai',
      issueDate: '2020-01-15',
      fileUrl: 'https://example.com/mock_dl.pdf'
    }
  ];
  await user.save();

  res.status(201).json({ message: 'Mock documents added', documents: user.documents });
});
module.exports = router;