// backend/src/controllers/schemaController.js
const Schema = require('../models/Schema');

exports.getSchemas = async (req, res) => {
  try {
    const schemas = await Schema.find();
    res.status(200).json({
      success: true,
      data: schemas,
    });
  } catch (error) {
    console.error('Get schemas error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSchemaByType = async (req, res) => {
  try {
    const { type } = req.params;
    const schema = await Schema.findOne({ type });
    res.status(200).json({
      success: true,
      data: schema || null,
    });
  } catch (error) {
    console.error('Get schema by type error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateSchema = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type and data',
      });
    }

    let schema = await Schema.findOne({ type });

    if (schema) {
      schema = await Schema.findByIdAndUpdate(
        schema._id,
        { data, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
    } else {
      schema = await Schema.create({ type, data });
    }

    res.status(200).json({
      success: true,
      data: schema,
      message: 'Schema updated successfully',
    });
  } catch (error) {
    console.error('Update schema error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteSchema = async (req, res) => {
  try {
    const { id } = req.params;
    await Schema.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Schema deleted successfully',
    });
  } catch (error) {
    console.error('Delete schema error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPublicSchemas = async (req, res) => {
  try {
    const schemas = await Schema.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: schemas,
    });
  } catch (error) {
    console.error('Get public schemas error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPublicSchemas = async (req, res) => {
  try {
    const schemas = await Schema.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: schemas,
    });
  } catch (error) {
    console.error('Get public schemas error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};