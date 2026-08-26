import postgres from "postgres";

// Histórico propio de leads (tabla `leads`, ver db/schema.sql). Ver Docs/BACKEND.md secciones 2 y 4.
// DATABASE_URL apunta al Postgres de Supabase. Solo se usa en server actions / route handlers.
export const db = postgres(process.env.DATABASE_URL!);
