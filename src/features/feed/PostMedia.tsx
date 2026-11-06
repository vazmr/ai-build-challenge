import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { MediaArt } from '../../components/shared/MediaArt'
import type { Post } from '../../types'

const fmt = (t: number) => (Number.isFinite(t) ? `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}` : '0:00')

/** Real photo with graceful fallback to generated art if the remote image fails. */
function Photo({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  if (failed) return <div className={`${className} bg-surface-muted`} role="img" aria-label={alt} />
  return <img src={src} alt={alt} loading="lazy" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} className={`${className} object-cover ${loaded ? '' : 'animate-pulse bg-surface-muted'}`} />
}

function AudioPlayer({ post }: { post: Post }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => () => ref.current?.pause(), [])

  const toggle = () => {
    const a = ref.current
    if (!a) return
    if (a.paused) void a.play().catch(() => setError(true))
    else a.pause()
  }

  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-surface-muted p-3">
      {post.mediaUrls?.[0] && <Photo src={post.mediaUrls[0]} alt="" className="size-16 shrink-0 rounded-lg" />}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{post.title ?? 'Audio'}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2">
            {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4 translate-x-px" />}
          </button>
          <input type="range" aria-label="Seek" min={0} max={duration || 0} step={0.1} value={time} disabled={!duration}
            onChange={(e) => { if (ref.current) ref.current.currentTime = Number(e.target.value) }}
            className="h-1.5 min-w-0 flex-1 accent-[#A71930]" />
          <span className="w-[5.5rem] shrink-0 text-right text-xs tabular-nums text-muted-foreground">{fmt(time)} / {fmt(duration)}</span>
        </div>
        {error && <p role="status" className="mt-1 text-xs text-muted-foreground">Couldn’t load this audio. Check your connection.</p>}
      </div>
      <audio ref={ref} src={post.audioUrl} preload="metadata"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onError={() => setError(true)} />
    </div>
  )
}

export function PostMedia({ post }: { post: Post }) {
  const kinds = ['photo', 'album', 'video', 'audio'] as const
  if (!kinds.some((k) => k === post.type)) return null
  const label = post.mediaLabel ?? post.title ?? 'Post media'
  const urls = post.mediaUrls ?? []
  const kind = post.type as (typeof kinds)[number]

  if (kind === 'audio' && post.audioUrl) return <AudioPlayer post={post} />
  if (!urls.length) return post.mediaLabel ? <MediaArt kind={kind} seed={post.id} label={label} /> : null

  const alt = post.title ?? label.replace(/^(Photo|Album|Video|Audio):\s*/i, '')

  if (kind === 'album' && urls.length > 1) {
    const shown = urls.slice(0, 5)
    const extra = urls.length - shown.length
    return (
      <div className="mt-3 grid grid-cols-4 gap-1 overflow-hidden rounded-xl" role="group" aria-label={label}>
        <Photo src={shown[0]} alt={`${alt}, 1 of ${urls.length}`} className="col-span-4 h-56 w-full sm:h-72" />
        {shown.slice(1).map((s, i) => (
          <div key={s} className="relative">
            <Photo src={s.replace('w=1200', 'w=400')} alt={`${alt}, ${i + 2} of ${urls.length}`} className="h-20 w-full sm:h-24" />
            {extra > 0 && i === shown.length - 2 && <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white">+{extra}</span>}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative mt-3 overflow-hidden rounded-xl">
      <Photo src={urls[0]} alt={alt} className="block h-64 w-full sm:h-80" />
      {kind === 'video' && (
        <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-black/10">
          <span className="flex size-14 items-center justify-center rounded-full bg-black/60 text-white"><Play className="size-7 translate-x-0.5" /></span>
        </span>
      )}
      {kind === 'video' && <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">{label.replace(/^Video:\s*/i, '')}</span>}
    </div>
  )
}
