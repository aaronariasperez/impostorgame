import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { WordPacksService, WordPack, PublicWordPack } from './word-packs.service';

@Controller('api/word-packs')
@UseGuards(ThrottlerGuard)
export class WordPacksController {
  constructor(private readonly wordPacksService: WordPacksService) {}

  @Get()
  async getAllPacks(): Promise<PublicWordPack[]> {
    return this.wordPacksService.getAllPacks();
  }

  @Get('combined')
  async getCombinedPacks(@Query('ids') ids?: string): Promise<PublicWordPack> {
    if (!ids) throw new BadRequestException('ids is required');
    const idArray = ids.split(',').map((s) => s.trim()).filter(Boolean);
    const pack = await this.wordPacksService.getCombinedMeta(idArray);
    if (!pack) {
      throw new NotFoundException(`No valid word packs found for ids: ${ids}`);
    }
    return pack;
  }

  @Post('selection')
  async getSelection(
    @Body() body: { ids: string[] },
  ): Promise<{ civilianWord: string; impostorHint: string }> {
    if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
      throw new BadRequestException('ids array is required and must not be empty');
    }

    const selection = await this.wordPacksService.getRandomSelection(body.ids);
    if (!selection) {
      throw new NotFoundException('No words available for selected packs');
    }

    return selection;
  }

  @Get(':id')
  async getPackById(@Param('id') id: string): Promise<PublicWordPack> {
    const pack = await this.wordPacksService.getPackMetaById(id);
    if (!pack) {
      throw new NotFoundException(`Word pack with id "${id}" not found`);
    }
    return pack;
  }
}
