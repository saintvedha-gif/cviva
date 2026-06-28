-- ============================================================
-- CViva — Schema de Supabase
-- Ejecutar completo en: Supabase → SQL Editor → New query
-- ============================================================

-- ── Extensiones ────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── TABLA: profiles ────────────────────────────────────────
-- Se crea automáticamente al registrarse un usuario via trigger
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  avatar_url    text,
  plan          text not null default 'free',   -- 'free' | 'pro' | 'teams'
  plan_period   text,                            -- 'mensual' | 'anual'
  plan_expires  timestamptz,
  plan_updated  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Trigger: crear profile automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger: actualizar updated_at en profiles
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

-- ── TABLA: cvs ─────────────────────────────────────────────
-- FIX CRÍTICO: la columna se llama "cv_data" (no "data") porque TODO el
-- frontend (CVEditorPage.jsx, InteractiveCVPage.jsx, supabase.js, CVListPage.jsx,
-- DashboardHome.jsx) lee y escribe "cv_data". Con el nombre "data" original,
-- guardar y cargar un CV fallaba en silencio / con error de columna inexistente.
create table if not exists public.cvs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null default 'Mi CV',
  slug        text unique,
  cv_data     jsonb,                  -- el objeto JSON con toda la info del CV
  template    text default 'default',
  published   boolean not null default false,
  views       integer not null default 0,
  downloads   integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Si la tabla ya existía con la columna vieja "data", renómbrala así
-- (no rompe nada si la columna ya se llama cv_data: el IF EXISTS evita el error)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'cvs' and column_name = 'data'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'cvs' and column_name = 'cv_data'
  ) then
    alter table public.cvs rename column data to cv_data;
  end if;
end $$;

drop trigger if exists cvs_updated_at on public.cvs;
create trigger cvs_updated_at
  before update on public.cvs
  for each row execute procedure public.update_updated_at();

-- ── TABLA: payments ────────────────────────────────────────
-- Registro de pagos para auditoría (llenado por el webhook de Wompi)
create table if not exists public.payments (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  plan            text not null,
  period          text,
  gateway         text not null default 'wompi',
  gateway_tx_id   text,
  amount_cents    integer,
  currency        text default 'COP',
  status          text not null default 'pending',  -- 'pending' | 'approved' | 'failed'
  paid_at         timestamptz,
  created_at      timestamptz not null default now()
);

-- ── RLS (Row Level Security) ────────────────────────────────
alter table public.profiles enable row level security;
alter table public.cvs      enable row level security;
alter table public.payments enable row level security;

-- profiles: cada usuario ve y edita solo su perfil
create policy "profiles: ver propio" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: editar propio" on public.profiles
  for update using (auth.uid() = id);

-- cvs: cada usuario gestiona solo sus CVs
create policy "cvs: ver propios" on public.cvs
  for select using (auth.uid() = user_id);
create policy "cvs: insertar propios" on public.cvs
  for insert with check (auth.uid() = user_id);
create policy "cvs: editar propios" on public.cvs
  for update using (auth.uid() = user_id);
create policy "cvs: borrar propios" on public.cvs
  for delete using (auth.uid() = user_id);

-- cvs publicados: cualquiera puede ver (para /cv/:slug)
create policy "cvs: ver publicados" on public.cvs
  for select using (published = true);

-- payments: cada usuario ve solo sus pagos
create policy "payments: ver propios" on public.payments
  for select using (auth.uid() = user_id);

-- ── Funciones helper para views/downloads ──────────────────
-- Fix #10: funciones para incrementar contadores
create or replace function public.increment_cv_views(cv_id uuid)
returns void language sql security definer as $$
  update public.cvs set views = views + 1 where id = cv_id and published = true;
$$;

-- FIX: faltaba "and published = true" — antes se podían inflar las
-- descargas de un CV en borrador (no publicado) sin ninguna restricción.
create or replace function public.increment_cv_downloads(cv_id uuid)
returns void language sql security definer as $$
  update public.cvs set downloads = downloads + 1 where id = cv_id and published = true;
$$;

-- ── Índice único para idempotencia de pagos ─────────────────
-- Evita registrar el mismo pago dos veces si Wompi reintenta el webhook
-- (no cambia la lógica del webhook todavía, solo prepara la base de datos).
create unique index if not exists payments_gateway_tx_id_unique
  on public.payments (gateway_tx_id)
  where gateway_tx_id is not null;