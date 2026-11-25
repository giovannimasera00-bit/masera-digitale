-- Agenda Masera, tappa 4A: il cliente sposta o annulla da solo, con il suo link personale.
-- Si esegue una volta nel SQL Editor di Supabase, dopo 0002_staff.sql.
-- Il link contiene un codice casuale lungo; nel database salviamo solo la sua impronta (sha256),
-- così chi leggesse il database non potrebbe ricostruire i link.
-- Regola: da soli si sposta o si annulla fino a 1 ora prima (confermato da Giovanni il 25/11/2026).

alter table public.appointments add column if not exists manage_token_hash text;
create unique index if not exists appointments_manage_token_idx
  on public.appointments (manage_token_hash) where manage_token_hash is not null;

-- ——— Conferma un posto tenuto e salva l'impronta del link personale ———
create or replace function public.confirm_booking(p_id uuid, p_name text, p_phone text, p_token_hash text)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  update appointments
     set status = 'confermato', hold_expires_at = null, customer_name = p_name, customer_phone = p_phone,
         privacy_ack_at = now(), manage_token_hash = p_token_hash, updated_at = now()
   where id = p_id and status = 'hold' and hold_expires_at > now();
  return found;
end $$;

-- ——— Legge l'appuntamento del link (senza nome né telefono) ———
create or replace function public.manage_get(p_token_hash text)
returns table (service_slug text, resource text, status text, day date, start_min int, end_min int)
language sql stable security definer set search_path = public as $$
  select
    service_slug, resource, status,
    (starts_at at time zone 'Europe/Rome')::date,
    (extract(hour from starts_at at time zone 'Europe/Rome') * 60 + extract(minute from starts_at at time zone 'Europe/Rome'))::int,
    (extract(epoch from (ends_at - starts_at)) / 60)::int
      + (extract(hour from starts_at at time zone 'Europe/Rome') * 60 + extract(minute from starts_at at time zone 'Europe/Rome'))::int
  from appointments
  where manage_token_hash = p_token_hash and status <> 'hold';
$$;

-- ——— Annulla: solo se confermato e manca almeno 1 ora ———
create or replace function public.manage_cancel(p_token_hash text)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  update appointments set status = 'annullato', updated_at = now()
   where manage_token_hash = p_token_hash and status = 'confermato' and starts_at >= now() + interval '1 hour';
  return found;
end $$;

-- ——— Sposta: stesso servizio e stessa durata, nuovo orario; il vincolo impedisce le sovrapposizioni ———
create or replace function public.manage_move(p_token_hash text, p_day date, p_start_min int)
returns boolean
language plpgsql security definer set search_path = public as $$
declare
  v_start timestamptz := (p_day + make_interval(mins => p_start_min)) at time zone 'Europe/Rome';
begin
  delete from appointments a where a.status = 'hold' and a.hold_expires_at < now();
  update appointments a
     set starts_at = v_start,
         ends_at = v_start + (a.ends_at - a.starts_at),
         blocked_until = v_start + (a.ends_at - a.starts_at) + make_interval(mins => a.buffer_min),
         updated_at = now()
   where a.manage_token_hash = p_token_hash and a.status = 'confermato'
     and a.starts_at >= now() + interval '1 hour' and v_start >= now() + interval '1 hour';
  return found;
exception when exclusion_violation then
  return false; -- il nuovo orario è appena stato preso
end $$;

revoke all on function public.confirm_booking(uuid, text, text, text) from public, anon, authenticated;
revoke all on function public.manage_get(text) from public, anon, authenticated;
revoke all on function public.manage_cancel(text) from public, anon, authenticated;
revoke all on function public.manage_move(text, date, int) from public, anon, authenticated;
grant execute on function public.confirm_booking(uuid, text, text, text), public.manage_get(text),
  public.manage_cancel(text), public.manage_move(text, date, int) to service_role;
