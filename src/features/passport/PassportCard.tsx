import { Compass } from 'lucide-react'
import { lazy, Suspense, useRef, useState } from 'react'
import { Card } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { getPassport } from '../../services/passportService'
import { useStampDates } from './passportStore'
import { CHAPTER_INK } from './stampArt'
import './passport.css'

// The book (3D pages, stamps, ink filter) only loads when someone opens it.
const PassportBook = lazy(() => import('./PassportBook').then((m) => ({ default: m.PassportBook })))

/**
 * Closed passport shown in the feed. Tilts open on hover; a click opens the full book in an overlay.
 * Private to the signed-in student and derived entirely from their own activity.
 */
export function PassportCard({ className = '' }: { className?: string }) {
  const { state, activeStudent } = useAppState()
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const dates = useStampDates(activeStudent.id)
  const passport = getPassport(state, activeStudent.id)
  const fresh = passport.stops.filter((s) => s.earned && !dates[s.id]).length

  const close = () => { setOpen(false); window.setTimeout(() => trigger.current?.focus(), 0) }

  return (
    <section aria-label="Student Passport" className={className}>
      <Card className="p-3">
        <button ref={trigger} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog"
          className="flex w-full items-center gap-4 rounded-xl text-left">
          <span className="pp-mini" aria-hidden>
            <span className="pp-mini-block">
              <span className="pp-mini-pages" />
              <span className="pp-mini-cover">
                <span className="absolute inset-[5px] rounded-[3px] border border-[#f3dd95]/45" />
                <span className="relative flex h-full flex-col items-center justify-center gap-1.5 pl-1">
                  <Compass className="size-6" strokeWidth={1.4} />
                  <span className="pp-foil font-display text-[0.62rem] font-bold uppercase leading-tight tracking-[0.14em]">Student<br />Passport</span>
                </span>
              </span>
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold">Your Passport</span>
              {fresh > 0 && <span className="pp-newdot rounded-full bg-brand px-2 py-0.5 text-[0.65rem] font-bold text-brand-foreground">{fresh} new</span>}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground tabular">{passport.earned} of {passport.total} stamps</span>
            <span className="mt-2 flex gap-[3px]" role="img" aria-label={`${passport.earned} of ${passport.total} stamps collected`}>
              {passport.stops.map((s) => <span key={s.id} className="h-1.5 flex-1 rounded-full" style={{ background: s.earned ? CHAPTER_INK[s.chapterId] : 'var(--color-border)' }} />)}
            </span>
            <span className="mt-2 block truncate text-xs">
              {passport.next ? <><span className="text-muted-foreground">Next stop: </span><span className="font-medium">{passport.next.title}</span></> : <span className="font-medium">Every stop stamped</span>}
            </span>
            <span className="mt-1 inline-block text-xs font-semibold text-brand">Open passport</span>
          </span>
        </button>
      </Card>
      {open && <Suspense fallback={null}><PassportBook onClose={close} /></Suspense>}
    </section>
  )
}
