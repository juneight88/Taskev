const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: { type: String, enum: ['Pending', 'Done'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
