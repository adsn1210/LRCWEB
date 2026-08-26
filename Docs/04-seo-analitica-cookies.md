---
title: LRC WEB · Documento 4 — Plan de SEO, Analítica y Cookies
fecha: 2026-08-21
estado: Borrador para revisión
fuentes: AEPD (Guía de Cookies), Google (Consent Mode v2)
---

# Plan de SEO, Analítica y Cookies

## SEO on-page

Cada página tendrá un título y una descripción únicos orientados a una intención de búsqueda concreta, un único `H1`, y un mínimo de contenido de texto real (no solo imágenes) de entre 300 y 600 palabras en las páginas de servicio y material — algo que hoy la web actual apenas tiene, ya que se apoya casi todo en galerías visuales. Las palabras clave prioritarias a trabajar, orientadas a Madrid, incluyen variantes como "encimeras de cocina Madrid", "encimera de granito/cuarzo/porcelánico precio", "reformas de cocina Madrid", "reformas de baño Madrid", "reformas integrales Madrid" y "reforma de locales comerciales Madrid". Cada página de material y cada página de servicio se construye pensando en una de estas búsquedas.

## SEO local

Al ser un negocio de ámbito geográfico definido, el SEO local pesa tanto o más que el genérico. Esto implica optimizar y mantener activa la ficha de **Google Business Profile** de la empresa, mantener el nombre, dirección y teléfono (NAP) exactamente iguales en la web y en todos los directorios donde aparezca, incluir el *schema* `LocalBusiness` con las coordenadas del showroom/fábrica, y valorar en una fase posterior páginas específicas por municipio si el volumen de búsqueda lo justifica (por ejemplo Alcorcón, Getafe, Móstoles, según de dónde venga más demanda real).

## SEO técnico

Se generará automáticamente `sitemap.xml` y `robots.txt` a partir de las páginas reales de la web (evitando el mantenimiento manual, fuente habitual de errores), se cuidará que cada página tenga una URL canónica, que las imágenes lleven texto alternativo descriptivo, y que el enlazado interno conecte de forma natural servicios, materiales y proyectos entre sí. El objetivo de rendimiento son los llamados *Core Web Vitals* en verde: carga principal (LCP) por debajo de 2,5 segundos, estabilidad visual (CLS) por debajo de 0,1, y respuesta a interacción (INP) por debajo de 200 ms — medibles directamente en Google Search Console una vez lanzada la web.

## Contenido para captar tráfico (blog, fase 2)

Un blog con artículos prácticos ("cuánto cuesta una encimera de cuarzo", "granito vs. porcelánico: diferencias", "cómo planificar la reforma de un local sin cerrar el negocio") permite captar búsquedas informativas que hoy la web no cubre en absoluto, y es habitualmente la palanca de SEO con mejor retorno a medio plazo en negocios de reformas. Se plantea como fase 2 para no bloquear el lanzamiento de la v1.

## Analítica: qué se va a medir

Se instalará **Google Analytics 4** gestionado a través de **Google Tag Manager**, de forma que añadir o modificar eventos de medición en el futuro no requiera tocar código. Además del tráfico básico (sesiones, origen, páginas más vistas, dispositivo), se configurarán como eventos de conversión las acciones que realmente importan al negocio: envío del formulario de contacto, clic en el botón de WhatsApp, clic en el número de teléfono, y clic para ver la ubicación/showroom. Con esto la empresa podrá ver no solo cuánta gente entra, sino cuánta gente realmente pide información — que es exactamente el "estudio de mercado básico" solicitado. Como complemento, se recomienda **Microsoft Clarity** (gratuito) para mapas de calor y grabaciones anonimizadas de sesiones, útil para ver qué materiales o proyectos generan más interés real.

## Cookies y consentimiento: marco legal aplicable

La normativa española (guiada por la AEPD, en línea con el RGPD y la Directiva ePrivacy) exige desde enero de 2024 que rechazar cookies sea tan fácil como aceptarlas. En la práctica esto significa que el banner debe mostrar, en la primera capa, un botón de "Rechazar todas" con el mismo tamaño, color y nivel de visibilidad que "Aceptar todas" (sin trucos de diseño que favorezcan una opción sobre otra), que el usuario pueda configurar el consentimiento por categoría (técnicas/necesarias, analítica, personalización/marketing) en lugar de un simple todo-o-nada, que ninguna cookie no esencial se cargue antes de que el usuario decida, y que quede registro de cada consentimiento (o rechazo) como evidencia ante una posible inspección. Todo esto se implementará como parte del propio desarrollo en Next.js, sin depender de un banner genérico mal configurado como suele ocurrir en muchas webs de pymes.

## Google Consent Mode v2

Desde marzo de 2024 es obligatorio, para cualquier negocio en la UE que use herramientas de Google (Analytics, Ads), integrar **Consent Mode v2**: un mecanismo que envía a Google cuatro señales de consentimiento (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`) según lo que el usuario haya aceptado en el banner. Esto permite que, aunque el usuario rechace cookies de analítica, Google pueda seguir estimando de forma agregada y anonimizada el comportamiento general del sitio ("modelado de conversiones"), sin vulnerar su decisión individual. Se implementará desde el primer día, conectado directamente al banner de cookies propio.

## Política de cookies y transparencia

Se redactará una página de política de cookies clara, en lenguaje sencillo, que explique qué cookies se usan, con qué finalidad, su duración, y cómo cambiar la decisión en cualquier momento (normalmente con un enlace fijo en el footer para reabrir el panel de configuración).

## Reporting

Se recomienda montar un panel simple en **Looker Studio** conectado a GA4, con las métricas clave (visitas, leads por canal, tasa de conversión, páginas de servicio más visitadas), revisable mensualmente sin necesidad de entrar cada vez a Google Analytics directamente.

## Fuentes consultadas

- [Grandes cambios para la protección de datos en España: la nueva Guía de Cookies de la AEPD — Didomi](https://www.didomi.io/es/blog/proteccion-datos-espana-guia-cookies-aepd)
- [Banner de cookies AEPD: guía de cumplimiento 2026 — agencytools.es](https://agencytools.es/blog/banner-cookies-aepd-cumplimiento-2026/)
- [Consent Mode v2 y RGPD: la guía definitiva para Google Ads en España (2026) — Adstralis](https://adstralis.agency/blog/consent-mode-v2-rgpd-google-ads/)
