import { Injectable } from '@nestjs/common';

export interface WordPack {
  id: string;
  name: string;
  description: string;
  language: string;
  words: string[];
}

@Injectable()
export class WordPacksService {
  private wordPacks: WordPack[] = [
    {
      id: 'animals',
      name: 'Animales',
      description: 'Palabras relacionadas con animales',
      language: 'es',
      words: [
        'Gato',
        'Perro',
        'Elefante',
        'Jirafa',
        'Pingüino',
        'Águila',
        'Delfín',
        'Tigre',
        'Oso',
        'Serpiente',
        'Mariposa',
        'Araña',
        'Caballo',
        'Vaca',
        'Oveja',
        'Cerdo',
        'Gallina',
        'Pato',
        'Conejo',
        'Ratón',
      ],
    },
    {
      id: 'fruits',
      name: 'Frutas',
      description: 'Palabras relacionadas con frutas',
      language: 'es',
      words: [
        'Manzana',
        'Plátano',
        'Naranja',
        'Fresa',
        'Uva',
        'Piña',
        'Sandía',
        'Melón',
        'Limón',
        'Cereza',
        'Durazno',
        'Pera',
        'Kiwi',
        'Mango',
        'Papaya',
        'Coco',
        'Arándano',
        'Frambuesa',
        'Mora',
        'Pomelo',
      ],
    },
    {
      id: 'professions',
      name: 'Profesiones',
      description: 'Palabras relacionadas con profesiones',
      language: 'es',
      words: [
        'Médico',
        'Abogado',
        'Ingeniero',
        'Profesor',
        'Cocinero',
        'Carpintero',
        'Electricista',
        'Plomero',
        'Policía',
        'Bombero',
        'Piloto',
        'Capitán',
        'Soldado',
        'Enfermera',
        'Dentista',
        'Psicólogo',
        'Contador',
        'Arquitecto',
        'Artista',
        'Músico',
      ],
    },
  ];

  getAllPacks(): WordPack[] {
    return this.wordPacks.map((pack) => ({
      ...pack,
      words: [], // Don't send words in list endpoint
    }));
  }

  getPackById(id: string): WordPack | null {
    return this.wordPacks.find((pack) => pack.id === id) || null;
  }
}
