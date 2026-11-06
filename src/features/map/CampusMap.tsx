import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import { CAMPUS_CENTER, CAMPUS_ZOOM, LAYER_COLORS, type Place } from '../../data/places'

const pinIcon = (color: string, selected: boolean) => {
  const w = selected ? 38 : 30
  const h = Math.round(w * 4 / 3)
  return L.divIcon({
    className: '',
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    html: `<svg viewBox="0 0 24 32" width="${w}" height="${h}" aria-hidden="true" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))">
      <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20 12 32 12 32s12-12 12-20.3C24 5.2 18.6 0 12 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12" cy="11.5" r="4.2" fill="#fff"/></svg>`,
  })
}

const dotIcon = (color: string, selected: boolean) => {
  const d = selected ? 22 : 14
  return L.divIcon({
    className: '',
    iconSize: [d, d],
    iconAnchor: [d / 2, d / 2],
    html: `<span style="display:block;width:${d}px;height:${d}px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.5)"></span>`,
  })
}

const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer noopener">OpenStreetMap</a> contributors'

/** Tried in order. If one can't load any tiles, the next is used automatically. */
const PROVIDERS = [
  { name: 'OpenStreetMap', url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: OSM_ATTR, subdomains: 'abc' },
  { name: 'CARTO', url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', attribution: `${OSM_ATTR} &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer noopener">CARTO</a>`, subdomains: 'abcd' },
  { name: 'OpenStreetMap France', url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', attribution: OSM_ATTR, subdomains: 'abc' },
]

interface Props { places: Place[]; selectedId: string | null; onSelect: (id: string) => void }

/** Real OpenStreetMap map centered on Temple's Main Campus. Never requests the user's location. */
export function CampusMap({ places, selectedId, onSelect }: Props) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)
  const [tilesFailed, setTilesFailed] = useState(false)
  const onSelectRef = useRef(onSelect)
  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])

  useEffect(() => {
    if (!el.current || map.current) return
    const m = L.map(el.current, { center: CAMPUS_CENTER, zoom: CAMPUS_ZOOM, minZoom: 13, maxZoom: 19, scrollWheelZoom: false })
    let index = 0
    let loaded = 0
    let failed = 0
    let tiles: L.TileLayer | null = null
    const startProvider = (i: number) => {
      tiles?.remove()
      loaded = 0
      failed = 0
      const prov = PROVIDERS[i]
      tiles = L.tileLayer(prov.url, { maxZoom: 19, attribution: prov.attribution, subdomains: prov.subdomains, referrerPolicy: 'origin' })
      tiles.on('tileload', () => { loaded++; if (loaded === 1) setTilesFailed(false) })
      tiles.on('tileerror', () => {
        failed++
        // Nothing has loaded from this provider yet: move on to the next one.
        if (loaded === 0 && failed >= 3) {
          if (index < PROVIDERS.length - 1) { index++; startProvider(index) } else setTilesFailed(true)
        }
      })
      tiles.addTo(m)
    }
    startProvider(0)
    layer.current = L.layerGroup().addTo(m)
    map.current = m
    return () => { m.remove(); map.current = null; layer.current = null }
  }, [])

  useEffect(() => {
    const g = layer.current
    if (!g) return
    g.clearLayers()
    // Draw small dots first so landmark pins stay on top.
    const ordered = [...places].sort((a, b) => Number(!!a.featured) - Number(!!b.featured))
    for (const p of ordered) {
      const selected = p.id === selectedId
      const color = LAYER_COLORS[p.layers[0]]
      const marker = L.marker([p.lat, p.lng], {
        icon: p.featured || selected ? pinIcon(color, selected) : dotIcon(color, false),
        title: p.name, alt: p.name, keyboard: true, riseOnHover: true, zIndexOffset: selected ? 1000 : p.featured ? 500 : 0,
      })
      marker.on('click', () => onSelectRef.current(p.id))
      marker.addTo(g)
    }
  }, [places, selectedId])

  useEffect(() => {
    const p = places.find((x) => x.id === selectedId)
    if (p && map.current) map.current.flyTo([p.lat, p.lng], Math.max(map.current.getZoom(), 17), { duration: 0.6 })
  }, [selectedId, places])

  return (
    <div className="relative">
      <div ref={el} role="region" aria-label="Map of Temple University Main Campus" className="z-0 h-[26rem] w-full overflow-hidden rounded-[var(--radius-card)] border border-border lg:h-[34rem]" />
      {tilesFailed && (
        <p role="alert" className="absolute inset-x-3 top-3 z-[500] rounded-lg bg-surface p-3 text-sm shadow">
          Map images couldn’t be loaded, so only pins are shown. Check your internet connection, or disable any ad or privacy blocker for this page, then reload. The place list on the right still works.
        </p>
      )}
    </div>
  )
}
