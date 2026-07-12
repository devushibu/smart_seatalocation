const express = require('express');
const router = express.Router();
const { Student, Teacher, Classroom, SeatAllocation, TeacherAllocation } = require('../models');
const { protect, adminOnly, studentOnly, teacherOnly } = require('../middleware/auth');

// GET Stats for dashboard metrics
router.get('/stats', protect, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const classrooms = await Classroom.find();
    const totalClassrooms = classrooms.length;
    const totalCapacity = classrooms.reduce((sum, room) => sum + room.capacity, 0);
    const allocatedSeats = await SeatAllocation.countDocuments();
    const availableSeats = Math.max(0, totalCapacity - allocatedSeats);
    res.json({ totalStudents, totalTeachers, totalClassrooms, totalCapacity, allocatedSeats, availableSeats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET unique student groups with counts (excluding already allocated students)
router.get('/metadata/groups', protect, adminOnly, async (req, res) => {
  try {
    const allocatedStudentIds = await SeatAllocation.distinct('student');
    const groups = await Student.aggregate([
      { $match: { _id: { $nin: allocatedStudentIds } } },
      { $group: { _id: { department: '$department', semester: '$semester' }, count: { $sum: 1 } } },
      { $project: { _id: 0, department: '$_id.department', semester: '$_id.semester', count: 1 } },
      { $sort: { department: 1, semester: 1 } }
    ]);
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET seat assignments (with filter & search)
router.get('/', protect, adminOnly, async (req, res) => {
  const { roomNumber, search } = req.query;
  const filter = {};
  if (roomNumber) filter.roomNumber = roomNumber;

  try {
    if (search) {
      // Since student names are stored in the referenced Student schema,
      // we query the Student collection to get IDs matching the name search first.
      const matchingStudents = await Student.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      const studentIds = matchingStudents.map(s => s._id);

      // Now query allocations that match either the student IDs, registerNumber, or department
      filter.$or = [
        { student: { $in: studentIds } },
        { registerNumber: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const allocations = await SeatAllocation.find(filter)
      .populate('student', 'name registerNumber department semester')
      .sort({ roomNumber: 1, seatNumber: 1 });
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST Run interleaving allocation algorithm with teacher auto-allocation
router.post('/generate', protect, adminOnly, async (req, res) => {
  const { groups, classrooms } = req.body;
  if (!groups || !groups.length || !classrooms || !classrooms.length) {
    return res.status(400).json({ message: 'Please select groups and classrooms' });
  }
  try {
    // Exclude students who already have an active seat allocation in another classroom
    const allocatedStudentIds = await SeatAllocation.distinct('student');

    const studentQuery = {
      $or: groups.map(g => ({ department: g.department, semester: g.semester })),
      _id: { $nin: allocatedStudentIds }
    };
    const students = await Student.find(studentQuery);
    const totalStudents = students.length;
    if (totalStudents === 0) return res.status(400).json({ message: 'No available students found in the selected groups' });

    // Exclude classrooms that are already occupied
    const occupiedRoomNumbers = await SeatAllocation.distinct('roomNumber');
    const filteredClassrooms = classrooms.filter(r => !occupiedRoomNumbers.includes(r));
    if (filteredClassrooms.length === 0) {
      return res.status(400).json({ message: 'All selected classrooms are already occupied.' });
    }

    const roomRecords = await Classroom.find({ roomNumber: { $in: filteredClassrooms } });
    const totalCapacity = roomRecords.reduce((sum, r) => sum + r.capacity, 0);
    if (totalCapacity < totalStudents) {
      return res.status(400).json({ message: 'Insufficient capacity in available classrooms', students: totalStudents, capacity: totalCapacity });
    }

    roomRecords.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));

    // Interleave student list
    const groupsMap = {};
    students.forEach(student => {
      const key = `${student.department}-${student.semester}`;
      if (!groupsMap[key]) groupsMap[key] = [];
      groupsMap[key].push(student);
    });

    const queues = Object.keys(groupsMap).map(key => ({ key, students: groupsMap[key] }));
    const interleavedStudents = [];
    let lastKey = null;

    for (let i = 0; i < totalStudents; i++) {
      const availableQueues = queues.filter(q => q.students.length > 0);
      if (availableQueues.length === 0) break;
      let validQueues = availableQueues.filter(q => q.key !== lastKey);
      let targetQueue = null;
      if (validQueues.length > 0) {
        validQueues.sort((a, b) => b.students.length - a.students.length);
        targetQueue = validQueues[0];
      } else {
        availableQueues.sort((a, b) => b.students.length - a.students.length);
        targetQueue = availableQueues[0];
      }
      const nextStudent = targetQueue.students.pop();
      interleavedStudents.push(nextStudent);
      lastKey = targetQueue.key;
    }

    // Allocate seats
    const newAllocations = [];
    const roomsUsed = new Set();
    let studentIndex = 0;
    for (const room of roomRecords) {
      if (studentIndex >= totalStudents) break;
      for (let seat = 1; seat <= room.capacity; seat++) {
        if (studentIndex >= totalStudents) break;
        const currentStudent = interleavedStudents[studentIndex++];
        newAllocations.push({
          student: currentStudent._id,
          registerNumber: currentStudent.registerNumber,
          roomNumber: room.roomNumber,
          seatNumber: seat,
          department: currentStudent.department,
          semester: currentStudent.semester
        });
        roomsUsed.add(room.roomNumber);
      }
    }

    // Save student allocations
    await SeatAllocation.insertMany(newAllocations);

    // Auto-allocate available teachers (invigilators) to the rooms that received students
    const activeTeacherAssignments = await TeacherAllocation.distinct('teacher');
    const availableTeachers = await Teacher.find({ _id: { $nin: activeTeacherAssignments } });
    
    let teacherIndex = 0;
    for (const roomNum of roomsUsed) {
      if (teacherIndex >= availableTeachers.length) {
        console.warn(`No more available teachers for auto-allocation to room: ${roomNum}`);
        break; // Out of teachers, leave room unassigned or handle as warning
      }
      const selectedTeacher = availableTeachers[teacherIndex++];
      await TeacherAllocation.findOneAndUpdate(
        { roomNumber: roomNum },
        { teacher: selectedTeacher._id },
        { upsert: true, new: true }
      );
    }

    res.json({
      message: 'Seat allocation generated successfully',
      allocatedCount: newAllocations.length,
      roomsUsed: roomsUsed.size
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET Teacher assignments
router.get('/teachers', protect, adminOnly, async (req, res) => {
  try {
    const allocations = await TeacherAllocation.find()
      .populate('teacher', 'name employeeId department')
      .sort({ roomNumber: 1 });
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST Assign Teacher to room
router.post('/teacher', protect, adminOnly, async (req, res) => {
  const { teacherId, roomNumber } = req.body;
  if (!teacherId || !roomNumber) return res.status(400).json({ message: 'Teacher and Room are required' });
  try {
    const room = await Classroom.findOne({ roomNumber });
    if (!room) return res.status(404).json({ message: `Classroom ${roomNumber} does not exist` });
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    await TeacherAllocation.deleteMany({ teacher: teacherId });
    const assignment = await TeacherAllocation.findOneAndUpdate(
      { roomNumber },
      { teacher: teacherId },
      { new: true, upsert: true }
    );
    res.json({ message: 'Teacher assigned successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE Invigilation Assignment
router.delete('/teacher/:id', protect, adminOnly, async (req, res) => {
  try {
    await TeacherAllocation.deleteOne({ _id: req.params.id });
    res.json({ message: 'Assignment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// DELETE All Seat and Teacher allocations
router.delete('/', protect, adminOnly, async (req, res) => {
  try {
    await SeatAllocation.deleteMany({});
    await TeacherAllocation.deleteMany({});
    res.json({ message: 'All seat and teacher allocations cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE Seat allocation for a specific room
router.delete('/room/:roomNumber', protect, adminOnly, async (req, res) => {
  try {
    const { roomNumber } = req.params;
    await SeatAllocation.deleteMany({ roomNumber });
    await TeacherAllocation.deleteMany({ roomNumber });
    res.json({ message: `Allocations for room ${roomNumber} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
