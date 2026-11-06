import { hashStr, paletteFor } from '../../utils/art'

const W = '#fff'

/** Six simple patterns, picked per seed, so neighbouring cards read as distinct without real photography. */
function Pattern({ kind, seed }: { kind: number; seed: number }) {
  const r = (i: number, max: number) => ((seed >> (i % 20)) * (i + 7) + i * 13) % max
  switch (kind) {
    case 0: // rings
      return <>{[16, 30, 44, 58].map((rad, i) => <circle key={i} cx={110 + r(1, 30)} cy="42" r={rad} fill="none" stroke={W} strokeOpacity={0.32 - i * 0.06} strokeWidth="3" />)}</>
    case 1: // diagonal bands
      return <>{Array.from({ length: 12 }, (_, i) => <rect key={i} x={-30 + i * 18} y="-20" width="7" height="120" fill={W} opacity="0.13" transform="rotate(25 80 30)" />)}</>
    case 2: // soft dots
      return <>{Array.from({ length: 24 }, (_, i) => <circle key={i} cx={r(i, 160)} cy={r(i + 9, 60)} r={1.5 + r(i + 2, 4)} fill={W} opacity="0.35" />)}</>
    case 3: // waves
      return <><path d="M0 40 Q 40 22 80 38 T 160 34 V60 H0Z" fill="#000" opacity="0.14" /><path d="M0 50 Q 50 36 100 48 T 160 44 V60 H0Z" fill="#000" opacity="0.2" /><circle cx={30 + r(3, 100)} cy="16" r="8" fill={W} opacity="0.45" /></>
    case 4: // grid
      return <>{Array.from({ length: 7 }, (_, i) => <line key={i} x1="0" x2="160" y1={6 + i * 9} y2={6 + i * 9} stroke={W} strokeOpacity="0.18" strokeWidth="0.8" />)}{Array.from({ length: 14 }, (_, i) => <line key={`v${i}`} y1="0" y2="60" x1={6 + i * 12} x2={6 + i * 12} stroke={W} strokeOpacity="0.1" strokeWidth="0.8" />)}</>
    default: // equalizer bars
      return <>{Array.from({ length: 28 }, (_, i) => { const bh = 8 + ((r(i, 9) + i * 5) % 9) * 4; return <rect key={i} x={4 + i * 5.6} y={60 - bh} width="3" height={bh} rx="1.5" fill={W} opacity="0.28" /> })}</>
  }
}

/** Decorative generated banner. Always aria-hidden; the card around it carries the meaning. */
export function CoverArt({ seed, className = 'h-14' }: { seed: string; className?: string }) {
  const h = hashStr(seed)
  const [a, b] = paletteFor(seed)
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundImage: `linear-gradient(${100 + (h % 60)}deg, ${a}, ${b})` }} aria-hidden>
      <svg viewBox="0 0 160 60" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full"><Pattern kind={(h >> 4) % 6} seed={h} /></svg>
    </div>
  )
}
