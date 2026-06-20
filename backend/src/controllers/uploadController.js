// backend/src/controllers/uploadController.js
const cloudinary = require('cloudinary').v2;

// ✅ Upload single image
exports.uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        url: req.file.path,
        public_id: req.file.filename,
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

// ✅ Upload multiple images (ADD THIS)
exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const files = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
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

// ✅ Delete file
exports.deleteFile = async (req, res) => {
  try {
    const { filename } = req.params; // ✅ Fix: use 'filename' not 'public_id'
    
    // Extract public_id from filename (remove extension)
    const publicId = filename.split('.')[0];
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(`seo-dashboard/${publicId}`);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'File deleted successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};