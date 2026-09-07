# Widget flotante "Cuéntanos tu proyecto" — Diseño

Fecha: 2026-09-07

## Contexto y objetivo

El formulario de `/contacto` (`ContactForm.tsx`) es el único punto de captura de leads hoy y es un
formulario plano de una sola pantalla. La idea es **sustituirlo** por un único asistente visual de 3
pasos (más llamativo, con imágenes, que precalifica al cliente) — inspirado en el patrón de Cosentino —
y hacer que ese mismo formulario esté además accesible desde cualquier página mediante un botón flotante,
como el `WhatsAppButton`. El objetivo de negocio es el mismo que el del proyecto: más leads y mejor
cualificados (sabiendo de entrada tipo de proyecto, presupuesto aproximado y urgencia).

**No se mantienen dos formularios en paralelo.** `ContactForm.tsx` desaparece: el mismo componente wizard
se usa en los dos sitios donde hoy se captura un lead — embebido en la página `/contacto` (sin modal, en
línea, sustituyendo directamente a `ContactForm`) y dentro de un modal que abre el botón flotante en el
resto de páginas.

## Alcance

Incluye: un único componente wizard de 3 pasos reutilizado en dos contextos (embebido e in-modal), botón
disparador fijo, extensión del esquema de datos y de la validación, reutilización del pipeline de envío
(Supabase + Resend) ya existente, eventos de analítica nuevos, y la eliminación de `ContactForm.tsx`.

Fuera de alcance (YAGNI, no se aborda en este spec): imágenes reales (se usan placeholders hasta que
lleguen los assets definitivos, igual que el resto del sitio, ver `Docs/FRONTEND.md` sección 7),
Playwright tests automatizados (el proyecto aún no tiene suite de Playwright configurada; se deja como
mejora futura, no bloquea esta feature), guardar el progreso del wizard entre sesiones (localStorage) —
si el usuario cierra el modal a medias, pierde el progreso, igual que pasaría con un formulario normal.

## Arquitectura

Tres componentes nuevos, sustituyendo a `components/forms/ContactForm.tsx` (que se elimina):

- **`components/forms/ProjectWizard.tsx`** — el contenido del wizard en sí: los 3 pasos, el estado
  (`useState` para el paso actual y los valores acumulados de cada paso: nombre, contacto, mensaje,
  servicio elegido, presupuesto, urgencia — no se pierden al retroceder), el indicador de progreso, la validación
  de cliente por paso y el envío final vía `submitLead`. No sabe nada de si está dentro de un modal o
  embebido en una página: recibe como prop el `source_page` a enviar y, opcionalmente, un callback
  `onSuccess` (para poder cerrar el modal cuando se usa ahí).
- **`app/(marketing)/contacto/page.tsx`** — sustituye `<ContactForm />` por `<ProjectWizard
  source_page="/contacto" />`, embebido en línea (sin overlay ni modal) en el mismo sitio donde estaba el
  formulario, dentro de la rejilla de 2 columnas ya existente.
- **`components/layout/ProjectWizardButton.tsx`** — botón disparador fijo, rectangular (no circular como
  WhatsApp), color `bg-accent-500` (uso que `Docs/FRONTEND.md` reserva para ese tono: CTAs), texto
  "Cuéntanos tu proyecto". Posición inicial: `fixed left-6 top-[55%] z-[90]` — se deja como punto de
  partida explícitamente experimental (así lo pidió el usuario: "probemos si no luego modificamos"),
  fácil de ajustar cambiando esas clases de Tailwind sin tocar lógica. Al hacer clic abre un modal
  (overlay + `<ProjectWizard source_page="widget-flotante" onSuccess={...} />` dentro, `z-[100]`, por
  encima de `WhatsAppButton`/`z-[90]`, `MobileMenu`/`z-[70]` y `CookieBanner`/`z-[60]`). Montado en
  `app/(marketing)/layout.tsx` junto a `<WhatsAppButton />`, visible en todas las páginas de marketing
  **excepto `/contacto`** (usa `usePathname` para ocultarse ahí): el formulario ya está embebido en esa
  página, así que mostrar también el botón sería redundante.

## Los 3 pasos

