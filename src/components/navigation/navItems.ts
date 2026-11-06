import { CalendarDays, Map, MessagesSquare, Newspaper, Rocket, type LucideIcon } from 'lucide-react'

export interface NavItem { to: string; label: string; icon: LucideIcon }

// Order is fixed by product rules: Map, Events, Feed, Community, Projects.
export const PRIMARY_NAV: NavItem[] = [
  { to: '/map', label: 'Map', icon: Map },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/feed', label: 'Feed', icon: Newspaper },
  { to: '/community', label: 'Community', icon: MessagesSquare },
  { to: '/projects', label: 'Projects', icon: Rocket },
]
