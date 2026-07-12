const express = require('express');
const router = express.Router();
const { Classroom, SeatAllocation, TeacherAllocation } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');

// GET all classrooms (supports filtering for available classrooms only)
router.get('/', protect, adminOnly, async (req, res) => {
  const { available } = req.query;
  try {
    const query = {};
    if (available === 'true') {
      // Find room numbers that are already allocated
      const allocatedRooms = await SeatAllocation.distinct('roomNumber');
      query.roomNumber = { $nin: allocatedRooms };
    }
    const classrooms = await Classroom.find(query).sort({ roomNumber: 1 });
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST Create Classroom
router.post('/', protect, adminOnly, async (req, res) => {
  const { roomNumber, building, floor, benches, seatsPerBench } = req.body;
  if (!roomNumber || !building || !floor || benches === undefined || seatsPerBench === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const existing = await Classroom.findOne({ roomNumber });
    if (existing) return res.status(400).json({ message: `Classroom ${roomNumber} already exists` });
    const classroom = await Classroom.create({ roomNumber, building, floor, benches, seatsPerBench });
    res.status(201).json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT Update Classroom
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { roomNumber, building, floor, benches, seatsPerBench } = req.body;
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
    if (roomNumber && roomNumber !== classroom.roomNumber) {
      const existing = await Classroom.findOne({ roomNumber });
      if (existing) return res.status(400).json({ message: 'Room number already in use' });
      classroom.roomNumber = roomNumber;
    }
    if (building) classroom.building = building;
    if (floor) classroom.floor = floor;
    if (benches !== undefined) classroom.benches = benches;
    if (seatsPerBench !== undefined) classroom.seatsPerBench = seatsPerBench;
    await classroom.save();
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE Classroom
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
    await SeatAllocation.deleteMany({ roomNumber: classroom.roomNumber });
    await TeacherAllocation.deleteMany({ roomNumber: classroom.roomNumber });
    await Classroom.deleteOne({ _id: classroom._id });
    res.json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
