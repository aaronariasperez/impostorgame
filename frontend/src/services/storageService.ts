import localforage from 'localforage';
import { WordPack } from '@/types/game';

const CACHE_KEY_PACKS = 'impostor_word_packs';
const CACHE_KEY_TIMESTAMP = 'impostor_packs_timestamp';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export const storageService = {
  async cachePacks(packs: WordPack[]): Promise<void> {
    try {
      await localforage.setItem(CACHE_KEY_PACKS, packs);
      await localforage.setItem(CACHE_KEY_TIMESTAMP, Date.now());
    } catch (error) {
      console.error('Error caching word packs:', error);
    }
  },

  async getCachedPacks(): Promise<WordPack[] | null> {
    try {
      const timestamp = (await localforage.getItem(CACHE_KEY_TIMESTAMP)) as number | null;
      if (!timestamp) return null;

      const isExpired = Date.now() - timestamp > CACHE_TTL;
      if (isExpired) {
        await this.clearCache();
        return null;
      }

      const packs = (await localforage.getItem(CACHE_KEY_PACKS)) as WordPack[] | null;
      return packs;
    } catch (error) {
      console.error('Error retrieving cached word packs:', error);
      return null;
    }
  },

  async clearCache(): Promise<void> {
    try {
      await localforage.removeItem(CACHE_KEY_PACKS);
      await localforage.removeItem(CACHE_KEY_TIMESTAMP);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },

  async isCacheValid(): Promise<boolean> {
    try {
      const timestamp = (await localforage.getItem(CACHE_KEY_TIMESTAMP)) as number | null;
      if (!timestamp) return false;
      return Date.now() - timestamp <= CACHE_TTL;
    } catch {
      return false;
    }
  },
};
