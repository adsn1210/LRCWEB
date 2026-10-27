const WINDOW_MS = 10 * 60 * 1000; // 10 minutos, ver Docs/BACKEND.md sección 4
const MAX_REQUESTS = 3;

type Entry = { count: number; resetAt: number };

// Limitador en memoria por IP: protección de segundo nivel tras el honeypot. En funciones
// serverless (Vercel) esto es "best effort" — no hay memoria compartida garantizada entre
// invocaciones. Si el volumen de spam lo justifica, migrar a Upstash Ratelimit (Docs/BACKEND.md
// sección 4) en vez de esto.
const hits = new Map<string, Entry>();

// Una instancia "caliente" puede vivir horas: sin limpiar, el Map crecería con cada IP nueva.
function pruneExpired(now: number) {
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key);
  }
}

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  pruneExpired(now);
  const entry = hits.get(key);

  if (!entry) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}
