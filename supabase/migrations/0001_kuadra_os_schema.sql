-- Kuadra OS — esquema base
-- Equipo (admin/estratega/cuentas/editor/productor) ve y edita todo.
-- Cliente solo ve su propio contenido, y solo lo aprobado/publicado o
-- lo que se le compartió explícitamente como plan del mes.

create schema if not exists private;

-- ---------------------------------------------------------------- clientes
create table clients (
  id         text primary key,          -- slug: 'bambu', 'clan', ...
  name       text not null,
  ig         text,
  tt         text,
  drive      text,
  pago       text not null default 'al día'
               check (pago in ('al día', 'pendiente')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------ perfiles
create table profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null,
  roles      text[] not null default '{}',
  client_id  text references clients (id) on delete set null,
  created_at timestamptz not null default now(),
  -- un perfil es de equipo o de cliente, nunca ambos
  constraint profiles_client_has_no_roles
    check (client_id is null or roles = '{}')
);

create index profiles_client_id_idx on profiles (client_id);

-- ------------------------------------------------------------------- piezas
create table pieces (
  id             bigint generated always as identity primary key,
  client_id      text not null references clients (id) on delete cascade,
  scheduled_date date not null,
  platform       text not null check (platform in ('ig', 'tt', 'both')),
  piece_type     text not null check (piece_type in ('reel', 'carrusel')),
  title          text not null,
  link           text,
  copy           text,
  hashtags       text,
  publish_time   text,
  status         text not null default 'grabar'
                   check (status in ('grabar', 'editar', 'revision',
                                     'cambios', 'aprobado', 'publicado')),
  rounds         integer not null default 0 check (rounds >= 0),
  plan_shared    boolean not null default false,
  plan_ok        boolean not null default false,
  created_at     timestamptz not null default now()
);

create index pieces_client_id_idx on pieces (client_id);
create index pieces_client_date_idx on pieces (client_id, scheduled_date);
create index pieces_status_idx on pieces (client_id, status);

-- ------------------------------------------------------------------ eventos
create table events (
  id         bigint generated always as identity primary key,
  piece_id   bigint not null references pieces (id) on delete cascade,
  event_type text not null check (event_type in ('created', 'status', 'note',
                                                 'client_note', 'change_request')),
  body       text not null default '',
  author_id  uuid references profiles (id) on delete set null,
  at         timestamptz not null default now()
);

create index events_piece_id_idx on events (piece_id, at);
create index events_author_id_idx on events (author_id);

-- --------------------------------------------------------------- prospectos
create table prospects (
  id         bigint generated always as identity primary key,
  company    text not null,
  contact    text,
  role       text,
  phone      text,
  email      text,
  ig         text,
  web        text,
  city       text,
  stage      text not null default 'nuevo'
               check (stage in ('nuevo', 'conversando', 'propuesta',
                                'contrato', 'firmado', 'activo', 'perdido')),
  next_date  date,
  next_what  text,
  notes      text,
  created_at timestamptz not null default now()
);

create index prospects_stage_idx on prospects (stage, next_date);

-- ------------------------------------------------------------------- pagos
create table payments (
  id         bigint generated always as identity primary key,
  client_id  text not null references clients (id) on delete cascade,
  month      text not null check (month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  amount     numeric(12,2) not null default 0 check (amount >= 0),
  status     text not null default 'pendiente'
               check (status in ('pendiente', 'pagado')),
  paid_date  date,
  invoice    text,
  receipt    text,
  created_at timestamptz not null default now(),
  unique (client_id, month)
);

create index payments_client_id_idx on payments (client_id);

-- ------------------------------------------------------- helpers de permisos
-- SECURITY DEFINER para poder leer profiles sin recursión de RLS.
-- Ambas fijan search_path y sólo miran la identidad de quien llama.

create or replace function private.is_team()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and cardinality(roles) > 0
  );
$$;

create or replace function private.my_client_id()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select client_id from public.profiles where id = (select auth.uid());
$$;

revoke execute on function private.is_team() from public, anon, authenticated;
revoke execute on function private.my_client_id() from public, anon, authenticated;
grant execute on function private.is_team() to authenticated;
grant execute on function private.my_client_id() to authenticated;

-- ------------------------------------------------------------------ perfiles
-- Un usuario nuevo entra sin roles y sin cliente: el equipo lo asigna después.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- --------------------------------------------------------------------- RLS
alter table clients   enable row level security;
alter table profiles  enable row level security;
alter table pieces    enable row level security;
alter table events    enable row level security;
alter table prospects enable row level security;
alter table payments  enable row level security;

-- clientes: el equipo administra; cada cliente ve solo su ficha
create policy clients_team_all on clients for all to authenticated
  using ((select private.is_team())) with check ((select private.is_team()));
create policy clients_own_read on clients for select to authenticated
  using (id = (select private.my_client_id()));

-- perfiles: cada quien lee el suyo; el equipo los ve y administra todos
create policy profiles_self_read on profiles for select to authenticated
  using (id = (select auth.uid()));
create policy profiles_team_all on profiles for all to authenticated
  using ((select private.is_team())) with check ((select private.is_team()));

-- piezas: el cliente ve lo aprobado/publicado y el plan que se le compartió
create policy pieces_team_all on pieces for all to authenticated
  using ((select private.is_team())) with check ((select private.is_team()));
create policy pieces_client_read on pieces for select to authenticated
  using (
    client_id = (select private.my_client_id())
    and (status in ('aprobado', 'publicado') or plan_shared)
  );
-- el cliente aprueba o retira su aprobación del plan, nada más
create policy pieces_client_plan_ok on pieces for update to authenticated
  using (client_id = (select private.my_client_id()) and plan_shared)
  with check (client_id = (select private.my_client_id()) and plan_shared);

-- eventos: el cliente lee los de sus piezas visibles y deja comentarios
create policy events_team_all on events for all to authenticated
  using ((select private.is_team())) with check ((select private.is_team()));
create policy events_client_read on events for select to authenticated
  using (exists (
    select 1 from pieces p
    where p.id = events.piece_id
      and p.client_id = (select private.my_client_id())
      and (p.status in ('aprobado', 'publicado') or p.plan_shared)
  ));
create policy events_client_note on events for insert to authenticated
  with check (
    event_type = 'client_note'
    and author_id = (select auth.uid())
    and exists (
      select 1 from pieces p
      where p.id = events.piece_id
        and p.client_id = (select private.my_client_id())
        and (p.status in ('aprobado', 'publicado') or p.plan_shared)
    )
  );

-- prospectos y pagos: solo equipo
create policy prospects_team_all on prospects for all to authenticated
  using ((select private.is_team())) with check ((select private.is_team()));
create policy payments_team_all on payments for all to authenticated
  using ((select private.is_team())) with check ((select private.is_team()));
