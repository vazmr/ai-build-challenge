import type { PersistedAppState } from '../types'
import type { ThreadKind } from '../types'
import { newId, nowIso } from '../utils/id'

export type CommunityRelation = { following: boolean; member: boolean; participated: boolean }

export function relationFor(s: PersistedAppState, studentId: string, communityId: string): CommunityRelation {
  return {
    following: s.follows.some((f) => f.followerId === studentId && f.targetType === 'community' && f.targetId === communityId),
    member: s.communityMemberships.some((m) => m.studentId === studentId && m.communityId === communityId && m.status === 'active'),
    participated:
      s.threads.some((t) => t.communityId === communityId && t.authorId === studentId) ||
      s.threadReplies.some((r) => r.authorId === studentId && s.threads.find((t) => t.id === r.threadId)?.communityId === communityId),
  }
}

export function joinCommunity(s: PersistedAppState, studentId: string, communityId: string): PersistedAppState {
  if (relationFor(s, studentId, communityId).member) return s
  return { ...s, communityMemberships: [...s.communityMemberships, { id: newId('cmem'), communityId, studentId, role: 'participant', status: 'active' }] }
}

/** Founders cannot leave via this simple prototype action. */
export function leaveCommunity(s: PersistedAppState, studentId: string, communityId: string): PersistedAppState {
  return {
    ...s,
    communityMemberships: s.communityMemberships.filter(
      (m) => !(m.studentId === studentId && m.communityId === communityId && m.role !== 'founder'),
    ),
  }
}

/** Only active members may start threads or reply. Joining is explicit; following is not joining. */
export function createThread(s: PersistedAppState, studentId: string, communityId: string, title: string, body: string, kind: ThreadKind = 'discussion', linkUrl = ''): PersistedAppState {
  if (!relationFor(s, studentId, communityId).member || !title.trim()) return s
  const isLeader = s.communityMemberships.some((m) => m.communityId === communityId && m.studentId === studentId && (m.role === 'founder' || m.role === 'moderator'))
  const safeKind: ThreadKind = kind === 'announcement' && !isLeader ? 'discussion' : kind
  return { ...s, threads: [...s.threads, { id: newId('thr'), communityId, authorId: studentId, kind: safeKind, title: title.trim(), body: body.trim(), linkUrl: linkUrl.trim() || undefined, createdAt: nowIso() }] }
}

export function addReply(s: PersistedAppState, studentId: string, threadId: string, body: string): PersistedAppState {
  const thread = s.threads.find((t) => t.id === threadId)
  if (!thread || !body.trim() || !relationFor(s, studentId, thread.communityId).member) return s
  return { ...s, threadReplies: [...s.threadReplies, { id: newId('rep'), threadId, authorId: studentId, body: body.trim(), createdAt: nowIso() }] }
}

export function createCommunity(s: PersistedAppState, studentId: string, name: string, description: string, category: string, tags: string[]): PersistedAppState {
  if (!name.trim()) return s
  const id = newId('com')
  return {
    ...s,
    communities: [...s.communities, { id, name: name.trim(), description: description.trim(), category, tags, createdByStudentId: studentId, visibility: 'open', isOfficialOrganization: false }],
    communityMemberships: [...s.communityMemberships, { id: newId('cmem'), communityId: id, studentId, role: 'founder', status: 'active' }],
  }
}
