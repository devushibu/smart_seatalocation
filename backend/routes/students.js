const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const { Student, SeatAllocation } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');
const { parseCSV } = require('../utils/csvHelper');

// Set up multer memory storage for CSV files
const upload = multer({ storage: multer.memoryStorage() });

// GET all students (with filter and search)
router.get('/', protect, adminOnly, async (req, res) => {
  const { department, semester, search } = req.query;
  const filter = {};
  if (department) filter.department = department;
  if (semester) filter.semester = semester;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { registerNumber: { $regex: search, $options: 'i' } }
    ];
  }
  try {
    const students = await Student.find(filter).sort({ registerNumber: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST Add Student Manually
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, registerNumber, department, semester } = req.body;
  if (!name || !registerNumber || !department || !semester) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const existing = await Student.findOne({ registerNumber });
    if (existing) return res.status(400).json({ message: `Student ${registerNumber} already exists` });
    
    const hashedPassword = await bcrypt.hash(registerNumber, 10);
    const student = await Student.create({
      name,
      registerNumber,
      department,
      semester,
      password: hashedPassword
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST CSV Upload
router.post('/upload-csv', protect, adminOnly, upload.single('file'), async (req, res) => {
  const { department, semester } = req.body;
  if (!req.file || !department || !semester) return res.status(400).json({ message: 'File, department, and semester are required' });
  try {
    const csvContent = req.file.buffer.toString('utf-8');
    const rows = parseCSV(csvContent);
    let successCount = 0;
    let duplicateCount = 0;
    for (const row of rows) {
      const regNo = row.registernumber || row.regno || row['register number'] || Object.values(row)[0];
      const name = row.studentname || row.name || row['student name'] || Object.values(row)[1];
      if (!regNo || !name) continue;
      
      const existing = await Student.findOne({ registerNumber: regNo });
      if (existing) { duplicateCount++; continue; }
      
      const hashedPassword = await bcrypt.hash(regNo, 10);
      await Student.create({ registerNumber: regNo, name, department, semester, password: hashedPassword });
      successCount++;
    }
    res.json({ message: 'CSV parsed', successCount, duplicateCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT Update Student
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { name, registerNumber, department, semester } = req.body;
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (registerNumber && registerNumber !== student.registerNumber) {
      const existing = await Student.findOne({ registerNumber });
      if (existing) return res.status(400).json({ message: 'Register number already in use' });
      student.registerNumber = registerNumber;
    }
    if (name) student.name = name;
    if (department) student.department = department;
    if (semester) student.semester = semester;
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE Student
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await SeatAllocation.deleteOne({ student: student._id });
    await Student.deleteOne({ _id: student._id });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
