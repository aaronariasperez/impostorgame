import { Module } from '@nestjs/common';
import { WordPacksModule } from './word-packs/word-packs.module';
import { TelemetryModule } from './telemetry/telemetry.module';

@Module({
  imports: [WordPacksModule, TelemetryModule],
})
export class AppModule {}
