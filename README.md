# LRC WEB

Web de **La Reina de la Casa** (encimeras, muebles a medida y reformas en Madrid). Next.js (App Router)
+ TypeScript + Tailwind CSS v4, CMS Sanity, base de datos de leads en Supabase Postgres.

## Documentación

Todo el contexto del proyecto (brief, arquitectura, sitemap, SEO/cookies, contenidos/diseño, roadmap,
y las guías técnicas accionables) está en [`Docs/`](./Docs). Empieza por `Docs/BACKEND.md` y
`Docs/FRONTEND.md` antes de tocar código; `.claude/CLAUDE.md` resume el contexto para Claude Code.

## Estructura

```
/app            → páginas (Next.js App Router)
/components     → UI (ui, marketing, forms, layout)
/lib            → backend lógico: clientes Sanity/Supabase/Resend, validaciones Zod
/sanity         → schemas del CMS
/public         → assets estáticos
/db             → esquema de la base de datos de leads (Supabase)
/Docs           → documentación del proyecto
```

## Desarrollo

```bash
cp .env.example .env.local   # rellenar con las claves reales (nunca subir este archivo)
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Comandos

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run lint` — ESLint
