import type { FoundingWorkspace, PersistedAppState } from '../types'
import { newId, nowIso } from '../utils/id'
import { notify } from './notificationsService'

export const CHECKLIST = [
  'Agree on a purpose and name',
  'Identify founding roles',
  'Draft a short constitution or bylaws',
  'Confirm the current official recognition steps with Temple sources',
]

export const workspaceFor = (s: PersistedAppState, communityId: string) => s.foundingWorkspaces.find((w) => w.communityId === communityId)

/** Only explicitly accepted founders (and the owner) can see the private workspace. */
export const canAccessFounding = (w: FoundingWorkspace | undefined, studentId: string) =>
  !!w && (w.ownerId === studentId || w.founders.some((f) => f.studentId === studentId && f.status === 'accepted'))

export function startFounding(s: PersistedAppState, studentId: string, communityId: string): PersistedAppState {
  const isFounder = s.communityMemberships.some((m) => m.communityId === communityId && m.studentId === studentId && m.role === 'founder')
  if (!isFounder || workspaceFor(s, communityId)) return s
  const w: FoundingWorkspace = {
    id: newId('fw'), communityId, ownerId: studentId, founders: [], notes: '', stage: 'founding', createdAt: nowIso(),
    checklist: CHECKLIST.map((label) => ({ id: newId('ck'), label, done: false })),
  }
  return { ...s, foundingWorkspaces: [...s.foundingWorkspaces, w] }
}

const patch = (s: PersistedAppState, id: string, fn: (w: FoundingWorkspace) => FoundingWorkspace): PersistedAppState =>
  ({ ...s, foundingWorkspaces: s.foundingWorkspaces.map((w) => (w.id === id ? fn(w) : w)) })

/** Public followers are NOT automatically founders: the owner invites and the invitee must accept. */
export function inviteFounder(s: PersistedAppState, ownerId: string, workspaceId: string, studentId: string): PersistedAppState {
  const w = s.foundingWorkspaces.find((x) => x.id === workspaceId)
  if (!w || w.ownerId !== ownerId || studentId === ownerId || w.founders.some((f) => f.studentId === studentId && f.status !== 'declined')) return s
  const next = patch(s, workspaceId, (x) => ({ ...x, founders: [...x.founders.filter((f) => f.studentId !== studentId), { studentId, status: 'invited' }] }))
  return notify(next, studentId, 'Founding invitation', 'You were invited to a private founding workspace.', `/community/${w.communityId}/founding`)
}

export function respondFounder(s: PersistedAppState, studentId: string, workspaceId: string, accept: boolean): PersistedAppState {
  return patch(s, workspaceId, (w) => ({ ...w, founders: w.founders.map((f) => (f.studentId === studentId && f.status === 'invited' ? { ...f, status: accept ? 'accepted' : 'declined' } : f)) }))
}

export const toggleChecklist = (s: PersistedAppState, studentId: string, workspaceId: string, itemId: string) =>
  canAccessFounding(s.foundingWorkspaces.find((w) => w.id === workspaceId), studentId)
    ? patch(s, workspaceId, (w) => ({ ...w, checklist: w.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)) }))
    : s

export const setNotes = (s: PersistedAppState, studentId: string, workspaceId: string, notes: string) =>
  canAccessFounding(s.foundingWorkspaces.find((w) => w.id === workspaceId), studentId) ? patch(s, workspaceId, (w) => ({ ...w, notes })) : s

export const advanceStage = (s: PersistedAppState, ownerId: string, workspaceId: string) =>
  s.foundingWorkspaces.find((w) => w.id === workspaceId)?.ownerId === ownerId ? patch(s, workspaceId, (w) => ({ ...w, stage: 'recognition-prep' })) : s
