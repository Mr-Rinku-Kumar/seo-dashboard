// backend/src/controllers/uploadController.js
const fs = require('fs');
const path = require('path');

// Base URL for uploaded files
const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get('host')}`;
};

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private
exports.uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const fileUrl = `${getBaseUrl(req)}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload',
    });
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      url: `${getBaseUrl(req)}/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.status(200).json({
      success: true,
      data: files,
      message: `${files.length} files uploaded successfully`,
    });
  } catch (error) {
    console.error('Upload multiple error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload',
    });
  }
};

// @desc    Delete uploaded image
// @route   DELETE /api/upload/:filename
// @access  Private
exports.deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during file deletion',
    });
  }
};