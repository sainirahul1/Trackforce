const fetch = require('node-fetch');

// In-memory cache to avoid redundant geocoding calls
const geoCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE = 500;

// Track if Google API is working to skip it fast when it's not
let googleApiWorking = true;
let googleFailCount = 0;

/**
 * Fast Reverse Geocoding with Cache + Failover
 * 
 * 1. Check cache first (instant)
 * 2. Try Google Maps with 3s timeout
 * 3. Fallback to Nominatim (OSM) with 4s timeout
 * 4. Return raw coordinates if all fail
 */
const reverseGeocode = async (lat, lng) => {
  const googleKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
  const initialAddress = `Lat: ${Number(lat).toFixed(6)}, Lng: ${Number(lng).toFixed(6)}`;

  // Round to ~100m precision for cache key
  const cacheKey = `${Number(lat).toFixed(4)},${Number(lng).toFixed(4)}`;
  
  // 0. CACHE HIT — instant return
  const cached = geoCache.get(cacheKey);
  if (cached && (Date.now() - cached.ts < CACHE_TTL)) {
    return cached.result;
  }

  // Helper: fetch with timeout
  const fetchWithTimeout = (url, opts = {}, ms = 3000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return fetch(url, { ...opts, signal: controller.signal })
      .finally(() => clearTimeout(timer));
  };

  // 1. Try Google Maps (skip if consistently failing)
  if (googleKey && googleApiWorking) {
    try {
      const response = await fetchWithTimeout(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleKey}`,
        {},
        3000
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results?.[0]) {
        const result = data.results[0];
        const address = result.formatted_address;
        const getComp = (type) => result.address_components.find(c => c.types.includes(type))?.long_name || '';

        googleFailCount = 0; // Reset on success
        const geoResult = {
          address,
          city: getComp('locality') || getComp('administrative_area_level_2'),
          state: getComp('administrative_area_level_1'),
          postcode: getComp('postal_code'),
          display_name: address,
          source: 'google',
          raw: data
        };
        cacheSet(cacheKey, geoResult);
        return geoResult;
      } else {
        // REQUEST_DENIED / OVER_QUERY_LIMIT — disable Google temporarily
        console.warn(`[GEOCODER] Google: ${data.status} — ${data.error_message || 'skipping to OSM'}`);
        googleFailCount++;
        if (googleFailCount >= 3) {
          googleApiWorking = false;
          console.warn(`[GEOCODER] Google disabled after ${googleFailCount} failures. Will retry in 10 min.`);
          setTimeout(() => { googleApiWorking = true; googleFailCount = 0; }, 10 * 60 * 1000);
        }
      }
    } catch (err) {
      // Timeout or network error — don't block, fall through
      googleFailCount++;
      if (googleFailCount >= 3) {
        googleApiWorking = false;
        setTimeout(() => { googleApiWorking = true; googleFailCount = 0; }, 10 * 60 * 1000);
      }
    }
  }

  // 2. Nominatim (OSM) Fallback
  try {
    const response = await fetchWithTimeout(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { 'User-Agent': 'ReatchAll-TrackForce/1.0' } },
      4000
    );

    if (response.ok) {
      const data = await response.json();
      if (data?.display_name) {
        const details = data.address || {};
        const geoResult = {
          address: data.display_name,
          city: details.city || details.town || details.village || '',
          state: details.state || '',
          postcode: details.postcode || '',
          display_name: data.display_name,
          source: 'osm',
          raw: data
        };
        cacheSet(cacheKey, geoResult);
        return geoResult;
      }
    }
  } catch (err) {
    // Silent — return coordinates
  }

  // 3. Raw coordinates fallback
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

function cacheSet(key, result) {
  if (geoCache.size >= MAX_CACHE) {
    // Evict oldest entry
    const firstKey = geoCache.keys().next().value;
    geoCache.delete(firstKey);
  }
  geoCache.set(key, { result, ts: Date.now() });
}

module.exports = { reverseGeocode };
