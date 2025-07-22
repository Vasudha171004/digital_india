const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const protect = require('../middleware/protectDigi');
const DigiLockerUser = require('../models/digilockerUser');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer disk storage to save actual files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/login', async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = '123456';
  let user = await DigiLockerUser.findOne({ phoneNumber });
  if (!user) user = await DigiLockerUser.create({ phoneNumber, otp });
  else {
    user.otp = otp;
    await user.save();
  }
  res.status(200).json({ message: 'OTP sent', otp });
});

router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const user = await DigiLockerUser.findOne({ phoneNumber });
  if (!user || user.otp !== otp) return res.status(401).json({ message: 'Invalid OTP' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'OTP verified', token, user });
});

router.post('/upload', protect, upload.single('file'), async (req, res) => {
  const user = await DigiLockerUser.findById(req.user._id);
  if (!user || !req.file) return res.status(400).json({ message: 'Upload failed' });

  const newDoc = {
    name: req.file.originalname,
    type: req.file.mimetype,
    issuedBy: 'Self Upload',
    issueDate: new Date().toISOString().split('T')[0],
    fileUrl: `/uploads/${req.file.filename}`
  };

  user.documents.push(newDoc);
  await user.save();

  res.status(200).json({ message: 'Document uploaded successfully', document: newDoc });
});

router.get('/documents', protect, async (req, res) => {
  const user = await DigiLockerUser.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ documents: user.documents || [] });
});

router.get('/download/:docId', protect, async (req, res) => {
  const user = await DigiLockerUser.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const document = user.documents.find(doc => doc._id?.toString() === req.params.docId);
  if (!document) return res.status(404).json({ message: 'Document not found' });
  res.json({ message: 'Download initiated', url: document.fileUrl });
});

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
