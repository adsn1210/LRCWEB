# LRC WEB — Guía Técnica de Backend

> Documento de referencia para el desarrollo. Léelo antes de escribir código de servidor, formularios, CMS o despliegue. Complementa `02-arquitectura-tecnica.md` del proyecto, aquí en formato accionable.

## 1. Infraestructura (decisiones ya tomadas)

| Pieza | Servicio | Notas |
|---|---|---|
| Dominio / DNS / email | Hostinger (ya contratado) | Se usa solo para el dominio y el correo corporativo. **No** se despliega la app Next.js aquí: el hosting compartido de Hostinger no soporta procesos Node.js persistentes, y necesitamos server actions/ISR. |
| Hosting de la app | Vercel (plan Free) | Aquí vive el Next.js real (SSR/ISR/server actions). Gratis para este volumen de tráfico. |
| CMS | Sanity (plan Free) | Proyectos, materiales, servicios, testimonios. |
| Base de datos de leads | Supabase Postgres (plan Free) | Histórico propio de formularios, independiente del email. |
| Email transaccional | Resend (plan Free) | Envío del aviso de "nuevo lead" al email de LRC. |
| Analítica | GA4 + Google Tag Manager (gratis) | Ver sección 6. |

**Acción de DNS**: en Hostinger, apuntar el dominio a Vercel con un registro `A`/`ALIAS` a la IP de Vercel (o `CNAME` en `www`) según las instrucciones que Vercel da al añadir el dominio custom. El correo (`MX`) se queda apuntando a Hostinger sin tocarlo.

## 2. Estructura de carpetas (Next.js App Router)

```
/app
  /(marketing)
    page.tsx                     → Home
    /servicios/[slug]/page.tsx   → 4 páginas de servicio
    /materiales/[slug]/page.tsx  → 3 páginas de material
    /proyectos/page.tsx          → Galería
    /proyectos/[slug]/page.tsx   → Ficha de proyecto
    /sobre-nosotros/page.tsx
    /contacto/page.tsx
    /aviso-legal/page.tsx
    /politica-de-privacidad/page.tsx
    /politica-de-cookies/page.tsx
  /api/leads/route.ts             → (solo si no se usa server action directa)
  sitemap.ts                      → genera sitemap.xml automático
  robots.ts                       → genera robots.txt automático
  layout.tsx                      → layout raíz (header, footer, GTM, cookie banner)
/components
  /ui                             → botones, inputs, card genérica
  /marketing                      → Hero, ServiceCard, MaterialCard, ProjectCard, TestimonialCard
  /forms                          → ContactForm
  /layout                         → Header, Footer, WhatsAppButton, CookieBanner
/lib
  sanity.ts                       → cliente de Sanity
  db.ts                           → cliente de Supabase
  email.ts                        → cliente de Resend
  validations.ts                  → esquemas Zod
/sanity
  schemaTypes/                    → definiciones de contenido (ver sección 3)
```

Slugs de servicios y materiales según `03-arquitectura-informacion-sitemap.md`: `encimeras-de-cocina`, `reformas-de-cocina`, `reformas-de-bano`, `reformas-integrales`; `porcelanico`, `cuarzo-compacto`, `granito`.

## 3. Modelo de datos en Sanity (schemas)

```ts
// sanity/schemaTypes/project.ts
{
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'service', type: 'reference', to: [{ type: 'service' }] },
    { name: 'material', type: 'reference', to: [{ type: 'material' }] },
    { name: 'municipality', type: 'string' }, // ej. "Alcorcón" — sin dirección exacta
    { name: 'description', type: 'text' },
    { name: 'beforeImage', type: 'image' },
    { name: 'afterImage', type: 'image' },
    { name: 'gallery', type: 'array', of: [{ type: 'image' }] },
    { name: 'featured', type: 'boolean' }, // para destacar en home
  ],
}
```

Además de `project`, crear con la misma lógica: `service` (título, slug, descripción larga, proceso), `material` (título, slug, descripción, variedades), y `testimonial` (nombre, texto, foto opcional, proyecto relacionado). Todo el contenido editable (textos de galería, materiales, proyectos) vive en Sanity; los textos legales y estructurales quedan en el código (cambian poco).

