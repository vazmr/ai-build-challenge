import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, PageHeader, Tabs } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { eventsOnDay, myEvents, publishedEvents } from '../../services/eventsService'
import { dayKey, formatDay } from '../../utils/format'
import { EventCard } from '../events/EventCard'

type View = 'month' | 'agenda' | 'list'
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function MonthView() {
  const { state, activeStudent } = useAppState()
  const [cursor, setCursor] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const [selected, setSelected] = useState(() => dayKey(new Date()))
  const all = publishedEvents(state)
  const mine = new Set(myEvents(state, activeStudent.id).map((m) => m.event.id))
  const first = cursor.getDay()
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  const cells = Array.from({ length: Math.ceil((first + daysInMonth) / 7) * 7 }, (_, i) => (i < first || i >= first + daysInMonth ? null : new Date(cursor.getFullYear(), cursor.getMonth(), i - first + 1, 12)))
  const selectedEvents = all.filter((e) => dayKey(e.startAt) === selected)
  const label = cursor.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" aria-label="Previous month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="flex size-10 items-center justify-center rounded-lg hover:bg-surface-muted"><ChevronLeft aria-hidden className="size-5" /></button>
        <h2 className="font-semibold" aria-live="polite">{label}</h2>
        <button type="button" aria-label="Next month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="flex size-10 items-center justify-center rounded-lg hover:bg-surface-muted"><ChevronRight aria-hidden className="size-5" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">{WEEKDAYS.map((d) => <div key={d} className="py-1">{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />
          const key = dayKey(d)
          const evs = eventsOnDay(all, d)
          const mineCount = evs.filter((e) => mine.has(e.id)).length
          return (
            <button key={i} type="button" onClick={() => setSelected(key)} aria-pressed={selected === key} aria-label={`${formatDay(d.toISOString())}, ${evs.length} events${mineCount ? `, ${mineCount} yours` : ''}`}
              className={`flex min-h-14 flex-col items-center rounded-lg border p-1 text-sm ${selected === key ? 'border-brand bg-brand-soft' : 'border-border bg-surface hover:bg-surface-muted'}`}>
              <span>{d.getDate()}</span>
              <span className="mt-1 flex gap-0.5">{evs.slice(0, 3).map((e) => <span key={e.id} className={`size-1.5 rounded-full ${mine.has(e.id) ? 'bg-brand' : 'bg-muted-foreground/50'}`} />)}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Red dots are events you saved or RSVP’d to (demo). Grey dots are other sample events.</p>
      <h3 className="mb-2 mt-4 font-semibold">{selectedEvents.length ? `Events on ${selected}` : `Nothing on ${selected}`}</h3>
      <div className="grid gap-3 md:grid-cols-2">{selectedEvents.map((e) => <EventCard key={e.id} event={e} />)}</div>
    </div>
  )
}

/** Month, list (all upcoming sample events) and agenda (your saved/going events). */
export function CalendarPage() {
  const { state, activeStudent } = useAppState()
  const [view, setView] = useState<View>('month')
  const [now] = useState(() => new Date())
  const mine = myEvents(state, activeStudent.id).filter(({ event }) => new Date(event.endAt) >= now)
  const groups = new Map<string, typeof mine>()
  for (const item of mine) {
    const key = formatDay(item.event.startAt)
    groups.set(key, [...(groups.get(key) ?? []), item])
  }
  const upcoming = publishedEvents(state).filter((e) => new Date(e.endAt) >= now)

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="My Campus Calendar" description="Your saved and RSVP’d events (demo), plus all sample events." />
      <Tabs<View> label="Calendar views" value={view} onChange={setView} tabs={[{ id: 'month', label: 'Month' }, { id: 'agenda', label: 'My agenda' }, { id: 'list', label: 'All upcoming' }]} />
      {view === 'month' && <MonthView />}
      {view === 'agenda' && (mine.length === 0 ? (
        <EmptyState title="Your agenda is empty" description="Save or RSVP to events and they’ll appear here." action={<Link to="/events" className="text-sm font-semibold text-brand hover:underline">Discover events</Link>} />
      ) : [...groups].map(([day, items]) => (
        <section key={day} className="mb-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{day}</h2>
          <div className="space-y-3">{items.map(({ event }) => <EventCard key={event.id} event={event} />)}</div>
        </section>
      )))}
      {view === 'list' && <div className="grid gap-3 md:grid-cols-2">{upcoming.map((e) => <EventCard key={e.id} event={e} />)}</div>}
    </div>
  )
}
