import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class TelemetryService {
  private logsDir = path.join(process.cwd(), 'logs');
  private visitsFile = path.join(this.logsDir, 'telemetry-visits.jsonl');
  private eventsFile = path.join(this.logsDir, 'telemetry-events.jsonl');

  constructor() {
    this.ensureLogsDir();
  }

  private async ensureLogsDir() {
    try {
      await fs.mkdir(this.logsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating logs directory:', error);
    }
  }

  async logVisit(payload: any) {
    try {
      const entry = {
        ts: new Date().toISOString(),
        type: 'visit',
        sessionId: payload.sessionId,
        path: payload.path,
        referrer: payload.referrer || null,
        userAgent: payload.ua,
        timestamp: payload.ts,
      };

      await fs.appendFile(this.visitsFile, JSON.stringify(entry) + '\n', 'utf8');
    } catch (error) {
      console.error('Error logging visit:', error);
    }
  }

  async logEvent(payload: any) {
    try {
      const entry = {
        ts: new Date().toISOString(),
        type: payload.eventType,
        sessionId: payload.sessionId,
        eventData: payload.data || {},
      };

      await fs.appendFile(this.eventsFile, JSON.stringify(entry) + '\n', 'utf8');
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }
}
