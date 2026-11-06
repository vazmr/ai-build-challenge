import { MapPin, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Card, EmptyState, Input, PageHeader } from '../../components/shared/ui'
import { MAP_LAYERS, PLACES, type MapLayer } from '../../data/places'
import { useAppState } from '../../hooks/useAppState'
import { upcomingEvents } from '../../services/eventsService'
import { formatDay } from '../../utils/format'

/** Illustrative map: schematic positions only. No location access, hours or live availability. */
export function MapPage() {
  const { state } = useAppState()
  const [layers, setLayers] = useState<Set<MapLayer>>(new Set(MAP_LAYERS))
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [now] = useState(() => new Date())

  const q = query.trim().toLowerCase()
  const events = upcomingEvents(state.events.filter((e) => e.status === 'published'), now)
  const eventsAt = (name: string) => events.filter((e) => e.locationName.toLowerCase().includes(name.toLowerCase()))
  const places = PLACES.filter((p) => p.layers.some((l) => layers.has(l)) && (!q || p.name.toLowerCase().includes(q) || eventsAt(p.name).some((e) => e.title.toLowerCase().includes(q))))
  const selected = PLACES.find((p) => p.id === selectedId)
  const toggle = (l: MapLayer) => setLayers((prev) => { const n = new Set(prev); if (n.has(l)) n.delete(l); else n.add(l); return n })

  return (
    <div>
      <PageHeader title="Map" description="What’s happening around me, and where can I find it? Illustrative map with sample places. It doesn’t use your location and shows no live info." />
      <div className="relative mb-3 max-w-md">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input aria-label="Search places and events" placeholder="Search buildings, places or events" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Map layers">
        {MAP_LAYERS.map((l) => (
          <button key={l} type="button" aria-pressed={layers.has(l)} onClick={() => toggle(l)} className={`min-h-9 rounded-full border px-3 text-sm ${layers.has(l) ? 'border-brand bg-brand-soft font-semibold text-brand' : 'border-border text-muted-foreground'}`}>{l}</button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface-muted">
          <svg viewBox="0 0 100 75" className="absolute inset-0 size-full" role="img" aria-label="Schematic campus map (illustrative)">
            <rect x="0" y="0" width="100" height="75" fill="var(--color-surface-muted)" />
            {[15, 30, 45, 60].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="var(--color-border)" strokeWidth="0.4" />)}
            {[20, 40, 60, 80].map((x) => <line key={x} y1="0" y2="75" x1={x} x2={x} stroke="var(--color-border)" strokeWidth="0.4" />)}
            <rect x="5" y="5" width="22" height="14" rx="2" fill="var(--color-border)" opacity="0.5" />
            <rect x="70" y="8" width="24" height="12" rx="2" fill="var(--color-border)" opacity="0.5" />
          </svg>
          {places.map((p) => (
            <button key={p.id} type="button" onClick={() => setSelectedId(p.id)} aria-label={`${p.name}${eventsAt(p.name).length ? `, ${eventsAt(p.name).length} upcoming events` : ''}`} aria-pressed={selectedId === p.id}
              style={{ left: `${p.x}%`, top: `${p.y * 1.333}%` }} className="absolute flex size-11 -translate-x-1/2 -translate-y-full items-start justify-center">
              <MapPin aria-hidden className={`size-8 drop-shadow ${selectedId === p.id ? 'fill-brand text-brand' : 'fill-brand-soft text-brand'}`} />
            </button>
          ))}
          <p className="absolute bottom-2 left-2 rounded bg-surface/90 px-2 py-0.5 text-xs text-muted-foreground">Illustrative only</p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold">{selected ? selected.name : 'Nearby discovery'}</h2>
          {selected ? (
            <Card>
              <p className="text-sm text-muted-foreground">{selected.note}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{selected.layers.map((l) => <Badge key={l}>{l}</Badge>)}</div>
              <h3 className="mb-1 mt-3 text-sm font-semibold">Upcoming sample events here</h3>
              {eventsAt(selected.name).length === 0 ? <p className="text-sm text-muted-foreground">None listed.</p> : <ul className="space-y-1 text-sm">{eventsAt(selected.name).map((e) => <li key={e.id}><Link className="font-medium hover:underline" to={`/events/${e.id}`}>{e.title}</Link> <span className="text-muted-foreground">· {formatDay(e.startAt)}</span></li>)}</ul>}
              <button type="button" className="mt-3 text-sm font-semibold text-brand hover:underline" onClick={() => setSelectedId(null)}>Back to list</button>
            </Card>
          ) : places.length === 0 ? <EmptyState title="No places match" description="Turn on more layers or clear the search." /> : (
            <ul className="space-y-2">{places.map((p) => (
              <li key={p.id}><button type="button" onClick={() => setSelectedId(p.id)} className="w-full rounded-xl border border-border bg-surface p-3 text-left hover:bg-surface-muted"><span className="block font-medium">{p.name}</span><span className="block text-xs text-muted-foreground">{eventsAt(p.name).length} upcoming sample events</span></button></li>
            ))}</ul>
          )}
        </div>
      </div>
    </div>
  )
}
