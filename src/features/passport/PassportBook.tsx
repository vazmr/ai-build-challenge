import { ArrowRight, ChevronLeft, ChevronRight, Compass, Lock, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Avatar } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { getPassport, type PassportChapter, type PassportStop, type PassportView } from '../../services/passportService'
import { hashStr } from '../../utils/art'
import { markStamped, useStampDates } from './passportStore'
import { InkFilter, Stamp, StampSlot } from './Stamp'
import { CHAPTER_INK, STAMP_ART } from './stampArt'
import './passport.css'

/* Sheets 0..5 (front/back each). Spread f shows the back of sheet f-1 on the left and the front of sheet f on the right.
   0 cover | 1 holder + route | 2..5 chapter intro + stamps | 6 final page + back cover */
const SHEETS = 6
const SPREAD_LABELS = ['Cover', 'Holder & route', 'Arrival', 'Showing up', 'Belonging', 'Building together', 'Final page']
const FLIP_MS = 900
const STAGGER_MS = 85
const chapterSpread = (chapterIndex: number) => chapterIndex + 2

const narrowQuery = '(max-width: 639px)'
const useNarrow = () =>
  useSyncExternalStore(
    (cb) => { const m = window.matchMedia(narrowQuery); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb) },
    () => window.matchMedia(narrowQuery).matches,
    () => false,
  )

type Side = 'left' | 'right'
interface Pos { f: number; side: Side }
/** On narrow screens the book is read one page at a time: (0,right) cover, (1,left), (1,right), (2,left)... */
const narrowSeq: Pos[] = [{ f: 0, side: 'right' }, ...Array.from({ length: SHEETS }, (_, i) => i + 1).flatMap<Pos>((f) => (f === SHEETS ? [{ f, side: 'left' }] : [{ f, side: 'left' }, { f, side: 'right' }]))]

