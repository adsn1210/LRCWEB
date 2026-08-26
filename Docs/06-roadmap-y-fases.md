---
title: LRC WEB · Documento 6 — Roadmap y Fases del Proyecto
fecha: 2026-08-21
estado: Borrador para revisión
---

# Roadmap y Fases del Proyecto

## Visión general

El proyecto se plantea en siete fases, algunas de las cuales pueden solaparse en el tiempo (por ejemplo, la carga de contenidos puede avanzar mientras se maqueta el sitio). La estimación total para tener la v1 lista para lanzar es de **10 a 14 semanas**, dependiendo sobre todo de la rapidez con la que LRC pueda entregar fotografías, textos y accesos.

## Fases

| Fase | Contenido | Duración estimada |
|---|---|---|
| 0 · Documentación y diseño | Estos documentos, wireframes de las páginas clave, moodboard visual, aprobación del cliente antes de programar nada | 2–3 semanas |
| 1 · Setup técnico | Repositorio de código, andamiaje Next.js + Tailwind, CI/CD, entornos de desarrollo/preview/producción, alta del CMS | 1 semana |
| 2 · Desarrollo core | Maquetación de todas las páginas del sitemap, formulario de contacto, integración del CMS con contenido real | 4–6 semanas |
| 3 · SEO, analítica y cookies | Datos estructurados, sitemap.xml, GA4 + GTM, Consent Mode v2, banner de cookies propio | 1–2 semanas (en paralelo con fase 2) |
| 4 · Contenidos y datos | Redacción de textos definitivos, carga de fotos y proyectos, primeros artículos de blog si aplica | 2 semanas (en paralelo con fases 2–3) |
| 5 · QA y testing | Pruebas en distintos dispositivos, rendimiento (Lighthouse/Core Web Vitals), accesibilidad, revisión legal de textos (aviso legal, privacidad, cookies) | 1 semana |
| 6 · Lanzamiento | Despliegue en el VPS de Hostinger sobre el dominio actual, redirecciones 301 desde las URLs actuales, alta en Google Search Console, verificación de Google Business Profile | 2–3 días |

## Migración desde la web actual

Para no perder el posicionamiento que `lareinadelacasa.com` ya tiene en Google, en la fase de lanzamiento se hará un mapeo completo de las URLs actuales a las nuevas y se configurarán redirecciones 301 automáticas, se mantendrá la propiedad ya verificada en Google Search Console (o se verificará la nueva con continuidad), y se revisarán los enlaces entrantes conocidos (redes sociales, directorios) para actualizarlos donde sea posible.

## Fase 2 futura (post-lanzamiento)

Una vez estabilizada la v1 y con datos reales de analítica, se plantean como siguientes pasos naturales: activar el blog con publicación regular para SEO a medio plazo, incorporar páginas específicas por municipio si el volumen de búsquedas lo justifica, valorar pruebas A/B en el formulario de contacto para mejorar la conversión, y — si el negocio lo pide — una zona de clientes para seguimiento de presupuestos o soporte multi-idioma.

## Próximos pasos inmediatos

Con los seis documentos de esta primera fase ya redactados, los siguientes pasos son: revisar y validar estos documentos con LRC (ajustar lo que no encaje con la realidad del negocio), reunir los activos pendientes (fotos, testimonios, logo vectorial, catálogo de materiales), y decidir las herramientas de pago aún pendientes (CMS) antes de arrancar la Fase 1 — el hosting (VPS) y el dominio ya están contratados en Hostinger.
