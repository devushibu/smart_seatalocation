const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  registerNumber: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
