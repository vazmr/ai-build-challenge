import { useId } from 'react'
import type { ChapterId } from '../../services/passportService'
import { CHAPTER_INK, STAMP_ART } from './stampArt'

const fmt = (iso?: string) =>
  (iso ? new Date(iso) : new Date()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(',', '').toUpperCase()

/** A stable, slightly crooked angle so no two stamps sit the same way (like real, hand-pressed ink). */
const tilt = (id: string) => ((id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 17) - 8)

interface StampProps {
  stopId: string
  chapterId: ChapterId
  chapterName: string
  stampedAt?: string
  /** Plays the press-down animation when it mounts. */
  fresh?: boolean
}

export function Stamp({ stopId, chapterId, chapterName, stampedAt, fresh }: StampProps) {
  const art = STAMP_ART[stopId]
  const uid = useId().replace(/:/g, '')
  if (!art) return null
  const Icon = art.icon
  const date = fmt(stampedAt)
  const text = { fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fill: 'currentColor', fontWeight: 700 } as const

  return (
    <div className={`pp-stamp ${fresh ? 'pp-stamp-fresh' : ''}`} style={{ color: CHAPTER_INK[chapterId], ['--r' as string]: `${tilt(stopId)}deg` }}>
      <svg viewBox="0 0 120 120" role="img" aria-label={`${art.mark} stamp, ${date}`} className="size-full overflow-visible">
        {art.shape === 'round' && (
          <>
            <defs>
              <path id={`${uid}t`} d="M 20,60 A 40,40 0 0 1 100,60" />
              <path id={`${uid}b`} d="M 13,60 A 47,47 0 0 0 107,60" />
            </defs>
            <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3.2" />
            <circle cx="60" cy="60" r="51" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
            <text style={text} fontSize="10" letterSpacing="1.4" textAnchor="middle"><textPath href={`#${uid}t`} startOffset="50%">{art.mark}</textPath></text>
            <text style={text} fontSize="8" letterSpacing="1.2" textAnchor="middle"><textPath href={`#${uid}b`} startOffset="50%">{date}</textPath></text>
            <Icon x={45} y={45} width={30} height={30} strokeWidth={2} />
          </>
        )}
        {art.shape === 'rect' && (
          <>
            <rect x="5" y="22" width="110" height="76" rx="6" fill="none" stroke="currentColor" strokeWidth="3.2" />
            <rect x="10" y="27" width="100" height="66" rx="3" fill="none" stroke="currentColor" strokeWidth="1" />
            <text style={text} x="60" y="40" fontSize="6.5" letterSpacing="1.6" textAnchor="middle">{chapterName.toUpperCase()}</text>
            <line x1="18" x2="102" y1="44" y2="44" stroke="currentColor" strokeWidth="1" />
            <Icon x={47} y={48} width={26} height={26} strokeWidth={2} />
            <text style={text} x="60" y="84" fontSize="10" letterSpacing="1.4" textAnchor="middle">{art.mark}</text>
            <text style={text} x="60" y="91.5" fontSize="5.5" letterSpacing="1.2" textAnchor="middle">{date}</text>
          </>
        )}
        {art.shape === 'oval' && (
          <>
            <ellipse cx="60" cy="60" rx="57" ry="40" fill="none" stroke="currentColor" strokeWidth="3.2" />
            <ellipse cx="60" cy="60" rx="52" ry="35" fill="none" stroke="currentColor" strokeWidth="1" />
            <text style={text} x="60" y="40" fontSize="9.5" letterSpacing="1.6" textAnchor="middle">{art.mark}</text>
            <Icon x={48} y={45} width={24} height={24} strokeWidth={2} />
            <text style={text} x="60" y="83" fontSize="7" letterSpacing="1.4" textAnchor="middle">{date}</text>
          </>
        )}
      </svg>
    </div>
  )
}

/** An empty slot waiting for its stamp: dashed outline and a faint ghost of the icon. */
export function StampSlot({ stopId }: { stopId: string }) {
  const art = STAMP_ART[stopId]
  if (!art) return null
  const Icon = art.icon
  return (
    <div className="pp-slot" aria-hidden>
      <svg viewBox="0 0 120 120" className="size-full">
        {art.shape === 'round' && <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />}
        {art.shape === 'rect' && <rect x="6" y="23" width="108" height="74" rx="6" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />}
        {art.shape === 'oval' && <ellipse cx="60" cy="60" rx="55" ry="38" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />}
        <Icon x={46} y={46} width={28} height={28} strokeWidth={1.6} opacity={0.5} />
      </svg>
    </div>
  )
}

/** Hidden SVG filter shared by every stamp: ragged edges plus uneven, worn ink. Rendered once with the book. */
export function InkFilter() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <filter id="pp-ink" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.4" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="3" seed="9" result="blot" />
          <feColorMatrix in="blot" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 2.35" result="wear" />
          <feComposite in="rough" in2="wear" operator="in" />
        </filter>
      </defs>
    </svg>
  )
}
