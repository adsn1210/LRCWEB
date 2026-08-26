---
title: LRC WEB · Documento 2 — Arquitectura Técnica y Stack Tecnológico
fecha: 2026-08-21
estado: Borrador para revisión
---

# Arquitectura Técnica y Stack Tecnológico

Este documento fija las decisiones tecnológicas de la nueva web, con el criterio pedido: tecnologías actuales, bien soportadas, y una arquitectura que pueda crecer (blog, zona de clientes, más idiomas, más servicios) sin tener que rehacerse.

## Frontend

El framework base será **Next.js** (App Router) con **React** y **TypeScript**, y **Tailwind CSS** para los estilos. Esta combinación es hoy el estándar de facto para webs corporativas/comerciales que necesitan buen SEO: permite renderizar las páginas en el servidor (SSG/ISR) para que Google las indexe perfectamente y carguen muy rápido, mientras se mantiene la interactividad típica de una aplicación moderna donde hace falta (galería filtrable, formulario, mapa). TypeScript aporta seguridad de tipos, lo que reduce errores según el proyecto crece y facilita que en el futuro se incorpore otro desarrollador sin fricción.

Las páginas de servicio, materiales y la home se generarán como contenido estático o semi-estático (Static Site Generation con revalidación incremental), que es la combinación óptima para SEO y velocidad. Las partes con datos dinámicos (galería de proyectos si se gestiona desde un CMS, formulario de contacto) usarán componentes de servidor y *server actions* de Next.js, evitando así montar una API separada para lo básico.

## Gestión de contenidos (CMS)

Para que el equipo de LRC pueda añadir proyectos nuevos, cambiar fotos o actualizar textos sin depender de un desarrollador cada vez, se recomienda un **CMS headless** conectado a Next.js — las opciones recomendadas son **Sanity** o **Payload CMS** (ambas con plan gratuito o de coste muy bajo para el volumen de esta web, y ambas con buena integración nativa con Next.js). El CMS gestionará: proyectos de la galería (fotos, categoría, materiales usados), catálogo de materiales, y opcionalmente las entradas de blog si se activa esa fase. Los textos legales y de estructura de página pueden vivir directamente en el código, ya que cambian con muy poca frecuencia.

## Formularios y captación de leads

El formulario de contacto se construirá con *server actions* de Next.js y validación de datos con **Zod**, enviando cada lead por email (vía un servicio como **Resend**) y guardándolo además en una base de datos ligera (**Postgres**, por ejemplo con Supabase o Neon) para tener un histórico propio de leads independiente del correo electrónico y poder cruzarlo en el futuro con la analítica. Se incorporará protección anti-spam básica (honeypot y límite de envíos) sin necesidad de un CAPTCHA intrusivo que empeore la conversión.

## Hosting e infraestructura

El hosting será un **VPS de Hostinger** (plan ya contratado, con el dominio actual gestionado también desde ahí), lo que evita migrar el dominio y aprovecha una infraestructura ya pagada. Al ser un VPS con Node.js, soporta Next.js en modo completo (SSR/ISR, server actions), desplegado mediante un proceso Node.js gestionado con **PM2** (o un contenedor Docker) detrás de un **Nginx** como reverse proxy y terminación SSL (Let's Encrypt/Certbot). El despliegue automático desde el repositorio se configurará vía GitHub Actions (build + deploy por SSH/rsync o Docker), y los entornos de vista previa —que en Vercel serían automáticos— se resolverán con un subdominio de staging propio en el mismo VPS o en un segundo VPS/entorno más económico.

## Imágenes y rendimiento

Dado que el negocio es muy visual (galerías de materiales y proyectos), se usará el componente `next/image` para servir automáticamente las imágenes en formatos modernos (WebP/AVIF), con el tamaño adecuado para cada dispositivo y carga diferida (*lazy loading*). Esto ataca directamente uno de los puntos débiles detectados en la web actual, donde el peso de las imágenes puede penalizar la velocidad de carga.

## SEO técnico de base

Next.js incluye una API de metadatos que se usará para generar automáticamente títulos, descripciones, etiquetas Open Graph (para que se vea bien al compartir en WhatsApp/redes) y datos estructurados (JSON-LD) en cada página: `LocalBusiness` para los datos de la empresa, `Service` para cada servicio, `FAQPage` donde haya preguntas frecuentes, y `BreadcrumbList` para la navegación. El `sitemap.xml` y `robots.txt` se generarán automáticamente a partir de las páginas reales, evitando que queden desactualizados como suele pasar en webs mantenidas a mano.

## Analítica y consentimiento de cookies

Se integrará **Google Analytics 4** a través de **Google Tag Manager**, junto con **Google Consent Mode v2** para que la analítica y cualquier campaña de anuncios respete de forma automática la decisión de cookies del usuario (esto es obligatorio desde marzo de 2024 para cualquier negocio en la UE que use herramientas de Google). El desarrollo del propio banner de consentimiento se detalla en el documento de SEO y Analítica. Como complemento gratuito, se puede añadir **Microsoft Clarity** para mapas de calor y grabaciones de sesión anonimizadas, muy útil para el "estudio de mercado" que se pide: ver en qué parte de la web se detiene la gente, qué materiales miran más, dónde abandonan el formulario.

## Seguridad

La web se servirá siempre bajo HTTPS, con cabeceras de seguridad estándar (CSP, HSTS), protección básica contra envíos automatizados en el formulario, y separación de entornos (desarrollo, vista previa, producción) para que ningún cambio llegue a producción sin revisarse antes.

## Calidad y mantenimiento del código

Se configurará desde el primer día un pipeline de integración continua (GitHub Actions) que ejecute linter (ESLint), formateo (Prettier) y comprobación de tipos en cada cambio, de forma que el código se mantenga consistente aunque en el futuro trabaje más de una persona en el proyecto. Se recomienda además una suite mínima de tests end-to-end (Playwright) sobre los flujos críticos: que el formulario de contacto funciona, que las páginas principales cargan y que el banner de cookies se comporta correctamente.

## Pensado para escalar

Esta arquitectura permite añadir en el futuro, sin rehacer nada de lo construido: un blog completo (el CMS y el enrutado de Next.js ya lo soportan), una zona de clientes o de seguimiento de presupuestos, soporte multi-idioma (Next.js tiene enrutado i18n nativo), nuevas líneas de negocio o nuevas sedes/zonas geográficas, y una futura tienda online de materiales si la empresa decide vender directamente.

## Resumen del stack

| Capa | Tecnología elegida | Motivo |
|---|---|---|
| Framework | Next.js (App Router) + React + TypeScript | SEO nativo, rendimiento, ecosistema maduro |
| Estilos | Tailwind CSS | Desarrollo rápido, diseño consistente, responsive de base |
| CMS | Sanity o Payload CMS | Autonomía del cliente para gestionar proyectos/galería |
| Base de datos | Postgres (Supabase/Neon) | Histórico propio de leads |
| Formularios | Server actions + Zod + Resend | Sin backend adicional, validación robusta |
| Hosting | VPS Hostinger | Plan y dominio ya contratados; Node.js propio para Next.js SSR/ISR (PM2/Docker + Nginx) |
| Analítica | GA4 + GTM + Consent Mode v2 | Medición fiable y conforme a normativa |
| Complemento analítico | Microsoft Clarity | Mapas de calor gratuitos para estudio de mercado |
| CI/CD | GitHub Actions | Calidad de código y despliegues seguros |
