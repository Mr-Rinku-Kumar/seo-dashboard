// backend/src/models/About.js
const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  image: { type: String, trim: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('About', AboutSchema);