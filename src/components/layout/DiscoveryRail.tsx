import { CalendarDays, Rocket, Users } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../../hooks/useAppState'
import { eventsOnDay, publishedEvents, upcomingEvents } from '../../services/eventsService'
import { discoverableProjects } from '../../services/projectsService'
import { formatDay } from '../../utils/format'
import { gradientFor } from '../../utils/art'
import { Card } from '../shared/ui'

function Section({ title, icon, to, children }: { title: string; icon: ReactNode; to: string; children: ReactNode }) {
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold">{icon}{title}</h2>
        <Link to={to} className="text-xs font-semibold text-brand hover:underline">See all</Link>
      </div>
      {children}
    </Card>
  )
}

/** Desktop-only side column: quick discovery paths. Uses no popularity or private data. */
export function DiscoveryRail() {
  const { state, activeStudent } = useAppState()
  const [now] = useState(() => new Date())
  const events = upcomingEvents(publishedEvents(state), now)
  const todays = eventsOnDay(events, now)
  const shown = (todays.length ? todays : events).slice(0, 3)
  const groups = state.communities.filter((c) => !state.communityMemberships.some((m) => m.communityId === c.id && m.studentId === activeStudent.id)).slice(0, 3)
  const projects = [...discoverableProjects(state, 'collaborators'), ...discoverableProjects(state, 'need-help')].filter((p) => p.ownerId !== activeStudent.id).slice(0, 3)

  return (
    <aside aria-label="Discover" className="hidden space-y-4 lg:block">
      <Section title={todays.length ? 'Happening today' : 'Coming up'} icon={<CalendarDays aria-hidden className="size-4 text-brand" />} to="/events">
        <ul className="space-y-2">{shown.map((e) => (
          <li key={e.id} className="flex gap-2.5">
            <span className="mt-0.5 h-9 w-1.5 shrink-0 rounded-full" style={{ backgroundImage: gradientFor(e.category) }} aria-hidden />
            <span className="min-w-0 text-sm"><Link to={`/events/${e.id}`} className="block truncate font-medium hover:underline">{e.title}</Link><span className="block text-xs text-muted-foreground">{formatDay(e.startAt)} · {e.locationName}</span></span>
          </li>
        ))}</ul>
      </Section>
      <Section title="Groups to explore" icon={<Users aria-hidden className="size-4 text-brand" />} to="/community">
        <ul className="space-y-2">{groups.map((g) => (
          <li key={g.id} className="text-sm"><Link to={`/community/${g.id}`} className="font-medium hover:underline">{g.name}</Link><span className="block text-xs text-muted-foreground">Informal group</span></li>
        ))}</ul>
      </Section>
      <Section title="Projects recruiting" icon={<Rocket aria-hidden className="size-4 text-brand" />} to="/projects">
        <ul className="space-y-2">{projects.map((p) => (
          <li key={p.id} className="text-sm"><Link to={`/projects/${p.id}`} className="font-medium hover:underline">{p.title}</Link><span className="block text-xs text-muted-foreground">{p.category}</span></li>
        ))}</ul>
      </Section>
    </aside>
  )
}
