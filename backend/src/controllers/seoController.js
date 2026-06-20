// backend/src/controllers/seoController.js
const SEO = require('../models/SEO');

exports.getSEO = async (req, res) => {
  try {
    const seo = await SEO.findOne();
    res.status(200).json({
      success: true,
      data: seo || {},
    });
  } catch (error) {
    console.error('Get SEO error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateSEO = async (req, res) => {
  try {
    const {
      metaTitle, metaDescription, focusKeywords, canonicalURL,
      robotsIndex, robotsFollow, ogTitle, ogDescription,
      ogImage, twitterTitle, twitterDescription, twitterImage,
    } = req.body;

    let seo = await SEO.findOne();

    if (seo) {
      seo = await SEO.findByIdAndUpdate(
        seo._id,
        {
          metaTitle, metaDescription, focusKeywords, canonicalURL,
          robotsIndex, robotsFollow, ogTitle, ogDescription,
          ogImage, twitterTitle, twitterDescription, twitterImage,
          updatedAt: Date.now(),
        },
        { new: true, runValidators: true }
      );
    } else {
      seo = await SEO.create({
        metaTitle, metaDescription, focusKeywords, canonicalURL,
        robotsIndex, robotsFollow, ogTitle, ogDescription,
        ogImage, twitterTitle, twitterDescription, twitterImage,
      });
    }

    res.status(200).json({
      success: true,
      data: seo,
      message: 'SEO settings updated successfully',
    });
  } catch (error) {
    console.error('Update SEO error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPublicSEO = async (req, res) => {
  try {
    const seo = await SEO.findOne();
    res.status(200).json({
      success: true,
      data: seo || {
        metaTitle: 'SEO Dashboard',
        metaDescription: 'Manage your website SEO and content',
        robotsIndex: 'index',
        robotsFollow: 'follow',
      },
    });
  } catch (error) {
    console.error('Get public SEO error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};