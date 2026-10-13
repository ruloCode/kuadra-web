'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { NATIVOS, type ProposalCopy } from '@/lib/propuesta'

const Ctx = createContext<ProposalCopy>(NATIVOS)

export function PropuestaProvider({
  value,
  children,
}: {
  value: ProposalCopy
  children: ReactNode
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function usePropuesta() {
  return useContext(Ctx)
}
