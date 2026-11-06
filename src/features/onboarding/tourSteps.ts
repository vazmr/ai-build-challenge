export type Placement = 'right' | 'bottom' | 'left' | 'top'

export interface TourStep {
  id: string
  title: string
  body: string
  /** Route to show behind the spotlight so the feature is on screen, not just described. */
  route?: string
  /** `data-tour` values, tried in order; the first one currently visible is highlighted. No match = centered card. */
  targets?: string[]
  /** Preferred card side on desktop (falls back to whichever fits). */
  prefer?: Placement[]
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Student Hub',
    body: 'Find your people and what’s happening on campus. This quick tour shows where things live. Everything here is fictional demo content, so explore freely.',
    route: '/feed',
  },
  {
    id: 'feed',
    title: 'Feed: what’s new, newest first',
    body: 'Posts from students, groups and organizations in the order they happen. No like counts and no popularity ranking.',
    route: '/feed',
    targets: ['nav-feed'],
    prefer: ['right', 'top'],
  },
  {
    id: 'events',
    title: 'Events: find something to go to',
    body: 'Browse what’s coming up, RSVP, and keep it on your campus calendar.',
    route: '/events',
    targets: ['nav-events'],
    prefer: ['right', 'top'],
  },
  {
    id: 'map',
    title: 'Map: see what’s near you',
    body: 'Places and events on the campus map, so you can tell what’s a short walk away.',
    route: '/map',
    targets: ['nav-map'],
    prefer: ['right', 'top'],
  },
  {
    id: 'community',
    title: 'Community: groups for any interest',
    body: 'Open, informal groups. Browse without signing up for anything, and join with one tap when one fits.',
    route: '/community',
    targets: ['nav-community'],
    prefer: ['right', 'top'],
  },
  {
    id: 'projects',
    title: 'Projects: find help and collaborators',
    body: 'Share what you’re building, recruit teammates, or ask peers for help. Project workspaces stay private to their members.',
    route: '/projects',
    targets: ['nav-projects'],
    prefer: ['right', 'top'],
  },
  {
    id: 'more',
    title: 'Organizations, resources and you',
    body: 'Organizations, Resources, Saved items and your profile are here, along with Settings & Privacy.',
    route: '/feed',
    targets: ['nav-organizations', 'more'],
    prefer: ['right', 'bottom'],
  },
  {
    id: 'assistant',
    title: 'Not sure where to look? Ask',
    body: 'The Campus Assistant points you to resources in plain language. Its answers are demo content, not official Temple guidance.',
    route: '/feed',
    targets: ['assistant'],
    prefer: ['left', 'top'],
  },
]
