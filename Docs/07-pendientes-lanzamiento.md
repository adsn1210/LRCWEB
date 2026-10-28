---
title: LRC WEB · Documento 7 — Estado del lanzamiento, pendientes y guía de analítica
fecha: 2026-09-04
actualizado: 2026-10-28
estado: Vivo — actualizar a medida que se completen puntos
---

# Estado y pendientes

La web está **en producción** desde octubre de 2026 (Vercel, rama `main`). Este documento recoge lo
que queda por hacer y, en la segunda parte, cómo está montada la analítica y qué revisar en ella.
Ver `Docs/06-roadmap-y-fases.md` para el roadmap y `Docs/08-conexion-supabase-sanity-vercel.md`
para la conexión de servicios.

## 1. Pendientes ordenados por impacto

### 1.1 Medición (GA4 / GTM) — lo más urgente

Sin medición no se sabe si la web genera tráfico ni leads. Estado a 2026-10-29:

| Punto | Estado | Quién / dónde |
|---|---|---|
| GTM carga y ejecuta la etiqueta de GA4 | ✅ corregido 2026-10-28 (ver 2.3) | — |
| Eventos clave `lead_form_submit`, `phone_click`, `whatsapp_click`, `email_click` | ✅ 2026-10-29 (creados "con código": el código ya los envía) | GA4 → Administrar → Eventos clave |
| Retención de datos a 14 meses | ✅ 2026-10-29 | GA4 → Administrar → Retención de datos |
| Etiqueta GTM que enviaba `lrc-web-Evento` en cada página | ✅ pausada 2026-10-29 (contenedor v3) | GTM → Etiquetas |
| Google Search Console (propiedad de **Dominio**, verificada por TXT en Hostinger) + sitemap | ✅ 2026-10-29 | search.google.com/search-console |
| Imagen de marca al compartir (WhatsApp, redes) | ✅ 2026-10-29, `public/og-image.jpg` | diseño fuente en `scripts/og-image/` |
| Vincular Search Console con GA4 | ❌ pendiente | GA4 → Administrar → Vinculaciones de productos |
| Ficha de **Google Business Profile** con enlace a la web | ❓ sin verificar | business.google.com |

La "confirmación de recogida de datos de usuario" que ofrece GA4 no se ha aceptado: no hace falta
para nada de lo anterior (solo para Google Signals o datos proporcionados por el usuario) y es una
declaración legal de la empresa, a decidir por LRC.

DNS (Hostinger): además del TXT de Google en `@`, hay SPF de Hostinger en `@`, `_dmarc`, y DKIM/SPF
de Resend en `resend._domainkey.contact` y `send.contact`. No tocar estos últimos: firman los
avisos de leads.

### 1.2 Dominio canónico — ✅ resuelto 2026-10-28

El dominio canónico es `lareinadelacasa.com` **sin www** (`lib/site.ts`). Hasta el 2026-10-28
Vercel lo tenía al revés (el apex redirigía a `www`), así que sitemap, robots y canonical
anunciaban URLs que redirigían. Corregido en Vercel → Settings → Domains: `lareinadelacasa.com`
sirve la web y `www.lareinadelacasa.com` redirige con 308 al apex. Verificado: las 14 URLs del
sitemap responden 200 y la canonical coincide con la URL servida.

### 1.3 Contenido pendiente del cliente

Dirección del showroom (al recibirla: `SHOWROOM_ADDRESS` en `lib/site.ts` y `address`/`geo` en el
JSON-LD de `app/(marketing)/layout.tsx`; hasta entonces no se muestra ninguna dirección), URLs de
redes sociales (`socialLinks` en `components/layout/Footer.tsx`; sin URL no se muestra el icono),
fotos reales de proyectos (se suben en `/studio`, la galería ya las lee de Sanity), logo definitivo
en vectorial, testimonios y catálogo de acabados. Ver `Docs/05-contenidos-y-diseno.md`.

### 1.4 Páginas legales

`/aviso-legal`, `/politica-de-privacidad` y `/politica-de-cookies` existen y tienen contenido
completo, pero aviso legal y privacidad siguen con los placeholders `[RAZÓN SOCIAL]`, `[NIF/CIF]`,
`[DOMICILIO SOCIAL]` y `[DATOS REGISTRALES]` (aparcado por decisión del equipo, 2026-10-21). Es
una plantilla razonable, no asesoramiento jurídico: conviene que la revise un gestor o abogado.

### 1.5 Calidad y mantenimiento

- **CI** (`.github/workflows/ci.yml`): ESLint, tipos y build en cada push/PR a `main`. Necesita las
  *variables* de GitHub `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET`.
- **Keep-alive de Supabase** (`.github/workflows/supabase-keepalive.yml`): consulta cada 3 días para
  que el plan Free no pause el proyecto (pasó en oct 2026 y se perdían leads). Necesita el secret
  `DATABASE_URL`. GitHub desactiva los workflows programados tras 60 días sin commits.
- Pendiente: Prettier y tests de Playwright (decisión original de `Docs/BACKEND.md` sección 1).

### 1.6 Nice-to-have

- Migrar a Sanity el contenido de servicios y materiales (`lib/content/services.ts`,
  `lib/content/materials.ts`), hoy en código.
