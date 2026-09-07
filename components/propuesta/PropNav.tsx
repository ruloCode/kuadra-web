'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useSpring } from 'motion/react'
import Magnetic from '../ui/Magnetic'
import Wordmark from '../ui/Wordmark'
import { CLIENT, WA_MAIN } from '@/lib/propuesta'

const LINKS = [
  { href: '#resultados', label: 'Resultados' },
  { href: '#casos', label: 'Casos' },
  { href: '#metodo', label: 'Método' },
  { href: '#planes', label: 'Planes' },
]

/**
 * Proposal header: wordmark, who the document is for, anchors, and a volt
 * reading-progress rule along the bottom edge that fills as you scroll.
 */
export default function PropNav() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-ink/80 py-3 backdrop-blur-xl' : 'py-5'
      }`}
    >
      <nav className="u-gutter flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Kuadra Film — inicio">
          <Wordmark className="h-5 w-auto shrink-0 text-smoke" />
          <span className="u-label hidden items-center gap-3 text-signal sm:flex">
            <span className="h-px w-5 bg-line" />
            Propuesta
            <span className="hidden text-smoke/70 lg:inline">· {CLIENT.name}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative u-label text-smoke transition-colors hover:text-volt"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-volt transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <Magnetic>
          <a
            href={WA_MAIN}
            target="_blank"
            rel="noopener noreferrer"
            className="u-label inline-flex items-center gap-2 bg-volt px-4 py-3 text-ink transition-colors hover:bg-smoke sm:px-5"
          >
            Escríbenos
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1 9L9 1M9 1H2.5M9 1V7.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </a>
        </Magnetic>
      </nav>

      {/* reading progress — the claqueta strip filling left to right */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-line">
        <motion.div className="h-full w-full origin-left bg-volt" style={{ scaleX: progress }} />
      </div>
    </header>
  )
}
