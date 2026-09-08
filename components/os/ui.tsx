import { clsx } from 'clsx'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type BtnVariant = 'solid' | 'outline' | 'ghost' | 'danger'

const VARIANTS: Record<BtnVariant, string> = {
  solid: 'bg-volt text-ink border-volt hover:bg-[#d9ff3d]',
  outline: 'border-volt text-volt hover:bg-volt hover:text-ink',
  ghost: 'border-line text-smoke/80 hover:border-smoke/60 hover:text-smoke',
  danger: 'border-danger text-danger hover:bg-danger hover:text-white',
}

function btnClass(variant: BtnVariant, small: boolean, className?: string) {
  return clsx(
    'inline-flex items-center gap-1.5 rounded border-[1.5px] font-bold whitespace-nowrap transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    small ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm',
    VARIANTS[variant],
    className,
  )
}

export function Btn({
  variant = 'outline',
  small = false,
  className,
  ...props
}: ComponentProps<'button'> & { variant?: BtnVariant; small?: boolean }) {
  return <button {...props} className={btnClass(variant, small, className)} />
}

/** Mismo aspecto que Btn, pero navega. Un enlace no debe ser un <button>. */
export function BtnLink({
  variant = 'outline',
  small = false,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: BtnVariant; small?: boolean }) {
  return <Link {...props} className={btnClass(variant, small, className)} />
}

/** Etiqueta de sección: mayúsculas espaciadas, como el HUD de una cámara. */
export function Label({ children }: { children: ReactNode }) {
  return <div className="u-label flex items-center gap-2">{children}</div>
}

/** El punto de grabación de la marca. */
export function Rec({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={clsx('u-rec inline-block size-2.5 rounded-full bg-volt', className)}
    />
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="u-label mb-1.5 block">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-signal">{hint}</span> : null}
    </label>
  )
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded border border-line bg-carbon p-8 text-center">
      <h3 className="u-display mb-2 text-base">{title}</h3>
      {children ? <p className="text-sm text-signal">{children}</p> : null}
    </div>
  )
}

export function Stat({
  value,
  label,
  tone = 'volt',
}: {
  value: ReactNode
  label: string
  tone?: 'volt' | 'amber' | 'danger' | 'smoke'
}) {
  return (
    <div className="border border-line bg-carbon px-4 py-3.5">
      <div
        className={clsx(
          'u-display u-tabular text-3xl leading-none',
          tone === 'volt' && 'text-volt',
          tone === 'amber' && 'text-amber',
          tone === 'danger' && 'text-danger',
          tone === 'smoke' && 'text-smoke',
        )}
      >
        {value}
      </div>
      <div className="mt-1.5 text-sm text-smoke/75">{label}</div>
    </div>
  )
}
