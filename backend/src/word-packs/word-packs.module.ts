import { Module } from '@nestjs/common';
import { WordPacksController } from './word-packs.controller';
import { WordPacksService } from './word-packs.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [WordPacksController],
  providers: [WordPacksService],
})
export class WordPacksModule {}
