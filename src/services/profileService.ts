import type { PersistedAppState, Post, Visibility } from '../types'
import { newId, nowIso } from '../utils/id'
import { activeMembers } from './projectsService'
import { blockedIdsFor } from './blockService'

export type ProfileSection = 'overview' | 'blog' | 'collections' | 'portfolio' | 'collaborations' | 'about'
export const PROFILE_SECTIONS: { id: ProfileSection; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'blog', label: 'My Blog' },
  { id: 'collections', label: 'Collections' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'collaborations', label: 'Collaborations' },
  { id: 'about', label: 'About' },
]

/** Exactly four public metrics, each derived from qualifying records (never stored). */
export function profileMetrics(s: PersistedAppState, studentId: string) {
  const memberOf = s.projects.filter((p) => activeMembers(s, p.id).some((m) => m.studentId === studentId))
  return {
    organizations: s.memberships.filter((m) => m.studentId === studentId && m.status === 'active').length,
    projects: memberOf.length,
    eventsAttended: s.eventParticipations.filter((p) => p.studentId === studentId && p.state === 'attended').length,
    // Collaboration = real shared work: a project where the student and at least one other person are active members.
    collaborations: memberOf.filter((p) => activeMembers(s, p.id).some((m) => m.studentId !== studentId)).length,
  }
}

/** Owners see everything. Others see a section unless it is private ("temple-only" is simulated as visible). */
export function canViewSection(s: PersistedAppState, viewerId: string, ownerId: string, section: ProfileSection): boolean {
  if (viewerId === ownerId) return true
  const level = s.students.find((x) => x.id === ownerId)?.privacy[section] ?? 'private'
  return level !== 'private'
}

export function setSectionVisibility(s: PersistedAppState, studentId: string, section: ProfileSection, level: Visibility): PersistedAppState {
  return { ...s, students: s.students.map((st) => (st.id === studentId ? { ...st, privacy: { ...st.privacy, [section]: level }, updatedAt: nowIso() } : st)) }
}

export function blogPostsFor(s: PersistedAppState, viewerId: string, ownerId: string): Post[] {
  if (blockedIdsFor(s, viewerId).has(ownerId)) return []
  return s.posts
    .filter((p) => p.authorId === ownerId && (viewerId === ownerId || (p.visibility !== 'private' && !p.isDraft)))
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.createdAt.localeCompare(a.createdAt))
}

export function addBlogPost(s: PersistedAppState, studentId: string, input: { title: string; body: string; tags: string[]; visibility: Visibility; draft?: boolean }): PersistedAppState {
  if (!input.body.trim()) return s
  const now = nowIso()
  return { ...s, posts: [...s.posts, { id: newId('post'), authorId: studentId, type: 'text', title: input.title.trim() || undefined, body: input.body.trim(), tags: input.tags, visibility: input.draft ? 'private' : input.visibility, isDraft: input.draft || undefined, createdAt: now, updatedAt: now }] }
}

export const collectionsFor = (s: PersistedAppState, viewerId: string, ownerId: string) =>
  s.collections.filter((c) => c.ownerId === ownerId && (viewerId === ownerId || c.visibility !== 'private'))

export const portfolioFor = (s: PersistedAppState, viewerId: string, ownerId: string) =>
  s.portfolioItems.filter((p) => p.ownerId === ownerId && (viewerId === ownerId || p.visibility !== 'private'))

/** Projects shown on someone else's profile never include private (unpublished) workspaces. */
export function collaborationProjectsFor(s: PersistedAppState, viewerId: string, ownerId: string) {
  return s.projects
    .filter((p) => activeMembers(s, p.id).some((m) => m.studentId === ownerId))
    .filter((p) => viewerId === ownerId || p.isPublished || p.status === 'completed' || activeMembers(s, p.id).some((m) => m.studentId === viewerId))
    .map((p) => ({ project: p, membership: activeMembers(s, p.id).find((m) => m.studentId === ownerId)! }))
}

export const togglePinPost = (s: PersistedAppState, studentId: string, postId: string): PersistedAppState =>
  ({ ...s, posts: s.posts.map((p) => (p.id === postId && p.authorId === studentId ? { ...p, pinned: !p.pinned } : p)) })

export const publishDraft = (s: PersistedAppState, studentId: string, postId: string, visibility: Visibility): PersistedAppState =>
  ({ ...s, posts: s.posts.map((p) => (p.id === postId && p.authorId === studentId ? { ...p, isDraft: undefined, visibility, updatedAt: nowIso() } : p)) })

export function createCollection(s: PersistedAppState, ownerId: string, title: string, description: string, visibility: Visibility): PersistedAppState {
  if (!title.trim()) return s
  return { ...s, collections: [...s.collections, { id: newId('col'), ownerId, title: title.trim(), description: description.trim() || undefined, visibility, itemIds: [] }] }
}

export function addToCollection(s: PersistedAppState, ownerId: string, collectionId: string, postId: string): PersistedAppState {
  return { ...s, collections: s.collections.map((c) => (c.id === collectionId && c.ownerId === ownerId && !c.itemIds.includes(postId) ? { ...c, itemIds: [...c.itemIds, postId] } : c)) }
}

export const removeFromCollection = (s: PersistedAppState, ownerId: string, collectionId: string, postId: string): PersistedAppState =>
  ({ ...s, collections: s.collections.map((c) => (c.id === collectionId && c.ownerId === ownerId ? { ...c, itemIds: c.itemIds.filter((i) => i !== postId) } : c)) })

export function createPortfolioItem(s: PersistedAppState, ownerId: string, i: { title: string; description: string; category: string; skills: string[]; credits: string[]; linkUrl: string; visibility: Visibility }): PersistedAppState {
  if (!i.title.trim()) return s
  return { ...s, portfolioItems: [...s.portfolioItems, { id: newId('port'), ownerId, title: i.title.trim(), description: i.description.trim() || undefined, category: i.category, skills: i.skills, credits: i.credits, linkUrl: i.linkUrl.trim() || undefined, visibility: i.visibility }] }
}

export const deletePortfolioItem = (s: PersistedAppState, ownerId: string, id: string): PersistedAppState =>
  ({ ...s, portfolioItems: s.portfolioItems.filter((p) => !(p.id === id && p.ownerId === ownerId)) })

export const setTheme = (s: PersistedAppState, studentId: string, theme: number): PersistedAppState =>
  ({ ...s, students: s.students.map((st) => (st.id === studentId ? { ...st, theme, updatedAt: nowIso() } : st)) })

export function moveSection(s: PersistedAppState, studentId: string, section: ProfileSection, dir: -1 | 1): PersistedAppState {
  const st = s.students.find((x) => x.id === studentId)
  if (!st) return s
  const order: ProfileSection[] = orderedSections(st.sectionOrder)
  const i = order.indexOf(section)
  const j = i + dir
  if (i < 0 || j < 0 || j >= order.length) return s
  const next = [...order]
  ;[next[i], next[j]] = [next[j], next[i]]
  return { ...s, students: s.students.map((x) => (x.id === studentId ? { ...x, sectionOrder: next, updatedAt: nowIso() } : x)) }
}

/** Overview always comes first; the rest follow the student's chosen order. */
export function orderedSections(saved?: string[]): ProfileSection[] {
  const rest: ProfileSection[] = PROFILE_SECTIONS.map((p) => p.id).filter((id) => id !== 'overview')
  const custom = (saved ?? []).filter((id): id is ProfileSection => rest.includes(id as ProfileSection))
  return [...custom, ...rest.filter((id) => !custom.includes(id))]
}
