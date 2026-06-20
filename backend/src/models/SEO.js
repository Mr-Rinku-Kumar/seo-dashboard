// backend/src/models/SEO.js
const mongoose = require('mongoose');

const SEOSchema = new mongoose.Schema({
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  focusKeywords: { type: String, trim: true },
  canonicalURL: { type: String, trim: true },
  robotsIndex: {
    type: String,
    enum: ['index', 'noindex'],
    default: 'index',
  },
  robotsFollow: {
    type: String,
    enum: ['follow', 'nofollow'],
    default: 'follow',
  },
  ogTitle: { type: String, trim: true },
  ogDescription: { type: String, trim: true },
  ogImage: { type: String, trim: true },
  twitterTitle: { type: String, trim: true },
  twitterDescription: { type: String, trim: true },
  twitterImage: { type: String, trim: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SEO', SEOSchema);