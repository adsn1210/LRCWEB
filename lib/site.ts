// Dominio canónico: lareinadelacasa.com sin "www" (decisión 2026-09-04, coincide con el flujo de
// datos de GA4). www.lareinadelacasa.com debe redirigir (301) a este, no convivir como sitio propio.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lareinadelacasa.com";

// Número real de WhatsApp de LRC (+34 602 02 34 56), confirmado 2026-09-04. Fuente única para
// que WhatsAppButton y la página de contacto no puedan desincronizarse.
export const WHATSAPP_URL = `https://wa.me/34602023456?text=${encodeURIComponent(
  "Hola, me gustaría pedir información sobre una encimera o reforma.",
)}`;
