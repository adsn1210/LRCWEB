---
title: LRC WEB · Documento 7 — Pendientes para lanzamiento y guía de cookies/Google
fecha: 2026-09-04
estado: Vivo — actualizar a medida que se completen puntos
---

# Pendientes para lanzamiento

Repaso a fecha de hoy de lo que falta para poder publicar la web en producción con todo completo.
Ver `Docs/06-roadmap-y-fases.md` para el roadmap general y `Docs/03-arquitectura-informacion-sitemap.md`
para el mapa del sitio de referencia.

## 1. Bloqueantes (no se puede lanzar sin esto)

### 1.1 Páginas legales — creadas 2026-09-04, falta solo un dato

`/aviso-legal`, `/politica-de-privacidad` y `/politica-de-cookies` **ya existen** — dejan de dar
404, el banner de cookies y el footer ya enlazan a páginas reales.

- **Política de cookies**: ✅ completa (tabla de cookies reales, explicación de tipos, y un botón
  "Volver a configurar mis cookies" nuevo — tanto en la propia página como en el footer — que borra
  la decisión guardada y vuelve a mostrar el banner; antes no existía forma de cambiar de opinión).
- **Aviso legal** y **Política de privacidad**: ✅ estructura y contenido legal completos (LSSI-CE
  y RGPD respectivamente), pero con **placeholders `[RAZÓN SOCIAL]`, `[NIF/CIF]`, `[DOMICILIO
  SOCIAL]` y `[DATOS REGISTRALES]`** pendientes de los datos fiscales reales de la empresa. En
  cuanto los tengas, es un cambio rápido (buscar y sustituir en
  `app/(marketing)/aviso-legal/page.tsx` y `app/(marketing)/politica-de-privacidad/page.tsx`).
  **Importante**: este contenido es una plantilla legal estándar razonable, no asesoramiento
  jurídico — conviene que lo revise un gestor/abogado antes del lanzamiento definitivo,
  especialmente la cláusula de plazo de conservación de datos.

### 1.2 GTM / Consent Mode v2 — código ya implementado (2026-09-04)

El contenedor real es `GTM-TZFP4VBC`. Ya está en el código (`app/layout.tsx` y
`app/(marketing)/layout.tsx`, usando `next/script` en vez de pegar el `<script>` a mano — ver
sección 2 más abajo para el detalle): snippet de consentimiento por defecto (denegado, en
`beforeInteractive` dentro del layout raíz), carga de GTM (`afterInteractive`, solo en páginas de
marketing, no en `/studio`) y el `<noscript>` de respaldo. De paso corregí un bug real en
`CookieBanner.tsx`: un visitante recurrente con la cookie de consentimiento ya guardada nunca
reenviaba esa decisión a `gtag` en cargas de página posteriores — con GTM ya cargando de verdad,
eso significaba que jamás se activaba la analítica para nadie que ya hubiera aceptado antes. Ya
corregido con un `useEffect` que sincroniza el consentimiento guardado en cada carga.

**Pendiente de añadir tú** (bloqueado por permisos de escritura sobre `.env.local`): la línea
`NEXT_PUBLIC_GTM_ID="GTM-TZFP4VBC"` al final de `.env.local`, y la misma variable en Vercel cuando
se despliegue (ver `Docs/08-conexion-supabase-sanity-vercel.md`).

**Actualización 2026-09-08 — eventos de conversión**: `lead_form_submit` ya estaba implementado desde
que se construyó el wizard (`ProjectWizard.tsx`, vía `lib/analytics.ts`). Añadidos ahora `phone_click`
y `whatsapp_click`: `PhoneMenu.tsx` (usado en Header, MobileMenu, Footer, CtaBand y `/contacto`) toma
un prop `source` obligatorio para identificar desde dónde se hizo clic, y dispara `trackEvent` en el
enlace `tel:` y en el de WhatsApp del propio desplegable. El botón flotante (`WhatsAppButton.tsx`) y
el enlace directo de `/contacto` usan un componente nuevo, `components/ui/TrackedWhatsAppLink.tsx`
(client component reutilizable), para no duplicar la lógica de tracking. **Solo queda `map_click`**,
bloqueado a que exista el mapa real embebido (sección 4 más abajo).

**Actualización 2026-09-04 — GA4 y dominio canónico**: propiedad GA4 creada (flujo "LRC-WEB",
ID de medición `G-693LKTD3YR`) — falta solo crear la etiqueta de configuración de GA4 dentro de GTM
(ver Paso 2-3 más abajo, es un paso en la interfaz de Google, no en el código). El flujo de datos de
GA4 apunta a `lareinadelacasa.com` sin `www`, así que ese pasa a ser **el dominio canónico del
proyecto** — actualizado en `lib/site.ts`, `.env.example`, `app/robots.ts` (que tenía su propio
fallback duplicado de dominio, ahora corregido para importar de `lib/site.ts` y no poder
desincronizarse) y `Docs/08-conexion-supabase-sanity-vercel.md`. `www.lareinadelacasa.com` debe
quedar como redirección 301 hacia el apex, no como sitio propio.

