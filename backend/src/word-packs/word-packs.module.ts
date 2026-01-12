import { Module } from '@nestjs/common';
import { WordPacksController } from './word-packs.controller';
import { WordPacksService } from './word-packs.service';

@Module({
  controllers: [WordPacksController],
  providers: [WordPacksService],
})
export class WordPacksModule {}
