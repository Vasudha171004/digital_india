// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
  type: String,
  enum: ['Male', 'Female', 'Other']
},
dob: {
  type: String
},
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  address: { 
    type: String, 
    required: true 
  },
  password: {
    type: String,
    required: true,
  },
  completedModules: {
    type: [String],
    default: []
  },
  quizStatus: {
    type: Map,
    of: String,
    default: {}
  },
  aadhaarAddress: {
  house: String,
  street: String,
  district: String,
  state: String,
  pincode: String
},
aadhaarStatus: {
  type: String,
  enum: ['pending', 'approved', 'rejected'],
  default: 'pending'
}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