### 1.3 Vercel

El repositorio está en GitHub (`adsn1210/LRCWEB`) pero no hay evidencia de que el proyecto esté
importado en Vercel (no existe `.vercel/` ni `vercel.json` — normal, Vercel no los necesita para
un proyecto Next.js estándar, pero confirma que aún no se ha hecho el `import`). Ver
`Docs/08-conexion-supabase-sanity-vercel.md` para el paso a paso.

### 1.4 CI/CD

`Docs/BACKEND.md` sección 1 decidió GitHub Actions con ESLint + Prettier + comprobación de tipos +
Playwright, pero no existe `.github/workflows/`, Prettier no está instalado como dependencia y no
hay ningún test todavía. No es estrictamente bloqueante para publicar una vez, pero sí para poder
iterar con confianza después del lanzamiento.

## 2. Estado real de las credenciales (corrección importante)

En la revisión anterior dije que Supabase y Resend no estaban configurados — **eso estaba
desactualizado**. Comprobé `.env.local` de nuevo (solo si cada variable está rellena o vacía, sin
leer los valores) y el estado real es:

| Variable | Estado |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ rellena |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ rellena |
| `SANITY_API_READ_TOKEN` | ❌ no presente (puede no hacer falta si el dataset es público en modo lectura) |
| `DATABASE_URL` (Supabase) | ✅ rellena |
| `RESEND_API_KEY` | ✅ rellena |
| `RESEND_FROM_EMAIL` | ✅ rellena |
| `LEAD_NOTIFICATION_EMAIL` | ✅ rellena |
| `NEXT_PUBLIC_GTM_ID` | ❌ no presente |
| `NEXT_PUBLIC_SITE_URL` | ❌ no presente (usa el valor por defecto del código, que ya es el dominio real) |

**Pendiente de verificar** (no lo he probado en esta sesión): que la tabla `leads` exista realmente
en el Supabase real — hay que ejecutar `db/schema.sql` en el SQL Editor de Supabase si no se ha
hecho, y probar el formulario de `/contacto` de verdad para confirmar que el lead llega a la base de
datos y el email de aviso se envía. Ver `Docs/08-conexion-supabase-sanity-vercel.md`.

## 3. Contenido pendiente del cliente

Fotos reales de proyectos (todo son degradados de color por ahora), logo definitivo en alta
resolución y en vectorial, teléfono, dirección del showroom, horario de atención, URLs reales de
redes sociales (hoy son `#` en el footer), catálogo real de acabados de materiales, testimonios de
clientes. Ver `Docs/05-contenidos-y-diseno.md` sección "Activos que hay que recopilar del cliente".

## 4. Nice-to-have (no bloquea el lanzamiento)

- Migrar el contenido hardcodeado de servicios/materiales/proyectos a Sanity, para que se pueda
  editar sin tocar código (hoy vive en `lib/content/services.ts`, `lib/content/materials.ts` y
  `lib/placeholder-projects.ts`, todos con comentarios `TODO` para esta migración).
- Mapa de Google Maps embebido en `/contacto` (pendiente de tener la dirección real del showroom).
- Rate-limit del formulario más robusto con Upstash Ratelimit (`Docs/BACKEND.md` sección 4) si el
  spam se convierte en un problema real — el actual es en memoria y "best effort" en serverless.

---

# Guía: conectar Google (GTM, GA4, Consent Mode) y cerrar el tema cookies

## Por qué esto es tan importante

España (AEPD) y el RGPD exigen que **no se cargue ningún script de analítica o publicidad que use
cookies no esenciales hasta que el usuario dé su consentimiento explícito**. Hacerlo mal (cargar GA4
antes de que el usuario decida) es una infracción real y sancionable. Por eso todo el diseño de este
proyecto pasa por "Consent Mode v2": todo arranca denegado por defecto, y solo se activa cuando el
usuario lo permite.

**Estado actual real (actualizado 2026-09-04)**: el banner de cookies
(`components/layout/CookieBanner.tsx`) guarda la decisión en la cookie `lrc_consent` (12 meses) y
llama a `gtag('consent', 'update', {...})` con los 4 parámetros que exige Consent Mode v2, tanto en
el momento de decidir como en cada carga posterior de página para visitantes recurrentes. El
snippet de consentimiento por defecto (denegado) y la carga de GTM ya están wireados en el código
(`app/layout.tsx` / `app/(marketing)/layout.tsx`) usando el ID real `GTM-TZFP4VBC` — solo falta que
la variable `NEXT_PUBLIC_GTM_ID` exista en `.env.local` (pendiente de que la añadas tú, ver más
abajo) y en Vercel para que se active de verdad.

