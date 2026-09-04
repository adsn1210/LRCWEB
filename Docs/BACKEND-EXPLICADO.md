---
title: LRC WEB · Backend explicado en profundidad (guía de estudio)
fecha: 2026-09-04
estado: Material de aprendizaje — no es documentación de decisiones, es una explicación del código
---

# Backend explicado en profundidad

Este documento no describe decisiones del proyecto (eso está en `Docs/BACKEND.md`) — explica **cómo
funciona de verdad el código de backend que ya existe**, pensado para que lo uses como material de
estudio. Cada sección apunta a archivos reales del repo para que lo sigas con el código delante.

## 0. Idea de fondo: aquí no hay un "backend" separado

En una app tradicional tendrías dos proyectos: un frontend (React) y un backend (Express, Django...)
hablando por una API REST. **Next.js App Router no funciona así**: es un único proyecto donde el
código de servidor y el de cliente conviven, y el propio framework decide dónde se ejecuta cada
parte según cómo escribas el archivo.

Tres piezas hacen esto posible en este proyecto:

- **Server Components** (por defecto): cualquier `page.tsx`/componente sin `"use client"` se ejecuta
  *solo en el servidor* — nunca se envía su código al navegador. Puede leer variables de entorno
  secretas, hacer queries a la base de datos, etc. directamente.
- **Client Components** (`"use client"` en la primera línea): se hidratan en el navegador porque
  necesitan interactividad (`useState`, `onClick`...). Ejemplos en este repo:
  `components/forms/ContactForm.tsx`, `components/layout/CookieBanner.tsx`,
  `components/marketing/ProjectGallery.tsx`.
- **Server Actions** (`"use server"`): funciones que viven en el servidor pero que un Client
  Component puede "llamar" como si fueran una función normal — Next.js genera automáticamente el
  endpoint HTTP por debajo. Es el pegamento entre las dos anteriores.

Con esto en mente, "el backend" de este proyecto es: `/lib` (clientes de servicios externos +
validación) + las Server Actions (`app/**/actions.ts`) + los schemas de Sanity (`/sanity`).

## 1. Variables de entorno: qué es público y qué no

Next.js expone al navegador **solo** las variables que empiezan por `NEXT_PUBLIC_` — el resto
(`DATABASE_URL`, `RESEND_API_KEY`, `SANITY_API_READ_TOKEN`) nunca salen del servidor, ni siquiera
aunque las uses en un Server Component. Por eso en `lib/db.ts` y `lib/email.ts` se usan sin prefijo
(son secretos), y en `lib/sanity.ts` el `projectId`/`dataset` sí llevan `NEXT_PUBLIC_` porque el
Studio de Sanity (que corre en el navegador en `/studio`) también los necesita.

Ver la lista completa en `Docs/BACKEND.md` sección 7 y la plantilla en `.env.example`.

## 2. El flujo completo del formulario de contacto (el mejor ejemplo end-to-end)

Sigue este recorrido con los archivos abiertos, es la forma más rápida de entender cómo encajan
todas las piezas del backend.

### 2.1 El formulario en sí — `components/forms/ContactForm.tsx`

Es un **Client Component** (necesita `useActionState` para mostrar estado de carga/error). Dos
detalles importantes:

```tsx
const [state, formAction, pending] = useActionState(submitLead, initialState);
// ...
<form action={formAction} className="...">
```

`useActionState` es un hook de React 19 hecho justo para Server Actions: le pasas la función del
servidor (`submitLead`) y un estado inicial, y te devuelve el estado actual, una función `formAction`
que enchufas directo al atributo `action` del `<form>`, y un booleano `pending` para deshabilitar el
botón mientras se procesa. Esto funciona **incluso con JavaScript desactivado** (progressive
enhancement) porque por debajo sigue siendo un `<form>` HTML normal que hace un POST — React solo
mejora la experiencia si JS está disponible.

