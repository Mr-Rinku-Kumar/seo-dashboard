// backend/src/models/Testimonial.js
const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Please provide customer name'],
    trim: true,
  },
  review: {
    type: String,
    required: [true, 'Please provide a review'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5,
  },
  customerImage: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);