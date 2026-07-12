const express = require('express');
const router = express.Router();
const { SeatAllocation, TeacherAllocation, Classroom } = require('../models');
const { protect, teacherOnly } = require('../middleware/auth');

// GET Teacher portal classroom
router.get('/my-classroom', protect, teacherOnly, async (req, res) => {
  try {
    const allocation = await TeacherAllocation.findOne({ teacher: req.user.id });
    if (!allocation) return res.json({ assigned: false });

    // Look up classroom details to get building name
    const classroom = await Classroom.findOne({ roomNumber: allocation.roomNumber });
    const buildingName = classroom ? classroom.building : '';

    const studentsList = await SeatAllocation.find({ roomNumber: allocation.roomNumber })
      .populate('student', 'name registerNumber department semester')
      .sort({ seatNumber: 1 });

    res.json({ 
      assigned: true, 
      roomNumber: allocation.roomNumber, 
      building: buildingName,
      studentsCount: studentsList.length, 
      students: studentsList 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
