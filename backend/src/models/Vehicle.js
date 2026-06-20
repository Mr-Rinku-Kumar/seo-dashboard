// backend/src/models/Vehicle.js
const mongoose = require('mongoose');

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

const VehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a vehicle name'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    sparse: true, // Allow null/undefined but enforce uniqueness when set
  },
  image: {
    type: String,
    required: [true, 'Please provide a vehicle image'],
  },
  seatingCapacity: {
    type: Number,
    required: [true, 'Please provide seating capacity'],
    min: 1,
  },
  description: {
    type: String,
    trim: true,
  },
  features: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate slug before saving
VehicleSchema.pre('save', async function(next) {
  if (!this.slug || this.isModified('name')) {
    let baseSlug = generateSlug(this.name);
    let slug = baseSlug;
    let counter = 1;
    
    // Check if slug already exists
    while (true) {
      const existing = await mongoose.models.Vehicle.findOne({ slug, _id: { $ne: this._id } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
    console.log(`✅ Generated slug: ${slug} for vehicle: ${this.name}`);
  }
  next();
});

module.exports = mongoose.model('Vehicle', VehicleSchema);