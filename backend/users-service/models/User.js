const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  socketId: { type: String },
  collabs: [{ type: String }],
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
