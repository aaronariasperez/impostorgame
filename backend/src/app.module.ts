import { Module } from '@nestjs/common';
import { WordPacksModule } from './word-packs/word-packs.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [FirebaseModule, WordPacksModule, TelemetryModule],
})
export class AppModule {}
