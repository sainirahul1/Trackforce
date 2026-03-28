import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GlobalLoader = () => {
  const [loadingCount, setLoadingCount] = useState(0);

  useEffect(() => {
    const isBackgroundUrl = (url = '') => {
      if (!url) return false;
      
      // API Endpoints that are background polling
      const isPollingEndpoint = url.includes('/settings') || url.includes('/stats/dashboard') || url.includes('/tracking/');
      
      // EXCLUDED PAGES: Do not show global loader on these pages as they have internal loaders
      const EXCLUDED_PATHS = [
        '/login',
        '/tenant/dashboard',
        '/tenant/visits',
        '/tenant/activity',
        '/tenant/subscription',
        '/tenant/notifications',
        '/superadmin/issues'
      ];
      
      const currentPath = window.location.pathname;
      const isExcludedPage = EXCLUDED_PATHS.some(path => currentPath === path || currentPath.startsWith(path + '/'));

      return isPollingEndpoint || isExcludedPage;
    };

    // Axios Interceptor
    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        if (!isBackgroundUrl(config.url)) {
          setLoadingCount((prev) => prev + 1);
        }
        return config;
      },
      (error) => {
        setLoadingCount((prev) => Math.max(0, prev - 1));
        return Promise.reject(error);
      }
    );

    const resInterceptor = axios.interceptors.response.use(
      (response) => {
        if (!isBackgroundUrl(response.config?.url)) {
          setLoadingCount((prev) => Math.max(0, prev - 1));
        }
        return response;
      },
      (error) => {
        if (!isBackgroundUrl(error.config?.url)) {
          setLoadingCount((prev) => Math.max(0, prev - 1));
        }
        return Promise.reject(error);
      }
    );

    // Fetch Interceptor
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      let url = '';
      if (typeof args[0] === 'string') {
        url = args[0];
      } else if (args[0] && args[0].url) {
        url = args[0].url;
      }

      const background = isBackgroundUrl(url);
      
      if (!background) {
        setLoadingCount((prev) => prev + 1);
      }
      
      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        if (!background) {
          setLoadingCount((prev) => Math.max(0, prev - 1));
        }
      }
    };

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
      window.fetch = originalFetch;
    };
  }, []);

  if (loadingCount <= 0) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-2xl flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-200">Loading data...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
