import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { WordPacksService, WordPack } from './word-packs.service';

@Controller('api/word-packs')
export class WordPacksController {
  constructor(private readonly wordPacksService: WordPacksService) {}

  @Get()
  getAllPacks(): Partial<WordPack>[] {
    return this.wordPacksService.getAllPacks();
  }

  @Get('combined')
  getCombinedPacks(@Query('ids') ids: string): WordPack {
    const idArray = ids.split(',').filter((id) => id.trim());
    const pack = this.wordPacksService.getPacksByIds(idArray);
    if (!pack) {
      throw new NotFoundException(`No valid word packs found for ids: ${ids}`);
    }
    return pack;
  }

  @Get(':id')
  getPackById(@Param('id') id: string): WordPack {
    const pack = this.wordPacksService.getPackById(id);
    if (!pack) {
      throw new NotFoundException(`Word pack with id "${id}" not found`);
    }
    return pack;
  }
}
