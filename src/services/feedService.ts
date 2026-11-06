import type { PersistedAppState, Post } from '../types'
import { newId, nowIso } from '../utils/id'
import { blockedIdsFor } from './blockService'

export type FeedMode = 'for-you' | 'following' | 'discover'

const byNewest = (a: Post, b: Post) => b.createdAt.localeCompare(a.createdAt)

/** Posts the student may see: no one else's private posts, nothing they hid. */
function eligiblePosts(s: PersistedAppState, studentId: string): Post[] {
  const hidden = new Set(s.hiddenPosts.filter((h) => h.studentId === studentId).map((h) => h.postId))
  const blocked = blockedIdsFor(s, studentId)
  return s.posts.filter((p) => !hidden.has(p.id) && p.authorId !== studentId && p.visibility !== 'private' && !p.isDraft && !blocked.has(p.authorId))
}

/**
 * Feed selection. Ordering is recency only: no popularity signals (likes/follower counts)
 * are used, and private messages/memberships are never recommendation inputs.
 */
export function getFeed(s: PersistedAppState, studentId: string, mode: FeedMode): Post[] {
  const student = s.students.find((x) => x.id === studentId)
  const interests = new Set(student?.interests ?? [])
  const mine = s.follows.filter((f) => f.followerId === studentId)
  const followedStudents = new Set(mine.filter((f) => f.targetType === 'student').map((f) => f.targetId))
  const followedOrgs = new Set(mine.filter((f) => f.targetType === 'organization').map((f) => f.targetId))
  const isFollowed = (p: Post) =>
    followedStudents.has(p.authorId) || (p.organizationId !== undefined && followedOrgs.has(p.organizationId))
  const matchesInterest = (p: Post) => p.tags.some((t) => interests.has(t))

  const posts = eligiblePosts(s, studentId)
  const picked =
    mode === 'following' ? posts.filter(isFollowed)
    : mode === 'for-you' ? posts.filter((p) => isFollowed(p) || matchesInterest(p))
    : posts.filter((p) => !isFollowed(p))
  return [...picked].sort(byNewest)
}

export function hidePost(s: PersistedAppState, studentId: string, postId: string, reason: 'hidden' | 'not-interested'): PersistedAppState {
  return { ...s, hiddenPosts: [...s.hiddenPosts, { id: newId('hid'), studentId, postId, reason }] }
}

export const resetRecommendations = (s: PersistedAppState, studentId: string): PersistedAppState =>
  ({ ...s, hiddenPosts: s.hiddenPosts.filter((h) => h.studentId !== studentId) })

export function toggleInterest(s: PersistedAppState, studentId: string, tag: string): PersistedAppState {
  return {
    ...s,
    students: s.students.map((st) =>
      st.id !== studentId ? st : {
        ...st,
        interests: st.interests.includes(tag) ? st.interests.filter((t) => t !== tag) : [...st.interests, tag],
        updatedAt: nowIso(),
      }),
  }
}

export function addComment(s: PersistedAppState, studentId: string, postId: string, body: string): PersistedAppState {
  const text = body.trim()
  if (!text) return s
  return { ...s, comments: [...s.comments, { id: newId('com'), postId, authorId: studentId, body: text, createdAt: nowIso() }] }
}

export const commentsFor = (s: PersistedAppState, postId: string) =>
  s.comments.filter((c) => c.postId === postId).sort((a, b) => a.createdAt.localeCompare(b.createdAt))

export interface NewPostInput { type: Post['type']; title: string; body: string; linkUrl: string; tags: string[]; visibility: Post['visibility'] }

export function createPost(s: PersistedAppState, authorId: string, input: NewPostInput): PersistedAppState {
  if (!input.body.trim() && !input.title.trim()) return s
  const now = nowIso()
  return { ...s, posts: [...s.posts, { id: newId('post'), authorId, type: input.type, title: input.title.trim() || undefined, body: input.body.trim() || undefined, linkUrl: input.linkUrl.trim() || undefined, tags: input.tags, visibility: input.visibility, createdAt: now, updatedAt: now }] }
}

export function visibleComments(s: PersistedAppState, viewerId: string, postId: string) {
  const blocked = blockedIdsFor(s, viewerId)
  return commentsFor(s, postId).filter((c) => !blocked.has(c.authorId))
}
