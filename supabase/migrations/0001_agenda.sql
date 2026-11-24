-- Agenda Masera, tappa 2 (BRIEF §9 e §15).
-- Si esegue una volta nel SQL Editor di Supabase (progetto a Francoforte).
-- Regole: nessun accesso dal browser (RLS attiva e nessuna policy): legge e scrive solo il server del sito.
-- Le ore si salvano come istanti (timestamptz); il calcolo "in ora di Seregno" lo fa il database con Europe/Rome.

create extension if not exists btree_gist;

-- ——— Appuntamenti e posti tenuti ———
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  service_slug text not null,
  resource text not null check (resource in ('cabina_analisi', 'skinlab', 'farmaestetica', 'video', 'evento')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  buffer_min int not null default 0 check (buffer_min between 0 and 60),
  status text not null default 'hold'
    check (status in ('hold', 'confermato', 'arrivato', 'fatto', 'annullato', 'non_presentato')),
  hold_expires_at timestamptz,
  channel text not null default 'online' check (channel in ('online', 'telefono', 'banco')),
  customer_name text,
  customer_phone text,
  privacy_ack_at timestamptz,
  notes text,
  check (ends_at > starts_at),
  check (status <> 'hold' or hold_expires_at is not null),
  -- Mai due appuntamenti (pulizia compresa) sulla stessa risorsa nello stesso momento.
  constraint appointments_no_overlap exclude using gist (
    resource with =,
    tstzrange(starts_at, ends_at + make_interval(mins => buffer_min), '[)') with &&
  ) where (status not in ('annullato'))
);

create index if not exists appointments_day_idx on public.appointments (resource, starts_at);

-- ——— Chiusure, ferie, festivi ———
create table if not exists public.closures (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  day date not null,
  resource text, -- null = tutta la farmacia
  from_min int check (from_min between 0 and 1440),
  to_min int check (to_min between 0 and 1440),
  reason text,
  check ((from_min is null) = (to_min is null)),
  check (from_min is null or to_min > from_min)
);

alter table public.appointments enable row level security;
alter table public.closures enable row level security;
-- Nessuna policy: il browser (chiave pubblica) non vede e non scrive niente.

-- ——— Impegni in ora di Seregno (solo orari, niente dati dei clienti) ———
create or replace view public.agenda_busy
with (security_invoker = true) as
select
  resource,
  (starts_at at time zone 'Europe/Rome')::date as day,
  (extract(hour from starts_at at time zone 'Europe/Rome') * 60 + extract(minute from starts_at at time zone 'Europe/Rome'))::int as start_min,
  (extract(epoch from (ends_at - starts_at)) / 60)::int
    + (extract(hour from starts_at at time zone 'Europe/Rome') * 60 + extract(minute from starts_at at time zone 'Europe/Rome'))::int as end_min
from public.appointments
where status not in ('annullato')
  and (status <> 'hold' or hold_expires_at > now());

-- ——— Tiene il posto per 5 minuti ———
-- Toglie prima i posti tenuti scaduti, poi prova a inserire: se l'orario è preso il vincolo blocca e restituisce null.
create or replace function public.hold_slot(
  p_service_slug text, p_resource text, p_day date, p_start_min int, p_duration_min int, p_buffer_min int
) returns table (id uuid, hold_expires_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare
  v_start timestamptz := (p_day + make_interval(mins => p_start_min)) at time zone 'Europe/Rome';
begin
  delete from appointments a where a.status = 'hold' and a.hold_expires_at < now();
  begin
    return query
      insert into appointments (service_slug, resource, starts_at, ends_at, buffer_min, status, hold_expires_at)
      values (p_service_slug, p_resource, v_start, v_start + make_interval(mins => p_duration_min), p_buffer_min, 'hold', now() + interval '5 minutes')
      returning appointments.id, appointments.hold_expires_at;
  exception when exclusion_violation then
    return; -- orario già preso: nessuna riga
  end;
end $$;

-- ——— Conferma un posto tenuto ———
create or replace function public.confirm_hold(p_id uuid, p_name text, p_phone text)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  update appointments
     set status = 'confermato', hold_expires_at = null, customer_name = p_name, customer_phone = p_phone,
         privacy_ack_at = now(), updated_at = now()
   where id = p_id and status = 'hold' and hold_expires_at > now();
  return found;
end $$;

-- Le funzioni le chiama solo il server (service role), non il browser.
revoke all on function public.hold_slot(text, text, date, int, int, int) from public, anon, authenticated;
revoke all on function public.confirm_hold(uuid, text, text) from public, anon, authenticated;
revoke all on public.agenda_busy from anon, authenticated;

-- ——— Libera un posto tenuto (il cliente ha cambiato orario) ———
create or replace function public.release_hold(p_id uuid)
returns void
language sql security definer set search_path = public as $$
  delete from appointments where id = p_id and status = 'hold';
$$;
revoke all on function public.release_hold(uuid) from public, anon, authenticated;
