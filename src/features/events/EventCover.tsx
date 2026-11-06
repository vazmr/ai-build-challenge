import { useState, type ReactNode } from 'react'
import type { CampusEvent } from '../../types'
import { hashStr, paletteFor } from '../../utils/art'
import { dayNumber, monthAbbr, whenInfo } from '../../utils/eventWhen'
import { CategoryIcon } from './CategoryIcon'

/** Generated, category-themed artwork. Deterministic per event so each card feels distinct. */
function Pattern({ category, seed }: { category: string; seed: string }) {
  const h = hashStr(seed)
  const r = (i: number, max: number) => ((h >> (i % 20)) * (i + 7) + i * 13) % max
  const white = '#fff'
  switch (category) {
    case 'Music & Entertainment':
      return <>{Array.from({ length: 30 }, (_, i) => { const bh = 14 + ((r(i, 9) + i * 5) % 9) * 6; return <rect key={i} x={4 + i * 5.2} y={90 - bh} width="3" height={bh} rx="1.5" fill={white} opacity="0.28" /> })}</>
    case 'Arts & Culture':
      return <>{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={20 + i * 32 + r(i, 10)} cy={25 + r(i + 3, 40)} r={16 + r(i + 5, 20)} fill={white} opacity={0.12 + i * 0.03} />)}</>
    case 'Social':
      return <>{Array.from({ length: 26 }, (_, i) => <circle key={i} cx={r(i, 160)} cy={r(i + 9, 90)} r={1.5 + r(i + 2, 4)} fill={white} opacity="0.35" />)}</>
    case 'Academic':
      return <>{Array.from({ length: 9 }, (_, i) => <line key={i} x1="0" x2="160" y1={8 + i * 10} y2={8 + i * 10} stroke={white} strokeOpacity="0.18" strokeWidth="0.8" />)}{Array.from({ length: 14 }, (_, i) => <line key={`v${i}`} y1="0" y2="90" x1={6 + i * 12} x2={6 + i * 12} stroke={white} strokeOpacity="0.1" strokeWidth="0.8" />)}</>
    case 'Professional':
      return <>{Array.from({ length: 12 }, (_, i) => <rect key={i} x={-20 + i * 18} y="-10" width="7" height="130" fill={white} opacity="0.12" transform="rotate(25 80 45)" />)}</>
    case 'Sports & Recreation':
      return <>{[22, 40, 58, 76].map((rad, i) => <circle key={i} cx="128" cy="62" r={rad} fill="none" stroke={white} strokeOpacity={0.3 - i * 0.05} strokeWidth="3" />)}</>
    case 'Community Service':
      return <><circle cx="120" cy="32" r="14" fill={white} opacity="0.5" /><path d="M0 70 Q 40 48 80 66 T 160 60 V90 H0Z" fill="#000" opacity="0.16" /><path d="M0 80 Q 50 64 100 78 T 160 74 V90 H0Z" fill="#000" opacity="0.22" /></>
    case 'Food & Freebies':
      return <>{[0, 1, 2, 3].map((i) => <circle key={i} cx={30 + i * 38} cy={55 + (i % 2) * 14} r={17} fill="none" stroke={white} strokeOpacity="0.3" strokeWidth="3" />)}{Array.from({ length: 16 }, (_, i) => <circle key={`d${i}`} cx={r(i, 160)} cy={r(i + 4, 40)} r="2" fill={white} opacity="0.3" />)}</>
    default:
      return <circle cx="110" cy="40" r="30" fill={white} opacity="0.15" />
  }
}

export function EventCover({ event, now, height = 'h-36', children, big = false }: { event: CampusEvent; now: Date; height?: string; children?: ReactNode; big?: boolean }) {
  const [a, b] = paletteFor(event.category + event.id.length)
  const when = whenInfo(event.startAt, event.endAt, now)
  const [photoFailed, setPhotoFailed] = useState(false)
  const photo = event.coverUrl && !photoFailed ? event.coverUrl : null
  const hot = when.urgency === 'now' || when.urgency === 'tonight' || when.urgency === 'today'
  return (
    <div className={`relative overflow-hidden ${height}`} style={{ backgroundImage: `linear-gradient(135deg, ${a}, ${b})` }}>
      {photo ? (
        <>
          <img src={photo} alt="" loading="lazy" onError={() => setPhotoFailed(true)} className="absolute inset-0 size-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/25" />
        </>
      ) : (
        <>
          <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden><Pattern category={event.category} seed={event.id} /></svg>
          <CategoryIcon category={event.category} className={`absolute right-3 top-1/2 -translate-y-1/2 text-white/25 ${big ? 'size-32' : 'size-16'}`} />
        </>
      )}
      <div className="absolute left-3 top-3 flex flex-col items-center rounded-xl bg-white px-2.5 py-1 text-center shadow-md">
        <span className="text-xs font-bold leading-tight tracking-wide text-brand">{monthAbbr(event.startAt)}</span>
        <span className={`font-extrabold leading-none text-foreground ${big ? 'text-2xl' : 'text-xl'}`}>{dayNumber(event.startAt)}</span>
      </div>
      <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
        {when.urgency !== 'past' && when.urgency !== 'later' && (
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold shadow ${hot ? 'bg-brand text-white' : 'bg-white text-foreground'}`}>{hot && '🔥 '}{when.label}</span>
        )}
        <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">{event.priceLabel}</span>
      </div>
      {children}
    </div>
  )
}
