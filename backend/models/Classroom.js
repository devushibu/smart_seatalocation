const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true, index: true },
  building: { type: String, required: true },
  floor: { type: String, required: true },
  benches: { type: Number, required: true },
  seatsPerBench: { type: Number, required: true },
  capacity: { type: Number, required: true }
}, { timestamps: true });

// Auto-calculate capacity before saving
ClassroomSchema.pre('validate', function(next) {
  if (this.benches && this.seatsPerBench) {
    this.capacity = this.benches * this.seatsPerBench;
  }
  next();
});

module.exports = mongoose.model('Classroom', ClassroomSchema);
