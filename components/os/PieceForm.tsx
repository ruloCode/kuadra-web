'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { Btn, Field } from '@/components/os/ui'
import { createPiece, updatePiece, type PieceFormState } from '@/lib/os/actions/pieces'
import type { PieceRow } from '@/lib/os/database.types'
import { STATUSES } from '@/lib/os/domain'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <Btn type="submit" variant="solid" disabled={pending}>
      {pending ? 'Guardando…' : 'Guardar'}
    </Btn>
  )
}

export function PieceForm({
  clientId,
  piece,
  defaultDate,
  team,
  onDone,
  onCancel,
}: {
  clientId: string
  piece: PieceRow | null
  defaultDate: string
  team: { id: string; name: string }[]
  onDone: () => void
  onCancel: () => void
}) {
  const action = piece
    ? updatePiece.bind(null, piece.id)
    : createPiece.bind(null, clientId)

  const [state, formAction] = useActionState<PieceFormState, FormData>(
    async (prev, data) => {
      const result = await action(prev, data)
      if (!result.error) onDone()
      return result
    },
    { error: null },
  )

  return (
    <form action={formAction} className="grid gap-4">
      <Field label="Título">
        <input
          name="title"
          defaultValue={piece?.title ?? ''}
          required
          placeholder="Ej: Tour del cuarto 3"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Publicar el">
          <input
            name="scheduled_date"
            type="date"
            required
            defaultValue={piece?.scheduled_date ?? defaultDate}
          />
        </Field>
        <Field label="Hora sugerida">
          <input
            name="publish_time"
            defaultValue={piece?.publish_time ?? '6:00 pm'}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Plataforma">
          <select name="platform" defaultValue={piece?.platform ?? 'both'}>
            <option value="ig">Instagram</option>
            <option value="tt">TikTok</option>
            <option value="both">Ambas</option>
          </select>
        </Field>
        <Field label="Tipo">
          <select name="piece_type" defaultValue={piece?.piece_type ?? 'reel'}>
            <option value="reel">Reel</option>
            <option value="carrusel">Carrusel</option>
          </select>
        </Field>
      </div>

      <Field label="Link de Drive" hint="También sirve la URL directa de un mp4 o una imagen.">
        <input
          name="link"
          defaultValue={piece?.link ?? ''}
          placeholder="https://drive.google.com/file/d/…/view"
        />
      </Field>

      <Field label="Copy">
        <textarea name="copy" defaultValue={piece?.copy ?? ''} />
      </Field>

      <Field label="Hashtags">
        <input name="hashtags" defaultValue={piece?.hashtags ?? ''} />
      </Field>

      <Field label="Guion / plan de tomas" hint="Interno, salvo que compartas el plan abajo.">
        <textarea
          name="guion"
          defaultValue={piece?.guion ?? ''}
          className="min-h-[120px]"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Estado">
          <select name="status" defaultValue={piece?.status ?? 'grabar'}>
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Responsable">
          <select name="assignee" defaultValue={piece?.assignee ?? ''}>
            <option value="">— sin asignar —</option>
            {team.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Fecha límite interna" hint="Cuándo tiene que estar lista la edición.">
        <input name="due" type="date" defaultValue={piece?.due ?? ''} />
      </Field>

      <label className="flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          name="plan_shared"
          defaultChecked={piece?.plan_shared ?? false}
          className="size-4 w-auto"
        />
        Compartir el guion con el cliente en «Plan del próximo mes»
      </label>

      {state.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <div className="flex gap-2 pt-2">
        <Submit />
        <Btn type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Btn>
      </div>
    </form>
  )
}
