import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

// Get or create session ID — persisted in localStorage, with in-memory fallback
let memorySessionId: string | null = null;

function getSessionId(): string {
  const key = 'impostor_sid';
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const sid = crypto.randomUUID();
    localStorage.setItem(key, sid);
    return sid;
  } catch {
    if (!memorySessionId) memorySessionId = crypto.randomUUID();
    return memorySessionId;
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
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
