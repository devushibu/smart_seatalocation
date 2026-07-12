const mongoose = require('mongoose');

const SeatAllocationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  registerNumber: { type: String, required: true, index: true },
  roomNumber: { type: String, required: true, index: true },
  seatNumber: { type: Number, required: true },
  department: { type: String, required: true },
  semester: { type: String, required: true }
}, { timestamps: true });

SeatAllocationSchema.index({ roomNumber: 1, seatNumber: 1 }, { unique: true });
SeatAllocationSchema.index({ student: 1 }, { unique: true });

module.exports = mongoose.model('SeatAllocation', SeatAllocationSchema);
