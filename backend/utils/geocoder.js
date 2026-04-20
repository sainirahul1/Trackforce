const fetch = require('node-fetch');

/**
 * Robust Geocoding Utility
 * 
 * Logic:
 * 1. Tries Google Maps Reverse Geocoding (if API key provided)
 * 2. Falls back to OpenStreetMap (Nominatim) if Google fails or key is missing
 * 
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 * @returns {Promise<{address: string, city: string, source: string}>}
 */
const reverseGeocode = async (lat, lng) => {
  const googleKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
  const initialAddress = `Lat: ${Number(lat).toFixed(6)}, Lng: ${Number(lng).toFixed(6)}`;
  
  // 1. Try Google Maps First
  if (googleKey && !googleKey.includes('VITE_GOOGLE_MAPS_API_KEY')) {
    try {
      console.log(`[GEOCODER] Attempting Google Maps Geocode for (${lat}, ${lng})...`);
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleKey}`);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results?.[0]) {
        const result = data.results[0];
        const address = result.formatted_address;
        
        // Extract components
        const getComp = (type) => result.address_components.find(c => c.types.includes(type))?.long_name || '';
        const city = getComp('locality') || getComp('administrative_area_level_2');
        const state = getComp('administrative_area_level_1');
        const postcode = getComp('postal_code');

        console.log(`[GEOCODER] Google Maps Success: ${address}`);
        return { 
          address, 
          city, 
          state,
          postcode,
          display_name: address, // Compatibility with OSM field
          source: 'google',
          raw: data 
        };
      } else {
        console.warn(`[GEOCODER] Google Maps Status: ${data.status} | Error: ${data.error_message || 'Unknown'}`);
      }
    } catch (err) {
      console.error(`[GEOCODER] Google Maps Exception:`, err.message);
    }
  }

  // 2. Fallback to OpenStreetMap (Nominatim)
  try {
    console.log(`[GEOCODER] Attempting Nominatim (OSM) Fallback...`);
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    
    const response = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'ReatchAll-TrackForce/1.0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.display_name) {
        const address = data.display_name;
        const details = data.address || {};
        const city = details.city || details.town || details.village || '';
        const state = details.state || '';
        const postcode = details.postcode || '';

        console.log(`[GEOCODER] Nominatim Success: ${address}`);
        return { 
          address, 
          city, 
          state,
          postcode,
          display_name: address,
          source: 'osm', 
          raw: data 
        };
      }
    }
  } catch (err) {
    console.error(`[GEOCODER] Nominatim Fallback Failed:`, err.message);
  }

  return { 
    address: initialAddress, 
    city: '', 
    state: '',
    postcode: '',
    display_name: initialAddress,
    source: 'none',
    raw: null
  };
};

module.exports = { reverseGeocode };
