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

// Default word packs as fallback - Pack fácil and Pack difícil
const PACK_FACIL_WORDS: Array<{ p1: string; p2: string }> = [
  { "p1": "Cigarrillo", "p2": "Chimenea" },
  { "p1": "Espejo", "p2": "Lago" },
  { "p1": "Reloj", "p2": "Latido" },
  { "p1": "Ancla", "p2": "Raíz" },
  { "p1": "Viento", "p2": "Fantasma" },
  { "p1": "Diamante", "p2": "Hielo" },
  { "p1": "Mapa", "p2": "Memoria" },
  { "p1": "Dinero", "p2": "Sangre" },
  { "p1": "Cárcel", "p2": "Monasterio" },
  { "p1": "Cine", "p2": "Sueño" },
  { "p1": "Batería", "p2": "Alimento" },
  { "p1": "Puente", "p2": "Túnel" },
  { "p1": "Cuchillo", "p2": "Tijeras" },
  { "p1": "Sudor", "p2": "Lluvia" },
  { "p1": "Gafas", "p2": "Ventana" },
  { "p1": "Jabón", "p2": "Mentira" },
  { "p1": "Zapatos", "p2": "Neumáticos" },
  { "p1": "Sal", "p2": "Azúcar" },
  { "p1": "Tumba", "p2": "Baúl" }
];

const PACK_DIFICIL_WORDS: Array<{ p1: string; p2: string }> = [
  { "p1": "Cámara", "p2": "Testigo" },
  { "p1": "Cerebro", "p2": "CPU" },
  { "p1": "Internet", "p2": "Telaraña" },
  { "p1": "Cable", "p2": "Liana" },
  { "p1": "Hormiga", "p2": "Obrero" },
  { "p1": "Abeja", "p2": "Dron" },
  { "p1": "Raíz", "p2": "Cimiento" },
  { "p1": "Humo", "p2": "Señal" },
  { "p1": "Ceniza", "p2": "Polvo" },
  { "p1": "Llama", "p2": "Pasión" },
  { "p1": "Esqueleto", "p2": "Andamio" },
  { "p1": "Músculo", "p2": "Pistón" },
  { "p1": "Pulmón", "p2": "Fuelle" },
  { "p1": "Vómito", "p2": "Cascada" },
  { "p1": "Cuna", "p2": "Nido" },
  { "p1": "Lápiz", "p2": "Varita" },
  { "p1": "Goma", "p2": "Perdón" },
  { "p1": "Tiza", "p2": "Nieve" },
  { "p1": "Papel", "p2": "Piel" }
];

const DEFAULT_WORD_PACKS: WordPack[] = [
  {
    id: 'pack facil',
    name: 'Pack fácil',
    description: 'Palabras con pistas más directas y obvias',
    language: 'es',
    words: PACK_FACIL_WORDS.map(w => w.p1),
    wordItems: PACK_FACIL_WORDS.map(w => ({
      word: w.p1,
      attributes: [w.p2],
    })),
  },
  {
    id: 'pack dificil',
    name: 'Pack difícil',
    description: 'Palabras con pistas más abstractas y desafiantes',
    language: 'es',
    words: PACK_DIFICIL_WORDS.map(w => w.p1),
    wordItems: PACK_DIFICIL_WORDS.map(w => ({
      word: w.p1,
      attributes: [w.p2],
    })),
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
