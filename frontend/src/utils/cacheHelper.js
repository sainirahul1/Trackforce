const CACHE_PREFIX = 'tf_cache_';
const CACHE_DURATION = 300000; // 5 minutes

export const clearCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
};

export const getSyncCachedData = (key) => {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
    return null; // Expired
  } catch (e) {
    return null;
  }
};

export const fetchDataWithCache = async (key, fetcher) => {
  const cachedData = getSyncCachedData(key);
  // Note: We still return cached data if available, 
  // but the services will decide whether to trigger a background update.
  if (cachedData) return cachedData;

  const data = await fetcher();
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    console.warn('Cache write failed (storage full?):', e);
  }
  return data;
};

export const setCachedData = (key, data) => {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    console.warn('Cache write failed:', e);
  }
};
