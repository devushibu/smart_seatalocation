const express = require('express');
const router = express.Router();
const { SeatAllocation, Classroom } = require('../models');
const { protect, studentOnly } = require('../middleware/auth');

// GET Student portal seat
router.get('/my-seat', protect, studentOnly, async (req, res) => {
  try {
    const allocation = await SeatAllocation.findOne({ student: req.user.id });
    if (!allocation) return res.json({ allocated: false });
    
    // Look up classroom details to get building name
    const classroom = await Classroom.findOne({ roomNumber: allocation.roomNumber });
    const buildingName = classroom ? classroom.building : '';

    res.json({ 
      allocated: true, 
      roomNumber: allocation.roomNumber, 
      seatNumber: allocation.seatNumber,
      building: buildingName
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
