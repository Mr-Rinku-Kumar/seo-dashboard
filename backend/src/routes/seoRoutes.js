// backend/src/routes/seoRoutes.js
const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');
const { protect, authorize } = require('../middleware/auth');

// SEO routes - Both Admin and Editor can view and update
router.route('/')
  .get(protect, authorize('admin', 'editor'), seoController.getSEO)
  .post(protect, authorize('admin', 'editor'), seoController.updateSEO);

// Public route - anyone can view
router.get('/public', seoController.getPublicSEO);

module.exports = router;