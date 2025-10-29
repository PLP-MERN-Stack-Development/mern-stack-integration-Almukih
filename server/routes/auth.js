const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register',
  body('username').isString().trim().notEmpty(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, password } = req.body;
    try {
      if (await User.findOne({ username })) return res.status(409).json({ message: 'User exists' });
      const hash = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hash });
      await user.save();
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1d' });
      res.status(201).json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login
router.post('/login',
  body('username').isString().trim().notEmpty(),
  body('password').isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if(!user) return res.status(401).json({ message: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password);
      if(!ok) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1d' });
      res.json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
