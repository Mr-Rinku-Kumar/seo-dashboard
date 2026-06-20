// backend/src/models/Hero.js
const mongoose = require('mongoose');

const HeroSchema = new mongoose.Schema({
  mainHeading: {
    type: String,
    required: [true, 'Please provide a main heading'],
    trim: true,
  },
  subHeading: { type: String, trim: true },
  bannerImage: {
    type: String,
    required: [true, 'Please provide a banner image'],
  },
  ctaText: { type: String, trim: true },
  ctaURL: { type: String, trim: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Hero', HeroSchema);