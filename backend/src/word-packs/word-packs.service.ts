import { Injectable, OnModuleInit } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { randomInt } from 'crypto';
import * as admin from 'firebase-admin';

export interface WordItem {
  word: string;
  hint: string;
}

export interface WordPack {
  id: string;
  name: string;
  description: string;
  language: string;
  words: string[];
  wordItems?: WordItem[];
}

export type PublicWordPack = Pick<WordPack, 'id' | 'name' | 'description' | 'language'>;

@Injectable()
export class WordPacksService implements OnModuleInit {
  private wordPacks: WordPack[] = [];
  private db: admin.firestore.Firestore;
  private loaded = false;
  private loadingPromise: Promise<void> | null = null;

  constructor(private firebaseService: FirebaseService) {
    this.db = firebaseService.getFirestore();
  }

  async onModuleInit() {
    await this.ensureLoaded();
  }

  private async ensureLoaded(): Promise<void> {
    if (this.loaded) return;
    if (!this.loadingPromise) {
      this.loadingPromise = this.loadWordPacksFromFirebase().finally(() => {
        this.loaded = true;
      });
    }
    await this.loadingPromise;
  }

  private async loadWordPacksFromFirebase(): Promise<void> {
    try {
      const snapshot = await this.db.collection('word_packs').get();

      this.wordPacks = [];

       snapshot.forEach((doc) => {
         const data = doc.data();
         const wordItems: WordItem[] = (data.wordItems || []).map(
           (item: any) => ({
             word: item.p1,
             hint: item.p2,
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

  private toPublicPack(pack: WordPack): PublicWordPack {
    return {
      id: pack.id,
      name: pack.name,
      description: pack.description,
      language: pack.language,
    };
  }

  async getAllPacks(): Promise<PublicWordPack[]> {
    await this.ensureLoaded();
    return this.wordPacks.map((pack) => this.toPublicPack(pack));
  }

  async getPackMetaById(id: string): Promise<PublicWordPack | null> {
    await this.ensureLoaded();
    const pack = this.wordPacks.find((pack) => pack.id === id);
    return pack ? this.toPublicPack(pack) : null;
  }

  async getCombinedMeta(ids: string[]): Promise<PublicWordPack | null> {
    await this.ensureLoaded();
    const uniqueIds = [...new Set(ids.filter(Boolean))];
    const packs = uniqueIds
      .map((id) => this.wordPacks.find((pack) => pack.id === id))
      .filter((pack) => pack !== undefined) as WordPack[];

    if (!packs.length) return null;

    return {
      id: uniqueIds.join(','),
      name: packs.map((p) => p.name).join(' + '),
      description: `Combinación de: ${packs.map((p) => p.name).join(', ')}`,
      language: packs[0].language ?? 'es',
    };
  }

   async getRandomSelection(
     ids: string[],
   ): Promise<{ civilianWord: string; impostorHint: string } | null> {
     await this.ensureLoaded();

     const uniqueIds = [...new Set(ids.filter(Boolean))];
     if (uniqueIds.length === 0) return null;

     const packs = uniqueIds
       .map((id) => this.wordPacks.find((pack) => pack.id === id))
       .filter((pack) => pack !== undefined) as WordPack[];

     if (!packs.length) return null;

     const combined = packs.flatMap((p) => p.wordItems ?? []);
     if (combined.length === 0) return null;

     const item = combined[randomInt(combined.length)];
     const civilianWord = item.word;
     const impostorHint = item.hint;

     return { civilianWord, impostorHint };
   }

  async getPacksByIds(ids: string[]): Promise<WordPack | null> {
    await this.ensureLoaded();
    if (!ids || ids.length === 0) {
      return null;
    }

    const requestedPacks = ids
      .map((id) => this.wordPacks.find((pack) => pack.id === id))
      .filter((pack) => pack !== undefined) as WordPack[];

    if (requestedPacks.length === 0) {
      return null;
    }

    const combinedWords: string[] = [];
    const combinedWordItems: WordItem[] = [];

    requestedPacks.forEach((pack) => {
      if (pack.words) {
        combinedWords.push(...pack.words);
      }
      if (pack.wordItems) {
        combinedWordItems.push(...pack.wordItems);
      }
    });

    const combinedName = requestedPacks.map((p) => p.name).join(' + ');
    const combinedDescription = `Combinación de: ${requestedPacks.map((p) => p.name).join(', ')}`;

    return {
      id: ids.join(','),
      name: combinedName,
      description: combinedDescription,
      language: requestedPacks[0].language,
      words: combinedWords,
      wordItems: combinedWordItems,
    };
  }
}