- Mapa de Google Maps en `/contacto` con evento `map_click`, cuando haya dirección.
- Rate-limit con Upstash si aparece spam real (el actual es en memoria, "best effort").
- Registrar la página de entrada de los visitantes que aceptan cookies (ver 2.4).

---

# Analítica: cómo está montada y qué revisar

## 2.1 Piezas

| Pieza | Valor | Dónde |
|---|---|---|
| Contenedor GTM | `GTM-TZFP4VBC` | Variable `NEXT_PUBLIC_GTM_ID` (Vercel y `.env.local`) |
| Propiedad GA4 | "la reina de la casa" (`properties/397656204`) | Cuenta Google `lrcencimeras@gmail.com` |
| Flujo de datos | LRC-WEB, `G-693LKTD3YR` | Configurado dentro de GTM, no en el código |
| Otro flujo en la misma propiedad | "Mi sitio web de encimeras", `G-RD8GPV6VWG` (encimerabarata.com) | Sus datos se mezclan en los informes: filtrar por flujo o nombre de host |

## 2.2 Flujo en el código

1. `app/layout.tsx` fija Consent Mode v2 **denegado por defecto** (`beforeInteractive`).
2. `app/(marketing)/layout.tsx` carga GTM (no en `/studio`).
3. `components/layout/CookieBanner.tsx` guarda la decisión en la cookie `lrc_consent` (12 meses) y
   llama a `gtag('consent', 'update', …)`, también en cada carga para visitantes recurrentes.
4. Los eventos se envían al `dataLayer` desde los componentes con `trackEvent()` (`lib/analytics.ts`):

| Evento | Se dispara en |
|---|---|
| `lead_form_submit` | Envío correcto del formulario (`ProjectWizard.tsx`) |
| `lead_widget_open` / `lead_widget_step` | Apertura y pasos del asistente |
| `phone_click`, `whatsapp_click` | `PhoneMenu.tsx`, `TrackedWhatsAppLink.tsx` (parámetro `source`) |
| `email_click` | `TrackedEmailLink.tsx` (contacto, footer, CtaBand) |
| `map_click` | Pendiente, cuando exista el mapa |

Las etiquetas de GTM que reenvían estos eventos a GA4 se configuran en la interfaz de GTM.

## 2.3 Incidencia de octubre de 2026: GA4 sin datos

Desde el lanzamiento GA4 no registró ninguna visita. Causa: la variable `NEXT_PUBLIC_GTM_ID` se
guardó en Vercel **con comillas dentro del valor** (`"GTM-TZFP4VBC"`). La web pedía
`gtm.js?id=%22GTM-TZFP4VBC%22`, Google devolvía un contenedor que no ejecutaba ninguna etiqueta, y
no salía ni una petición a GA4. En local no se notaba porque Next quita las comillas al leer
`.env.local`. Arreglado quitando las comillas en Vercel + redeploy; además `lib/analytics.ts` sanea
el ID para que no pueda repetirse.

Cómo comprobar que la medición funciona: abrir la web, aceptar cookies, navegar a otra página y,
en DevTools → Red, filtrar por `collect`: debe aparecer una petición a
`region1.google-analytics.com/g/collect` con `tid=G-693LKTD3YR` y respuesta 204. Ojo: los
bloqueadores de anuncios (uBlock, Brave, DNS privados…) impiden esas peticiones, y GA4 descarta
el tráfico de navegadores automatizados (`HeadlessChrome`).

## 2.4 Cómo se cuentan las visitas con Consent Mode

- Antes de decidir (o si rechaza), GA4 recibe solo "pings" sin cookies (`gcs=G100`): sirven para
  el modelado de Google pero **no aparecen** en informes ni en tiempo real.
- Tras aceptar, las páginas siguientes llegan con cookies (`gcs=G111`) y sí cuentan. La página de
  entrada de quien acepta no se registra como visita completa (posible mejora: reenviar un
  `page_view` al aceptar).
- Por tanto GA4 siempre mostrará menos visitas que las reales. Search Console (clics desde Google)
  no depende de cookies y es la cifra fiable de tráfico orgánico.

## 2.5 Consultar GA4 desde Claude Code

Hay un servidor MCP de Google Analytics (`analytics-mcp`, instalado con pipx y registrado a nivel de
usuario en Claude Code) con acceso **solo de lectura** a la propiedad, usando las credenciales de
`lrcencimeras@gmail.com` (ADC con un cliente OAuth propio del proyecto de Google Cloud
`lrcencimeras-analytics`). Si las credenciales caducan, se renuevan con:

```
gcloud auth application-default login --client-id-file="%APPDATA%\gcloud\lrc-analytics-oauth-client.json" --scopes=https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform
```

El cliente OAuth por defecto de `gcloud` no sirve: Google lo bloquea para el permiso de Analytics.

## 2.6 Cookies declaradas en `/politica-de-cookies`

| Cookie | Tipo | Duración | Finalidad |
|---|---|---|---|
| `lrc_consent` | Técnica/propia | 12 meses | Recordar la decisión sobre cookies |
| `_ga`, `_ga_*` | Analítica (Google, terceros) | hasta 13 meses | Medir el uso del sitio, solo con consentimiento |

El footer y la propia política tienen un botón "Configurar cookies" que borra la decisión y vuelve a
mostrar el banner. Aceptar y rechazar tienen el mismo peso visual (requisito de la AEPD).
