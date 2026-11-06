import { CURATED_TAGS } from '../../data/seed'
import { createOrgEvent, EVENT_CATEGORIES, participationFor, toggleGoing } from '../../services/eventsService'
import { createPost } from '../../services/feedService'
import { createProject, PROJECT_CATEGORIES, requestFor, requestToJoin, activeMembers } from '../../services/projectsService'
import { hasOrgPermission } from '../../utils/permissions'
import type { PersistedAppState, ProjectKind } from '../../types'
import { formatDay, formatTimeRange } from '../../utils/format'

export interface AssistantAction { id: string; name: string; input: Record<string, unknown> }
export type PlanResult = { ok: true; title: string; detail: string; confirm: string } | { ok: false; reason: string }
export interface RunResult { state: PersistedAppState; message: string; link?: { to: string; label: string } }

const str = (v: unknown, max = 600) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

/** Org the student can create events for (must have the event permission). */
function managedOrg(s: PersistedAppState, me: string, wanted?: string) {
  const orgs = s.organizations.filter((o) => hasOrgPermission(s, me, o.id, 'org.manage-events'))
  return orgs.find((o) => o.id === wanted) ?? orgs[0]
}

/** Validates an action proposed by the model against real app state. Nothing the model says is trusted. */
export function planAction(a: AssistantAction, s: PersistedAppState, me: string): PlanResult {
  const i = a.input ?? {}
  switch (a.name) {
    case 'create_post': {
      const body = str(i.body)
      if (!body) return { ok: false, reason: 'The post is empty.' }
      return { ok: true, title: 'Share to your feed', detail: `“${body.slice(0, 200)}”`, confirm: 'Post' }
    }
    case 'rsvp_event': {
      const ev = s.events.find((e) => e.id === i.eventId && e.status === 'published')
      if (!ev) return { ok: false, reason: 'I couldn’t find that event.' }
      const cur = participationFor(s, me, ev.id)?.state
      const going = i.going !== false
      if (cur === 'attended') return { ok: false, reason: 'You already attended this event.' }
      if ((cur === 'going') === going) return { ok: false, reason: going ? `You’re already going to ${ev.title}.` : `You’re not RSVP’d to ${ev.title}.` }
      return { ok: true, title: going ? `RSVP to ${ev.title}` : `Cancel RSVP for ${ev.title}`, detail: `${formatDay(ev.startAt)} · ${formatTimeRange(ev.startAt, ev.endAt)} · ${ev.locationName}`, confirm: going ? 'RSVP' : 'Cancel RSVP' }
    }
    case 'create_event': {
      const org = managedOrg(s, me, str(i.organizationId, 40))
      if (!org) return { ok: false, reason: 'Only officers with event permission can create events, for their own organization. I can create a project or a post instead.' }
      const date = str(i.date, 10), start = str(i.startTime, 5), end = str(i.endTime, 5), title = str(i.title, 100)
      if (!title || !DATE.test(date) || !TIME.test(start) || !TIME.test(end)) return { ok: false, reason: 'I need a title, date and start and end time to create the event.' }
      if (end <= start) return { ok: false, reason: 'The end time has to be after the start time.' }
      return { ok: true, title: `Create event: ${title}`, detail: `${org.name} · ${date} · ${start}–${end}${str(i.location, 80) ? ` · ${str(i.location, 80)}` : ''}`, confirm: 'Create event' }
    }
    case 'create_project': {
      const title = str(i.title, 100), description = str(i.description, 600)
      if (!title || !description) return { ok: false, reason: 'A project needs a title and a short description.' }
      return { ok: true, title: `Create project: ${title}`, detail: `${description.slice(0, 160)} · Starts private; you choose when to publish.`, confirm: 'Create project' }
    }
    case 'join_project': {
      const p = s.projects.find((x) => x.id === i.projectId)
      if (!p || !p.isPublished || p.status !== 'recruiting') return { ok: false, reason: 'That project isn’t taking requests right now.' }
      if (p.ownerId === me || activeMembers(s, p.id).some((m) => m.studentId === me)) return { ok: false, reason: `You’re already part of ${p.title}.` }
      if (requestFor(s, me, p.id)?.status === 'pending') return { ok: false, reason: `You already asked to join ${p.title}.` }
      return { ok: true, title: `Ask to join ${p.title}`, detail: str(i.message, 200) ? `“${str(i.message, 200)}”` : 'The project lead reviews every request.', confirm: 'Send request' }
    }
    default:
      return { ok: false, reason: 'I can’t do that action.' }
  }
}

/** Runs a validated action with the app's own services. */
export function runAction(a: AssistantAction, s: PersistedAppState, me: string): RunResult {
  const i = a.input ?? {}
  switch (a.name) {
    case 'create_post': {
      const tags = (Array.isArray(i.tags) ? i.tags : []).map((t) => str(t, 30).toLowerCase().replace(/^#/, '')).filter((t) => CURATED_TAGS.includes(t)).slice(0, 4)
      return { state: createPost(s, me, { type: 'text', title: str(i.title, 100), body: str(i.body), linkUrl: '', tags, visibility: 'public' }), message: 'Posted to your feed.', link: { to: `/profile/${me}`, label: 'View on your profile' } }
    }
    case 'rsvp_event': {
      const ev = s.events.find((e) => e.id === i.eventId)
      return { state: toggleGoing(s, me, String(i.eventId)), message: i.going === false ? 'RSVP cancelled.' : 'You’re going!', link: ev && { to: `/events/${ev.id}`, label: 'View event' } }
    }
    case 'create_event': {
      const org = managedOrg(s, me, str(i.organizationId, 40))!
      const category = EVENT_CATEGORIES.includes(str(i.category, 60)) ? str(i.category, 60) : 'Social'
      const next = createOrgEvent(s, me, org.id, { title: str(i.title, 100), description: str(i.description, 500), category, date: str(i.date, 10), startTime: str(i.startTime, 5), endTime: str(i.endTime, 5), locationName: str(i.location, 80), priceLabel: str(i.price, 30) })
      const created = next.events[next.events.length - 1]
      return { state: next, message: 'Event created.', link: created && next.events.length > s.events.length ? { to: `/events/${created.id}`, label: 'View event' } : undefined }
    }
    case 'create_project': {
      const kind: ProjectKind = i.kind === 'need-help' || i.kind === 'offer-help' ? i.kind : 'collaborators'
      const category = PROJECT_CATEGORIES.includes(str(i.category, 60)) ? str(i.category, 60) : PROJECT_CATEGORIES[0]
      const skills = (Array.isArray(i.skills) ? i.skills : []).map((x) => str(x, 40)).filter(Boolean).slice(0, 6)
      const deadline = DATE.test(str(i.deadline, 10)) ? str(i.deadline, 10) : undefined
      const { state, id } = createProject(s, me, { title: str(i.title, 100), description: str(i.description, 600), category, kind, skillsNeeded: skills, deadline })
      return { state, message: 'Project created (private).', link: { to: `/projects/${id}`, label: 'Open project' } }
    }
    case 'join_project':
      return { state: requestToJoin(s, me, String(i.projectId), str(i.message, 300)), message: 'Request sent. The project lead will review it.', link: { to: `/projects/${String(i.projectId)}`, label: 'View project' } }
    default:
      return { state: s, message: 'Nothing to do.' }
  }
}
