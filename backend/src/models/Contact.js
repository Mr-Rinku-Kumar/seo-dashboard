// backend/src/models/Contact.js
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  address: { type: String, trim: true },
  googleMapEmbed: { type: String, trim: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contact', ContactSchema);