import { Disc3, Play } from 'lucide-react'
import { hashStr, paletteFor } from '../../utils/art'

type Kind = 'photo' | 'album' | 'video' | 'audio'

/** Generated placeholder artwork (no real media in the prototype). Deterministic per seed. */
export function MediaArt({ kind, seed, label }: { kind: Kind; seed: string; label: string }) {
  const [a, b] = paletteFor(seed)
  const h = hashStr(seed)
  const sunX = 20 + (h % 60)
  const gid = `g-${seed}`

  const scene = (x: number, w: number) => (
    <g transform={`translate(${x} 0)`}>
      <rect width={w} height="100" fill={`url(#${gid})`} />
      <circle cx={w * (sunX / 100)} cy="32" r="10" fill="#fff" opacity="0.85" />
      <path d={`M0 78 Q ${w * 0.25} ${58 + (h % 12)} ${w * 0.5} 74 T ${w} 70 V100 H0Z`} fill="#000" opacity="0.22" />
      <path d={`M0 88 Q ${w * 0.3} 72 ${w * 0.6} 86 T ${w} 82 V100 H0Z`} fill="#000" opacity="0.32" />
    </g>
  )

  return (
    <div role="img" aria-label={`${label} (generated placeholder)`} className="relative mt-3 overflow-hidden rounded-xl">
      <svg viewBox={kind === 'album' ? '0 0 160 100' : '0 0 160 100'} preserveAspectRatio="xMidYMid slice" className="block h-48 w-full sm:h-56">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
        </defs>
        {kind === 'album' ? (<>{scene(0, 78)}{scene(82, 78)}</>) : kind === 'audio' ? (
          <>
            <rect width="160" height="100" fill={`url(#${gid})`} />
            {Array.from({ length: 36 }, (_, i) => {
              const hh = 12 + ((h >> (i % 12)) % 7) * 7 + (i % 5) * 4
              return <rect key={i} x={8 + i * 4.2} y={50 - hh / 2} width="2.4" height={hh} rx="1.2" fill="#fff" opacity="0.85" />
            })}
          </>
        ) : scene(0, 160)}
      </svg>
      {kind === 'video' && <span className="absolute inset-0 flex items-center justify-center"><span className="flex size-14 items-center justify-center rounded-full bg-black/55 text-white"><Play aria-hidden className="size-7 translate-x-0.5" /></span></span>}
      {kind === 'audio' && <Disc3 aria-hidden className="absolute left-3 top-3 size-6 text-white/90" />}
      <span className="absolute bottom-2 left-2 rounded-md bg-black/55 px-2 py-0.5 text-xs text-white">{label}</span>
    </div>
  )
}
