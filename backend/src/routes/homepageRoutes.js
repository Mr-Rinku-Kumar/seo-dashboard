// backend/src/routes/homepageRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const homepageController = require('../controllers/homepageController');

// ============ HERO ============
router.get('/hero', protect, authorize('admin', 'editor'), homepageController.getHero);
router.post('/hero', protect, authorize('admin', 'editor'), homepageController.updateHero);
router.get('/hero/public', homepageController.getPublicHero);

// ============ ABOUT ============
router.get('/about', protect, authorize('admin', 'editor'), homepageController.getAbout);
router.post('/about', protect, authorize('admin', 'editor'), homepageController.updateAbout);
router.get('/about/public', homepageController.getPublicAbout);

// ============ VEHICLES ============
// Public routes (no auth required)
router.get('/vehicles/public', homepageController.getPublicVehicles);
router.get('/vehicles/slug/:slug', homepageController.getVehicleBySlug);
router.get('/vehicles/slugs', homepageController.getVehicleSlugs);
router.get('/vehicles/:id', homepageController.getVehicleById);

// Protected routes (auth required)
router.get('/vehicles', protect, authorize('admin', 'editor'), homepageController.getVehicles);
router.post('/vehicles', protect, authorize('admin'), homepageController.createVehicle);
router.put('/vehicles/:id', protect, authorize('admin'), homepageController.updateVehicle);
router.delete('/vehicles/:id', protect, authorize('admin'), homepageController.deleteVehicle);
router.post('/vehicles/reorder', protect, authorize('admin'), homepageController.reorderVehicles);

// ============ OCCASIONS ============
router.get('/occasions', protect, authorize('admin', 'editor'), homepageController.getOccasions);
router.post('/occasions', protect, authorize('admin'), homepageController.createOccasion);
router.put('/occasions/:id', protect, authorize('admin'), homepageController.updateOccasion);
router.delete('/occasions/:id', protect, authorize('admin'), homepageController.deleteOccasion);
router.get('/occasions/public', homepageController.getPublicOccasions);

// ============ TESTIMONIALS ============
router.get('/testimonials', protect, authorize('admin', 'editor'), homepageController.getTestimonials);
router.post('/testimonials', protect, authorize('admin', 'editor'), homepageController.createTestimonial);
router.put('/testimonials/:id', protect, authorize('admin', 'editor'), homepageController.updateTestimonial);
router.delete('/testimonials/:id', protect, authorize('admin'), homepageController.deleteTestimonial);
router.get('/testimonials/public', homepageController.getPublicTestimonials);

// ============ GALLERY ============
router.get('/gallery', protect, authorize('admin', 'editor'), homepageController.getGallery);
router.post('/gallery', protect, authorize('admin', 'editor'), homepageController.createGalleryItem);
router.put('/gallery/:id', protect, authorize('admin', 'editor'), homepageController.updateGalleryItem);
router.delete('/gallery/:id', protect, authorize('admin'), homepageController.deleteGalleryItem);
router.get('/gallery/public', homepageController.getPublicGallery);

// ============ CONTACT ============
router.get('/contact', protect, authorize('admin', 'editor'), homepageController.getContact);
router.post('/contact', protect, authorize('admin', 'editor'), homepageController.updateContact);
router.get('/contact/public', homepageController.getPublicContact);

module.exports = router;