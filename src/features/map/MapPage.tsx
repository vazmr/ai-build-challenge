import { ExternalLink, Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, Input, PageHeader } from '../../components/shared/ui'
import { LAYER_COLORS, MAP_LAYERS, PLACES, type MapLayer } from '../../data/places'
import { useAppState } from '../../hooks/useAppState'
import { upcomingEvents } from '../../services/eventsService'
import { formatDay } from '../../utils/format'
import { CampusMap } from './CampusMap'

/** Real OpenStreetMap map of Temple's Main Campus. No location access, hours or live availability. */
export function MapPage() {
  const { state } = useAppState()
  const [layers, setLayers] = useState<Set<MapLayer>>(new Set(MAP_LAYERS))
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [params] = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const wanted = params.get('place')?.toLowerCase()
    return (wanted && PLACES.find((p) => wanted.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(wanted))?.id) || null
  })
  const [now] = useState(() => new Date())

  const q = query.trim().toLowerCase()
  const events = upcomingEvents(state.events.filter((e) => e.status === 'published'), now)
  const eventsAt = (name: string) => events.filter((e) => e.locationName.toLowerCase().includes(name.toLowerCase()))
  const countFor = (l: MapLayer) => PLACES.filter((p) => p.layers.includes(l)).length

  const places = PLACES.filter((p) =>
    p.layers.some((l) => layers.has(l)) &&
    (!q || p.name.toLowerCase().includes(q) || p.note.toLowerCase().includes(q) || p.layers.some((l) => l.toLowerCase().includes(q)) || eventsAt(p.name).some((e) => e.title.toLowerCase().includes(q))))
  const listed = [...places].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || a.name.localeCompare(b.name))
  const selected = PLACES.find((p) => p.id === selectedId)
  const toggle = (l: MapLayer) => setLayers((prev) => { const next = new Set(prev); if (next.has(l)) next.delete(l); else next.add(l); return next })

  return (
    <div>
      <PageHeader title="Map" description="Temple’s Main Campus. Never uses your location; no live hours." />
      <div className="mb-3 flex items-center gap-2">
        <div className="relative min-w-0 max-w-md flex-1">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input aria-label="Search places and events" placeholder="Search buildings, food, services or events" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button type="button" aria-expanded={filtersOpen} aria-controls="map-layers" onClick={() => setFiltersOpen((o) => !o)}
          className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-sm font-semibold lg:hidden">
          <SlidersHorizontal aria-hidden className="size-4" /> Categories <span className="text-xs font-normal text-muted-foreground">{layers.size}/{MAP_LAYERS.length}</span>
        </button>
      </div>

      <div className="mb-4">
        <div id="map-layers" className={`${filtersOpen ? 'flex' : 'hidden'} flex-wrap items-center gap-2 lg:flex`} role="group" aria-label="Map layers">
          {MAP_LAYERS.map((l) => (
            <button key={l} type="button" aria-pressed={layers.has(l)} onClick={() => toggle(l)}
              className={`flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm ${layers.has(l) ? 'border-foreground bg-surface font-semibold' : 'border-border text-muted-foreground'}`}>
              <span className="size-2.5 rounded-full" style={{ background: LAYER_COLORS[l], opacity: layers.has(l) ? 1 : 0.35 }} aria-hidden />
              {l} <span className="text-xs text-muted-foreground">{countFor(l)}</span>
            </button>
          ))}
          <Button variant="ghost" onClick={() => setLayers(new Set(MAP_LAYERS))} disabled={layers.size === MAP_LAYERS.length}>Show all</Button>
          <Button variant="ghost" onClick={() => setLayers(new Set())} disabled={layers.size === 0}>Clear</Button>
        </div>
        <p role="status" className="mt-2 text-xs text-muted-foreground">Showing {places.length} of {PLACES.length} places. Large pins are main landmarks; small dots are everyday spots.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div>
          <CampusMap places={places} selectedId={selectedId} onSelect={setSelectedId} />
          <p className="mt-1 text-xs text-muted-foreground">Pins are approximate. Map data © OpenStreetMap contributors. Confirm hours and details with official sources.</p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold">{selected ? selected.name : 'Places'}</h2>
          {selected ? (
            <Card>
              <p className="text-sm text-muted-foreground">{selected.note}</p>
              <a href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=18/${selected.lat}/${selected.lng}`} target="_blank" rel="noreferrer noopener" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">Open in OpenStreetMap <ExternalLink aria-hidden className="size-3.5" /></a>
              <div className="mt-2 flex flex-wrap gap-1.5">{selected.layers.map((l) => <Badge key={l}>{l}</Badge>)}</div>
              <h3 className="mb-1 mt-3 text-sm font-semibold">Upcoming events here</h3>
              {eventsAt(selected.name).length === 0 ? <p className="text-sm text-muted-foreground">None listed.</p> : <ul className="space-y-1 text-sm">{eventsAt(selected.name).map((e) => <li key={e.id}><Link className="font-medium hover:underline" to={`/events/${e.id}`}>{e.title}</Link> <span className="text-muted-foreground">· {formatDay(e.startAt)}</span></li>)}</ul>}
              <button type="button" className="mt-3 text-sm font-semibold text-brand hover:underline" onClick={() => setSelectedId(null)}>Back to list</button>
            </Card>
          ) : listed.length === 0 ? <EmptyState title="No places match" description="Turn on more layers or clear the search." /> : (
            <ul className="max-h-[30rem] space-y-2 overflow-y-auto pr-1">{listed.map((p) => (
              <li key={p.id}><button type="button" onClick={() => setSelectedId(p.id)} className="flex w-full items-start gap-2.5 rounded-xl border border-border bg-surface p-3 text-left hover:bg-surface-muted">
                <span className="mt-1.5 size-3 shrink-0 rounded-full" style={{ background: LAYER_COLORS[p.layers[0]] }} aria-hidden />
                <span><span className="block font-medium">{p.name}</span><span className="block text-xs text-muted-foreground">{p.layers.join(' · ')}{eventsAt(p.name).length ? ` · ${eventsAt(p.name).length} upcoming events` : ''}</span></span>
              </button></li>
            ))}</ul>
          )}
        </div>
      </div>
    </div>
  )
}
