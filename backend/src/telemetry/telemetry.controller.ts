import { Body, Controller, Post } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Controller('api/telemetry')
export class TelemetryController {
  constructor(private readonly telemetry: TelemetryService) {}

  @Post('visit')
  async visit(@Body() body: any) {
    await this.telemetry.logVisit(body);
    return { ok: true };
  }

  @Post('event')
  async event(@Body() body: any) {
    await this.telemetry.logEvent(body);
    return { ok: true };
  }
}
