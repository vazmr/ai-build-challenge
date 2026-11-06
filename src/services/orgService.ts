import type { OrganizationRole, PersistedAppState } from '../types'
import { newId, nowIso } from '../utils/id'
import { hasOrgPermission, permissionsForRole } from '../utils/permissions'
import { notify } from './notificationsService'

const orgName = (s: PersistedAppState, id: string) => s.organizations.find((o) => o.id === id)?.name ?? 'an organization'

export const activeOrgMembers = (s: PersistedAppState, organizationId: string) =>
  s.memberships.filter((m) => m.organizationId === organizationId && m.status === 'active')

export const isActiveMember = (s: PersistedAppState, studentId: string, organizationId: string) =>
  activeOrgMembers(s, organizationId).some((m) => m.studentId === studentId)

export const applicationFor = (s: PersistedAppState, studentId: string, organizationId: string) =>
  [...s.orgApplications].reverse().find((a) => a.studentId === studentId && a.organizationId === organizationId)

/** Student-initiated "Request to Join". Never grants membership by itself. */
export function applyToOrg(s: PersistedAppState, studentId: string, organizationId: string, message: string): PersistedAppState {
  if (isActiveMember(s, studentId, organizationId) || applicationFor(s, studentId, organizationId)?.status === 'pending') return s
  return { ...s, orgApplications: [...s.orgApplications, { id: newId('app'), organizationId, studentId, message: message.trim() || undefined, status: 'pending', createdAt: nowIso() }] }
}

export function decideApplication(s: PersistedAppState, actorId: string, applicationId: string, approve: boolean): PersistedAppState {
  const app = s.orgApplications.find((a) => a.id === applicationId)
  if (!app || app.status !== 'pending' || !hasOrgPermission(s, actorId, app.organizationId, 'org.review-applications')) return s
  let next: PersistedAppState = { ...s, orgApplications: s.orgApplications.map((a) => (a.id === applicationId ? { ...a, status: approve ? 'approved' : 'declined' } : a)) }
  if (approve) {
    next = {
      ...next,
      memberships: [...next.memberships.filter((m) => !(m.studentId === app.studentId && m.organizationId === app.organizationId)),
        { id: newId('mem'), organizationId: app.organizationId, studentId: app.studentId, role: 'member', status: 'active', permissions: permissionsForRole('member'), joinedAt: nowIso() }],
    }
  }
  return notify(next, app.studentId, approve ? 'Application approved' : 'Application declined',
    `Your request to join ${orgName(s, app.organizationId)} was ${approve ? 'approved' : 'declined'}.`, `/organizations/${app.organizationId}`)
}

const isPresident = (s: PersistedAppState, studentId: string, organizationId: string) =>
  s.memberships.some((m) => m.studentId === studentId && m.organizationId === organizationId && m.status === 'active' && m.role === 'president')

/** Changes a member's role and resets their permissions to the explicit preset for that role. */
export function changeRole(s: PersistedAppState, actorId: string, membershipId: string, role: OrganizationRole): PersistedAppState {
  const target = s.memberships.find((m) => m.id === membershipId)
  if (!target || target.status !== 'active' || !hasOrgPermission(s, actorId, target.organizationId, 'org.manage-members')) return s
  if (target.role === 'president' || role === 'president' || target.studentId === actorId) return s // use transfer / no self-edit
  return { ...s, memberships: s.memberships.map((m) => (m.id === membershipId ? { ...m, role, permissions: permissionsForRole(role) } : m)) }
}

export function deactivateMember(s: PersistedAppState, actorId: string, membershipId: string): PersistedAppState {
  const target = s.memberships.find((m) => m.id === membershipId)
  if (!target || !hasOrgPermission(s, actorId, target.organizationId, 'org.manage-members')) return s
  if (target.role === 'president' || target.studentId === actorId) return s
  return { ...s, memberships: s.memberships.map((m) => (m.id === membershipId ? { ...m, status: 'inactive' as const, permissions: [] } : m)) }
}

export function transferPresidency(s: PersistedAppState, actorId: string, organizationId: string, targetStudentId: string): PersistedAppState {
  if (!isPresident(s, actorId, organizationId) || actorId === targetStudentId || !isActiveMember(s, targetStudentId, organizationId)) return s
  const flip = (m: PersistedAppState['memberships'][number]) => {
    if (m.organizationId !== organizationId || m.status !== 'active') return m
    if (m.studentId === actorId) return { ...m, role: 'vice-president' as const, permissions: permissionsForRole('vice-president') }
    if (m.studentId === targetStudentId) return { ...m, role: 'president' as const, permissions: permissionsForRole('president') }
    return m
  }
  return notify({ ...s, memberships: s.memberships.map(flip) }, targetStudentId, 'You are now president', `You were made president of ${orgName(s, organizationId)}.`, `/organizations/${organizationId}/workspace`)
}

