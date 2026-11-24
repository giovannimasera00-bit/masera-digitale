-- Agenda Masera, tappa 3: vista del personale (/staff/agenda).
-- Si esegue una volta nel SQL Editor di Supabase, dopo 0001_agenda.sql.

-- ——— Appuntamenti del giorno, con i dati del cliente: solo per il server (il personale passa da lì) ———
create or replace view public.staff_appointments
with (security_invoker = true) as
select
  id,
  resource,
  service_slug,
  status,
  channel,
  customer_name,
  customer_phone,
  notes,
  created_at,
  (starts_at at time zone 'Europe/Rome')::date as day,
  (extract(hour from starts_at at time zone 'Europe/Rome') * 60 + extract(minute from starts_at at time zone 'Europe/Rome'))::int as start_min,
  (extract(epoch from (ends_at - starts_at)) / 60)::int
    + (extract(hour from starts_at at time zone 'Europe/Rome') * 60 + extract(minute from starts_at at time zone 'Europe/Rome'))::int as end_min
from public.appointments
where status <> 'hold';

-- ——— Prenotazione inserita dal personale (telefono o banco): subito confermata ———
create or replace function public.book_direct(
  p_service_slug text, p_resource text, p_day date, p_start_min int, p_duration_min int, p_buffer_min int,
  p_name text, p_phone text, p_channel text, p_notes text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_start timestamptz := (p_day + make_interval(mins => p_start_min)) at time zone 'Europe/Rome';
  v_id uuid;
begin
  delete from appointments a where a.status = 'hold' and a.hold_expires_at < now();
  begin
    insert into appointments (service_slug, resource, starts_at, ends_at, buffer_min, blocked_until, status,
                              channel, customer_name, customer_phone, notes)
    values (p_service_slug, p_resource, v_start, v_start + make_interval(mins => p_duration_min), p_buffer_min,
            v_start + make_interval(mins => p_duration_min + p_buffer_min), 'confermato',
            p_channel, p_name, nullif(p_phone, ''), nullif(p_notes, ''))
    returning id into v_id;
  exception when exclusion_violation then
    return null; -- orario già preso
  end;
  return v_id;
end $$;

-- ——— Cambia lo stato: arrivato, fatto, non presentato, annullato (o di nuovo confermato) ———
create or replace function public.set_appointment_status(p_id uuid, p_status text)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if p_status not in ('confermato', 'arrivato', 'fatto', 'annullato', 'non_presentato') then
    return false;
  end if;
  update appointments set status = p_status, updated_at = now() where id = p_id and status <> 'hold';
  return found;
exception when exclusion_violation then
  return false; -- "riattivare" un annullato quando l'orario è stato ripreso da altri
end $$;

revoke all on public.staff_appointments from anon, authenticated;
revoke all on function public.book_direct(text, text, date, int, int, int, text, text, text, text) from public, anon, authenticated;
revoke all on function public.set_appointment_status(uuid, text) from public, anon, authenticated;
grant select on public.staff_appointments to service_role;
grant execute on function public.book_direct(text, text, date, int, int, int, text, text, text, text),
  public.set_appointment_status(uuid, text) to service_role;
