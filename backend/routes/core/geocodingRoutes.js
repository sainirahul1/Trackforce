const express = require('express');
const router = express.Router();
const { reverseGeocode } = require('../../utils/geocoder');

// @desc    Reverse Geocode Proxy (Bypasses CORS for Frontend)
// @route   GET /reatchall/public/geocoding/reverse
// @access  Public (Used by Employee App)
router.get('/reverse', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  try {
    const geoResult = await reverseGeocode(lat, lon);
    
    if (geoResult.raw) {
      // Return the raw data to maintain compatibility with existing frontend logic
      // which expects Nominatim or Google Maps nested structures
      return res.json(geoResult.raw);
    }

    // Fallback if raw is null
    res.json({
      display_name: geoResult.address,
      address: {
        city: geoResult.city,
        state: geoResult.state,
        postcode: geoResult.postcode
      }
    });
  } catch (error) {
    console.error('[GEOCODING PROXY ERROR]', error);
    res.status(500).json({ 
      message: 'Failed to fetch location data',
      error: error.message 
    });
  }
});

module.exports = router;
