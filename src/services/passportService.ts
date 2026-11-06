import type { PersistedAppState } from '../types'
import { friendsGoing } from './eventsService'
import { activeMembers } from './projectsService'

/**
 * Student Passport: a private, derived "route" through the product.
 *
 * Stamps are never stored. Each one is computed from records that already exist (memberships, RSVPs, threads,
 * projects), so the passport can't drift from reality and needs no schema change. The route is ordered by
 * commitment: look around -> show up -> belong -> build together. Early stops are quick wins; later stops
 * only come from other people (a friend at an event, a teammate on a project), because the goal is bonds,
 * not usage. Nothing here counts popularity (likes, followers) and the passport is visible only to its owner.
 */

export type ChapterId = 'arrive' | 'show-up' | 'belong' | 'build'

export interface StopDef {
  id: string
  title: string
  /** Imperative line telling the student exactly how to earn the stamp. */
  how: string
  cta: string
  to: (studentId: string) => string
  need: number
  count: (s: PersistedAppState, studentId: string) => number
}

export interface ChapterDef {
  id: ChapterId
  name: string
  tagline: string
  /** Why this chapter matters for belonging, shown on the chapter page. */
  why: string
  stops: [StopDef, StopDef, StopDef]
}

const goingOrAttended = (s: PersistedAppState, id: string) =>
  s.eventParticipations.filter((p) => p.studentId === id && (p.state === 'going' || p.state === 'attended'))

const collabProjects = (s: PersistedAppState, id: string) =>
  s.projects.filter((p) => {
    const members = activeMembers(s, p.id)
    return members.some((m) => m.studentId === id) && members.some((m) => m.studentId !== id)
  })

export const PASSPORT_ROUTE: ChapterDef[] = [
  {
    id: 'arrive',
    name: 'Arrival',
    tagline: 'Look around, say hello',
    why: 'People connect with people they can recognise. Three small moves make you easy to find and easy to talk to.',
    stops: [
      { id: 'profile', title: 'Make it yours', how: 'Write a short bio and pick three interests.', cta: 'Open your profile', to: (id) => `/profile/${id}`, need: 4,
        count: (s, id) => { const p = s.students.find((x) => x.id === id); return p ? (p.bio?.trim() ? 1 : 0) + Math.min(3, p.interests.length) : 0 } },
      { id: 'follow', title: 'Follow your curiosity', how: 'Follow a student, group or organization, or save an event. It stays private.', cta: 'Browse groups', to: () => '/community', need: 1,
        count: (s, id) => s.follows.filter((f) => f.followerId === id).length + s.savedItems.filter((i) => i.studentId === id).length },
      { id: 'hello', title: 'Say hello', how: 'Comment on someone else’s post.', cta: 'Back to the feed', to: () => '/feed', need: 1,
        count: (s, id) => s.comments.filter((c) => c.authorId === id && s.posts.find((p) => p.id === c.postId)?.authorId !== id).length },
    ],
  },
  {
    id: 'show-up',
    name: 'Showing up',
    tagline: 'Be in the room',
    why: 'Familiar faces start in shared rooms. Going once is a plan; going with someone you know is the start of a habit.',
    stops: [
      { id: 'rsvp', title: 'Save your spot', how: 'RSVP “Going” to an event.', cta: 'Find an event', to: () => '/events', need: 1,
        count: (s, id) => goingOrAttended(s, id).length },
      { id: 'together', title: 'Better together', how: 'RSVP to an event that someone you follow is also going to.', cta: 'Find an event', to: () => '/events', need: 1,
        count: (s, id) => goingOrAttended(s, id).filter((p) => friendsGoing(s, id, p.eventId).length > 0).length },
      { id: 'regular', title: 'Regular', how: 'Go to three different events.', cta: 'Find an event', to: () => '/events', need: 3,
        count: (s, id) => goingOrAttended(s, id).length },
    ],
  },
  {
    id: 'belong',
    name: 'Belonging',
    tagline: 'Find your people',
    why: 'Belonging is joining something and speaking up in it. Groups are low-pressure; organizations are a deeper commitment.',
    stops: [
      { id: 'group', title: 'Find your group', how: 'Join an informal group.', cta: 'Explore groups', to: () => '/community', need: 1,
        count: (s, id) => s.communityMemberships.filter((m) => m.studentId === id && m.status === 'active').length },
      { id: 'org', title: 'Join a club', how: 'Become an active member of an organization.', cta: 'See organizations', to: () => '/organizations', need: 1,
        count: (s, id) => s.memberships.filter((m) => m.studentId === id && m.status === 'active').length },
      { id: 'voice', title: 'Find your voice', how: 'Start threads or reply in groups, five times in all.', cta: 'Join a conversation', to: () => '/community', need: 5,
        count: (s, id) => s.threads.filter((t) => t.authorId === id).length + s.threadReplies.filter((r) => r.authorId === id).length },
    ],
  },
  {
    id: 'build',
    name: 'Building together',
    tagline: 'Make something with others',
    why: 'Shared work makes the strongest ties. These stamps only come from working alongside other people.',
    stops: [
      { id: 'hand', title: 'Raise your hand', how: 'Start a project, or ask to join one.', cta: 'Browse projects', to: () => '/projects', need: 1,
        count: (s, id) => s.projects.filter((p) => p.ownerId === id).length + s.projectJoinRequests.filter((r) => r.studentId === id).length },
      { id: 'team', title: 'Teammate', how: 'Be an active member of a project with someone else.', cta: 'Browse projects', to: () => '/projects', need: 1,
        count: (s, id) => collabProjects(s, id).length },
      { id: 'ship', title: 'Shipped it', how: 'Finish a project you worked on with others.', cta: 'Your projects', to: () => '/projects', need: 1,
        count: (s, id) => collabProjects(s, id).filter((p) => p.status === 'completed').length },
    ],
  },
]

export interface PassportStop {
  id: string
  chapterId: ChapterId
  title: string
  how: string
  cta: string
  to: string
  earned: boolean
  have: number
  need: number
}

export interface PassportChapter {
  id: ChapterId
  number: number
  name: string
  tagline: string
  why: string
  stops: PassportStop[]
  earned: number
}

export interface PassportView {
  chapters: PassportChapter[]
  stops: PassportStop[]
  earned: number
  total: number
  next?: PassportStop
  complete: boolean
}

export function getPassport(s: PersistedAppState, studentId: string): PassportView {
  const chapters: PassportChapter[] = PASSPORT_ROUTE.map((c, i) => {
    const stops = c.stops.map<PassportStop>((d) => {
      const have = d.count(s, studentId)
      return { id: d.id, chapterId: c.id, title: d.title, how: d.how, cta: d.cta, to: d.to(studentId), earned: have >= d.need, have: Math.min(have, d.need), need: d.need }
    })
    return { id: c.id, number: i + 1, name: c.name, tagline: c.tagline, why: c.why, stops, earned: stops.filter((x) => x.earned).length }
  })
  const stops = chapters.flatMap((c) => c.stops)
  const earned = stops.filter((x) => x.earned).length
  return { chapters, stops, earned, total: stops.length, next: stops.find((x) => !x.earned), complete: earned === stops.length }
}
