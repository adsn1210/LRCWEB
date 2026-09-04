---
title: LRC WEB · Documento 8 — Conectar Supabase, Sanity y Vercel
fecha: 2026-09-04
estado: Vivo — guía operativa
---

# Conectar Supabase, Sanity y Vercel

Guía paso a paso para dejar los tres servicios de infraestructura funcionando de verdad en
producción. Ver `Docs/BACKEND.md` secciones 1 y 9 para las decisiones de arquitectura de fondo.

## Estado actual (comprobado hoy, sin leer valores reales)

Ya tienes rellenas en tu `.env.local` local: `NEXT_PUBLIC_SANITY_PROJECT_ID`,
`NEXT_PUBLIC_SANITY_DATASET`, `DATABASE_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` y
`LEAD_NOTIFICATION_EMAIL`. Lo que falta es: confirmar que la tabla de Supabase existe de verdad,
importar el proyecto en Vercel, y llevar esas mismas variables a las variables de entorno de Vercel
(un `.env.local` solo funciona en tu máquina — Vercel no lo lee).

## 1. Supabase (base de datos de leads)

### 1.1 Si el proyecto de Supabase ya existe (parece que sí, `DATABASE_URL` está rellena)

1. Entra en [supabase.com](https://supabase.com/dashboard) → tu proyecto.
2. Ve a **SQL Editor** → pega el contenido de `db/schema.sql` (la tabla `leads`) → **Run**.
   - Es seguro ejecutarlo aunque ya exista: usa `create table if not exists`.
3. Ve a **Table Editor** y confirma que la tabla `leads` aparece con las columnas: `id`,
   `created_at`, `name`, `contact`, `service`, `message`, `source_page`.
4. Prueba el formulario real en `/contacto` (en local, con `npm run dev`) y confirma que aparece una
   fila nueva en la tabla tras enviarlo.

### 1.2 Si necesitas crear el proyecto desde cero

1. [supabase.com](https://supabase.com/dashboard) → **New project** → plan **Free**.
2. Región recomendada: la más cercana a España/Europa (p. ej. `eu-central-1`).
3. Guarda la contraseña de la base de datos que te pide al crear el proyecto — la necesitas para el
   connection string.
4. **Project Settings → Database → Connection string** → copia el modo **Transaction** (puerto
   `6543`, recomendado para funciones serverless como Vercel) o **Session** (puerto `5432`) — con
   el driver `postgres` (paquete `postgres` de npm que ya usa `lib/db.ts`) cualquiera de los dos
   funciona; para Vercel es más robusto el modo *Transaction pooling*.
5. Pega ese connection string en `DATABASE_URL` (sustituyendo `[YOUR-PASSWORD]` por la contraseña
   real).
6. Sigue con el paso 1.1 desde el punto 2 (ejecutar `db/schema.sql`).

### 1.3 Notas

- El cliente `postgres` (`lib/db.ts`) no valida la conexión hasta la primera consulta — si algo
  falla, se verá en los logs de Vercel (Runtime Logs) como un error al enviar el formulario, no en
  el build.
- Plan Free de Supabase pausa el proyecto tras 7 días de inactividad total — si la web lleva tiempo
  sin tráfico y el formulario falla, revisa primero si el proyecto está "paused" en el dashboard.

## 2. Sanity (CMS)

Según la memoria del proyecto, el Studio ya se inicializó con la cuenta/proyecto real del cliente
(`f68d26d Inicializar Sanity Studio con el proyecto real del cliente`), y las variables ya están
rellenas. Lo que falta es solo cargar contenido y, si hace falta, dar acceso a Vercel:

1. Confirma que puedes entrar al Studio en local: `npm run dev` → `http://localhost:3000/studio`.
2. Si el dataset es privado (no "público" en modo lectura), genera un token de solo lectura en
   [sanity.io/manage](https://www.sanity.io/manage) → tu proyecto → **API → Tokens → Add API token**
   con permisos **Viewer**, y ponlo en `SANITY_API_READ_TOKEN` (hoy no está presente en tu
   `.env.local` — solo hace falta si las queries fallan por permisos).
3. Cuando subas contenido real (proyectos, servicios, materiales, testimonios) desde el Studio, se
   verá automáticamente en las páginas que ya consulten Sanity — hoy, `servicios`, `materiales` y
   `proyectos` siguen con contenido hardcodeado en `lib/content/` y `lib/placeholder-projects.ts`
   (ver `Docs/07-pendientes-lanzamiento.md` sección 4, es un nice-to-have migrar esto).
4. Da acceso al cliente si quieres que gestione contenido: **sanity.io/manage → tu proyecto →
   Members → Invite** con su email, rol **Editor** (no **Administrator**, para que no pueda
   cambiar el schema ni borrar el proyecto).

## 3. Vercel (hosting de la app)

### 3.1 Importar el proyecto

1. [vercel.com/new](https://vercel.com/new) → conecta tu cuenta de GitHub si no lo está ya.
2. Selecciona el repositorio `adsn1210/LRCWEB`.
3. Framework Preset: Vercel detecta Next.js automáticamente — no toques nada del build command.
4. **Antes de darle a Deploy**, añade las variables de entorno (paso 3.2) — si despliegas sin ellas,
   el build puede fallar o la app funcionará sin base de datos/email/Sanity.

### 3.2 Variables de entorno en Vercel

En **Project Settings → Environment Variables**, añade (mismo nombre que en `.env.example`), para
los entornos **Production** y **Preview**:

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_READ_TOKEN        (si hace falta, ver sección 2)
DATABASE_URL
RESEND_API_KEY
RESEND_FROM_EMAIL
LEAD_NOTIFICATION_EMAIL
NEXT_PUBLIC_SITE_URL          (pon https://www.lareinadelacasa.com explícitamente)
NEXT_PUBLIC_GTM_ID            (cuando exista, ver Docs/07-pendientes-lanzamiento.md)
```

Copia los valores directamente desde tu `.env.local` — no hace falta reescribirlos a mano si tienes
el archivo delante.

### 3.3 Dominio custom (Hostinger → Vercel)

**Dominio canónico: `lareinadelacasa.com` (sin `www`)** — decisión del 2026-09-04, para que coincida
con el flujo de datos ya creado en GA4. `www.lareinadelacasa.com` debe existir solo como redirección
301 hacia el dominio sin `www`, nunca como sitio independiente (evita contenido duplicado de cara a
SEO).

1. En Vercel: **Project Settings → Domains → Add** → añade primero `lareinadelacasa.com` y márcalo
   como dominio primario (Primary Domain).
2. Añade también `www.lareinadelacasa.com` — Vercel te ofrece automáticamente la opción
   **"Redirect to lareinadelacasa.com"**; actívala (redirección 308/301 permanente).
3. Vercel te da los registros DNS exactos a crear para ambos — normalmente:
   - Un registro **A** en la raíz (`@`) apuntando a `76.76.21.21` (la IP que te indique Vercel en
     pantalla — usa la que te muestre a ti, puede variar).
   - Un registro **CNAME** en `www` apuntando a `cname.vercel-dns.com`.
3. En Hostinger: **hPanel → Dominios → tu dominio → DNS / Zona DNS** → añade esos registros exactos.
   **No toques ni borres los registros `MX`** (el correo corporativo se queda en Hostinger, sin
   cambios — ver `Docs/BACKEND.md` sección 1).
4. La propagación DNS puede tardar de minutos a un par de horas. Vercel marca el dominio como
   verificado automáticamente en cuanto lo detecta.
5. Vercel emite el certificado SSL (HTTPS) automáticamente una vez el DNS apunta correctamente — no
   hay que hacer nada manual para eso.

### 3.4 Después del primer deploy

- Cada `push` a `main` despliega a producción automáticamente; cada Pull Request genera una URL de
  preview propia — útil para revisar cambios antes de fusionarlos a `main`.
- Revisa **Deployments → (el deploy) → Runtime Logs** si algo falla en producción mientras funciona
  en local — normalmente son variables de entorno que faltan en Vercel.
