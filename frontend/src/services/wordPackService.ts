import { WordPack } from '@/types/game';
import { firebaseWordPackService } from './firebaseWordPackService';

let cachedPacks: WordPack[] | null = null;

export const wordPackService = {
  async getAllPacks(): Promise<WordPack[]> {
    if (cachedPacks) {
      return cachedPacks;
    }

    const packs = await firebaseWordPackService.getAllPacks();
    cachedPacks = packs;
    return packs;
  },

  async getSelection(ids: string[]): Promise<{ civilianWord: string; impostorHint: string }> {
    if (!ids || ids.length === 0) {
      throw new Error('At least one word pack must be selected');
    }

    const packs = await this.getAllPacks();
    const selection = await firebaseWordPackService.getRandomSelection(ids, packs);

    if (!selection) {
      throw new Error('No words available for selected packs');
    }

    return selection;
  },

  async getCombinedPacks(ids: string[]): Promise<WordPack> {
    if (!ids || ids.length === 0) {
      throw new Error('At least one word pack must be selected');
    }

    const packs = await this.getAllPacks();
    const combined = await firebaseWordPackService.getCombinedMeta(ids, packs);

    if (!combined) {
      throw new Error(`Failed to fetch combined word packs: ${ids.join(', ')}`);
    }

    return combined;
  },
};
