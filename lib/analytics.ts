// ID del contenedor de GTM, compartido por app/layout.tsx (Consent Mode por defecto) y
// app/(marketing)/layout.tsx (carga de GTM). Se limpian comillas y espacios porque en oct 2026 la
// variable se pegó en Vercel como `"GTM-TZFP4VBC"`, con las comillas dentro del valor: GTM cargaba
// un contenedor con ese ID entre comillas, no ejecutaba ninguna etiqueta y GA4 estuvo semanas sin
// recibir ni una visita. (En local no se notaba: Next quita las comillas al leer .env.local.)
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.replace(/["'\s]/g, "") || undefined;

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