1. **Datos básicos** — los mismos campos que tenía `ContactForm`: Nombre, Teléfono/email, y el mensaje
   libre opcional ("Cuéntanos tu proyecto"). El `service` (select) desaparece de este paso: pasa a
   decidirse visualmente en el paso 2. Sin validación de servidor todavía; solo validación de cliente
   (campos requeridos, longitud mínima como en `leadSchema`) para poder avanzar de paso.
2. **Tipo de proyecto** — 4 tarjetas con imagen y texto, selección única: Encimeras de cocina, Reforma
   de cocina, Reforma de baño, Reforma integral. Se excluye "Otro" del `enum` original de servicio: no
   tiene una imagen natural que lo represente; si un caso no encaja en ninguna de las 4, el usuario lo
   describe en el mensaje libre del paso 1 (o llama/escribe por WhatsApp, igual que ya se ofrece hoy en
   `/contacto`). Imágenes: placeholders temporales en `/public/placeholders`, con comentario
   `// TODO: reemplazar por asset definitivo` en el componente, igual que el resto del sitio.
3. **Presupuesto y prisa** — slider de rango 1.000€–30.000€, con el extremo superior abierto
   ("30.000€ o más"); y 3 chips de urgencia con color: verde "Más de 3 meses", ámbar "Menos de 3 meses",
   rojo "Lo antes posible". Botón final "Enviar solicitud".

Cabecera del wizard con indicador de progreso (1/2/3) y botón "Atrás" en los pasos 2 y 3 — igual dentro
del modal que embebido en `/contacto`.

## Datos y validación

`lib/validations.ts` — `leadSchema` gana dos campos **opcionales** (el paso 3 del wizard siempre los
manda, pero se dejan opcionales a nivel de esquema por robustez — p. ej. si en el futuro se reutiliza
`submitLead` desde algún otro sitio sin esos datos):

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

`app/(marketing)/contacto/actions.ts` — se reutiliza `submitLead` tal cual, ahora como único punto de
envío de leads. Cambios necesarios:

- El `insert` a Supabase gana las dos columnas nuevas (`budget`, `urgency`).
- `source_page` deja de estar fijado a `'/contacto'` en el código: pasa a leerse de un campo oculto del
  formulario (`formData.get("source_page")`), con `'/contacto'` como valor por defecto si no viene.
  `<ProjectWizard>` recibe ese valor como prop y lo escribe en ese campo oculto — así la instancia
  embebida en `/contacto` manda `'/contacto'` y la del modal manda `'widget-flotante'`, sin que
  `submitLead` tenga que saber nada de dónde viene la petición.
- El texto del email a Resend incluye presupuesto y urgencia.

## Errores y antispam

Sin cambios de fondo: mismo campo honeypot oculto (vive dentro de `ProjectWizard`, en el paso 1) y mismo
`checkRateLimit` por IP. Cada paso del wizard valida en cliente antes de dejar avanzar (paso 2 requiere
una tarjeta seleccionada, paso 3 requiere urgencia elegida); la validación Zod de `leadSchema` en el
servidor queda como red de seguridad final, igual que hoy.

## Analítica

Dos eventos `dataLayer` nuevos, siguiendo la convención de `Docs/BACKEND.md` sección 6 (disparados desde
el componente, no hardcoded en GTM):

- `lead_widget_open` — al abrir el modal desde el botón flotante (no aplica a la instancia embebida en
  `/contacto`, que ya es visible sin acción del usuario).
- `lead_widget_step` — al avanzar de paso, con el número de paso alcanzado y el `source_page` (permite
  ver en GA4 en qué paso abandona la gente, y si hay diferencia entre quien llega por `/contacto` y quien
  usa el botón flotante).

Al enviar, se reutiliza el evento de conversión ya existente `lead_form_submit`, con un parámetro
`source_page` para distinguir el origen en los informes.

## Testing

Sin Playwright todavía en el repo (no hay suite configurada). Verificación manual antes de dar por
cerrada la implementación, en los dos contextos:

- En `/contacto`: completar el wizard embebido, confirmar que el lead aparece en Supabase con
  `source_page = '/contacto'` y las columnas `budget`/`urgency` rellenas, y que llega el email de aviso
  vía Resend.
- Desde otra página (p. ej. la home): abrir el modal con el botón flotante, completar el wizard, y
  confirmar lo mismo con `source_page = 'widget-flotante'`.

Se deja como mejora futura añadir un test Playwright de este flujo cuando el proyecto configure la suite
(ver roadmap en `AGENTS.md`/CI).
