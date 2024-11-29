const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming the User model is already created

const router = express.Router();

// User Signup
// User Signup with Role (Teacher/Student)
router.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;
  
    // Only allow 'teacher' or 'student' roles
    if (!['teacher', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either "teacher" or "student"' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const newUser = new User({ username, password: hashedPassword, role });
      await newUser.save(); // Save the new user to the database
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error creating user', error });
    }
});
  
// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }); // Find user by username
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Check if credentials are correct
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;
