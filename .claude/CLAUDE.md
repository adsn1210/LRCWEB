---
title: LRC WEB — Contexto de proyecto para Claude
---

# LRC WEB

## Qué es esto

Web nueva para **La Reina de la Casa (LRC)**, empresa de Madrid especializada en encimeras de cocina
(porcelánico, cuarzo compacto, granito) y muebles a medida, que está ampliando su actividad a reformas
generales de locales y viviendas. Sustituye a lareinadelacasa.com (anticuada en tecnología, SEO y medición).

Objetivo de negocio: más y mejores leads medibles, mensaje ampliado a "reformas" (no solo encimeras),
y mejor posicionamiento orgánico en la Comunidad de Madrid.

Público: particulares de Madrid capital/alrededores reformando cocina/baño o buscando reforma integral,
que comparan varias empresas y llegan sobre todo desde móvil/Google.

Documentos de referencia completos (fase 0, ya redactados) en `Docs/`:
`01-brief-y-alcance.md`, `02-arquitectura-tecnica.md`, `03-arquitectura-informacion-sitemap.md`,
`04-seo-analitica-cookies.md`, `05-contenidos-y-diseno.md`, `06-roadmap-y-fases.md`.
Los assets de marca (logo, paleta de colores) están en `Docs/branding/`.

## Guías técnicas de desarrollo (léelas siempre antes de escribir código)

@../Docs/BACKEND.md
@../Docs/FRONTEND.md

## Stack técnico

| Capa | Tecnología | Motivo |
|---|---|---|
| Framework | Next.js (App Router) + React + TypeScript | SEO nativo, rendimiento |
| Estilos | Tailwind CSS | Desarrollo rápido, consistente |
| CMS | Sanity (plan Free) | Autonomía del cliente para gestionar galería/proyectos, sin depender del servidor propio |
| Base de datos | Postgres (Supabase, plan Free) | Histórico propio de leads |
| Formularios | Server actions + Zod + Resend | Sin backend adicional |
| Hosting de la app | **Vercel** (plan Free) | Next.js necesita procesos Node.js para server actions e ISR; el hosting compartido de Hostinger no los soporta |
| Dominio y correo | Hostinger (ya contratado) | Solo DNS y email corporativo — la app NO se despliega aquí |
| Analítica | GA4 + GTM + Consent Mode v2 | Medición conforme a normativa UE (AEPD/RGPD) |
| CI/CD | GitHub Actions (ESLint, Prettier, tipos, Playwright) | Calidad de código |

Alcance v1: home, páginas de servicio (encimeras, reforma cocina, reforma baño, reforma integral),
materiales, galería de proyectos filtrable, sobre nosotros, contacto, legales, analítica+cookies.
Fuera de v1: blog activo, zona de clientes, multi-idioma.

## Estructura del repositorio

Next.js App Router unifica frontend y backend en un mismo proyecto (no son carpetas separadas):
la parte "backend" vive en `/lib` (clientes de Sanity/Supabase/Resend, validaciones Zod) y en las
*server actions*/`app/api`; la parte "front" vive en `/app` (páginas) y `/components` (UI). Ver la
estructura exacta de carpetas en `Docs/BACKEND.md` sección 2.

```
/app            → páginas (Next.js App Router)
/components     → UI (ui, marketing, forms, layout)
/lib            → backend lógico: clientes Sanity/Supabase/Resend, validaciones Zod
/sanity         → schemas del CMS
/public         → assets estáticos servidos por Next.js
/db             → esquema/migraciones de la base de datos de leads (Supabase)
/Docs           → documentación del proyecto (fase 0, guías técnicas, branding)
/.claude        → configuración de Claude Code (agentes, comandos, hooks, este archivo)
.env.example    → plantilla de variables de entorno ("keys") — nunca claves reales en el repo
```

## Estado y roadmap

Proyecto saliendo de la **Fase 0 (documentación y diseño)**, entrando en **Fase 1 (setup técnico)**.
Activos pendientes de recibir del cliente: fotos definitivas y logo definitivo en alta resolución
(se usan temporalmente placeholders y el logo actual de `Docs/branding/`, ver `Docs/FRONTEND.md` sección 7).
El desarrollo (fases 1–6) se hace en Claude Code sobre este mismo repo. Ver `Docs/06-roadmap-y-fases.md`
para el detalle de fases (estimación total v1: 10–14 semanas).

## Convenciones para trabajar en este repo

- Sigue siempre las decisiones de `Docs/BACKEND.md` y `Docs/FRONTEND.md` salvo que el usuario pida
  explícitamente un cambio.
- No instales plugins, marketplaces o frameworks de terceros por iniciativa propia — si algo así hace
  falta, pregúntalo primero al usuario.
- No subas `.env`, `.env.local` ni ninguna clave real al repositorio; usa siempre `.env.example` como
  plantilla.
