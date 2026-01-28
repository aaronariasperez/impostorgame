import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
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
    TelemetryModule,
  ],
})
export class AppModule {}
