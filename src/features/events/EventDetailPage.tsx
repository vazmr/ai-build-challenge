import { ArrowLeft, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge, Card, DemoBadge, EmptyState } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { formatDay, formatTimeRange } from '../../utils/format'
import { EventActions } from './EventActions'

export function EventDetailPage() {
  const { eventId } = useParams()
  const { state } = useAppState()
  const { orgName } = useDirectory()
  const event = state.events.find((e) => e.id === eventId && e.status === 'published')
  if (!event) return <EmptyState title="Event not found" description="It may have been removed." action={<Link to="/events" className="text-sm font-semibold text-brand">Back to events</Link>} />
  const host = orgName(event.hostOrganizationId)

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/events" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden className="size-4" /> Events</Link>
      <Card>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="brand">{event.category}</Badge>
          {event.isDemoContent && <DemoBadge />}
        </div>
        <h1 className="mt-2 text-2xl font-bold">{event.title}</h1>
        <p className="mt-3 text-sm">{formatDay(event.startAt)} · {formatTimeRange(event.startAt, event.endAt)}</p>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin aria-hidden className="size-4" /> {event.locationName}</p>
        {host && <p className="mt-1 text-sm text-muted-foreground">Hosted by <Link to={`/organizations/${event.hostOrganizationId}`} className="font-medium text-foreground hover:underline">{host}</Link></p>}
        <p className="mt-1 text-sm font-medium">{event.priceLabel}</p>
        <p className="mt-4 text-sm">{event.description}</p>
        <div className="mt-5"><EventActions eventId={event.id} /></div>
        <p className="mt-4 text-xs text-muted-foreground">Fictional sample event. RSVP is a prototype state only, not a real registration.</p>
      </Card>
    </div>
  )
}
