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
    const payload = {
      sessionId: getSessionId(),
      path: window.location.pathname,
      referrer: document.referrer || null,
      ua: navigator.userAgent,
      ts: Date.now(),
    };

    const ok = navigator.sendBeacon(
      '/api/telemetry/visit',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    );

    // Fallback if sendBeacon fails
    if (!ok) {
      fetch('/api/telemetry/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (error) {
    console.error('Error logging visit:', error);
  }
}

// Log a game event
export async function logGameEvent(
  eventType: string,
  data: Record<string, any>
) {
  try {
    const payload = {
      sessionId: getSessionId(),
      eventType,
      data,
    };

    fetch('/api/telemetry/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch (error) {
    console.error('Error logging event:', error);
  }
}
