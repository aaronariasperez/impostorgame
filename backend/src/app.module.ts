import { Module } from '@nestjs/common';
import { WordPacksModule } from './word-packs/word-packs.module';

@Module({
  imports: [WordPacksModule],
})
export class AppModule {}
