# Widget flotante "Cuéntanos tu proyecto" — Diseño

Fecha: 2026-09-07

## Contexto y objetivo

El formulario de `/contacto` (`ContactForm.tsx`) es el único punto de captura de leads hoy. La idea es
añadir un segundo canal de captura, más llamativo y presente en todas las páginas del sitio (como el
`WhatsAppButton`), que precalifique al cliente con un asistente visual de 3 pasos en vez de un formulario
plano — inspirado en el patrón de Cosentino (preguntas cerradas y visuales antes de pedir datos de
contacto). El objetivo de negocio es el mismo que el del proyecto: más leads y mejor cualificados
(sabiendo de entrada tipo de proyecto, presupuesto aproximado y urgencia).

Este widget **convive** con `/contacto`, no lo sustituye: el formulario largo sigue existiendo tal cual
para quien llegue directamente a esa página.

## Alcance

Incluye: botón disparador fijo, modal con wizard de 3 pasos, extensión del esquema de datos y de la
validación, reutilización del pipeline de envío (Supabase + Resend) ya existente, eventos de analítica
nuevos.

Fuera de alcance (YAGNI, no se aborda en este spec): imágenes reales (se usan placeholders hasta que
lleguen los assets definitivos, igual que el resto del sitio, ver `Docs/FRONTEND.md` sección 7),
Playwright tests automatizados (el proyecto aún no tiene suite de Playwright configurada; se deja como
mejora futura, no bloquea esta feature), guardar el progreso del wizard entre sesiones (localStorage) —
si el usuario cierra el modal a medias, pierde el progreso, igual que pasaría con un formulario normal.

## Arquitectura

Un componente cliente nuevo, `components/marketing/ProjectWizard.tsx`, montado en
`app/(marketing)/layout.tsx` junto a `<WhatsAppButton />` (mismo nivel, visible en todas las páginas de
marketing). Se divide en:

- **`ProjectWizardButton`** — botón disparador fijo en pantalla, rectangular (no circular como
  WhatsApp), color `bg-accent-500` (es justamente el uso que `Docs/FRONTEND.md` reserva para ese tono:
  CTAs), texto "Cuéntanos tu proyecto". Posición inicial: `fixed left-6 top-[55%] z-[90]` — se deja como
  punto de partida explícitamente experimental (así lo pidió el usuario: "probemos si no luego
  modificamos"), fácil de ajustar cambiando esas clases de Tailwind sin tocar lógica.
- **`ProjectWizardModal`** — overlay + contenido del paso actual. `z-[100]` (por encima de
  `WhatsAppButton`/`z-[90]`, `MobileMenu`/`z-[70]` y `CookieBanner`/`z-[60]`, seguiendo la escala de
  z-index ya usada en `components/layout`). Estado local en React (`useState`) para: paso actual
  (1 | 2 | 3), y los valores de cada paso (nombre, contacto, servicio elegido, presupuesto, urgencia) —
  no se pierden al retroceder entre pasos.

## Los 3 pasos

1. **Datos básicos** — los mismos 2 campos que ya tiene `ContactForm`: Nombre, Teléfono/email. Sin
   validación de servidor todavía; solo validación de cliente (campos requeridos, longitud mínima como
   en `leadSchema`) para poder avanzar de paso.
2. **Tipo de proyecto** — 4 tarjetas con imagen y texto, selección única: Encimeras de cocina, Reforma
   de cocina, Reforma de baño, Reforma integral (se excluye "Otro": no tiene una imagen natural y ya
   queda cubierto por el formulario largo de `/contacto`). Imágenes: placeholders temporales en
   `/public/placeholders`, con comentario `// TODO: reemplazar por asset definitivo` en el componente,
   igual que el resto del sitio.
3. **Presupuesto y prisa** — slider de rango 1.000€–30.000€, con el extremo superior abierto
   ("30.000€ o más"); y 3 chips de urgencia con color: verde "Más de 3 meses", ámbar "Menos de 3 meses",
   rojo "Lo antes posible". Botón final "Enviar solicitud".

Cabecera del modal con indicador de progreso (1/2/3) y botón "Atrás" en los pasos 2 y 3.

## Datos y validación

`lib/validations.ts` — `leadSchema` gana dos campos **opcionales** (para no romper el formulario largo,
que no los pide):

```ts
budget: z.coerce.number().min(1000).max(30000).optional(),
urgency: z.enum(["mas-3-meses", "menos-3-meses", "lo-antes-posible"]).optional(),
```

`db/schema.sql` — dos columnas nuevas, nullable, con migración aparte porque la tabla ya tiene datos
reales en producción:

```sql
alter table leads add column if not exists budget integer;
alter table leads add column if not exists urgency text
  check (urgency in ('mas-3-meses', 'menos-3-meses', 'lo-antes-posible'));
```

`app/(marketing)/contacto/actions.ts` — se reutiliza `submitLead` tal cual para ambos formularios (el
wizard llama a la misma server action). Cambios necesarios:

- El `insert` a Supabase gana las dos columnas nuevas (`budget`, `urgency`), con `null` cuando no vienen
  (caso del formulario largo).
- `source_page` deja de estar fijado a `'/contacto'` en el código: pasa a leerse de un campo oculto del
  formulario (`formData.get("source_page")`), con `'/contacto'` como valor por defecto si no viene, para
  no romper el formulario existente. El wizard manda `'widget-flotante'`.
- El texto del email a Resend incluye presupuesto y urgencia cuando están presentes.

## Errores y antispam

Sin cambios de fondo: mismo campo honeypot oculto (se añade también al wizard, en el paso 1 o como campo
oculto del propio modal) y mismo `checkRateLimit` por IP. Cada paso del wizard valida en cliente antes de
dejar avanzar (paso 2 requiere una tarjeta seleccionada, paso 3 requiere urgencia elegida); la validación
Zod de `leadSchema` en el servidor queda como red de seguridad final, igual que hoy.

## Analítica

Dos eventos `dataLayer` nuevos, siguiendo la convención de `Docs/BACKEND.md` sección 6 (disparados desde
el componente, no hardcoded en GTM):

- `lead_widget_open` — al abrir el modal.
- `lead_widget_step` — al avanzar de paso, con el número de paso alcanzado (permite ver en GA4 en qué
  paso abandona la gente).

Al enviar, se reutiliza el evento de conversión ya existente `lead_form_submit` (no se duplica el
objetivo en GA4; simplemente se le puede añadir un parámetro `source: "widget"` para distinguirlo del
formulario largo en los informes).

## Testing

Sin Playwright todavía en el repo (no hay suite configurada). Verificación manual antes de dar por
cerrada la implementación: abrir el widget, completar los 3 pasos, confirmar que el lead aparece en
Supabase con `source_page = 'widget-flotante'` y las columnas `budget`/`urgency` rellenas, y que llega el
email de aviso vía Resend. Se deja como mejora futura añadir un test Playwright de este flujo cuando el
proyecto configure la suite (ver roadmap en `AGENTS.md`/CI).
