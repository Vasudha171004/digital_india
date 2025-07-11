const mongoose = require('mongoose');

const aadhaarUserSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  otp: String,
  address: {
    name: String,
    house: String,
    locality: String,
    pin: String,
    district: String,
    state: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('AadhaarUser', aadhaarUserSchema);
