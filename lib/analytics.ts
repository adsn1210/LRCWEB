// Envío de eventos a GA4 vía dataLayer (Docs/BACKEND.md sección 6). Se dispara desde los
// componentes, nunca hardcoded en GTM, para que quede versionado en el código qué evento
// corresponde a qué acción.
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
