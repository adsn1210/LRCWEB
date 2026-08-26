---
title: LRC WEB · Documento 3 — Arquitectura de Información y Mapa del Sitio
fecha: 2026-08-21
estado: Borrador para revisión
---

# Arquitectura de Información y Mapa del Sitio

## Criterio general

La estructura se organiza para que cada tipo de servicio y cada material tenga su propia página con contenido dedicado, en lugar de mezclarlo todo en pocas páginas genéricas como ocurre en la web actual. Esto es clave tanto para SEO (Google posiciona mejor páginas específicas que responden a una búsqueda concreta) como para que el usuario encuentre rápido lo que busca, ya sea "encimera de granito" o "reforma de un local comercial".

## Mapa del sitio

| Sección | Páginas | Propósito |
|---|---|---|
| Inicio | `/` | Presentación general, propuesta de valor, acceso rápido a los 4-5 servicios principales, proyectos destacados, CTA de contacto |
| Servicios | `/servicios/encimeras-de-cocina` | Encimeras: materiales, proceso, precios orientativos |
| | `/servicios/reformas-de-cocina` | Reforma integral de cocina |
| | `/servicios/reformas-de-bano` | Reforma integral de baño |
| | `/servicios/reformas-integrales` | Vivienda completa y locales comerciales |
| Materiales | `/materiales/porcelanico` | Página SEO dedicada a encimeras de porcelánico |
| | `/materiales/cuarzo-compacto` | Página SEO dedicada a cuarzo (Silestone, Dekton, etc.) |
| | `/materiales/granito` | Página SEO dedicada a granito y variedades |
| Proyectos | `/proyectos` | Galería filtrable por tipo de servicio y material, con fichas de proyecto |
| Sobre nosotros | `/sobre-nosotros` | Historia, proceso de trabajo en 4 pasos, showroom, equipo |
| Zonas | `/zonas` (opcional fase 2) | Municipios de la Comunidad de Madrid donde se trabaja, para SEO local |
| Blog | `/blog` (fase 2) | Contenido informativo para captar tráfico de búsqueda |
| Contacto | `/contacto` | Formulario, teléfono, WhatsApp, email, mapa, horario |
| Legal | `/aviso-legal`, `/politica-de-privacidad`, `/politica-de-cookies` | Cumplimiento normativo obligatorio |

## Navegación principal

El menú superior se simplifica a cinco bloques para no saturar: **Servicios** (desplegable con las cuatro líneas de negocio), **Materiales** (desplegable), **Proyectos**, **Sobre nosotros** y **Contacto**, con el teléfono y un botón de WhatsApp siempre visibles en la cabecera, especialmente en móvil donde suele estar la mayoría del tráfico.

## Página de inicio: bloques recomendados

La home debe funcionar como un resumen que enganche y dirija al usuario a la página específica que le interesa: cabecera con propuesta de valor clara y CTA de contacto, los cuatro servicios principales con acceso directo, una selección de proyectos destacados con fotos reales, los materiales de trabajo, el proceso de trabajo en pasos, algún testimonio si se dispone de él, y un bloque final de contacto con formulario o llamada a la acción.

## Ficha de proyecto (dentro de `/proyectos`)

Cada proyecto de la galería se plantea como una mini-ficha con: fotos (idealmente antes/después), tipo de servicio, material utilizado, ubicación (municipio, sin dirección exacta), y una breve descripción. Esto convierte la galería en contenido único indexable por Google, en vez de solo imágenes sueltas como en la web actual.

## Footer

El pie de página recogerá: datos de contacto completos, enlaces a las páginas legales, enlaces a redes sociales (TikTok, Facebook, Instagram, YouTube, ya presentes en la web actual), y un mini-mapa del sitio para reforzar el enlazado interno de cara a SEO.

## Migración desde la web actual

Para no perder el posicionamiento ya ganado por `lareinadelacasa.com`, será necesario mapear cada URL antigua a su nueva equivalente y configurar redirecciones 301 en el lanzamiento; esto se detalla en el documento de Roadmap.
