// backend/src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { singleUpload, multipleUpload } = require('../middleware/upload');
const { 
  uploadSingle, 
  uploadMultiple, 
  deleteFile 
} = require('../controllers/uploadController');

// Upload routes - Both Admin and Editor can upload
router.post('/', protect, authorize('admin', 'editor'), singleUpload('image'), uploadSingle);
router.post('/multiple', protect, authorize('admin', 'editor'), multipleUpload('images', 10), uploadMultiple);

// Delete file - Only Admin can delete
router.delete('/:filename', protect, authorize('admin'), deleteFile);

module.exports = router;