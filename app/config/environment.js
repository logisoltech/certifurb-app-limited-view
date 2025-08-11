// Environment configuration for Certifurb Live Store
const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const config = {
  // API Base URL
  API_BASE_URL: isDevelopment || isLocalhost 
    ? 'http://192.168.100.18:5000'  // Development
    : 'https://api.certifurb.com',   // Production

  // WebSocket URL  
  WEBSOCKET_URL: isDevelopment || isLocalhost
    ? 'http://192.168.100.18:5000'  // Development
    : 'https://api.certifurb.com',   // Production

  // Frontend URLs for CORS
  FRONTEND_URL: isDevelopment || isLocalhost
    ? ['http://localhost:3000', 'http://192.168.100.18:3000']  // Development
    : ['https://certifurb.com'],   // Production

  // Protocol (important for camera access)
  PROTOCOL: isDevelopment || isLocalhost ? 'http' : 'https',

  // Environment flags
  IS_DEVELOPMENT: isDevelopment || isLocalhost,
  IS_PRODUCTION: !isDevelopment && !isLocalhost
};

// Helper functions
export const getApiUrl = (endpoint) => {
  const baseUrl = config.API_BASE_URL;
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export const getWebSocketUrl = () => {
  return config.WEBSOCKET_URL;
};

export const getFrontendOrigins = () => {
  return config.FRONTEND_URL;
};

export default config; 