import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: mongoose.Schema.Types.Mixed, // False when not checked out, else it's a date
    required: true,
  },
  comment: {
    type: String
  },
  timeWorked: {
    type: Number // In minutes
  }
});

const WorkSlot = mongoose.model('WorkSlot', slotSchema);

export default WorkSlot;
