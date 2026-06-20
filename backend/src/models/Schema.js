// backend/src/models/Schema.js
const mongoose = require('mongoose');

const SchemaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Organization', 'FAQ', 'Breadcrumb', 'Website', 'LocalBusiness'],
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Schema', SchemaSchema);