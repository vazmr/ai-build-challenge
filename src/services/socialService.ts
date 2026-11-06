import type { PersistedAppState, Follow, SavedItem } from '../types'
import { newId, nowIso } from '../utils/id'

type FollowTarget = Follow['targetType']
type SavedType = SavedItem['itemType']

export const isFollowing = (s: PersistedAppState, followerId: string, type: FollowTarget, targetId: string) =>
  s.follows.some((f) => f.followerId === followerId && f.targetType === type && f.targetId === targetId)

/** Following is private and one-way. Never expose counts or lists to other students. */
export function toggleFollow(s: PersistedAppState, followerId: string, type: FollowTarget, targetId: string): PersistedAppState {
  if (type === 'student' && followerId === targetId) return s
  if (isFollowing(s, followerId, type, targetId)) {
    return { ...s, follows: s.follows.filter((f) => !(f.followerId === followerId && f.targetType === type && f.targetId === targetId)) }
  }
  return { ...s, follows: [...s.follows, { id: newId('fol'), followerId, targetType: type, targetId, createdAt: nowIso() }] }
}

export const isSaved = (s: PersistedAppState, studentId: string, type: SavedType, itemId: string) =>
  s.savedItems.some((i) => i.studentId === studentId && i.itemType === type && i.itemId === itemId)

export function toggleSaved(s: PersistedAppState, studentId: string, type: SavedType, itemId: string): PersistedAppState {
  if (isSaved(s, studentId, type, itemId)) {
    return { ...s, savedItems: s.savedItems.filter((i) => !(i.studentId === studentId && i.itemType === type && i.itemId === itemId)) }
  }
  return { ...s, savedItems: [...s.savedItems, { id: newId('sav'), studentId, itemType: type, itemId, createdAt: nowIso() }] }
}
