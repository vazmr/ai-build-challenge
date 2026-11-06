import { Clock, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { friendsGoing } from '../../services/eventsService'
import type { CampusEvent } from '../../types'
import { formatDay, formatTimeRange } from '../../utils/format'
import { EventActions } from './EventActions'
import { EventAttendees } from './EventAttendees'
import { EventCover } from './EventCover'

export function EventCard({ event, compact = false }: { event: CampusEvent; compact?: boolean }) {
  const { state, activeStudent } = useAppState()
  const { orgName } = useDirectory()
  const [now] = useState(() => new Date())
  const host = orgName(event.hostOrganizationId)
  const friends = friendsGoing(state, activeStudent.id, event.id).filter((f) => f.id !== activeStudent.id)

  return (
    <article className={`group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${compact ? 'w-72 shrink-0' : ''}`}>
      <Link to={`/events/${event.id}`} aria-label={`${event.title}, open event`} className="block">
        <EventCover event={event} now={now} height={compact ? 'h-28' : 'h-36'} />
      </Link>
      <div className="p-4">
        <p className="flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand">{event.category}</p>
        <h3 className="mt-1 text-lg font-bold leading-snug"><Link to={`/events/${event.id}`} className="hover:underline">{event.title}</Link></h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm"><Clock aria-hidden className="size-3.5 text-muted-foreground" />{formatDay(event.startAt)} · {formatTimeRange(event.startAt, event.endAt)}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin aria-hidden className="size-3.5" />{event.locationName}</p>
        {host && <p className="mt-0.5 text-xs text-muted-foreground">Hosted by {host}</p>}
        <EventAttendees eventId={event.id} />
        {friends.length > 0 && <p className="mt-1 text-xs font-medium text-brand">{friends[0].displayName}{friends.length > 1 ? ` and ${friends.length - 1} more you follow are going` : ' (you follow) is going'}</p>}
        {!compact && <div className="mt-4"><EventActions eventId={event.id} /></div>}
      </div>
    </article>
  )
}
