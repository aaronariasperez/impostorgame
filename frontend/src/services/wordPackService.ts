import { WordPack } from '@/types/game';

const API_URL = '/api/word-packs';

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
};
