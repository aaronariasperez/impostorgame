import { WordPack } from '@/types/game';
import { Capacitor } from '@capacitor/core';
import { storageService } from './storageService';

const isNative = Capacitor.isNativePlatform();

const API_BASE = isNative 
  ? 'https://impostorgame-1.onrender.com' 
  : '';

const API_URL = `${API_BASE}/api/word-packs`;

// Set to true to simulate slow backend responses for testing loading screens
const SIMULATE_DELAY = false;
const DELAY_MS = 5000; // 5 seconds

const simulateDelay = async () => {
  if (SIMULATE_DELAY) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }
};

export const wordPackService = {
  async getAllPacks(): Promise<WordPack[]> {
    try {
      await simulateDelay();
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch word packs');
      }
      const packs = await response.json();
      await storageService.cachePacks(packs);
      return packs;
    } catch (error) {
      console.warn('Failed to fetch word packs online, trying cache:', error);
      const cachedPacks = await storageService.getCachedPacks();
      if (cachedPacks) {
        return cachedPacks;
      }
      throw error;
    }
  },

  async getSelection(ids: string[]): Promise<{ civilianWord: string; impostorHint: string }> {
    if (!ids || ids.length === 0) {
      throw new Error('At least one word pack must be selected');
    }

    try {
      await simulateDelay();
      const response = await fetch(`${API_URL}/selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch selection');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching selection:', error);
      throw error;
    }
  },
};
