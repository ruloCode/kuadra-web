#!/usr/bin/env node
/**
 * Da de alta una cuenta en Kuadra OS.
 *
 * No hay registro abierto: las cuentas se crean aquí, con la service_role,
 * que salta todo el RLS. Por eso la clave vive sólo en .env.local.
 *
 *   node scripts/create-user.mjs --email a@b.com --name "Nombre" --roles admin
 *   node scripts/create-user.mjs --email a@b.com --name "Nombre" --client bambu
 *
 * Un perfil es de equipo (--roles) o de cliente (--client), nunca las dos
 * cosas: la constraint `profiles_client_has_no_roles` lo impide en la base.
 */
import { randomBytes } from 'node:crypto'
import { readFileSync } from 'node:fs'

import { createClient } from '@supabase/supabase-js'

const ROLES = ['admin', 'estratega', 'cuentas', 'editor', 'productor']

function loadEnv(file) {
  try {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    // Sin .env.local: las variables tendrán que venir del entorno.
  }
}

function arg(name) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}

function fail(message) {
  console.error(`\n  ✗ ${message}\n`)
  process.exit(1)
}

loadEnv('.env.local')

const email = arg('email')
const name = arg('name')
const roles = (arg('roles') ?? '').split(',').map((r) => r.trim()).filter(Boolean)
const clientId = arg('client')
const password = arg('password') ?? randomBytes(15).toString('base64url').slice(0, 20)

if (!email || !name) fail('Faltan --email o --name.')
if (roles.length === 0 && !clientId) fail('Indica --roles (equipo) o --client (cliente).')
if (roles.length > 0 && clientId) fail('Un perfil es de equipo o de cliente, no ambos.')

const unknown = roles.filter((r) => !ROLES.includes(r))
if (unknown.length) fail(`Rol desconocido: ${unknown.join(', ')}. Válidos: ${ROLES.join(', ')}`)

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url) fail('Falta NEXT_PUBLIC_SUPABASE_URL.')
if (!serviceKey) {
  fail(
    'Falta SUPABASE_SERVICE_ROLE_KEY en .env.local.\n' +
      '    Se saca del dashboard: Project Settings → API → service_role.',
  )
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { name },
})
if (error) fail(`No se pudo crear la cuenta: ${error.message}`)

// El trigger on_auth_user_created ya insertó el perfil, sin roles ni cliente.
const { error: profileError } = await admin
  .from('profiles')
  .update({ name, roles, client_id: clientId ?? null })
  .eq('id', data.user.id)

if (profileError) {
  fail(
    `La cuenta se creó pero el perfil no quedó bien: ${profileError.message}\n` +
      `    Revisa el perfil ${data.user.id} a mano.`,
  )
}

console.log(`
  ✓ Cuenta creada

    Correo      ${email}
    Contraseña  ${password}
    Perfil      ${roles.length ? `equipo · ${roles.join(', ')}` : `cliente · ${clientId}`}

  Esta contraseña no se vuelve a mostrar. Pásasela por un canal privado
  y pídele que la cambie al entrar.
`)
