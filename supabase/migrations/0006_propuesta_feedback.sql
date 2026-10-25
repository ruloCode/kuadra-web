-- Kuadra OS 0006 — Comentarios y aprobaciones en propuestas públicas
--
-- Las propuestas viven en el sitio público (/propuesta/...) y el cliente las
-- abre sin cuenta, desde el celular. Ahí puede dejar un comentario o aprobar
-- cada pieza. Como no hay sesión, el rol anon nunca toca las tablas: entra
-- sólo por dos funciones que validan la sala y los tamaños.
--
-- Una «sala» es una propuesta con comentarios abiertos. El slug lleva un sufijo
-- al azar a propósito: es lo único que separa la sala de cualquiera que lo
-- adivine, así que no conviene que sea sólo el nombre del cliente.

create table public.proposal_rooms (
  slug text primary key,
  client_name text not null,
  open boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.proposal_feedback (
  id bigint generated always as identity primary key,
  room text not null references public.proposal_rooms (slug) on delete cascade,
  -- Id de la pieza dentro de la propuesta ('p01'…), o 'general'.
  piece text not null check (char_length(piece) between 1 and 40),
  kind text not null check (kind in ('comment', 'approve', 'unapprove')),
  author text not null check (char_length(author) between 1 and 60),
  body text check (body is null or char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  check (kind <> 'comment' or body is not null)
);

create index proposal_feedback_room_idx
  on public.proposal_feedback (room, created_at);

-- --------------------------------------------------------------------- RLS
alter table public.proposal_rooms enable row level security;
alter table public.proposal_feedback enable row level security;

-- El equipo administra las salas y lee lo que dejan los clientes.
create policy proposal_rooms_team_all on public.proposal_rooms for all to authenticated
  using ((select private.is_team())) with check ((select private.is_team()));
create policy proposal_feedback_team_read on public.proposal_feedback for select to authenticated
  using ((select private.is_team()));

-- ------------------------------------------------------- acceso sin cuenta
create or replace function public.proposal_feedback_list(p_room text)
returns setof public.proposal_feedback
language sql
stable
security definer
set search_path = ''
as $$
  select f.*
  from public.proposal_feedback f
  join public.proposal_rooms r on r.slug = f.room
  where f.room = p_room
  order by f.created_at, f.id;
$$;

create or replace function public.proposal_feedback_add(
  p_room text,
  p_piece text,
  p_kind text,
  p_author text,
  p_body text default null
)
returns public.proposal_feedback
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved public.proposal_feedback;
begin
  if not exists (select 1 from public.proposal_rooms where slug = p_room and open) then
    raise exception 'La sala % no existe o está cerrada', p_room;
  end if;

  -- Tope por sala: una propuesta real no pasa de unos cientos de mensajes, y
  -- así un enlace filtrado no puede llenar la tabla.
  if (select count(*) from public.proposal_feedback where room = p_room) >= 3000 then
    raise exception 'La sala % llegó al tope de mensajes', p_room;
  end if;

  insert into public.proposal_feedback (room, piece, kind, author, body)
  values (
    p_room,
    trim(p_piece),
    p_kind,
    coalesce(nullif(trim(p_author), ''), 'Cliente'),
    nullif(trim(p_body), '')
  )
  returning * into saved;

  return saved;
end;
$$;

revoke execute on function public.proposal_feedback_list(text) from public;
revoke execute on function public.proposal_feedback_add(text, text, text, text, text) from public;
grant execute on function public.proposal_feedback_list(text) to anon, authenticated;
grant execute on function public.proposal_feedback_add(text, text, text, text, text) to anon, authenticated;

-- ------------------------------------------------------------------- salas
insert into public.proposal_rooms (slug, client_name)
values ('arnold-7q2k', 'Arnold');
