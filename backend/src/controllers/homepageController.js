// backend/src/controllers/homepageController.js
const Hero = require('../models/Hero');
const About = require('../models/About');
const Vehicle = require('../models/Vehicle');
const Occasion = require('../models/Occasion');
const Testimonial = require('../models/Testimonial');
const Gallery = require('../models/Gallery');
const Contact = require('../models/Contact');

// ============ HERO ============
exports.getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.status(200).json({ success: true, data: hero || {} });
  } catch (error) {
    console.error('Get hero error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateHero = async (req, res) => {
  try {
    const { mainHeading, subHeading, bannerImage, ctaText, ctaURL } = req.body;
    let hero = await Hero.findOne();

    if (hero) {
      hero = await Hero.findByIdAndUpdate(
        hero._id,
        { mainHeading, subHeading, bannerImage, ctaText, ctaURL, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
    } else {
      hero = await Hero.create({ mainHeading, subHeading, bannerImage, ctaText, ctaURL });
    }

    res.status(200).json({
      success: true,
      data: hero,
      message: 'Hero updated successfully',
    });
  } catch (error) {
    console.error('Update hero error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPublicHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.status(200).json({ success: true, data: hero || {} });
  } catch (error) {
    console.error('Get public hero error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ ABOUT ============
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.status(200).json({ success: true, data: about || {} });
  } catch (error) {
    console.error('Get about error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    const { title, description, image } = req.body;
    let about = await About.findOne();

    if (about) {
      about = await About.findByIdAndUpdate(
        about._id,
        { title, description, image, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
    } else {
      about = await About.create({ title, description, image });
    }

    res.status(200).json({
      success: true,
      data: about,
      message: 'About updated successfully',
    });
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPublicAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.status(200).json({ success: true, data: about || {} });
  } catch (error) {
    console.error('Get public about error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ VEHICLES ============
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort('order');
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({
      success: true,
      data: vehicle,
      message: 'Vehicle created successfully',
    });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(200).json({
      success: true,
      data: vehicle,
      message: 'Vehicle updated successfully',
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.reorderVehicles = async (req, res) => {
  try {
    const { vehicleIds } = req.body;
    if (!vehicleIds || !Array.isArray(vehicleIds)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of vehicle IDs in order',
      });
    }

    for (let i = 0; i < vehicleIds.length; i++) {
      await Vehicle.findByIdAndUpdate(vehicleIds[i], { order: i });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicles reordered successfully',
    });
  } catch (error) {
    console.error('Reorder vehicles error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPublicVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ isActive: true }).sort('order');
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Get public vehicles error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Get vehicle by slug
exports.getVehicleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log('🔍 Looking for vehicle with slug:', slug);

    const vehicle = await Vehicle.findOne({ slug, isActive: true });

    if (!vehicle) {
      console.log('❌ Vehicle not found with slug:', slug);
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    console.log('✅ Vehicle found:', vehicle.name);
    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error('Get vehicle by slug error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Get vehicle by ID (fallback)
exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Looking for vehicle with ID:', id);

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      console.log('❌ Vehicle not found with ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    console.log('✅ Vehicle found:', vehicle.name);
    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error('Get vehicle by id error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Get all vehicle slugs
exports.getVehicleSlugs = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ isActive: true }).select('slug name');
    console.log('📋 Found vehicles:', vehicles.length);
    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error('Get vehicle slugs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ OCCASIONS ============
exports.getOccasions = async (req, res) => {
  try {
    const occasions = await Occasion.find();
    res.status(200).json({ success: true, data: occasions });
  } catch (error) {
    console.error('Get occasions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createOccasion = async (req, res) => {
  try {
    const occasion = await Occasion.create(req.body);
    res.status(201).json({
      success: true,
      data: occasion,
      message: 'Occasion created successfully',
    });
  } catch (error) {
    console.error('Create occasion error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateOccasion = async (req, res) => {
  try {
    const { id } = req.params;
    const occasion = await Occasion.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!occasion) {
      return res.status(404).json({ success: false, message: 'Occasion not found' });
    }
    res.status(200).json({
      success: true,
      data: occasion,
      message: 'Occasion updated successfully',
    });
  } catch (error) {
    console.error('Update occasion error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteOccasion = async (req, res) => {
  try {
    const { id } = req.params;
    const occasion = await Occasion.findByIdAndDelete(id);
    if (!occasion) {
      return res.status(404).json({ success: false, message: 'Occasion not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Occasion deleted successfully',
    });
  } catch (error) {
    console.error('Delete occasion error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPublicOccasions = async (req, res) => {
  try {
    const occasions = await Occasion.find({ isActive: true });
    res.status(200).json({ success: true, data: occasions });
  } catch (error) {
    console.error('Get public occasions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ TESTIMONIALS ============
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Testimonial created successfully',
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.status(200).json({
      success: true,
      data: testimonial,
      message: 'Testimonial updated successfully',
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get public testimonials error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ GALLERY ============
exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort('order');
    res.status(200).json({ success: true, data: gallery });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.create(req.body);
    res.status(201).json({
      success: true,
      data: galleryItem,
      message: 'Gallery item created successfully',
    });
  } catch (error) {
    console.error('Create gallery item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const galleryItem = await Gallery.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!galleryItem) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.status(200).json({
      success: true,
      data: galleryItem,
      message: 'Gallery item updated successfully',
    });
  } catch (error) {
    console.error('Update gallery item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const galleryItem = await Gallery.findByIdAndDelete(id);
    if (!galleryItem) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPublicGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort('order');
    res.status(200).json({ success: true, data: gallery });
  } catch (error) {
    console.error('Get public gallery error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ CONTACT ============
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne();
    res.status(200).json({ success: true, data: contact || {} });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { phone, email, address, googleMapEmbed } = req.body;
    let contact = await Contact.findOne();

    if (contact) {
      contact = await Contact.findByIdAndUpdate(
        contact._id,
        { phone, email, address, googleMapEmbed, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
    } else {
      contact = await Contact.create({ phone, email, address, googleMapEmbed });
    }

    res.status(200).json({
      success: true,
      data: contact,
      message: 'Contact updated successfully',
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPublicContact = async (req, res) => {
  try {
    const contact = await Contact.findOne();
    res.status(200).json({ success: true, data: contact || {} });
  } catch (error) {
    console.error('Get public contact error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};