El honeypot (líneas 82-86) es un campo oculto por CSS (nunca `display:none`, porque algunos bots lo
detectan) que un humano nunca rellena pero un bot que rellena formularios automáticamente sí.

### 2.2 La Server Action — `app/(marketing)/contacto/actions.ts`

```ts
"use server";
export async function submitLead(_prevState: SubmitLeadState, formData: FormData): Promise<SubmitLeadState>
```

La directiva `"use server"` en la primera línea le dice a Next.js: "todo lo que exporte este archivo
se ejecuta en el servidor, generando un endpoint accesible desde el cliente". La firma con
`(_prevState, formData)` es el contrato que exige `useActionState`: siempre recibe el estado anterior
(no lo usamos aquí, de ahí el `_`) y un `FormData` con los campos del formulario.

El orden de la función importa, es una cadena de validación en capas:

1. **Parseo con Zod** (`leadSchema.safeParse(raw)`) — si el honeypot trae contenido, `safeParse`
   falla (porque el schema exige `max(0)`), y respondemos `{ status: "success" }` como si nada,
   **sin decirle al bot que lo detectamos** (línea 23-25). Es una técnica deliberada: si le devuelves
   un error, el bot aprende a evitarlo.
2. **Rate limit por IP** (`checkRateLimit(ip)`) — después de la validación, no antes, para no gastar
   ciclos de rate-limit en spam que ya se filtra gratis con el honeypot.
3. **Guardar en Supabase** (`db\`insert into leads ...\``) — si esto falla, cortamos aquí y avisamos
   al usuario con un mensaje de fallback (WhatsApp/teléfono).
4. **Enviar email con Resend** — deliberadamente **después** de guardar en base de datos y en su
   propio `try/catch` que no propaga el error: si el email falla pero el lead ya se guardó, el
   usuario ve éxito igualmente (el dato no se pierde, solo falla el aviso). Esto es una decisión de
   diseño importante: prioriza no perder el lead sobre notificar al instante.

### 2.3 Validación — `lib/validations.ts`

```ts
export const leadSchema = z.object({
  name: z.string().min(2),
  phoneOrEmail: z.string().min(6),
  service: z.enum([...]),
  message: z.string().max(1000).optional(),
  honeypot: z.string().max(0),
});
```

[Zod](https://zod.dev) define la "forma" que deben tener los datos y los valida en tiempo de
ejecución (a diferencia de TypeScript, que solo comprueba tipos en tiempo de compilación y no puede
proteger contra datos que llegan de un `FormData` sin tipar). `safeParse` (en vez de `parse`) no
lanza excepción si falla — devuelve `{ success: false, error }`, que es más cómodo de manejar en una
Server Action. `z.infer<typeof leadSchema>` genera el tipo TypeScript automáticamente a partir del
schema, así nunca se desincroniza el tipo con la validación real.

### 2.4 Cliente de base de datos — `lib/db.ts`

```ts
export const db = postgres(process.env.DATABASE_URL!);
```

El paquete `postgres` (no `pg`, más moderno y con mejor soporte de *tagged template literals*) crea
un pool de conexiones reutilizable. La forma de hacer queries es la clave de seguridad aquí:

```ts
await db`insert into leads (name, contact, service, message, source_page) values (${name}, ...)`;
```

Esto **no es concatenación de strings** (que sería vulnerable a SQL injection) — es un *tagged
template literal*, una característica de JavaScript donde la función `db` recibe el texto SQL y los
valores por separado, y la librería los envía a Postgres como parámetros preparados. Aunque
`name` viniera con código SQL malicioso, se trata como un valor literal, nunca como parte de la
sentencia. Ver `db/schema.sql` para la tabla `leads` que recibe estos inserts.

### 2.5 Cliente de email — `lib/email.ts`

```ts
export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
```

Detalle sutil pero importante: el SDK de Resend **lanza una excepción en el propio constructor** si
le falta la API key (a diferencia de `postgres`, que no falla hasta la primera query). Si hiciéramos
`new Resend(process.env.RESEND_API_KEY!)` directamente y la key no existiera, **rompería toda la
app** en cuanto se importara este módulo, no solo el envío de email. Por eso `resend` es `null` en
vez de un objeto roto, y `actions.ts` comprueba `if (resend)` antes de usarlo — así el sitio sigue
funcionando (guardando leads) aunque Resend no esté configurado.

### 2.6 Rate limiting — `lib/rate-limit.ts`

Un `Map<string, { count, resetAt }>` en memoria, indexado por IP. Funciona perfecto en un servidor
tradicional siempre encendido, pero **en Vercel (serverless) cada invocación puede correr en una
instancia distinta** — no hay garantía de que la segunda petición del mismo usuario reutilice la
misma instancia con el mismo `Map` en memoria. Por eso el comentario en el código lo llama "best
effort": frena spam torpe (scripts que golpean rápido y siempre caen en la misma instancia "caliente"
de Vercel), pero no es una garantía dura. La alternativa robusta (Upstash Ratelimit, sobre Redis) se
deja documentada como mejora futura en vez de implementarla ya, para no añadir una cuenta de terceros
sin necesidad real (ver `Docs/07-pendientes-lanzamiento.md`).

