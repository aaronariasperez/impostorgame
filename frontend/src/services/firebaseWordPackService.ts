import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { WordPack, WordItem } from '@/types/game';
import { storageService } from './storageService';

interface FirebaseWordItem {
  p1: string;
  p2: string;
}

interface FirebaseWordPack {
  name: string;
  description: string;
  language: string;
  wordItems: FirebaseWordItem[];
}

const transformWordPack = (id: string, data: FirebaseWordPack): WordPack => {
  const wordItems: WordItem[] = (data.wordItems || []).map((item) => ({
    word: item.p1,
    attributes: [item.p2], // Store hint as attributes for compatibility
  }));

  return {
    id,
    name: data.name,
    description: data.description,
    language: data.language || 'es',
    words: wordItems.map((item) => item.word),
    wordItems,
  };
};

// Default word packs as fallback
const DEFAULT_WORD_PACKS: WordPack[] = [
  {
    id: 'animales',
    name: 'Animales',
    description: 'Palabras relacionadas con animales',
    language: 'es',
    words: ['gato', 'perro', 'pajaro', 'pez', 'elefante'],
    wordItems: [
      { word: 'gato', attributes: ['felino doméstico'] },
      { word: 'perro', attributes: ['mejor amigo del hombre'] },
      { word: 'pajaro', attributes: ['tiene alas y vuela'] },
      { word: 'pez', attributes: ['vive en el agua'] },
      { word: 'elefante', attributes: ['animal grande con trompa'] },
    ],
  },
  {
    id: 'comidas',
    name: 'Comidas',
    description: 'Palabras relacionadas con comida',
    language: 'es',
    words: ['pizza', 'hamburguesa', 'manzana', 'pan', 'queso'],
    wordItems: [
      { word: 'pizza', attributes: ['comida italiana con queso'] },
      { word: 'hamburguesa', attributes: ['pan con carne'] },
      { word: 'manzana', attributes: ['fruta roja o verde'] },
      { word: 'pan', attributes: ['hecho de harina'] },
      { word: 'queso', attributes: ['producto lácteo amarillo'] },
    ],
  },
];

export const firebaseWordPackService = {
  async getAllPacks(): Promise<WordPack[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const snapshot = await getDocs(collection(db, 'word_packs'));
      const packs: WordPack[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as FirebaseWordPack;
        packs.push(transformWordPack(doc.id, data));
      });

      if (packs.length === 0) {
        console.warn('No word packs found in Firestore, using defaults');
        return DEFAULT_WORD_PACKS;
      }

      // Cache the packs locally
      await storageService.cachePacks(packs);
      return packs;
    } catch (error) {
      console.warn('Failed to fetch word packs from Firebase, trying cache:', error);
      const cachedPacks = await storageService.getCachedPacks();
      if (cachedPacks) {
        return cachedPacks;
      }
      console.warn('No cached packs, using default word packs');
      return DEFAULT_WORD_PACKS;
    }
  },

  async getRandomSelection(
    ids: string[],
    allPacks: WordPack[]
  ): Promise<{ civilianWord: string; impostorHint: string } | null> {
    const uniqueIds = [...new Set(ids.filter(Boolean))];
    if (uniqueIds.length === 0) return null;

    const selectedPacks = uniqueIds
      .map((id) => allPacks.find((pack) => pack.id === id))
      .filter((pack) => pack !== undefined) as WordPack[];

    if (selectedPacks.length === 0) return null;

    const combined = selectedPacks.flatMap((p) => p.wordItems ?? []);
    if (combined.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * combined.length);
    const item = combined[randomIndex];

    return {
      civilianWord: item.word,
      impostorHint: item.attributes[0] || '',
    };
  },

  async getCombinedMeta(ids: string[], allPacks: WordPack[]): Promise<WordPack | null> {
    const uniqueIds = [...new Set(ids.filter(Boolean))];
    const packs = uniqueIds
      .map((id) => allPacks.find((pack) => pack.id === id))
      .filter((pack) => pack !== undefined) as WordPack[];

    if (!packs.length) return null;

    const combinedWords: string[] = [];
    const combinedWordItems: WordItem[] = [];

    packs.forEach((pack) => {
      if (pack.words) {
        combinedWords.push(...pack.words);
      }
      if (pack.wordItems) {
        combinedWordItems.push(...pack.wordItems);
      }
    });

    return {
      id: uniqueIds.join(','),
      name: packs.map((p) => p.name).join(' + '),
      description: `Combinación de: ${packs.map((p) => p.name).join(', ')}`,
      language: packs[0].language ?? 'es',
      words: combinedWords,
      wordItems: combinedWordItems,
    };
  },
};
