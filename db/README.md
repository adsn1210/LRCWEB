# db

Esquema versionado de la base de datos de leads (Postgres, gestionado con Supabase). No es una
base de datos local: `schema.sql` es la fuente de verdad que se aplica manualmente (o vía CLI de
Supabase) sobre el proyecto Supabase real. Ver `Docs/BACKEND.md` secciones 1 y 4.

## Migraciones

`schema.sql` refleja el estado deseado para un proyecto Supabase nuevo (usa `create table if not
exists`, así que no toca una tabla que ya existe). Para aplicar un cambio de esquema sobre el
proyecto Supabase real que ya tiene datos, se añade un archivo numerado en `migrations/` con las
sentencias `alter table` necesarias, y se ejecuta a mano en el SQL Editor de Supabase — no hay
herramienta de migraciones automática en este proyecto.

**Importante para esta migración concreta:** el código de esta rama inserta `budget`/`urgency`
sin comprobar si existen — hay que aplicar `0001_add_budget_urgency.sql` en producción **antes**
de desplegar este código, no después. Si se despliega primero, todos los envíos de lead (incluido
el formulario ya existente en `/contacto`) fallarán hasta que se aplique la migración.
