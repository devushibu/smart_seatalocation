const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin, Student, Teacher } = require('../models');
const { protect } = require('../middleware/auth');

// POST Login
router.post('/login', async (req, res) => {
  const { role, username, employeeId, registerNumber, password } = req.body;
  try {
    let user = null;
    let identifier = '';
    
    if (role === 'admin') {
      if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
      user = await Admin.findOne({ username });
      identifier = username;
    } else if (role === 'teacher') {
      // Accept teacher name from req.body parameters (name, username, or employeeId)
      const teacherName = req.body.name || req.body.username || req.body.employeeId;
      if (!teacherName || !password) return res.status(400).json({ message: 'Teacher Name and password are required' });
      
      // Case-insensitive lookup by teacher name
      user = await Teacher.findOne({ name: { $regex: new RegExp("^" + teacherName.trim() + "$", "i") } });
      
      // Store employeeId as the unique token identifier for session queries
      identifier = user ? user.employeeId : teacherName;
    } else if (role === 'student') {
      // Accept name via the body keys name, username, or registerNumber
      const studentName = req.body.name || req.body.username || req.body.registerNumber;
      if (!studentName || !password) return res.status(400).json({ message: 'Student Name and password are required' });
      
      // Case-insensitive search by student name
      user = await Student.findOne({ name: { $regex: new RegExp("^" + studentName.trim() + "$", "i") } });
      
      // Use their unique registerNumber as the identifier for the token session
      identifier = user ? user.registerNumber : studentName;
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role, identifier, name: user.name || user.username },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '30d' }
    );
    res.json({
      token,
      user: {
        id: user._id,
        role,
        identifier,
        name: user.name || user.username,
        department: user.department || null,
        semester: user.semester || null
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET Fetch profile info
router.get('/me', protect, async (req, res) => {
  try {
    const { id, role } = req.user;
    let userDetails = null;
    if (role === 'admin') userDetails = await Admin.findById(id).select('-password');
    else if (role === 'teacher') userDetails = await Teacher.findById(id).select('-password');
    else if (role === 'student') userDetails = await Student.findById(id).select('-password');

    if (!userDetails) return res.status(404).json({ message: 'User not found' });
    res.json({ role, user: userDetails });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT Change Password
router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'All fields are required' });
  try {
    const { id, role } = req.user;
    let user = null;
    if (role === 'admin') user = await Admin.findById(id);
    else if (role === 'teacher') user = await Teacher.findById(id);
    else if (role === 'student') user = await Student.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
