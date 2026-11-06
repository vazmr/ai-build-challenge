import { CalendarDays, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../../hooks/useAppState'
import { publishedEvents, upcomingEvents } from '../../services/eventsService'
import { formatDay } from '../../utils/format'
import { gradientFor } from '../../utils/art'

const card = 'flex w-60 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border bg-surface'

/**
 * Cold-start strip for students who haven't joined any group or organization yet.
 * Mobile only: on desktop the DiscoveryRail already covers this. Disappears once they belong somewhere.
 */
export function StartHere() {
  const { state, activeStudent } = useAppState()
  const [now] = useState(() => new Date())
  const belongs =
    state.communityMemberships.some((m) => m.studentId === activeStudent.id) ||
    state.memberships.some((m) => m.studentId === activeStudent.id && m.status === 'active')
  if (belongs) return null

  const events = upcomingEvents(publishedEvents(state), now).slice(0, 3)
  const groups = state.communities.slice(0, 3)
  if (!events.length && !groups.length) return null

  return (
    <section aria-labelledby="start-here" className="mb-5 lg:hidden">
      <h2 id="start-here" className="mb-2 text-base font-semibold">New here? Start with one of these</h2>
      <ul className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {events.map((e) => (
          <li key={e.id} className={card}>
            <div className="h-1.5" style={{ backgroundImage: gradientFor(e.category) }} aria-hidden />
            <Link to={`/events/${e.id}`} className="flex flex-1 flex-col gap-1 p-3">
              <span className="flex items-center gap-1 text-xs font-semibold text-brand"><CalendarDays aria-hidden className="size-3.5" /> Event</span>
              <span className="font-medium">{e.title}</span>
              <span className="text-xs text-muted-foreground">{formatDay(e.startAt)} · {e.locationName}</span>
            </Link>
          </li>
        ))}
        {groups.map((g) => (
          <li key={g.id} className={card}>
            <div className="h-1.5" style={{ backgroundImage: gradientFor(g.id) }} aria-hidden />
            <Link to={`/community/${g.id}`} className="flex flex-1 flex-col gap-1 p-3">
              <span className="flex items-center gap-1 text-xs font-semibold text-brand"><Users aria-hidden className="size-3.5" /> Group</span>
              <span className="font-medium">{g.name}</span>
              <span className="text-xs text-muted-foreground">Informal group · open to browse</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
