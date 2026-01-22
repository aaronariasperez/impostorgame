import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

export const API_BASE_URL = isNative
  ? 'http://localhost:3000'
  : '/api';

export const getApiUrl = (endpoint: string): string => {
  if (isNative) {
    return `${API_BASE_URL}${endpoint}`;
  }
  return endpoint;
};