export function PassportBook({ onClose }: { onClose: () => void }) {
  const { state, activeStudent } = useAppState()
  const narrow = useNarrow()
  const passport = getPassport(state, activeStudent.id)
  const dates = useStampDates(activeStudent.id)

  const [pos, setPos] = useState<Pos>({ f: 0, side: 'right' })
  const [move, setMove] = useState<{ from: number; to: number } | null>(null)
  const [closing, setClosing] = useState(false)
  const [thud, setThud] = useState<string | null>(null)
  const posRef = useRef(pos)
  posRef.current = pos
  const timers = useRef<number[]>([])
  const autoplay = useRef(true)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Stamps earned since the student last looked. The first few are inked live; the rest just appear.
  const [queue] = useState(() => {
    const unseen = passport.stops.filter((s) => s.earned && !dates[s.id])
    return { live: unseen.slice(0, 4).map((s) => s.id), quiet: unseen.slice(4).map((s) => s.id) }
  })

  const later = useCallback((fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }, [])

  const goTo = useCallback((next: Pos) => {
    const cur = posRef.current
    if (next.f === cur.f && next.side === cur.side) return
    if (next.f !== cur.f) {
      setMove({ from: cur.f, to: next.f })
      later(() => setMove(null), FLIP_MS + STAGGER_MS * Math.abs(next.f - cur.f) + 60)
    }
    setPos(next)
  }, [later])

  const stopAutoplay = () => {
    if (!autoplay.current) return
    autoplay.current = false
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }

  const step = (dir: 1 | -1) => {
    stopAutoplay()
    if (narrow) {
      const i = narrowSeq.findIndex((p) => p.f === pos.f && p.side === pos.side)
      const nxt = narrowSeq[i + dir]
      if (nxt) goTo(nxt)
    } else {
      const f = pos.f + dir
      if (f >= 0 && f <= SHEETS) goTo({ f, side: 'right' })
    }
  }
  const jump = (f: number) => { stopAutoplay(); goTo({ f, side: f === 1 ? 'left' : 'right' }) }

  const close = useCallback(() => {
    if (closing) return
    stopAutoplay()
    setClosing(true)
    goTo({ f: 0, side: 'right' })
    window.setTimeout(onClose, FLIP_MS + STAGGER_MS * posRef.current.f + 260)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing, goTo, onClose])

  /* Opening sequence: cover swings open, the book riffles to where the student left off, then new stamps land one by one. */
  useEffect(() => {
    const sid = activeStudent.id
    queue.quiet.forEach((id) => markStamped(sid, id))
    const chapterOf = (stopId: string) => passport.chapters.findIndex((c) => c.stops.some((x) => x.id === stopId))
    const startChapter = queue.live.length ? chapterOf(queue.live[0]) : passport.next ? chapterOf(passport.next.id) : -1
    const startF = startChapter >= 0 ? chapterSpread(startChapter) : passport.complete ? SHEETS : 1
    let t = 380
    later(() => goTo({ f: startF, side: startF === 1 ? 'left' : 'right' }), t)
    t += FLIP_MS + STAGGER_MS * startF + 380
    let at = startF
    for (const id of queue.live) {
      const f = chapterSpread(chapterOf(id))
      if (f !== at) { const target = f; later(() => goTo({ f: target, side: 'right' }), t); t += FLIP_MS + 420; at = f }
      later(() => { markStamped(sid, id); setThud(id); later(() => setThud(null), 260) }, t)
      t += 1000
    }
    const pending = timers.current
    return () => { pending.forEach(window.clearTimeout); timers.current = [] }
    // Run once on open; the queue is fixed at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keyboard, focus trap, scroll lock.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => { document.body.style.overflow = prev }
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close() }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
    else if (e.key === 'Tab') {
      const nodes = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]):not([tabindex="-1"])') ?? []).filter((n) => !n.closest('[inert]'))
      if (!nodes.length) return
      const first = nodes[0], last = nodes[nodes.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }

  const f = pos.f

  const sheets: [ReactNode, ReactNode][] = [
    [<Cover key="c" passport={passport} />, <HolderPage key="h" passport={passport} />],
    [<RoutePage key="r" passport={passport} onJump={jump} onNavigate={onClose} />, <ChapterIntro key="i0" chapter={passport.chapters[0]} />],
    [<StampsPage key="s0" chapter={passport.chapters[0]} dates={dates} live={queue.live} onNavigate={onClose} />, <ChapterIntro key="i1" chapter={passport.chapters[1]} />],
    [<StampsPage key="s1" chapter={passport.chapters[1]} dates={dates} live={queue.live} onNavigate={onClose} />, <ChapterIntro key="i2" chapter={passport.chapters[2]} />],
    [<StampsPage key="s2" chapter={passport.chapters[2]} dates={dates} live={queue.live} onNavigate={onClose} />, <ChapterIntro key="i3" chapter={passport.chapters[3]} />],
    [<StampsPage key="s3" chapter={passport.chapters[3]} dates={dates} live={queue.live} onNavigate={onClose} />, <FinalPage key="f" passport={passport} onNavigate={onClose} />],
  ]

  // Narrow: the window shows one half. Right half = -50% of the stage, left half = 0.
  const shift = narrow ? (pos.side === 'right' ? '-50%' : '0%') : f === 0 ? '-25%' : '0%'
  const narrowIdx = narrowSeq.findIndex((p) => p.f === pos.f && p.side === pos.side)
  const atStart = narrow ? narrowIdx <= 0 : f === 0
  const atEnd = narrow ? narrowIdx >= narrowSeq.length - 1 : f === SHEETS

  return createPortal(
    <div className="pp-root fixed inset-0 z-[70]" data-narrow={narrow} onKeyDown={onKeyDown}>
      <div className="pp-overlay absolute inset-0 overflow-hidden backdrop-blur-[3px]" data-closing={closing}
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(62,44,40,.95) 0%, rgba(24,16,14,.97) 75%)' }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}>
        <InkFilter />
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Your Student Passport" tabIndex={-1}
          className="flex h-full flex-col items-center justify-center gap-7 px-4 pb-4 pt-14 outline-none"
          onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}>
          <button type="button" onClick={close} aria-label="Close passport"
            className="absolute right-3 top-3 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20">
            <X aria-hidden className="size-4" /> Close
          </button>

          <div className="pp-window" style={{ '--shift': shift } as CSSProperties}>
            <div className="pp-ground" style={{ opacity: f === 0 ? 0.55 : 0.9, transform: f === 0 ? 'scaleX(.55)' : 'scaleX(1)' }} aria-hidden />
            <div className="pp-stage" data-open={f > 0} style={{ '--shift': shift, '--right-stack': f >= SHEETS ? 0 : 1, '--left-stack': f > 0 ? 1 : 0 } as CSSProperties}>
              <div className="pp-leftstack" aria-hidden />
              <div className="pp-base" aria-hidden>
                <div className="absolute inset-0 grid place-items-center text-[#f3dd95]/70"><Compass className="size-10" aria-hidden /></div>
              </div>
              {sheets.map(([front, back], s) => {
                const flipped = s < f
                const moving = move && ((move.from < move.to && s >= move.from && s < move.to) || (move.from > move.to && s >= move.to && s < move.from))
                const order = !move ? 0 : move.from < move.to ? s - move.from : move.from - 1 - s
                const delay = moving ? order * STAGGER_MS : 0
                const frontVisible = !flipped && s === f && (!narrow || pos.side === 'right')
                const backVisible = flipped && s === f - 1 && (!narrow || pos.side === 'left')
                return (
                  <div key={s} className="pp-sheet" data-moving={!!moving} style={{
                    zIndex: flipped ? s + 1 : SHEETS - s,
                    transform: `rotateY(${flipped ? -180 : 0}deg)`,
                    transition: `transform ${FLIP_MS}ms var(--flip-ease) ${delay}ms, z-index 0s linear ${delay + FLIP_MS / 2}ms`,
                    '--delay': `${delay}ms`,
                  } as CSSProperties}>
                    <div className={`pp-face pp-front ${s === 0 ? '' : 'pp-paper'} ${thud && frontVisible ? 'pp-thud' : ''}`} inert={!frontVisible} aria-hidden={!frontVisible}>
                      {front}
                      {s > 0 && <button type="button" tabIndex={-1} aria-hidden className="pp-peel" onClick={() => step(1)} />}
                    </div>
                    <div className={`pp-face pp-back pp-paper ${thud && backVisible ? 'pp-thud' : ''}`} inert={!backVisible} aria-hidden={!backVisible}>
                      {back}
                      <button type="button" tabIndex={-1} aria-hidden className="pp-peel" onClick={() => step(-1)} />
                    </div>
                  </div>
                )
              })}
              <div className="pp-gutter" style={{ opacity: f === 0 ? 0 : 1 }} aria-hidden />
            </div>
          </div>

          <nav aria-label="Passport pages" className="flex flex-col items-center gap-3 text-white">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => step(-1)} disabled={atStart || closing} aria-label="Previous page" className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"><ChevronLeft aria-hidden className="size-5" /></button>
              <ol className="flex items-center gap-1.5">
                {SPREAD_LABELS.map((label, i) => (
                  <li key={label}>
                    <button type="button" onClick={() => jump(i)} aria-label={label} aria-current={i === f ? 'page' : undefined}
                      className="grid size-7 place-items-center rounded-full">
                      <span className={`block rounded-full transition-all ${i === f ? 'h-2.5 w-6 bg-white' : 'size-2 bg-white/40'}`} />
                    </button>
                  </li>
                ))}
              </ol>
              <button type="button" onClick={() => step(1)} disabled={atEnd || closing} aria-label="Next page" className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"><ChevronRight aria-hidden className="size-5" /></button>
            </div>
            <p aria-live="polite" className="text-xs font-medium tracking-wide text-white/75">{SPREAD_LABELS[f]} · {passport.earned} of {passport.total} stamps</p>
          </nav>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/* ---------------------------------- Pages ---------------------------------- */

