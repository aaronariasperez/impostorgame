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

const PACK_CELEBRITIES_WORDS: Array<{ p1: string; p2: string }> = [
  { "p1": "Einstein",        "p2": "Patente"      },
  { "p1": "Newton",          "p2": "Luna"         },
  { "p1": "Darwin",          "p2": "Tortuga"      },
  { "p1": "Freud",           "p2": "Infancia"     },
  { "p1": "Marie Curie",     "p2": "Laboratorio"  },
  { "p1": "Tesla",           "p2": "Corriente"    },
  { "p1": "Hawking",         "p2": "Universo"     },
  { "p1": "Galileo",         "p2": "Inquisición"  },
  { "p1": "Edison",          "p2": "Fonógrafo"    },
  { "p1": "Alan Turing",     "p2": "Código"       },
  { "p1": "Picasso",         "p2": "Toro"         },
  { "p1": "Da Vinci",        "p2": "Vuelo"        },
  { "p1": "Michelangelo",    "p2": "Techo"        },
  { "p1": "Dalí",            "p2": "Reloj"        },
  { "p1": "Van Gogh",        "p2": "Amarillo"     },
  { "p1": "Frida Kahlo",     "p2": "Autorretrato" },
  { "p1": "Cervantes",       "p2": "Molino"       },
  { "p1": "Shakespeare",     "p2": "Fantasma"     },
  { "p1": "Freddie Mercury", "p2": "Bohemio"      },
  { "p1": "Michael Jackson", "p2": "Guante"       },
  { "p1": "Elvis",           "p2": "Cadillac"     },
  { "p1": "Mozart",          "p2": "Flauta"       },
  { "p1": "Beethoven",       "p2": "Silencio"     },
  { "p1": "Madonna",         "p2": "Vogue"        },
  { "p1": "Lady Gaga",       "p2": "Oscar"        },
  { "p1": "David Bowie",     "p2": "Espacio"      },
  { "p1": "John Lennon",     "p2": "Imaginación"  },
  { "p1": "Jimi Hendrix",    "p2": "Fuego"        },
  { "p1": "Bob Marley",      "p2": "Paz"          },
  { "p1": "Shakira",         "p2": "Mundial"      },
  { "p1": "Messi",           "p2": "Pulga"        },
  { "p1": "Ronaldo",         "p2": "Cabezazo"     },
  { "p1": "Muhammad Ali",    "p2": "Antorcha"     },
  { "p1": "Mike Tyson",      "p2": "Tatuaje"      },
  { "p1": "Michael Jordan",  "p2": "Zapatilla"    },
  { "p1": "Usain Bolt",      "p2": "Relámpago"    },
  { "p1": "Roger Federer",   "p2": "Revés"        },
  { "p1": "Tiger Woods",     "p2": "Masters"      },
  { "p1": "Maradona",        "p2": "Diez"         },
  { "p1": "Napoleón",        "p2": "Exilio"       },
  { "p1": "Alejandro Magno", "p2": "Persia"       },
  { "p1": "Hitler",          "p2": "Pintura"      },
  { "p1": "Stalin",          "p2": "Acero"        },
  { "p1": "Gandhi",          "p2": "Ayuno"        },
  { "p1": "Mandela",         "p2": "Perdón"       },
  { "p1": "Cleopatra",       "p2": "Serpiente"    },
  { "p1": "Churchill",       "p2": "Whisky"       },
  { "p1": "Colón",           "p2": "India"        },
  { "p1": "Lincoln",         "p2": "Sombrero"     },
  { "p1": "Juana de Arco",   "p2": "Santos"       },
  { "p1": "Marie Antoinette","p2": "Guillotina"   },
  { "p1": "Julio César",     "p2": "Senado"       },
  { "p1": "Obama",           "p2": "Canasta"      },
  { "p1": "Trump",           "p2": "Golf"         },
  { "p1": "Che Guevara",     "p2": "Médico"       },
  { "p1": "Sócrates",        "p2": "Cicuta"       },
  { "p1": "Steve Jobs",      "p2": "Garaje"       },
  { "p1": "Elon Musk",       "p2": "Colonia"      },
  { "p1": "Walt Disney",     "p2": "Criogénica"   },
  { "p1": "Neil Armstrong",  "p2": "Tranquilidad" },
];

export const CELEBRITIES_PACK: WordPack = {
  id: 'pack-celebrities',
  name: 'Pack Celebrities',
  description: '¿Eres de los que valoran lo bueno? Personas icónicas mundialmente reconocibles.',
  language: 'es',
  words: PACK_CELEBRITIES_WORDS.map(w => w.p1),
  wordItems: PACK_CELEBRITIES_WORDS.map(w => ({
    word: w.p1,
    attributes: [w.p2],
  })),
  locked: true,
};

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
        return [...DEFAULT_WORD_PACKS, CELEBRITIES_PACK];
      }

      // Cache the packs locally
      await storageService.cachePacks(packs);
      return [...packs, CELEBRITIES_PACK];
    } catch (error) {
      console.warn('Failed to fetch word packs from Firebase, trying cache:', error);
      const cachedPacks = await storageService.getCachedPacks();
      if (cachedPacks) {
        return [...cachedPacks, CELEBRITIES_PACK];
      }
      console.warn('No cached packs, using default word packs');
      return [...DEFAULT_WORD_PACKS, CELEBRITIES_PACK];
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