## Paso a paso para activarlo

### Paso 1 — Crear la cuenta y el contenedor de GTM

1. Entra en [tagmanager.google.com](https://tagmanager.google.com) con la cuenta de Google que vaya
   a ser la "cuenta oficial" de LRC (recomendable que sea del cliente, no personal tuya, para que la
   propiedad sea de la empresa).
2. Crea una cuenta nueva → nombre "La Reina de la Casa".
3. Crea un contenedor → tipo **Web**, nombre `lareinadelacasa.com`.
4. Te da un ID con forma `GTM-XXXXXXX`. Ese es el valor que va en `NEXT_PUBLIC_GTM_ID`.

### Paso 2 — Crear la propiedad de GA4

1. En [analytics.google.com](https://analytics.google.com), crea una propiedad GA4 nueva para el
   dominio.
2. Copia el **ID de medición** (`G-XXXXXXXXXX`), lo necesitarás dentro de GTM, no en el código.
3. Dentro de GTM, crea una etiqueta tipo "Google Analytics: Configuración de GA4" con ese ID, con el
   disparador "All Pages" (o mejor, ligado al Consent Mode — ver paso 3).

### Paso 3 — Configurar Consent Mode v2 dentro de GTM

GTM tiene soporte nativo para Consent Mode desde 2024. En el propio contenedor:

1. Ve a **Admin → Configuración del contenedor** y activa "Consent Overview".
2. En cada etiqueta de analítica/marketing, en la pestaña "Consentimiento" (Advanced Settings →
   Consent Settings), marca los tipos de consentimiento adicionales requeridos (`analytics_storage`
   para GA4, `ad_storage`/`ad_user_data`/`ad_personalization` si en el futuro se añaden campañas de
   Ads).
3. Esto hace que GTM **no dispare la etiqueta hasta que reciba la señal de consentimiento
   correspondiente** — el mismo mecanismo que ya alimenta `CookieBanner.tsx`.

### Paso 4 — Código: qué está hecho y qué falta

Puntos 1 y 2 **ya implementados** (2026-09-04) con el ID real `GTM-TZFP4VBC`:

1. ✅ **Snippet de consentimiento por defecto**, en `app/layout.tsx`, con `next/script` y
   `strategy="beforeInteractive"` (es la única estrategia que Next.js permite en el layout raíz, y
   se inyecta siempre en el `<head>` sin importar dónde se coloque el componente) — todo denegado
   (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` en `'denied'`,
   `wait_for_update: 500`).
2. ✅ **Carga de GTM**: `next/script` con `strategy="afterInteractive"` en
   `app/(marketing)/layout.tsx` (no en el layout raíz, para que no cargue en `/studio`), usando
   `process.env.NEXT_PUBLIC_GTM_ID`, más el `<noscript>` de respaldo.

3. ✅ **Eventos de conversión al `dataLayer`** (`Docs/BACKEND.md` sección 6):
   `lead_form_submit` (`components/forms/ProjectWizard.tsx`), `whatsapp_click` y `phone_click`
   (`components/ui/PhoneMenu.tsx` y `components/ui/TrackedWhatsAppLink.tsx`) — ver detalle arriba.
   Solo falta `map_click`, cuando exista el mapa embebido real en `/contacto`.

Pendiente:

4. Añadir `NEXT_PUBLIC_GTM_ID` a `.env.local` y a las variables de entorno de Vercel (ver
   `Docs/08-conexion-supabase-sanity-vercel.md`).

### Paso 5 — Contenido de la política de cookies

La página `/politica-de-cookies` (pendiente de crear, ver sección 1.1) debe listar, como mínimo:

| Cookie | Tipo | Duración | Finalidad |
|---|---|---|---|
| `lrc_consent` | Técnica/propia | 12 meses | Recordar tu decisión sobre cookies para no volver a preguntar |
| `_ga`, `_ga_*` | Analítica (Google Analytics, terceros) | hasta 13 meses (GA4 estándar) | Medir el uso del sitio, solo si aceptas cookies analíticas |

Y explicar: qué son las cookies, que las necesarias siempre están activas, que las de analítica solo
se activan con consentimiento, cómo cambiar la decisión más adelante (ideal: un enlace/botón
"Configurar cookies" en el footer que vuelva a abrir el `CookieBanner`), y que Google es el
tercero que trata los datos de analítica si se aceptan.

## Resumen de lo que necesito de ti para poder terminar esto

- El ID de GTM (`GTM-XXXXXXX`) una vez creado el contenedor.
- Confirmación de si la cuenta de Google Analytics/GTM la crea el cliente (LRC) o tú, para saber a
  qué email pedirte que me des acceso de "Editor" en GTM cuando toque implementarlo.
- Los datos fiscales reales de la empresa para el aviso legal y la política de privacidad (razón
  social, NIF/CIF, domicilio social).