const mono = 'font-[ui-monospace,SFMono-Regular,Menlo,monospace]'
const label = `${mono} text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--paper-mute)]`

function Cover({ passport }: { passport: PassportView }) {
  return (
    <div className="pp-cover">
      <div className="pp-cover-frame" />
      <div className="relative flex h-full flex-col items-center px-8 pb-8 pt-10 text-center">
        <p className={`${mono} pp-foil pp-emboss text-[10px] font-bold uppercase tracking-[0.34em]`}>Temple Student Hub</p>
        <div className="pp-emboss mt-6 grid size-24 place-items-center rounded-full border border-[#f3dd95]/60">
          <div className="grid size-[4.9rem] place-items-center rounded-full border border-[#f3dd95]/40"><Compass aria-hidden className="size-11" strokeWidth={1.4} /></div>
        </div>
        <h2 className="pp-foil pp-emboss mt-6 font-display text-[2rem] font-bold uppercase leading-none tracking-[0.12em]">Student<br />Passport</h2>
        <p className={`${mono} mt-3 text-[9px] uppercase tracking-[0.3em] text-[#f3dd95]/80`}>Find your people</p>
        <svg viewBox="0 0 28 20" className="pp-emboss mt-auto h-6 text-[#f3dd95]" aria-hidden><rect x="1" y="1" width="26" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="14" cy="10" r="4" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M1 10h9M18 10h9" stroke="currentColor" strokeWidth="1.4" /></svg>
        <p className={`${mono} mt-3 text-[9px] uppercase tracking-[0.2em] text-[#f3dd95]/75`}>{passport.earned} / {passport.total} stamps</p>
      </div>
    </div>
  )
}

