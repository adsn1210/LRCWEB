-- Migracion para el proyecto Supabase ya desplegado, de antes de que existiera el wizard de 3
-- pasos (2026-09-07). Ejecutar manualmente en el SQL Editor de Supabase - ver db/README.md.
alter table leads add column if not exists budget integer;
alter table leads add column if not exists urgency text
  check (urgency in ('mas-3-meses', 'menos-3-meses', 'lo-antes-posible'));
