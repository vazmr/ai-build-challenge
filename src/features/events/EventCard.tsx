import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gradientFor } from '../../utils/art'
import { Badge, Card, DemoBadge } from '../../components/shared/ui'
import { useDirectory } from '../../hooks/useDirectory'
import type { CampusEvent } from '../../types'
import { formatDay, formatTimeRange } from '../../utils/format'
import { EventActions } from './EventActions'

export function EventCard({ event, compact = false }: { event: CampusEvent; compact?: boolean }) {
  const { orgName } = useDirectory()
  const host = orgName(event.hostOrganizationId)
  return (
    <Card className={`overflow-hidden !p-0 ${compact ? 'w-64 shrink-0' : ''}`}>
      <div className="h-2" style={{ backgroundImage: gradientFor(event.category) }} aria-hidden />
      <div className="p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="brand">{event.category}</Badge>
        {event.isDemoContent && <DemoBadge />}
      </div>
      <h3 className="mt-2 font-semibold"><Link to={`/events/${event.id}`} className="hover:underline">{event.title}</Link></h3>
      <p className="mt-1 text-sm">{formatDay(event.startAt)} · {formatTimeRange(event.startAt, event.endAt)}</p>
      <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground"><MapPin aria-hidden className="size-3.5" /> {event.locationName}</p>
      {host && <p className="mt-0.5 text-xs text-muted-foreground">Hosted by {host}</p>}
      <p className="mt-1 text-sm font-medium">{event.priceLabel}</p>
      {!compact && <div className="mt-3"><EventActions eventId={event.id} /></div>}
      </div>
    </Card>
  )
}
