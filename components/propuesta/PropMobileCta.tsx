'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { WA_MAIN } from '@/lib/propuesta'

/** Phone-only action bar: planes + WhatsApp, shown once the hero is gone. */
export default function PropMobileCta() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9
      const nearEnd = window.scrollY + window.innerHeight > document.body.scrollHeight - 700
      setShow(past && !nearEnd)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/92 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3">
            <a
              href="#planes"
              className="u-label flex min-h-[52px] flex-1 items-center justify-center gap-2 border border-line text-smoke"
            >
              Planes
            </a>
            <a
              href={WA_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] flex-[1.4] items-center justify-center gap-2 bg-volt text-[15px] font-bold text-ink"
            >
              Escríbenos
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
