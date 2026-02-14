const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  strokeData: { type: mongoose.Schema.Types.Mixed, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Drawing', drawingSchema);
