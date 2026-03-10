import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

// Get or create session ID
function getSessionId(): string {
  try {
    const key = 'impostor_sid';
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const sid = crypto.randomUUID();
    localStorage.setItem(key, sid);
    return sid;
  } catch {
    return crypto.randomUUID();
  }
}

// Log a visit to the app
export async function logVisit() {
  try {
    if (!db) return;

    await addDoc(collection(db, 'telemetry_visits'), {
      ts: new Date().toISOString(),
      type: 'visit',
      sessionId: getSessionId(),
      path: window.location.pathname,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error logging visit:', error);
  }
}

// Log a game event
export async function logGameEvent(
  eventType: string,
  data: Record<string, unknown>
) {
  try {
    if (!db) return;

    await addDoc(collection(db, 'telemetry_events'), {
      ts: new Date().toISOString(),
      type: eventType,
      sessionId: getSessionId(),
      eventData: data,
    });
  } catch (error) {
    console.error('Error logging event:', error);
  }
}