export function inviteStudent(s: PersistedAppState, actorId: string, organizationId: string, studentId: string): PersistedAppState {
  if (!hasOrgPermission(s, actorId, organizationId, 'org.manage-invitations') || isActiveMember(s, studentId, organizationId)) return s
  if (s.orgInvitations.some((i) => i.organizationId === organizationId && i.studentId === studentId && i.status === 'pending')) return s
  const next = { ...s, orgInvitations: [...s.orgInvitations, { id: newId('inv'), organizationId, studentId, invitedById: actorId, status: 'pending' as const, createdAt: nowIso() }] }
  return notify(next, studentId, `Invitation from ${orgName(s, organizationId)}`, 'You have been invited to join.', `/organizations/${organizationId}`)
}

export function revokeInvitation(s: PersistedAppState, actorId: string, invitationId: string): PersistedAppState {
  const inv = s.orgInvitations.find((i) => i.id === invitationId)
  if (!inv || inv.status !== 'pending' || !hasOrgPermission(s, actorId, inv.organizationId, 'org.manage-invitations')) return s
  return { ...s, orgInvitations: s.orgInvitations.map((i) => (i.id === invitationId ? { ...i, status: 'revoked' as const } : i)) }
}

/** The invited student explicitly accepts or declines. */
export function respondToInvitation(s: PersistedAppState, studentId: string, invitationId: string, accept: boolean): PersistedAppState {
  const inv = s.orgInvitations.find((i) => i.id === invitationId)
  if (!inv || inv.studentId !== studentId || inv.status !== 'pending') return s
  const next = { ...s, orgInvitations: s.orgInvitations.map((i) => (i.id === invitationId ? { ...i, status: accept ? ('accepted' as const) : ('declined' as const) } : i)) }
  if (!accept) return next
  return { ...next, memberships: [...next.memberships.filter((m) => !(m.studentId === studentId && m.organizationId === inv.organizationId)),
    { id: newId('mem'), organizationId: inv.organizationId, studentId, role: 'member', status: 'active', permissions: permissionsForRole('member'), joinedAt: nowIso() }] }
}

// ---- inquiries (shared inbox) ----
export function askQuestion(s: PersistedAppState, studentId: string, organizationId: string, subject: string, body: string): PersistedAppState {
  if (!subject.trim() || !body.trim()) return s
  return { ...s, inquiries: [...s.inquiries, { id: newId('inq'), organizationId, studentId, subject: subject.trim(), body: body.trim(), status: 'new', replies: [], createdAt: nowIso() }] }
}

const canInbox = (s: PersistedAppState, actorId: string, orgId: string) => hasOrgPermission(s, actorId, orgId, 'org.read-inquiries')

export function replyToInquiry(s: PersistedAppState, actorId: string, inquiryId: string, body: string): PersistedAppState {
  const q = s.inquiries.find((i) => i.id === inquiryId)
  if (!q || !body.trim() || !canInbox(s, actorId, q.organizationId)) return s
  const next = { ...s, inquiries: s.inquiries.map((i) => (i.id === inquiryId ? { ...i, status: 'replied' as const, replies: [...i.replies, { id: newId('ir'), authorId: actorId, body: body.trim(), createdAt: nowIso() }] } : i)) }
  return notify(next, q.studentId, `Reply from ${orgName(s, q.organizationId)}`, `Re: ${q.subject}`, `/organizations/${q.organizationId}`)
}

export function setInquiryStatus(s: PersistedAppState, actorId: string, inquiryId: string, status: 'new' | 'assigned' | 'replied' | 'closed'): PersistedAppState {
  const q = s.inquiries.find((i) => i.id === inquiryId)
  if (!q || !canInbox(s, actorId, q.organizationId)) return s
  return { ...s, inquiries: s.inquiries.map((i) => (i.id === inquiryId ? { ...i, status, assignedToId: status === 'assigned' ? actorId : i.assignedToId } : i)) }
}

// ---- announcements / interest ----
export function postAnnouncement(s: PersistedAppState, actorId: string, organizationId: string, title: string, body: string, pinned: boolean): PersistedAppState {
  if (!title.trim() || !hasOrgPermission(s, actorId, organizationId, 'org.post-announcements')) return s
  const cleared = pinned ? s.announcements.map((a) => (a.organizationId === organizationId ? { ...a, pinned: false } : a)) : s.announcements
  return { ...s, announcements: [...cleared, { id: newId('ann'), organizationId, authorId: actorId, title: title.trim(), body: body.trim(), pinned, createdAt: nowIso() }] }
}

export const isInterested = (s: PersistedAppState, studentId: string, organizationId: string) =>
  s.orgInterests.some((i) => i.studentId === studentId && i.organizationId === organizationId)

export function toggleInterested(s: PersistedAppState, studentId: string, organizationId: string): PersistedAppState {
  return isInterested(s, studentId, organizationId)
    ? { ...s, orgInterests: s.orgInterests.filter((i) => !(i.studentId === studentId && i.organizationId === organizationId)) }
    : { ...s, orgInterests: [...s.orgInterests, { id: newId('oi'), studentId, organizationId }] }
}
