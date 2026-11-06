import { ArrowLeft, CalendarPlus, Clock, MapPin, Ticket } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar, Badge, Card, EmptyState } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { friendsGoing, goingStudents } from '../../services/eventsService'
import { formatDay, formatTimeRange } from '../../utils/format'
import { buildIcs, whenInfo } from '../../utils/eventWhen'
import { EventActions } from './EventActions'
import { EventAttendees } from './EventAttendees'
import { EventCover } from './EventCover'
import { CategoryIcon } from './CategoryIcon'

export function EventDetailPage() {
  const { eventId } = useParams()
  const { state, activeStudent } = useAppState()
  const { orgName } = useDirectory()
  const [now] = useState(() => new Date())
  const event = state.events.find((e) => e.id === eventId && e.status === 'published')
  if (!event) return <EmptyState title="Event not found" description="It may have been removed." action={<Link to="/events" className="text-sm font-semibold text-brand">Back to events</Link>} />

  const host = orgName(event.hostOrganizationId)
  const going = goingStudents(state, activeStudent.id, event.id)
  const friends = friendsGoing(state, activeStudent.id, event.id).filter((f) => f.id !== activeStudent.id)
  const when = whenInfo(event.startAt, event.endAt, now)

  const downloadIcs = () => {
    const url = URL.createObjectURL(new Blob([buildIcs(event)], { type: 'text/calendar' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `${event.title.replace(/\W+/g, '-').toLowerCase()}.ics` })
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/events" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden className="size-4" /> Events</Link>
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-md">
        <EventCover event={event} now={now} height="h-64 md:h-80" big>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 pt-24 text-white md:p-7">
            <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest"><CategoryIcon category={event.category} className="size-4" /> {event.category}</p>
            <h1 className="mt-1 text-3xl font-extrabold leading-tight md:text-5xl">{event.title}</h1>
            <p className="mt-2 text-sm font-semibold">{when.label}</p>
          </div>
        </EventCover>

        <div className="grid gap-6 p-5 md:grid-cols-[1fr_18rem] md:p-7">
          <div>
            <h2 className="text-lg font-bold">About this event</h2>
            <p className="mt-2 text-base leading-relaxed">{event.description}</p>

            <h2 className="mt-7 text-lg font-bold">Who’s going</h2>
            {going.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No one yet. Be the first to RSVP.</p> : (
              <>
                <EventAttendees eventId={event.id} />
                {friends.length > 0 && <p className="mt-2 text-sm font-medium text-brand">{friends.map((f) => f.displayName).join(', ')} {friends.length === 1 ? 'is' : 'are'} going (people you follow).</p>}
                <ul className="mt-3 flex flex-wrap gap-2">{going.map((g) => (
                  <li key={g.id}><Link to={`/profile/${g.id}`} className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 text-sm hover:bg-surface-muted"><Avatar name={g.displayName} size={24} />{g.id === activeStudent.id ? 'You' : g.displayName}</Link></li>
                ))}</ul>
              </>
            )}
            
          </div>

          <aside className="space-y-4">
            <Card className="space-y-3">
              <p className="flex items-start gap-2 text-sm"><Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" /><span><span className="block font-semibold">{formatDay(event.startAt)}</span><span className="text-muted-foreground">{formatTimeRange(event.startAt, event.endAt)}</span></span></p>
              <p className="flex items-start gap-2 text-sm"><MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" /><span><span className="block font-semibold">{event.locationName}</span><Link to={`/map?place=${encodeURIComponent(event.locationName)}`} className="text-brand hover:underline">See on the map</Link></span></p>
              <p className="flex items-center gap-2 text-sm"><Ticket aria-hidden className="size-4 text-brand" /><span className="font-semibold">{event.priceLabel}</span></p>
              {host && <p className="text-sm text-muted-foreground">Hosted by <Link to={`/organizations/${event.hostOrganizationId}`} className="font-semibold text-foreground hover:underline">{host}</Link></p>}
              <Badge tone="brand">{event.category}</Badge>
            </Card>
            <Card className="space-y-3">
              <EventActions eventId={event.id} />
              <button type="button" onClick={downloadIcs} className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-border text-sm font-semibold hover:bg-surface-muted"><CalendarPlus aria-hidden className="size-4" /> Add to my calendar (.ics)</button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