## 4. Formulario de contacto

Flujo: `ContactForm` (client component) → **server action** en `app/contacto/actions.ts` → valida con Zod → guarda el lead en Supabase → envía email con Resend a LRC → devuelve estado de éxito/error al formulario.

```ts
// lib/validations.ts
export const leadSchema = z.object({
  name: z.string().min(2),
  phoneOrEmail: z.string().min(6),
  service: z.enum(['encimeras', 'reforma-cocina', 'reforma-bano', 'reforma-integral', 'otro']),
  message: z.string().max(1000).optional(),
  honeypot: z.string().max(0), // debe llegar vacío; si no, es spam → descartar en silencio
})
```

Tabla en Supabase: `leads (id, created_at, name, contact, service, message, source_page)`. Anti-spam: campo honeypot oculto por CSS (nunca mostrado a humanos) + límite de 3 envíos por IP cada 10 minutos (middleware simple o Upstash Ratelimit free tier). No usar CAPTCHA visible: empeora la conversión sin necesidad para este volumen.

## 5. SEO técnico

- Usar la **Metadata API** de Next.js (`generateMetadata`) en cada página de servicio/material/proyecto: title, description y Open Graph únicos por página, generados a partir del contenido de Sanity.
- `app/sitemap.ts` y `app/robots.ts` generan `sitemap.xml`/`robots.txt` a partir de las páginas reales (estáticas + dinámicas de Sanity) — no mantenerlos a mano.
- Insertar JSON-LD: `LocalBusiness` en el layout raíz (NAP + geo del showroom), `Service` en cada página de servicio, `BreadcrumbList` en páginas internas.
- Todas las páginas de servicio/material generadas con `generateStaticParams` + revalidación (`revalidate: 3600` o similar) para servir contenido de Sanity sin perder velocidad.

## 6. Analítica y cookies

- **Google Tag Manager** se carga en `layout.tsx` mediante `next/script`, con `strategy="afterInteractive"`.
- Antes de que el usuario decida sobre cookies, GTM debe arrancar en modo "denegado por defecto": inyectar el snippet de `gtag('consent', 'default', {...})` con `ad_storage: 'denied'`, `analytics_storage: 'denied'`, `ad_user_data: 'denied'`, `ad_personalization: 'denied'` **antes** de cargar GTM.
- El `CookieBanner` (ver `FRONTEND.md` para el diseño) al aceptar/rechazar/configurar llama a `gtag('consent', 'update', {...})` con los valores elegidos por categoría, y guarda la decisión en una cookie propia (p. ej. `lrc_consent`, 12 meses) para no volver a preguntar.
- Eventos GA4 a disparar como conversión: `lead_form_submit`, `whatsapp_click`, `phone_click`, `map_click`. Dispararlos vía `dataLayer.push(...)` en los componentes correspondientes, no hardcoded en GTM, para que queden versionados en el código.
- Ver el detalle legal completo en `04-seo-analitica-cookies.md`.

## 7. Variables de entorno

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
DATABASE_URL=                # Supabase Postgres
RESEND_API_KEY=
LEAD_NOTIFICATION_EMAIL=info@lareinadelacasa.com
NEXT_PUBLIC_GTM_ID=
```

## 8. Convenciones de código

TypeScript en modo `strict`. ESLint + Prettier con las reglas por defecto de `create-next-app`. Un componente por archivo, componentes de servidor por defecto y `"use client"` solo donde haga falta interactividad (formulario, galería filtrable, banner de cookies, menú móvil). Commits pequeños y descriptivos; no subir `.env.local` al repositorio (usar `.env.example` como plantilla).

## 9. Despliegue

1. Repositorio en GitHub → conectar a Vercel (import project).
2. Configurar las variables de entorno de la sección 7 en Vercel.
3. Añadir el dominio custom en Vercel y apuntar el DNS desde Hostinger (sección 1).
4. Cada `push` a `main` despliega a producción; cada PR genera una URL de preview automática para revisar antes de publicar.
