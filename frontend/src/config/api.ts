import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

// For native apps, use Render backend; for web, use relative URLs
export const API_BASE_URL = isNative
  ? 'https://impostor-backend.onrender.com'
  : '';

export const getApiUrl = (endpoint: string): string => {
  if (isNative) {
    return `${API_BASE_URL}${endpoint}`;
  }
  return endpoint;
};
