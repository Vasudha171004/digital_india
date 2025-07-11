const mongoose = require('mongoose');

// Subdocument schema for individual documents
const documentSchema = new mongoose.Schema({
  name: String,
  type: String,
  issuedBy: String,
  issueDate: String,
  fileUrl: String
});

// Main DigiLocker user schema
const digilockerUserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true
  },
  otp: String,
  documents: [documentSchema]  // ✅ Array of document objects
});

module.exports = mongoose.model('DigiLockerUser', digilockerUserSchema);
