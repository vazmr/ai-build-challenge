import { Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, Input, PageHeader, Select, Tabs } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { EVENT_CATEGORIES, eventsOnDay, filterEvents, myEvents, publishedEvents, upcomingEvents, type EventScope } from '../../services/eventsService'
import { EventCard } from './EventCard'

type View = 'discover' | 'mine'

export function EventsPage() {
  const { state, activeStudent } = useAppState()
  const [view, setView] = useState<View>('discover')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [scope, setScope] = useState<EventScope>('all')

  const [now] = useState(() => new Date())
  const all = publishedEvents(state)
  const today = eventsOnDay(all, now)
  const strip = today.length ? today : upcomingEvents(all, now).slice(0, 3)
  const results = upcomingEvents(filterEvents(state, { query, category, scope }), now)
  const mine = myEvents(state, activeStudent.id)

  return (
    <div>
      <PageHeader title="Events" description="Sample events for the prototype. Save and RSVP are simulated; nothing is registered." />
      <Tabs tabs={[{ id: 'discover' as const, label: 'Discover' }, { id: 'mine' as const, label: `My Events${mine.length ? ` (${mine.length})` : ''}` }]} value={view} onChange={setView} label="Events views" />

      {view === 'discover' ? (
        <>
          <section aria-labelledby="today-h" className="mb-6">
            <h2 id="today-h" className="mb-2 text-lg font-semibold">{today.length ? 'Happening Today' : 'Nothing today. Coming up next'}</h2>
            {strip.length ? (
              <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">{strip.map((e) => <EventCard key={e.id} event={e} compact />)}</div>
            ) : <p className="text-sm text-muted-foreground">No upcoming events.</p>}
          </section>

          <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input aria-label="Search events" placeholder="Search events, places or hosts" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {EVENT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
            <Select aria-label="Filter" value={scope} onChange={(e) => setScope(e.target.value as EventScope)}>
              <option value="all">All events</option>
              <option value="campus">Main Campus</option>
              <option value="free">Free</option>
            </Select>
          </div>

          {results.length === 0 ? (
            <EmptyState title="No events match your filters" description="Try a different search or clear the filters." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">{results.map((e) => <EventCard key={e.id} event={e} />)}</div>
          )}
        </>
      ) : mine.length === 0 ? (
        <EmptyState title="No saved or upcoming events yet" description="Save an event or RSVP and it will show up here." action={<button type="button" onClick={() => setView('discover')} className="text-sm font-semibold text-brand hover:underline">Discover events</button>} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">{mine.map(({ event, state: st }) => (
            <div key={event.id}><p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{st === 'going' ? 'Going (demo RSVP)' : 'Saved'}</p><EventCard event={event} /></div>
          ))}</div>
          <p className="mt-4 text-sm"><Link to="/calendar" className="font-semibold text-brand hover:underline">Open My Campus Calendar</Link></p>
        </>
      )}
    </div>
  )
}
