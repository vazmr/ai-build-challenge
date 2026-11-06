import { Bookmark, BookOpen, Building2, CalendarDays, Map, MessagesSquare, Newspaper, Rocket, Settings, UserRound, type LucideIcon } from 'lucide-react'

export interface NavItem { to: string; label: string; icon: LucideIcon }
export interface NavGroup { id: string; label: string; items: NavItem[] }

// Order is fixed by product rules: Map, Events, Feed, Community, Projects.
// These five are the only destinations in the mobile bottom bar.
export const PRIMARY_NAV: NavItem[] = [
  { to: '/map', label: 'Map', icon: Map },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/feed', label: 'Feed', icon: Newspaper },
  { to: '/community', label: 'Community', icon: MessagesSquare },
  { to: '/projects', label: 'Projects', icon: Rocket },
]

/**
 * Everything else lives in the sidebar on desktop/tablet and in the "More" menu on mobile.
 * One source for both, so a destination never exists in only one of them.
 */
export function secondaryGroups(studentId: string): NavGroup[] {
  return [
    {
      id: 'explore',
      label: 'Explore',
      items: [
        { to: '/organizations', label: 'Organizations', icon: Building2 },
        { to: '/resources', label: 'Resources', icon: BookOpen },
      ],
    },
    {
      id: 'you',
      label: 'You',
      items: [
        { to: `/profile/${studentId}`, label: 'My Profile', icon: UserRound },
        { to: '/saved', label: 'Saved Items', icon: Bookmark },
      ],
    },
  ]
}

export const SETTINGS_NAV: NavItem = { to: '/settings', label: 'Settings & Privacy', icon: Settings }
