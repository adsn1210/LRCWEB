-- Tabla de leads (Docs/BACKEND.md sección 4). Base: Postgres de Supabase.
-- Histórico propio de leads, independiente del email de notificación (Resend).

create table if not exists leads (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  name         text not null,
  contact      text not null, -- teléfono o email
  service      text not null check (service in ('encimeras', 'reforma-cocina', 'reforma-bano', 'reforma-integral', 'otro')),
  message      text,
  source_page  text
);
