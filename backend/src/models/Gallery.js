// backend/src/models/Gallery.js
const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Please provide an image'],
  },
  altText: { type: String, trim: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gallery', GallerySchema);