// Dominio canónico: lareinadelacasa.com sin "www" (decisión 2026-09-04, coincide con el flujo de
// datos de GA4). www.lareinadelacasa.com debe redirigir (301) a este, no convivir como sitio propio.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lareinadelacasa.com";
