import { WordPack } from '@/types/game';
import { firebaseWordPackService } from './firebaseWordPackService';

// Pack IDs that require unlock via app rating
const LOCKED_PACK_IDS = new Set(['pack-celebrities']);

function applyLockState(packs: WordPack[]): WordPack[] {
  let unlockedIds: Set<string>;
  try {
    const raw = localStorage.getItem('impostor_unlocked_packs');
    unlockedIds = raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    unlockedIds = new Set();
  }
  return packs.map((pack) =>
    LOCKED_PACK_IDS.has(pack.id) && !unlockedIds.has(pack.id)
      ? { ...pack, locked: true }
      : pack
  );
}

let cachedPacks: WordPack[] | null = null;

export const wordPackService = {
  async getAllPacks(): Promise<WordPack[]> {
    if (cachedPacks) {
      return cachedPacks;
    }

    const packs = await firebaseWordPackService.getAllPacks();
    cachedPacks = applyLockState(packs);
    return cachedPacks;
  },

  invalidateCache(): void {
    cachedPacks = null;
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
