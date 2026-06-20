// backend/src/routes/schemaRoutes.js
const express = require('express');
const router = express.Router();
const schemaController = require('../controllers/schemaController');
const { protect, authorize, isAdmin } = require('../middleware/auth');

// Schema routes
router.route('/')
  .get(protect, authorize('admin', 'editor'), schemaController.getSchemas)
  .post(protect, authorize('admin'), schemaController.updateSchema); // Only admin

router.get('/public', schemaController.getPublicSchemas);
router.get('/:type', protect, authorize('admin', 'editor'), schemaController.getSchemaByType);
router.delete('/:id', protect, authorize('admin'), schemaController.deleteSchema); // Only admin

module.exports = router;