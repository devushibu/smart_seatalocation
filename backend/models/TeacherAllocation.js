const mongoose = require('mongoose');

const TeacherAllocationSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  roomNumber: { type: String, required: true, unique: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('TeacherAllocation', TeacherAllocationSchema);
