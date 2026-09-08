-- Kuadra OS 0002 — campos que el prototipo ya usaba, y permisos del cliente
-- acotados a dos operaciones concretas.

-- ------------------------------------------------- campos que faltaban
-- El prototipo guardaba estos tres en memoria y la tabla no los tenía: sin
-- ellos no hay importador de guiones, ni reparto de trabajo, ni vencimientos.
alter table public.pieces
  add column if not exists guion    text,
  add column if not exists assignee uuid references public.profiles (id) on delete set null,
  add column if not exists due      date;

create index if not exists pieces_assignee_idx
  on public.pieces (assignee) where assignee is not null;

-- ------------------------------------------------- permisos del cliente
-- La policy `pieces_client_plan_ok` de 0001 decía «el cliente aprueba el plan,
-- nada más», pero PostgreSQL no restringe columnas dentro de una policy: con
-- ella, un cliente podía hacer `update pieces set client_id = 'otro'` sobre
-- cualquier pieza suya con plan_shared. Los grants por columna tampoco valen,
-- porque equipo y clientes comparten el rol `authenticated`.
--
-- Sin policy permisiva de UPDATE, RLS le deniega al cliente toda escritura
-- directa sobre pieces. Lo que sí puede hacer pasa por estas dos funciones,
-- que revalidan la propiedad dentro de Postgres y dejan rastro en `events`.
drop policy if exists pieces_client_plan_ok on public.pieces;

create or replace function public.set_plan_ok(p_piece_id bigint, p_ok boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.pieces
     set plan_ok = p_ok
   where id = p_piece_id
     and client_id = (select private.my_client_id())
     and plan_shared;

  if not found then
    raise exception 'pieza no encontrada o sin permiso' using errcode = '42501';
  end if;

  insert into public.events (piece_id, event_type, body, author_id)
  values (p_piece_id, 'note',
          case when p_ok then 'Plan aprobado por el cliente'
               else 'El cliente retiró la aprobación del plan' end,
          (select auth.uid()));
end;
$$;

-- El botón «Ya lo publiqué» del cliente. En 0001 no existía forma de hacerlo:
-- la policy de lectura le dejaba ver la pieza aprobada, pero ninguna de
-- escritura le permitía marcarla.
create or replace function public.mark_published(p_piece_id bigint, p_published boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.pieces
     set status = case when p_published then 'publicado' else 'aprobado' end
   where id = p_piece_id
     and client_id = (select private.my_client_id())
     and status in ('aprobado', 'publicado');

  if not found then
    raise exception 'pieza no encontrada o sin permiso' using errcode = '42501';
  end if;

  insert into public.events (piece_id, event_type, body, author_id)
  values (p_piece_id, 'status',
          case when p_published then 'Aprobado → Publicado · marcado por el cliente'
               else 'Publicado → Aprobado · desmarcado por el cliente' end,
          (select auth.uid()));
end;
$$;

-- `get_advisors` marcará estas dos funciones con
-- `authenticated_security_definer_function_executable`. Es esperado y
-- deliberado: existen justamente para que un cliente autenticado las llame.
-- SECURITY DEFINER es lo que les permite escribir donde su invocador no puede,
-- y por eso ambas revalidan la propiedad de la pieza antes de tocar nada.
revoke execute on function public.set_plan_ok(bigint, boolean)    from public, anon;
revoke execute on function public.mark_published(bigint, boolean) from public, anon;
grant  execute on function public.set_plan_ok(bigint, boolean)    to authenticated;
grant  execute on function public.mark_published(bigint, boolean) to authenticated;
