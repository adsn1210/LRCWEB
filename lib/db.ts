import postgres from "postgres";

// Histórico propio de leads (tabla `leads`, ver db/schema.sql). Ver Docs/BACKEND.md secciones 2 y 4.
// DATABASE_URL apunta al Postgres de Supabase. Solo se usa en server actions / route handlers.
//
// La URL de producción usa el *transaction pooler* de Supabase (puerto 6543), que no admite
// sentencias preparadas: sin `prepare: false`, postgres.js las usa por defecto y los inserts fallan
// de forma intermitente. `connect_timeout` corto para que, si Supabase está caído o pausado, el
// formulario no se quede colgado 30 s antes de recurrir al aviso por email (ver contacto/actions.ts).
// `max: 1` porque cada función serverless atiende una petición a la vez: más conexiones solo
// agotarían el límite del plan Free.
export const db = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  connect_timeout: 10,
  idle_timeout: 20,
  max: 1,
});
