const jwt = require('jsonwebtoken');
const User = require('../models/User'); // ✅ Correct model

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // ✅ Use correct User model

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // ✅ Attach full user object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = protect;
