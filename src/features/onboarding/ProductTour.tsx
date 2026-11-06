import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/shared/ui'
import { TOUR_STEPS, type Placement, type TourStep } from './tourSteps'
import { hasSeenTour, markTourSeen, START_TOUR_EVENT } from './tourStorage'

const PAD = 6
const GAP = 14
const MARGIN = 12
const CARD_W = 340

interface Rect { top: number; left: number; width: number; height: number }

function findTarget(step: TourStep): Rect | null {
  for (const name of step.targets ?? []) {
    for (const el of document.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`)) {
      if (!el.getClientRects().length) continue // display:none variant
      const r = el.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) return { top: r.top, left: r.left, width: r.width, height: r.height }
    }
  }
  return null
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }

/** Desktop card position: first preferred side with room, else whichever side fits, else clamped. */
function placeCard(target: Rect, h: number, prefer: Placement[] = ['right', 'bottom', 'left', 'top']) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const cx = clamp(target.left + target.width / 2 - CARD_W / 2, MARGIN, vw - CARD_W - MARGIN)
  const cy = clamp(target.top + target.height / 2 - h / 2, MARGIN, vh - h - MARGIN)
  const spots: Record<Placement, { top: number; left: number; fits: boolean }> = {
    right: { left: target.left + target.width + PAD + GAP, top: cy, fits: target.left + target.width + PAD + GAP + CARD_W + MARGIN <= vw },
    left: { left: target.left - PAD - GAP - CARD_W, top: cy, fits: target.left - PAD - GAP - CARD_W >= MARGIN },
    bottom: { left: cx, top: target.top + target.height + PAD + GAP, fits: target.top + target.height + PAD + GAP + h + MARGIN <= vh },
    top: { left: cx, top: target.top - PAD - GAP - h, fits: target.top - PAD - GAP - h >= MARGIN },
  }
  const order = [...prefer, ...(['right', 'bottom', 'left', 'top'] as Placement[]).filter((p) => !prefer.includes(p))]
  const pick = order.find((p) => spots[p].fits) ?? order[0]
  return { top: spots[pick].top, left: spots[pick].left }
}

/**
 * First-run product tour. Walks the real UI (navigates to each feature and spotlights its entry point),
 * works as a bottom/top sheet on phones and an anchored popover on desktop. Always skippable,
 * remembered per browser, replayable from Settings.
 */
export function ProductTour() {
  const navigate = useNavigate()
  const [active, setActive] = useState(false)
  const [index, setIndex] = useState(0)
  const [target, setTarget] = useState<Rect | null>(null)
  const [cardH, setCardH] = useState(220)
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  const cardRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  const step = TOUR_STEPS[index]
  const last = index === TOUR_STEPS.length - 1
  const centered = !step.targets || !target

  const begin = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null
    setIndex(0)
    setActive(true)
  }, [])

  const close = useCallback(() => {
    markTourSeen()
    setActive(false)
    navigate('/feed')
    requestAnimationFrame(() => returnFocus.current?.focus?.())
  }, [navigate])

  // First visit: start after the app has settled. Replay: Settings dispatches an event.
  useEffect(() => {
    const t = hasSeenTour() ? undefined : window.setTimeout(begin, 900)
    window.addEventListener(START_TOUR_EVENT, begin)
    return () => {
      if (t) window.clearTimeout(t)
      window.removeEventListener(START_TOUR_EVENT, begin)
    }
  }, [begin])

  // Show the feature behind the spotlight.
  useEffect(() => {
    if (active && step.route) navigate(step.route)
  }, [active, step, navigate])

  // Track the target through resize, scroll and layout changes.
  useLayoutEffect(() => {
    if (!active) return
    const measure = () => {
      setWide(window.matchMedia('(min-width: 768px)').matches)
      setTarget(findTarget(step))
      if (cardRef.current) setCardH(cardRef.current.offsetHeight)
    }
    measure()
    const raf = requestAnimationFrame(measure) // after the route paints
    const t = window.setTimeout(measure, 250)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [active, step])

  // Move focus into the card on every step so screen readers announce it and keys work.
  useEffect(() => {
    if (active) cardRef.current?.focus()
  }, [active, index])

  const next = useCallback(() => (last ? close() : setIndex((i) => i + 1)), [last, close])
  const back = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close() }
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') back()
      else if (e.key === 'Tab' && cardRef.current) {
        const f = cardRef.current.querySelectorAll<HTMLElement>('button:not(:disabled)')
        const first = f[0]
        const lastEl = f[f.length - 1]
        const cur = document.activeElement
        if (e.shiftKey && (cur === first || cur === cardRef.current)) { e.preventDefault(); lastEl.focus() }
        else if (!e.shiftKey && cur === lastEl) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, close, next, back])

  if (!active) return null

  // Phones: a sheet pinned away from the highlighted element (nav is at the bottom, so sheet goes up top).
  const sheetAtTop = !target || target.top + target.height / 2 > window.innerHeight / 2
  let cardStyle: React.CSSProperties
  if (!wide) {
    cardStyle = centered
      ? { left: MARGIN, right: MARGIN, top: '50%', transform: 'translateY(-50%)' }
      : sheetAtTop
        ? { left: MARGIN, right: MARGIN, top: 'calc(3.5rem + 0.75rem)' }
        : { left: MARGIN, right: MARGIN, bottom: 'calc(env(safe-area-inset-bottom) + 5.25rem)' }
  } else if (centered) {
    cardStyle = { left: '50%', top: '50%', width: CARD_W + 40, transform: 'translate(-50%, -50%)' }
  } else {
    cardStyle = { ...placeCard(target, cardH, step.prefer), width: CARD_W }
  }

  return (
    <div className="fixed inset-0 z-[60]" role="presentation">
      {/* Click shield: keeps the page still while the tour is open. */}
      <div className="absolute inset-0" onClick={(e) => e.stopPropagation()} aria-hidden />
      {target ? (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-xl ring-2 ring-white transition-[top,left,width,height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            top: target.top - PAD,
            left: target.left - PAD,
            width: target.width + PAD * 2,
            height: target.height + PAD * 2,
            boxShadow: '0 0 0 100vmax rgb(38 40 43 / 0.62)',
          }}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-foreground/60" />
      )}

      <div
        key={step.id}
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-body"
        tabIndex={-1}
        style={cardStyle}
        className="tour-card fixed max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-2xl outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="tour-title" className="text-lg font-semibold leading-snug">{step.title}</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Skip tour"
            className="-mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <p id="tour-body" className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>

        <div className="mt-5 flex items-center gap-3">
          <p className="mr-auto text-xs font-medium text-muted-foreground" aria-live="polite">
            <span className="sr-only">Step </span>{index + 1} of {TOUR_STEPS.length}
          </p>
          {index === 0 ? (
            <Button variant="ghost" onClick={close} className="min-h-11">Skip tour</Button>
          ) : (
            <Button variant="secondary" onClick={back} className="min-h-11" aria-label="Previous step"><ArrowLeft aria-hidden className="size-4" /> Back</Button>
          )}
          <Button variant="primary" onClick={next} className="min-h-11">
            {index === 0 ? 'Show me around' : last ? 'Start exploring' : 'Next'}
            {!last && <ArrowRight aria-hidden className="size-4" />}
          </Button>
        </div>
        <div className="mt-4 flex gap-1" aria-hidden>
          {TOUR_STEPS.map((s, i) => (
            <span key={s.id} className={`h-1 flex-1 rounded-full transition-colors ${i <= index ? 'bg-brand' : 'bg-border'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
