import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

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

  constructor() {
    this.loadWordPacksFromFiles();
  }

  private loadWordPacksFromFiles(): void {
    const wordPacksDir = path.join(process.cwd(), 'word_packs');

    try {
      if (!fs.existsSync(wordPacksDir)) {
        console.warn(`Word packs directory not found: ${wordPacksDir}`);
        return;
      }

      const files = fs.readdirSync(wordPacksDir).filter((file) =>
        file.endsWith('.json')
      );

      files.forEach((file) => {
        try {
          const filePath = path.join(wordPacksDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(fileContent);

          // Extract category name from filename (without .json)
          const categoryName = file.replace('.json', '');
          const categoryId = categoryName.toLowerCase();

          // Extract words and attributes
          const wordItems: WordItem[] = data.map((item: any) => ({
            word: item.p,
            attributes: item.a || [],
          }));

          const words = wordItems.map((item) => item.word);

          this.wordPacks.push({
            id: categoryId,
            name: categoryName,
            description: `Palabras relacionadas con ${categoryName.toLowerCase()}`,
            language: 'es',
            words,
            wordItems,
          });
        } catch (error) {
          console.error(`Error loading word pack from ${file}:`, error);
        }
      });

      console.log(`Loaded ${this.wordPacks.length} word packs from files`);
    } catch (error) {
      console.error('Error loading word packs directory:', error);
    }
  }

  getAllPacks(): WordPack[] {
    return this.wordPacks.map((pack) => ({
      ...pack,
      words: [], // Don't send words in list endpoint
      wordItems: undefined, // Don't send word items in list endpoint
    }));
  }

  getPackById(id: string): WordPack | null {
    const pack = this.wordPacks.find((pack) => pack.id === id);
    if (!pack) {
      return null;
    }

    // Return pack with words and wordItems for full details
    return {
      ...pack,
      words: pack.words,
      wordItems: pack.wordItems,
    };
  }
}