function HolderPage({ passport }: { passport: PassportView }) {
  const { activeStudent: s } = useAppState()
  const no = `TSH-${(hashStr(s.id) % 9000000 + 1000000)}`
  const name = s.displayName.toUpperCase().replace(/[^A-Z]/g, '<')
  const mrz1 = `P<TSH${name}<<<<<<<<<<<<<<<<<<<<<<<<<`.slice(0, 30)
  const mrz2 = `${no.replace('-', '')}<${(s.classYear ?? '0000')}<<${passport.earned.toString().padStart(2, '0')}<<<<<<<<<<<<<<<`.slice(0, 30)
  return (
    <div className="flex h-full flex-col p-5 pl-6">
      <p className={label}>Holder · Titulaire</p>
      <div className="mt-3 flex gap-4">
        <div className="grid size-[5.6rem] shrink-0 place-items-center overflow-hidden rounded-sm border border-[var(--paper-rule)] bg-white/50 p-1"><Avatar name={s.displayName} size={82} /></div>
        <dl className="min-w-0 space-y-2 text-[12px]">
          <div><dt className={label}>Name</dt><dd className="truncate font-display text-lg font-bold leading-tight">{s.displayName}</dd></div>
          <div><dt className={label}>Program</dt><dd className="truncate">{s.major ?? 'Undeclared'}</dd></div>
          <div><dt className={label}>College</dt><dd className="truncate">{s.college ?? 'Temple University'}</dd></div>
        </dl>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-[12px]">
        <div><dt className={label}>Class of</dt><dd className="font-semibold">{s.classYear ?? '—'}</dd></div>
        <div><dt className={label}>Passport no.</dt><dd className={`${mono} font-semibold`}>{no}</dd></div>
        <div><dt className={label}>Stamps</dt><dd className="font-semibold tabular">{passport.earned} of {passport.total}</dd></div>
        <div><dt className={label}>Chapters done</dt><dd className="font-semibold tabular">{passport.chapters.filter((c) => c.earned === c.stops.length).length} of {passport.chapters.length}</dd></div>
      </dl>
      <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-snug text-[var(--paper-mute)]"><Lock aria-hidden className="mt-0.5 size-3 shrink-0" /> Private to you. Nobody else can see your passport, and stamps are never ranked or counted for anyone but you.</p>
      <div className="mt-auto">
        <p className="mb-2 text-[10px] leading-snug text-[var(--paper-mute)]">Demo passport with fictional data. Not an official Temple document.</p>
        <div className={`${mono} select-none break-all rounded-sm bg-black/[0.045] px-2 py-1.5 text-[11px] leading-[1.35] tracking-[0.04em] text-[var(--paper-ink)]/80`} aria-hidden>{mrz1}<br />{mrz2}</div>
      </div>
    </div>
  )
}