## 3. El cliente de Sanity — `lib/sanity.ts`

```ts
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-01-01",
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: true,
});
```

Sanity es un CMS *headless*: no genera páginas, solo guarda contenido estructurado y lo sirve por
API. `useCdn: true` hace que las queries se sirvan desde la CDN de Sanity (rápido, pero con hasta un
minuto de caché) en vez de pegar directo a la API en tiempo real — correcto para contenido de
marketing que no cambia cada segundo. `apiVersion` fija la versión de la API a una fecha concreta
para que un cambio futuro en Sanity no rompa las queries sin avisar.

**Importante**: este cliente existe pero **todavía no se usa en ninguna página** — `/servicios`,
`/materiales` y `/proyectos` usan datos hardcodeados en `lib/content/` y
`lib/placeholder-projects.ts` en su lugar, con comentarios `TODO` marcando dónde migrar. Cuando se
haga esa migración, se usaría así (patrón típico, no implementado aún):

```ts
const proyectos = await sanityClient.fetch(`*[_type == "project"]`);
```

Ese lenguaje de query (`*[_type == "project"]`) es **GROQ**, el lenguaje de consultas propio de
Sanity — similar en espíritu a GraphQL pero con sintaxis propia.

### 3.1 Los schemas — `sanity/schemaTypes/*.ts`

Cada archivo (`project.ts`, `service.ts`, `material.ts`, `testimonial.ts`) usa `defineType`/
`defineField` para describir un tipo de documento editable desde el Studio (`/studio`, ver
`app/studio/[[...tool]]/page.tsx`). Por ejemplo, `project.ts` define que un "Proyecto" tiene título,
slug, referencias a `service`/`material` (relaciones entre documentos), municipio, descripción,
imágenes de antes/después y una galería — el cliente rellena esto desde una interfaz visual sin
tocar código, y `sanity/schemaTypes/index.ts` es solo el registro central que los agrupa
(`schemaTypes`) para que `sanity.config.ts` los cargue todos.

## 4. Páginas dinámicas y generación estática — `/servicios/[slug]`, `/materiales/[slug]`

```ts
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  // ...
}
```

`[slug]` en el nombre de la carpeta es una *ruta dinámica*: una sola definición de página (
`app/(marketing)/servicios/[slug]/page.tsx`) sirve las 4 URLs reales (`/servicios/encimeras-de-cocina`,
etc.). `generateStaticParams` le dice a Next.js, **en tiempo de build**, qué valores concretos de
`slug` existen — con eso, Next.js pre-renderiza las 4 páginas como HTML estático (lo verás en el
output de `npm run build` marcadas con `●`, SSG), en vez de generarlas bajo demanda en cada visita.
`generateMetadata` es el equivalente dinámico de `export const metadata = {...}`: como el `<title>`/
`description` dependen de qué servicio es, tiene que ser una función que reciba el `slug`.

