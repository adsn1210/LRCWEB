// Dominio canónico: lareinadelacasa.com sin "www" (decisión 2026-09-04, coincide con el flujo de
// datos de GA4). www.lareinadelacasa.com debe redirigir (301) a este, no convivir como sitio propio.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lareinadelacasa.com";

// Número real de WhatsApp de LRC (+34 602 02 34 56), confirmado 2026-09-04. Fuente única para
// que WhatsAppButton y la página de contacto no puedan desincronizarse.
export const WHATSAPP_URL = `https://wa.me/34602023456?text=${encodeURIComponent(
  "Hola, me gustaría pedir información sobre una encimera o reforma.",
)}`;

// Mismo número que WhatsApp (+34 602 02 34 56), confirmado 2026-09-07 — LRC solo tiene una línea
// para ambos canales. Fuente única para que los enlaces de teléfono del sitio (PhoneMenu, JSON-LD,
// aviso legal) no puedan desincronizarse entre sí ni del número de WhatsApp de arriba.
export const PHONE_NUMBER_DISPLAY = "+34 602 02 34 56";
export const PHONE_NUMBER_TEL = "+34602023456";

export const CONTACT_EMAIL = "info@lareinadelacasa.com";

// Dirección del showroom, pendiente de que LRC la facilite. Mientras sea null, footer, /contacto y
// /sobre-nosotros no muestran ninguna línea de dirección (antes se veía "[Dirección showroom]" en
// todas las páginas). Al rellenarla, añadir también address/geo al JSON-LD de app/(marketing)/layout.tsx.
export const SHOWROOM_ADDRESS: string | null = null;
