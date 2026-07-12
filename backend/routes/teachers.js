const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const { Teacher, TeacherAllocation } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');
const { parseCSV } = require('../utils/csvHelper');

// Set up multer memory storage for CSV files
const upload = multer({ storage: multer.memoryStorage() });

// GET all teachers
router.get('/', protect, adminOnly, async (req, res) => {
  const { search } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } }
    ];
  }
  try {
    const teachers = await Teacher.find(filter).sort({ employeeId: 1 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST Add Teacher manually
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, employeeId, department } = req.body;
  if (!name || !employeeId || !department) return res.status(400).json({ message: 'All fields are required' });
  try {
    const existing = await Teacher.findOne({ employeeId });
    if (existing) return res.status(400).json({ message: `Teacher ${employeeId} already exists` });
    
    const hashedPassword = await bcrypt.hash(employeeId, 10);
    const teacher = await Teacher.create({ name, employeeId, department, password: hashedPassword });
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST Upload Teacher CSV
router.post('/upload-csv', protect, adminOnly, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Please upload a CSV file' });
  try {
    const csvContent = req.file.buffer.toString('utf-8');
    const rows = parseCSV(csvContent);
    let successCount = 0;
    let duplicateCount = 0;
    for (const row of rows) {
      const empId = row.employeeid || row.empid || row['employee id'] || Object.values(row)[0];
      const name = row.teachername || row.name || row['teacher name'] || Object.values(row)[1];
      const dept = row.department || row.dept || Object.values(row)[2];
      if (!empId || !name || !dept) continue;
      
      const existing = await Teacher.findOne({ employeeId: empId });
      if (existing) { duplicateCount++; continue; }
      
      const hashedPassword = await bcrypt.hash(empId, 10);
      await Teacher.create({ employeeId: empId, name, department: dept, password: hashedPassword });
      successCount++;
    }
    res.json({ message: 'CSV parsed', successCount, duplicateCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT Update Teacher
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { name, employeeId, department } = req.body;
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    if (employeeId && employeeId !== teacher.employeeId) {
      const existing = await Teacher.findOne({ employeeId });
      if (existing) return res.status(400).json({ message: 'Employee ID already in use' });
      teacher.employeeId = employeeId;
    }
    if (name) teacher.name = name;
    if (department) teacher.department = department;
    await teacher.save();
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE Teacher
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    await TeacherAllocation.deleteOne({ teacher: teacher._id });
    await Teacher.deleteOne({ _id: teacher._id });
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