function RoutePage({ passport, onJump, onNavigate }: { passport: PassportView; onJump: (f: number) => void; onNavigate: () => void }) {
  const next = passport.next
  return (
    <div className="flex h-full flex-col p-5 pr-6">
      <p className={label}>Your route</p>
      <h3 className="mt-1 font-display text-xl font-bold leading-tight">Four stops, from curious to connected</h3>
      <ol className="relative mt-4 space-y-3">
        <span aria-hidden className="absolute bottom-4 left-[0.95rem] top-4 border-l-2 border-dashed border-[var(--paper-rule)]" />
        {passport.chapters.map((c, i) => (
          <li key={c.id} className="relative">
            <button type="button" onClick={() => onJump(chapterSpread(i))} className="flex w-full items-center gap-3 rounded-lg p-1 text-left hover:bg-black/[0.04]">
              <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 bg-[var(--paper)] font-display text-sm font-bold" style={{ borderColor: CHAPTER_INK[c.id], color: CHAPTER_INK[c.id] }}>{c.number}</span>
              <span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold leading-tight">{c.name}</span><span className="block text-[11px] text-[var(--paper-mute)]">{c.tagline}</span></span>
              <span className={`${mono} text-[11px] font-bold tabular`} style={{ color: CHAPTER_INK[c.id] }}>{c.earned}/{c.stops.length}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-auto rounded-lg border border-dashed border-[var(--paper-rule)] bg-white/40 p-3">
        {next ? (
          <>
            <p className={label}>Next stop</p>
            <p className="mt-1 text-[13px] font-semibold leading-tight">{next.title}</p>
            <p className="text-[11.5px] leading-snug text-[var(--paper-mute)]">{next.how}</p>
            <Link to={next.to} onClick={onNavigate} className="mt-2 inline-flex min-h-9 items-center gap-1 text-[12px] font-bold text-brand hover:underline">{next.cta} <ArrowRight aria-hidden className="size-3.5" /></Link>
          </>
        ) : (
          <p className="text-[12.5px] font-semibold">Every stop stamped. Bring someone along to their first one.</p>
        )}
      </div>
    </div>
  )
}

function ChapterIntro({ chapter }: { chapter: PassportChapter }) {
  const ink = CHAPTER_INK[chapter.id]
  const Icon = STAMP_ART[chapter.stops[0].id].icon
  return (
    <div className="relative flex h-full flex-col overflow-hidden p-5 pl-6 pr-7">
      <Icon aria-hidden className="absolute -right-6 bottom-8 size-44 opacity-[0.06]" style={{ color: ink }} strokeWidth={1} />
      <p className={label}>Chapter {chapter.number} of 4</p>
      <p className="mt-3 font-display text-[4.2rem] font-bold leading-none" style={{ color: ink }} aria-hidden>{String(chapter.number).padStart(2, '0')}</p>
      <h3 className="mt-2 font-display text-2xl font-bold leading-tight">{chapter.name}</h3>
      <p className="mt-0.5 text-[12.5px] font-semibold" style={{ color: ink }}>{chapter.tagline}</p>
      <p className="mt-4 text-[12.5px] leading-relaxed text-[var(--paper-ink)]/85">{chapter.why}</p>
      <div className="mt-auto flex items-center gap-1.5" role="img" aria-label={`${chapter.earned} of ${chapter.stops.length} stamps in this chapter`}>
        {chapter.stops.map((x) => <span key={x.id} className="h-1.5 flex-1 rounded-full" style={{ background: x.earned ? ink : 'var(--paper-rule)' }} />)}
        <span className={`${mono} ml-1 text-[11px] font-bold tabular`} style={{ color: ink }}>{chapter.earned}/{chapter.stops.length}</span>
      </div>
    </div>
  )
}

function StampsPage({ chapter, dates, live, onNavigate }: { chapter: PassportChapter; dates: Record<string, string>; live: string[]; onNavigate: () => void }) {
  return (
    <div className="flex h-full flex-col p-5 pr-6">
      <p className={label}>{chapter.name} · Stamps</p>
      <ul className="mt-3 flex flex-1 flex-col justify-evenly gap-2">
        {chapter.stops.map((stop) => <StopRow key={stop.id} stop={stop} chapter={chapter} stampedAt={dates[stop.id]} fresh={live.includes(stop.id)} onNavigate={onNavigate} />)}
      </ul>
    </div>
  )
}

function StopRow({ stop, chapter, stampedAt, fresh, onNavigate }: { stop: PassportStop; chapter: PassportChapter; stampedAt?: string; fresh: boolean; onNavigate: () => void }) {
  // An earned stop only shows ink once it has been stamped (so new ones can land with the animation).
  const inked = stop.earned && !!stampedAt
  return (
    <li className="flex items-center gap-3">
      <div className="w-[4.7rem] shrink-0">
        {inked ? <Stamp stopId={stop.id} chapterId={stop.chapterId} chapterName={chapter.name} stampedAt={stampedAt} fresh={fresh} /> : <StampSlot stopId={stop.id} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold leading-tight">{stop.title}</p>
        <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--paper-mute)]">{stop.how}</p>
        {inked ? (
          <p className={`${mono} mt-1 text-[10px] font-bold uppercase tracking-wider`} style={{ color: CHAPTER_INK[stop.chapterId] }}>✓ Stamped</p>
        ) : (
          <div className="mt-0.5 flex items-center gap-2">
            {stop.need > 1 && <span className={`${mono} text-[10px] font-bold tabular text-[var(--paper-mute)]`}>{stop.have}/{stop.need}</span>}
            <Link to={stop.to} onClick={onNavigate} className="inline-flex min-h-8 items-center gap-1 text-[12px] font-bold text-brand hover:underline">{stop.cta} <ArrowRight aria-hidden className="size-3" /></Link>
          </div>
        )}
      </div>
    </li>
  )
}

function FinalPage({ passport, onNavigate }: { passport: PassportView; onNavigate: () => void }) {
  const left = passport.total - passport.earned
  return (
    <div className="flex h-full flex-col items-center p-5 pl-6 pr-7 text-center">
      <p className={`${label} self-start`}>Final page</p>
      <div className="mt-6 grid size-32 place-items-center">
        <div className={`${passport.complete ? 'pp-seal' : 'bg-[var(--paper-rule)]'} grid size-32 place-items-center rounded-full`}>
          <div className="grid size-[7.4rem] place-items-center rounded-full border-2 border-dashed border-black/25 bg-[var(--paper)] text-center">
            <div><p className="font-display text-3xl font-bold leading-none tabular">{passport.earned}<span className="text-lg text-[var(--paper-mute)]">/{passport.total}</span></p><p className={`${mono} mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--paper-mute)]`}>{passport.complete ? 'Full pass' : 'Stamps'}</p></div>
          </div>
        </div>
      </div>
      <h3 className="mt-5 font-display text-xl font-bold leading-tight">{passport.complete ? 'You’ve made your way around' : `${left} ${left === 1 ? 'stamp' : 'stamps'} to go`}</h3>
      <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--paper-ink)]/85">
        {passport.complete ? 'Every stop is stamped. The best next stop is someone else’s first: invite a classmate to an event or a project.' : 'Stamps come from doing things with other people, so there is no rush and nothing expires. Pick the next one that sounds fun.'}
      </p>
      {passport.next && <Link to={passport.next.to} onClick={onNavigate} className="mt-auto inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">{passport.next.cta} <ArrowRight aria-hidden className="size-4" /></Link>}
    </div>
  )
}
