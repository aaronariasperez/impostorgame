import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { WordPacksModule } from './word-packs/word-packs.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
    FirebaseModule,
    WordPacksModule,
    TelemetryModule,
  ],
})
export class AppModule {}
