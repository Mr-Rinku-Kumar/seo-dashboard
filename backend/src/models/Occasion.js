// backend/src/models/Occasion.js
const mongoose = require('mongoose');

const OccasionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: { type: String, trim: true },
  image: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Occasion', OccasionSchema);