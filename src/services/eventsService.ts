import type { CampusEvent, EventParticipation, PersistedAppState } from '../types'
import { newId, nowIso } from '../utils/id'
import { dayKey } from '../utils/format'
import { hasOrgPermission } from '../utils/permissions'

export const EVENT_CATEGORIES = [
  'Music & Entertainment', 'Arts & Culture', 'Social', 'Academic',
  'Professional', 'Sports & Recreation', 'Community Service', 'Food & Freebies',
]

export type EventScope = 'all' | 'campus' | 'free'

export interface EventFilters { query: string; category: string; scope: EventScope }

export const publishedEvents = (s: PersistedAppState) =>
  s.events.filter((e) => e.status === 'published').sort((a, b) => a.startAt.localeCompare(b.startAt))

export function filterEvents(s: PersistedAppState, f: EventFilters): CampusEvent[] {
  const q = f.query.trim().toLowerCase()
  const hostName = (e: CampusEvent) => s.organizations.find((o) => o.id === e.hostOrganizationId)?.name ?? ''
  return publishedEvents(s).filter((e) => {
    if (f.category && e.category !== f.category) return false
    if (f.scope === 'free' && !/^free$/i.test(e.priceLabel)) return false
    if (f.scope === 'campus' && e.campus !== 'Main Campus') return false
    if (q && !`${e.title} ${e.description} ${e.locationName} ${e.category} ${hostName(e)}`.toLowerCase().includes(q)) return false
    return true
  })
}

export const eventsOnDay = (events: CampusEvent[], day: Date) => events.filter((e) => dayKey(e.startAt) === dayKey(day))

export const upcomingEvents = (events: CampusEvent[], now: Date) => events.filter((e) => new Date(e.endAt) >= now)

export const participationFor = (s: PersistedAppState, studentId: string, eventId: string): EventParticipation | undefined =>
  s.eventParticipations.find((p) => p.studentId === studentId && p.eventId === eventId)

function setState(s: PersistedAppState, studentId: string, eventId: string, state: EventParticipation['state'] | null): PersistedAppState {
  const rest = s.eventParticipations.filter((p) => !(p.studentId === studentId && p.eventId === eventId))
  if (state === null) return { ...s, eventParticipations: rest }
  const existing = participationFor(s, studentId, eventId)
  return { ...s, eventParticipations: [...rest, { id: existing?.id ?? newId('ep'), eventId, studentId, state, updatedAt: nowIso() }] }
}

/** Save is a bookmark. Going/attended are never downgraded by saving. */
export function toggleSaveEvent(s: PersistedAppState, studentId: string, eventId: string): PersistedAppState {
  const cur = participationFor(s, studentId, eventId)?.state
  if (cur === 'going' || cur === 'attended') return s
  return setState(s, studentId, eventId, cur === 'saved' ? null : 'saved')
}

/** Simulated RSVP only. "attended" is confirmed attendance and cannot be set here. */
export function toggleGoing(s: PersistedAppState, studentId: string, eventId: string): PersistedAppState {
  const cur = participationFor(s, studentId, eventId)?.state
  if (cur === 'attended') return s
  return setState(s, studentId, eventId, cur === 'going' ? null : 'going')
}

export const myEvents = (s: PersistedAppState, studentId: string) => {
  const ids = new Map(s.eventParticipations.filter((p) => p.studentId === studentId && p.state !== 'attended').map((p) => [p.eventId, p.state]))
  return publishedEvents(s).filter((e) => ids.has(e.id)).map((e) => ({ event: e, state: ids.get(e.id) as 'saved' | 'going' }))
}

export interface NewOrgEventInput { title: string; description: string; category: string; date: string; startTime: string; endTime: string; locationName: string; priceLabel: string }

/** Officers with event permission can create sample events for their own organization only. */
export function createOrgEvent(s: PersistedAppState, actorId: string, organizationId: string, i: NewOrgEventInput): PersistedAppState {
  if (!i.title.trim() || !i.date || !i.startTime || !i.endTime || !hasOrgPermission(s, actorId, organizationId, 'org.manage-events')) return s
  const e: CampusEvent = {
    id: newId('ev'), title: i.title.trim(), description: i.description.trim(), hostOrganizationId: organizationId, category: i.category,
    startAt: `${i.date}T${i.startTime}:00-05:00`, endAt: `${i.date}T${i.endTime}:00-05:00`, locationName: i.locationName.trim() || 'TBD',
    priceLabel: i.priceLabel.trim() || 'Free', campus: 'Main Campus', status: 'published', isDemoContent: true,
  }
  return { ...s, events: [...s.events, e] }
}
