const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');

// Correct answers (indexed 0–3)
const correctAnswersMap = {
  aadhaar: [0, 2, 1, 3, 0],
  digilocker: [1, 0, 2, 1, 3],
  ehospital: [2, 3, 0, 1, 1]
};

// ✅ POST /api/quiz/submit
router.post('/submit', protect, async (req, res) => {
  const { module, answers } = req.body;
  const correctAnswers = correctAnswersMap[module];

  if (!correctAnswers) {
    return res.status(400).json({ message: 'Invalid module' });
  }

  let score = 0;
  correctAnswers.forEach((correct, index) => {
    if (answers[index] === correct) score++;
  });

  const passed = score >= 3; // pass if 3 or more correct

  const user = await User.findById(req.user._id);
  if (!user.quizStatus) user.quizStatus = {};
  user.quizStatus[module] = passed ? 'passed' : 'failed';
  if (passed && !user.completedModules.includes(module)) {
  user.completedModules.push(module);
  }

  // ✅ Mark module as complete if passed
  if (passed && !user.completedModules.includes(module)) {
    user.completedModules.push(module);
  }

  await user.save();

  res.json({ message: `You ${passed ? 'passed' : 'failed'} the quiz`, score });
});

// ✅ GET /api/quiz/status?module=aadhaar
router.get('/status', protect, async (req, res) => {
  const { module } = req.query;
  const user = await User.findById(req.user._id);
  const status = user.quizStatus?.[module] || 'not attempted';
  res.json({ module, status });
});

module.exports = router;
