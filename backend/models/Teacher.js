const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
