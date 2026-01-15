import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import * as admin from 'firebase-admin';

@Injectable()
export class TelemetryService {
  private db: admin.firestore.Firestore;

  constructor(private firebaseService: FirebaseService) {
    this.db = firebaseService.getFirestore();
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

      await this.db.collection('telemetry_visits').add(entry);
    } catch (error) {
      console.error('Error logging visit to Firebase:', error);
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

      await this.db.collection('telemetry_events').add(entry);
    } catch (error) {
      console.error('Error logging event to Firebase:', error);
    }
  }
}
