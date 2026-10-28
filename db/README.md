# db

Esquema versionado de la base de datos de leads (Postgres, gestionado con Supabase). No es una
base de datos local: `schema.sql` es la fuente de verdad que se aplica manualmente (o vía CLI de
Supabase) sobre el proyecto Supabase real. Ver `Docs/BACKEND.md` secciones 1 y 4.

## Pausa por inactividad (plan Free)

El proyecto Supabase (**LRCWEB**, organización **LRC**, cuenta *lrcencimeras*) se pausa solo tras 7
días sin actividad, y entonces falla el guardado de leads (pasó en octubre de 2026). Para evitarlo,
`.github/workflows/supabase-keepalive.yml` hace una consulta mínima cada 3 días usando el secret
`DATABASE_URL` de GitHub. Si el repo pasa 60 días sin commits, GitHub desactiva los workflows
programados (avisa por email): se reactiva desde la pestaña *Actions*. Aunque la base de datos
falle, `submitLead` sigue enviando el aviso por email, con una advertencia de que es la única copia.

## Migraciones

`schema.sql` refleja el estado deseado para un proyecto Supabase nuevo (usa `create table if not
exists`, así que no toca una tabla que ya existe). Para aplicar un cambio de esquema sobre el
proyecto Supabase real que ya tiene datos, se añade un archivo numerado en `migrations/` con las
sentencias `alter table` necesarias, y se ejecuta a mano en el SQL Editor de Supabase — no hay
herramienta de migraciones automática en este proyecto.

**Regla general:** aplica la migración en Supabase **antes** de desplegar el código que la usa. Por
ejemplo, `submitLead` inserta `budget`/`urgency` sin comprobar si existen: si el código llega a
producción antes que `0001_add_budget_urgency.sql`, falla el guardado de todos los leads (el aviso
por email sigue llegando, marcado como única copia).

## Conexión

Producción usa el *transaction pooler* de Supabase (puerto 6543), que no admite sentencias
preparadas: `lib/db.ts` crea el cliente con `prepare: false` y un `connect_timeout` corto.