Fíjate que `params` es una `Promise` que hay que `await`ear — esto es específico de las versiones
recientes de Next.js (params asíncronos), parte de las "breaking changes" que menciona
`AGENTS.md` al principio del repo.

Si visitas un slug que no existe, `notFound()` (de `next/navigation`) interrumpe el render y muestra
la página 404 — así es como `app/(marketing)/servicios/[slug]/page.tsx` maneja slugs inválidos.

## 5. `sitemap.ts` y `robots.ts` — convenciones de archivo, no rutas normales

`app/sitemap.ts` y `app/robots.ts` no son páginas — son *convenciones especiales* de Next.js: si
existen con ese nombre exacto en `/app`, Next.js genera automáticamente `/sitemap.xml` y
`/robots.txt` a partir de lo que devuelva la función exportada, sin que tengas que escribir XML a
mano. En este proyecto, `sitemap.ts` importa las mismas listas de `lib/content/services.ts` y
`lib/content/materials.ts` que usan las páginas reales — así nunca se puede desincronizar el
sitemap de las páginas que existen de verdad.

## 6. JSON-LD (datos estructurados para Google)

Verás bloques como este en varias páginas (`app/(marketing)/layout.tsx`,
`app/(marketing)/servicios/[slug]/page.tsx`, `components/ui/Breadcrumbs.tsx`):

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

Es un objeto JavaScript normal, serializado a JSON e inyectado en un `<script>` con un tipo MIME
especial que los navegadores no ejecutan como JS — solo lo leen los buscadores. Sigue el vocabulario
[schema.org](https://schema.org): le dice a Google explícitamente "esto es un negocio local", "esto
es un servicio", "esta es la ruta de migas de pan", más allá de lo que pueda inferir del HTML visual.
`dangerouslySetInnerHTML` sería peligroso con contenido de usuario (XSS), pero aquí el contenido lo
generamos nosotros mismos a partir de datos propios, no de input externo, así que es seguro.

## 7. Route groups — por qué existe `app/(marketing)/`

La carpeta `(marketing)` con paréntesis es un *route group*: agrupa páginas bajo un layout común
(`app/(marketing)/layout.tsx`, que añade Header/Footer/WhatsApp/CookieBanner) **sin añadir
`/marketing` a la URL real**. `/servicios/...` existe dentro de esa carpeta pero la URL sigue siendo
`/servicios/...`, no `/marketing/servicios/...`.

La razón de tenerlo separado del `app/layout.tsx` raíz: `/studio` (Sanity Studio) también cuelga de
`app/layout.tsx`, pero necesita el lienzo completo sin cabecera/pie/banner de cookies de marketing.
Así, `app/layout.tsx` se queda mínimo (fuentes, `<html>`/`<body>`) y cada rama añade lo que necesita.

## 8. Resumen mental para cuando vuelvas a este código

- ¿El archivo tiene `"use client"`? → corre en el navegador, puede tener estado/eventos, **no** puede
  leer secretos de servidor directamente.
- ¿Tiene `"use server"`? → es una Server Action, un puente invocable desde el cliente que corre en
  el servidor.
- ¿No tiene ninguna de las dos? → Server Component por defecto: corre solo en el servidor, ideal
  para leer datos (Sanity, Supabase) y renderizar HTML, pero sin interactividad.
- `/lib` = los "servicios" del backend (clientes + validación), sin mezclarse con las rutas.
- Los schemas de Sanity y `db/schema.sql` son las dos únicas fuentes de verdad sobre la forma de los
  datos — si algo no cuadra con lo que ves en el código, empieza por mirar ahí.
