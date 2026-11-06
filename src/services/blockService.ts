import type { PersistedAppState } from '../types'
import { newId } from '../utils/id'

export const blockedIdsFor = (s: PersistedAppState, studentId: string) =>
  new Set(s.blocks.filter((b) => b.studentId === studentId).map((b) => b.blockedId))

export const isBlocked = (s: PersistedAppState, studentId: string, otherId: string) => blockedIdsFor(s, studentId).has(otherId)

/** Blocking is private. Blocked students' posts, comments and replies are hidden from the blocker. */
export function toggleBlock(s: PersistedAppState, studentId: string, otherId: string): PersistedAppState {
  if (studentId === otherId) return s
  return isBlocked(s, studentId, otherId)
    ? { ...s, blocks: s.blocks.filter((b) => !(b.studentId === studentId && b.blockedId === otherId)) }
    : { ...s, blocks: [...s.blocks, { id: newId('blk'), studentId, blockedId: otherId }], follows: s.follows.filter((f) => !(f.followerId === studentId && f.targetType === 'student' && f.targetId === otherId)) }
}
