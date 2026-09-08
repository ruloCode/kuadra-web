# Supabase — Kuadra OS

Proyecto **`kuadra-os`** en la organización **Kuadra Film**.

| | |
| --- | --- |
| Ref | `maoqrpcxlirbzpxzwdid` |
| URL | https://maoqrpcxlirbzpxzwdid.supabase.co |
| Región | `us-east-1` |
| Plan | Free ($0/mes) |
| Dashboard | https://supabase.com/dashboard/project/maoqrpcxlirbzpxzwdid |

La clave publicable (`sb_publishable_...`) va en `.env` — está pensada para vivir
en el cliente, la que **nunca** se commitea es la `service_role`.

## Tablas

| Tabla | Qué guarda |
| --- | --- |
| `clients` | Ficha del cliente: slug, nombre, IG, TikTok, carpeta de Drive, estado de pago |
| `profiles` | Usuario de `auth.users` + `roles[]` (equipo) o `client_id` (cliente) |
| `pieces` | Cada pieza: fecha, plataforma, tipo, título, link, copy, estado, rondas |
| `events` | Bitácora por pieza: cambios de estado, notas, comentarios del cliente |
| `prospects` | CRM: embudo de `nuevo` a `activo` / `perdido` |
| `payments` | Matriz cliente × mes, con monto, estado y comprobante |

## Quién ve qué (RLS)

RLS está activo en las seis tablas. Dos helpers `security definer` en el esquema
`private` resuelven la identidad sin recursión: `is_team()` y `my_client_id()`.

- **Equipo** (perfil con `roles` no vacío) — acceso total a todo.
- **Cliente** (perfil con `client_id`) — solo su ficha, y de sus piezas
  únicamente las `aprobado` / `publicado` o las marcadas `plan_shared`.
  Puede aprobar el plan (`plan_ok`) e insertar eventos `client_note`. Nada más.
  El CRM y los pagos le son invisibles.

Un usuario nuevo entra por trigger a `profiles` **sin roles y sin cliente**:
no ve nada hasta que el equipo lo asigna. Asignación desde el dashboard:

```sql
-- miembro del equipo
update profiles set roles = '{admin,estratega,cuentas}' where id = '<uuid>';

-- usuario de un cliente
update profiles set client_id = 'bambu' where id = '<uuid>';
```

## Migraciones

`migrations/0001_kuadra_os_schema.sql` — ya aplicada al proyecto.
`get_advisors` de seguridad sale limpio (0 hallazgos).
