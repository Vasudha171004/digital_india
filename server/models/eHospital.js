const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  department: String,
  doctor: String,
  date: String,
  time: String
}, { timestamps: true });

const ipdSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: String,
  ward: String,
  admitDate: String
}, { timestamps: true });

const labReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  labId: String,
  testName: String,
  result: String,
  date: String
}, { timestamps: true });

module.exports = {
  Appointment: mongoose.model('Appointment', appointmentSchema),
  IPD: mongoose.model('IPD', ipdSchema),
  LabReport: mongoose.model('LabReport', labReportSchema)
};
