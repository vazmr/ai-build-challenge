import { Clock, MapPin, Search, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, Input, Select, Tabs } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { EVENT_CATEGORIES, eventsOnDay, filterEvents, friendsGoing, goingStudents, myEvents, publishedEvents, upcomingEvents, type EventScope } from '../../services/eventsService'
import type { CampusEvent } from '../../types'
import { dayKey, formatDay, formatTimeRange } from '../../utils/format'
import { EventActions } from './EventActions'
import { EventAttendees } from './EventAttendees'
import { EventCard } from './EventCard'
import { CategoryIcon } from './CategoryIcon'
import { EventCover } from './EventCover'

type View = 'discover' | 'mine'

function Row({ title, subtitle, events }: { title: string; subtitle?: string; events: CampusEvent[] }) {
  if (events.length === 0) return null
  return (
    <section className="mb-8">
      <div className="mb-3"><h2 className="text-xl font-extrabold">{title}</h2>{subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}</div>
      <div className="relative -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:px-0">{events.map((e) => <div key={e.id} className="snap-start"><EventCard event={e} compact /></div>)}</div>
    </section>
  )
}

export function EventsPage() {
  const { state, activeStudent } = useAppState()
  const { orgName } = useDirectory()
  const [view, setView] = useState<View>('discover')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [scope, setScope] = useState<EventScope>('all')
  const [now] = useState(() => new Date())
  const me = activeStudent.id

  const all = publishedEvents(state)
  const upcoming = upcomingEvents(all, now)
  const results = upcomingEvents(filterEvents(state, { query, category, scope }), now)
  const filtering = !!(query.trim() || category || scope !== 'all')
  const mine = myEvents(state, me)

  // Featured: soonest events within a week, weighted by friends going and attendance.
  const week = upcoming.filter((e) => new Date(e.startAt).getTime() - now.getTime() < 7 * 86_400_000)
  const featured = [...(week.length ? week : upcoming)].sort((a, b) => (friendsGoing(state, me, b.id).length * 3 + goingStudents(state, me, b.id).length) - (friendsGoing(state, me, a.id).length * 3 + goingStudents(state, me, a.id).length) || a.startAt.localeCompare(b.startAt))[0]
  const todays = eventsOnDay(upcoming, now)
  const friendsEvents = upcoming.filter((e) => e.id !== featured?.id && friendsGoing(state, me, e.id).some((f) => f.id !== me))
  const dow = now.getDay()
  const weekendStart = new Date(now.getTime() + ((6 - dow + 7) % 7) * 86_400_000)
  const weekendKeys = new Set([dayKey(weekendStart), dayKey(new Date(weekendStart.getTime() + 86_400_000))])
  const weekend = upcoming.filter((e) => weekendKeys.has(dayKey(e.startAt)) && e.id !== featured?.id)

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">What’s happening</h1>
          <p className="mt-1 text-muted-foreground">Find your next night out, study jam or new crew.</p>
        </div>
      </div>
      <Tabs tabs={[{ id: 'discover' as const, label: 'Discover' }, { id: 'mine' as const, label: `My Events${mine.length ? ` (${mine.length})` : ''}` }]} value={view} onChange={setView} label="Events views" />

      {view === 'discover' ? (
        <>
          {!filtering && featured && (
            <section aria-label="Featured event" className="mb-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-md">
              <EventCover event={featured} now={now} height="h-56 md:h-72" big>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-5 pt-20 text-white">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"><CategoryIcon category={featured.category} className="size-4" /> Featured · {featured.category}</p>
                  <h2 className="mt-1 text-2xl font-extrabold leading-tight md:text-4xl"><Link to={`/events/${featured.id}`} className="hover:underline">{featured.title}</Link></h2>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"><span className="flex items-center gap-1.5"><Clock aria-hidden className="size-4" />{formatDay(featured.startAt)} · {formatTimeRange(featured.startAt, featured.endAt)}</span><span className="flex items-center gap-1.5"><MapPin aria-hidden className="size-4" />{featured.locationName}</span></p>
                </div>
              </EventCover>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div><EventAttendees eventId={featured.id} />{orgName(featured.hostOrganizationId) && <p className="mt-1 text-xs text-muted-foreground">Hosted by {orgName(featured.hostOrganizationId)}</p>}</div>
                <EventActions eventId={featured.id} />
              </div>
            </section>
          )}

          <div className="sticky top-14 z-10 -mx-4 mb-6 space-y-3 bg-background/95 px-4 py-3 backdrop-blur md:mx-0 md:px-0">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search aria-hidden className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input aria-label="Search events" placeholder="Search events, places or hosts" className="rounded-full pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <Select aria-label="Filter" className="rounded-full" value={scope} onChange={(e) => setScope(e.target.value as EventScope)}>
                <option value="all">All events</option><option value="campus">Main Campus</option><option value="free">Free only</option>
              </Select>
            </div>
            <div role="group" aria-label="Categories" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              <button type="button" aria-pressed={category === ''} onClick={() => setCategory('')} className={`flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium ${category === '' ? 'border-brand bg-brand text-white' : 'border-border bg-surface hover:bg-surface-muted'}`}><Sparkles aria-hidden className="size-4" />All</button>
              {EVENT_CATEGORIES.map((c) => (
                <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(category === c ? '' : c)} className={`flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium ${category === c ? 'border-brand bg-brand text-white' : 'border-border bg-surface hover:bg-surface-muted'}`}><CategoryIcon category={c} className="size-4" />{c}</button>
              ))}
            </div>
          </div>

          {filtering ? (
            results.length === 0 ? <EmptyState title="No events match" description="Try another search or category. New events are added all the time." />
              : (<><p className="mb-3 text-sm text-muted-foreground" role="status">{results.length} event{results.length === 1 ? '' : 's'}</p><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{results.map((e) => <EventCard key={e.id} event={e} />)}</div></>)
          ) : (
            <>
              <Row title={todays.length ? '🔥 Happening today' : 'Coming up next'} subtitle={todays.length ? 'Still time to jump in.' : undefined} events={todays.length ? todays : upcoming.slice(0, 4)} />
              <Row title="Friends are going" subtitle="People you follow have RSVP’d. Following stays private." events={friendsEvents} />
              <Row title="This weekend" events={weekend} />
              <section className="mb-4">
                <h2 className="mb-3 text-xl font-extrabold">All upcoming</h2>
                <div className="motion-stagger grid gap-5 md:grid-cols-2 xl:grid-cols-3">{upcoming.map((e) => <EventCard key={e.id} event={e} />)}</div>
              </section>
            </>
          )}
        </>
      ) : mine.length === 0 ? (
        <EmptyState title="Nothing planned yet" description="Save an event or RSVP and it shows up here, ready for your calendar." action={<button type="button" onClick={() => setView('discover')} className="text-sm font-semibold text-brand hover:underline">Find something fun</button>} />
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{mine.map(({ event, state: st }) => (
            <div key={event.id}><p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-brand">{st === 'going' ? '✓ You’re going' : 'Saved'}</p><EventCard event={event} /></div>
          ))}</div>
          <p className="mt-5 text-sm"><Link to="/calendar" className="font-semibold text-brand hover:underline">Open My Campus Calendar</Link></p>
        </>
      )}
    </div>
  )
}
