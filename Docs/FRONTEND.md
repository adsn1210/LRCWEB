# LRC WEB — Guía Técnica de Frontend y Diseño

> Sistema de diseño de referencia. Úsalo para mantener consistencia visual en todos los componentes, en vez de decidir colores/tipografía página a página. Complementa `05-contenidos-y-diseno.md` del proyecto, aquí en formato accionable para código.

## 1. Stack visual

Next.js (App Router) + **Tailwind CSS** (config extendida con los tokens de este documento). Componentes de UI base propios y sencillos (botón, input, card) — no hace falta una librería de componentes completa para el volumen de esta web.

## 2. Paleta de colores

Base neutra y luminosa con acento **taupe**, extraído directamente del logotipo actual de la marca (ver `Docs/branding/`), no del cobre/dorado que manejaba una versión anterior de este documento. Next.js 16 usa Tailwind v4 (config CSS-first, sin `tailwind.config.ts`): los tokens se definen con `@theme` en `app/globals.css`.

```css
@theme {
  --color-base-50: #FAF9F7;   /* fondo general */
  --color-base-100: #F3F1EC;  /* fondo alterno de sección */
  --color-base-200: #E5E1DA;  /* bordes, separadores */

  --color-ink-700: #4A453D;   /* texto secundario */
  --color-ink-900: #221F1B;   /* texto principal, headings */

  --color-accent-500: #AD8E7F; /* Taupe del logo — CTAs, detalles, iconos activos */
  --color-accent-600: #96733F; /* hover del acento */

  --color-brand-taupe: #AD8E7F;      /* bloque logo + texto principal */
  --color-brand-beige: #D6A99A;      /* bloque izquierdo del logo */
  --color-brand-gray: #9FA5AA;       /* bloque superior derecho del logo */
  --color-brand-gray-pale: #CECBC4;  /* bloque inferior derecho del logo */

  --color-success: #3F7D5C;
  --color-danger: #B3413A;
}
```

Regla de uso: fondo `bg-base-50`/`bg-base-100` alternando por sección, texto en `text-ink-900` (títulos) e `text-ink-700` (párrafos), `accent-500` reservado para CTAs y elementos interactivos clave — no usarlo como color de fondo grande, sirve para destacar, no para empapelar. Los tonos `brand-*` quedan disponibles para detalles que quieran remitir directamente a los bloques del logo (separadores, iconos, tags de categoría).

## 3. Tipografía

Dos familias vía `next/font/google`: una serif con carácter para titulares (`Playfair Display` o `Fraunces`) que aporte la sensación "premium" de los materiales que vende la empresa, y una sans-serif muy legible para el cuerpo de texto (`Inter` o `Manrope`).

```ts
h1: 'font-serif text-4xl md:text-5xl font-semibold text-ink-900'
h2: 'font-serif text-3xl md:text-4xl font-semibold text-ink-900'
h3: 'font-sans text-xl font-semibold text-ink-900'
body: 'font-sans text-base text-ink-700 leading-relaxed'
small: 'font-sans text-sm text-ink-700'
```

## 4. Espaciado y breakpoints

Usar la escala por defecto de Tailwind (4px base) sin inventar valores custom. Breakpoints estándar: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px. Mobile-first siempre: escribir primero el estilo para móvil y añadir `md:`/`lg:` para escritorio, nunca al revés. Contenedor de página: `max-w-7xl mx-auto px-4 md:px-8`.

## 5. Componentes a construir

| Componente | Descripción | Notas |
|---|---|---|
| `Header` | Logo, menú con desplegables Servicios/Materiales, teléfono clicable, botón WhatsApp | Sticky, colapsa a menú hamburguesa en móvil |
| `Footer` | Contacto, enlaces legales, redes sociales, mini-sitemap | |
| `Hero` | Titular + subtítulo + CTA, imagen/vídeo de fondo | Usado en home y cabeceras de página de servicio |
| `ServiceCard` | Icono/imagen, título, descripción corta, link | Grid 2x2 en home |
| `MaterialCard` | Imagen de textura, nombre del material, link | Grid en home y en `/materiales` |
| `ProjectCard` | Imagen (o antes/después con slider simple), servicio, material, municipio | Usado en `/proyectos` con filtros |
| `TestimonialCard` | Foto (opcional), nombre, texto | Carrusel simple o grid |
| `ContactForm` | Nombre, contacto, tipo de servicio, mensaje | Client component; estado de envío con feedback claro (éxito/error) |
| `CookieBanner` | Aceptar todas / Rechazar todas / Configurar, con igual peso visual entre "Aceptar" y "Rechazar" | Ver requisito legal en `BACKEND.md` sección 6 — **obligatorio** que ambos botones tengan el mismo tamaño, color y posición destacada |
| `WhatsAppButton` | Botón flotante fijo, visible en todas las páginas | Especialmente importante en móvil |
| `Breadcrumbs` | Migas de pan en páginas internas | Refuerza SEO interno |

## 6. Estructura de páginas (mapeo a diseño)

Cada página de **servicio** sigue el mismo patrón de bloques: Hero → introducción (texto real, 300–600 palabras) → proceso de trabajo → proyectos relacionados (3-4 `ProjectCard` filtradas por ese servicio) → CTA de contacto. Cada página de **material** sigue el mismo patrón pero con foco en variedades/acabados del material. La **home** combina: Hero general → los 4 `ServiceCard` → proyectos destacados → los 3 `MaterialCard` → proceso de trabajo → testimonios (si hay) → bloque de contacto. Ver el detalle completo de secciones en `03-arquitectura-informacion-sitemap.md`.

## 7. Imágenes y assets temporales

Mientras se recopilan los activos definitivos, usar una carpeta `/public/placeholders` con imágenes temporales neutras (nunca imágenes de stock que aparenten ser proyectos reales, para no crear expectativas falsas) y un logo temporal simple en `/public/logo-temp.svg`. Marcar con un comentario `// TODO: reemplazar por asset definitivo` en cada componente que use un placeholder, para poder localizarlos todos fácilmente cuando lleguen las fotos y el logo reales. Todas las imágenes reales se sirven con `next/image` (nunca `<img>` directo) para aprovechar la optimización automática.

## 8. Accesibilidad (mínimos)

Contraste de texto mínimo AA (4.5:1 en texto normal) — verificar especialmente `ink.700` sobre `base.50`/`base.100`. Toda imagen con `alt` descriptivo (doble beneficio: accesibilidad + SEO). Todos los elementos interactivos (botones, links, inputs del formulario) alcanzables y operables por teclado, con estado de foco visible (`focus-visible:ring-2 ring-accent-500`). Tamaño mínimo de área táctil de 44x44px en botones para móvil.
