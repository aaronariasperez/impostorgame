import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aaronarias.impostor',
  appName: 'Impostor',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: process.env.CAPACITOR_SERVER_URL || undefined,
  },
  ios: {
    contentInset: 'automatic',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;

// Backend API configuration for native apps
export const API_CONFIG = {
  // Render backend URL
  baseUrl: 'https://impostorgame-1.onrender.com',
};
