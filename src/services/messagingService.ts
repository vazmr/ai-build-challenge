import type { Conversation, PersistedAppState } from '../types'
import { newId, nowIso } from '../utils/id'
import { canAccessProjectWorkspace, hasOrgPermission } from '../utils/permissions'
import { isActiveMember } from './orgService'

/**
 * Conversation access is checked against explicit membership/permissions.
 * Board access never implies access to anyone's direct messages.
 */
export function canAccessConversation(s: PersistedAppState, studentId: string, c: Conversation): boolean {
  switch (c.type) {
    case 'organization-board': return !!c.organizationId && hasOrgPermission(s, studentId, c.organizationId, 'org.access-board')
    case 'organization-members': return !!c.organizationId && isActiveMember(s, studentId, c.organizationId)
    case 'organization-inquiries': return !!c.organizationId && hasOrgPermission(s, studentId, c.organizationId, 'org.read-inquiries')
    case 'project': return !!c.projectId && canAccessProjectWorkspace(s, studentId, c.projectId)
    default: return c.participantIds.includes(studentId)
  }
}

export const messagesIn = (s: PersistedAppState, conversationId: string) =>
  s.messages.filter((m) => m.conversationId === conversationId).sort((a, b) => a.createdAt.localeCompare(b.createdAt))

export function sendMessage(s: PersistedAppState, studentId: string, conversationId: string, body: string): PersistedAppState {
  const c = s.conversations.find((x) => x.id === conversationId)
  if (!c || !body.trim() || !canAccessConversation(s, studentId, c)) return s
  return { ...s, messages: [...s.messages, { id: newId('msg'), conversationId, senderId: studentId, body: body.trim(), createdAt: nowIso() }] }
}

export const orgChannel = (s: PersistedAppState, organizationId: string, type: 'organization-board' | 'organization-members') =>
  s.conversations.find((c) => c.organizationId === organizationId && c.type === type)

export const directConversationsFor = (s: PersistedAppState, studentId: string) =>
  s.conversations.filter((c) => c.type === 'direct' && c.participantIds.includes(studentId))

/** Returns the existing 1:1 conversation id, creating it when needed. */
export function ensureDirect(s: PersistedAppState, a: string, b: string): { state: PersistedAppState; id: string } {
  const existing = s.conversations.find((c) => c.type === 'direct' && c.participantIds.length === 2 && c.participantIds.includes(a) && c.participantIds.includes(b))
  if (existing) return { state: s, id: existing.id }
  const id = newId('conv')
  return { id, state: { ...s, conversations: [...s.conversations, { id, type: 'direct', participantIds: [a, b] }] } }
}

export const projectConversation = (s: PersistedAppState, projectId: string) =>
  s.conversations.find((c) => c.type === 'project' && c.projectId === projectId)

export function ensureProjectConversation(s: PersistedAppState, projectId: string): { state: PersistedAppState; id: string } {
  const existing = projectConversation(s, projectId)
  if (existing) return { state: s, id: existing.id }
  const id = newId('conv')
  return { id, state: { ...s, conversations: [...s.conversations, { id, type: 'project', projectId, participantIds: [], title: 'Team chat' }] } }
}

export const customChannelsFor = (s: PersistedAppState, studentId: string, organizationId: string) =>
  s.conversations.filter((c) => c.type === 'custom' && c.organizationId === organizationId && canAccessConversation(s, studentId, c))

/** Custom topic channels list explicit participants; officers with member-management permission create them. */
export function createCustomChannel(s: PersistedAppState, actorId: string, organizationId: string, title: string, memberIds: string[]): PersistedAppState {
  if (!title.trim() || !hasOrgPermission(s, actorId, organizationId, 'org.manage-members')) return s
  const valid = memberIds.filter((id) => isActiveMember(s, id, organizationId))
  const participantIds = [...new Set([actorId, ...valid])]
  return { ...s, conversations: [...s.conversations, { id: newId('conv'), type: 'custom', organizationId, participantIds, title: title.trim() }] }
}

/** Each organization keeps its own private internal chat about a shared collaboration (board-level access). */
export function ensureCollabChat(s: PersistedAppState, organizationId: string, collabId: string, title: string): { state: PersistedAppState; id: string } {
  const id = `conv-collab-${collabId}-${organizationId}`
  if (s.conversations.some((c) => c.id === id)) return { state: s, id }
  return { id, state: { ...s, conversations: [...s.conversations, { id, type: 'organization-board', organizationId, participantIds: [], title }] } }
}
