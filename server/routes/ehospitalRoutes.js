const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { Appointment, IPD, LabReport } = require('../models/eHospital');
const appointments = []; // 🗃️ Temp storage for demo

// ✅ POST: Book Appointment and return patientId
router.post('/appointments', async (req, res) => {
  try {
    const { fullName, age, gender, mobile, hospital, department, date } = req.body;

    const patientId = `PAT${Math.floor(100000 + Math.random() * 900000)}`;

    const newAppointment = {
      patientId,
      fullName,
      age,
      gender,
      mobile,
      hospital,
      department,
      date
    };

    appointments.push(newAppointment); // ✅ Store for later lab use

    res.status(200).json({
      message: 'Appointment booked successfully!',
      patientId
    });

  } catch (err) {
    console.error('Appointment error:', err);
    res.status(500).json({ message: 'Failed to book appointment' });
  }
});

// ✅ POST: IPD Admission (uses protected route)
router.post('/ipd', protect, async (req, res) => {
  const { patientId, admissionDate, ward, expectedDischargeDate, transferTo } = req.body;
  try {
    const ipd = await IPD.create({
      userId: req.user._id,
      patientId,
      admissionDate,
      ward,
      expectedDischargeDate,
      transferTo
    });
    res.status(201).json({ message: 'Admitted successfully', ipd });
  } catch (err) {
    console.error('IPD error:', err);
    res.status(500).json({ message: 'Error admitting patient' });
  }
});

// ✅ GET: Lab Report (protected)
router.get('/labreport', protect, async (req, res) => {
  const { labId } = req.query;

  // 🧠 Find matching appointment
  const patient = appointments.find(app => app.patientId === labId);

  if (patient) {
    return res.status(200).json({
      labId,
      patientName: patient.fullName,
      wbc: "5600 /µL",
      rbc: "4.9 million/µL",
      hemoglobin: "13.2 g/dL",
      platelet: "200,000 /µL",
      status: "Normal"
    });
  }

  return res.status(404).json({ message: "No lab report found for given ID." });
});

// ✅ POST: Mock Lab Report (dev-only)
router.post('/labreport/mock', protect, async (req, res) => {
  try {
    const report = await LabReport.create({
      userId: req.user._id,
      labId: "ABC123",
      testName: "Blood Test",
      result: "Hemoglobin normal",
      date: "2025-07-01"
    });
    res.status(201).json({ message: "Mock lab report created", report });
  } catch (err) {
    console.error('Mock lab error:', err);
    res.status(500).json({ message: "Error creating mock report" });
  }
});

module.exports = router;
