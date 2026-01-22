import { WordPack } from '@/types/game';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

// For native apps, use Render backend; for web, use relative URLs
const API_BASE = isNative 
  ? 'https://impostorgame-1.onrender.com' 
  : '';

const API_URL = `${API_BASE}/api/word-packs`;

export const wordPackService = {
  async getAllPacks(): Promise<WordPack[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch word packs');
    }
    return response.json();
  },

  async getPackById(id: string): Promise<WordPack> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch word pack: ${id}`);
    }
    return response.json();
  },

  async getCombinedPacks(ids: string[]): Promise<WordPack> {
    if (!ids || ids.length === 0) {
      throw new Error('At least one word pack must be selected');
    }
    const idsQuery = ids.join(',');
    const response = await fetch(`${API_URL}/combined?ids=${idsQuery}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch combined word packs: ${ids.join(', ')}`);
    }
    return response.json();
  },
};
