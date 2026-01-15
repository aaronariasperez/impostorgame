import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import * as admin from 'firebase-admin';

export interface WordItem {
  word: string;
  attributes: string[];
}

export interface WordPack {
  id: string;
  name: string;
  description: string;
  language: string;
  words: string[];
  wordItems?: WordItem[];
}

@Injectable()
export class WordPacksService {
  private wordPacks: WordPack[] = [];
  private db: admin.firestore.Firestore;

  constructor(private firebaseService: FirebaseService) {
    this.db = firebaseService.getFirestore();
    this.loadWordPacksFromFirebase();
  }

  private async loadWordPacksFromFirebase(): Promise<void> {
    try {
      const snapshot = await this.db.collection('word_packs').get();

      this.wordPacks = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const wordItems: WordItem[] = (data.wordItems || []).map(
          (item: any) => ({
            word: item.word,
            attributes: item.attributes || [],
          }),
        );

        const words = wordItems.map((item) => item.word);

        this.wordPacks.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          language: data.language || 'es',
          words,
          wordItems,
        });
      });

      console.log(`Loaded ${this.wordPacks.length} word packs from Firebase`);
    } catch (error) {
      console.error('Error loading word packs from Firebase:', error);
    }
  }

  getAllPacks(): Partial<WordPack>[] {
    return this.wordPacks.map((pack) => ({
      ...pack,
      words: [],
      wordItems: undefined,
    }));
  }

  getPackById(id: string): WordPack | null {
    const pack = this.wordPacks.find((pack) => pack.id === id);
    if (!pack) {
      return null;
    }

    return {
      ...pack,
      words: pack.words,
      wordItems: pack.wordItems,
    };
  }
}
