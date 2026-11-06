import type { OrganizationPermission, OrganizationRole, PersistedAppState } from '../types'

/** Permissions are organization-scoped and explicit; role labels never grant access. */
export function hasOrgPermission(
  state: PersistedAppState,
  studentId: string,
  organizationId: string,
  permission: OrganizationPermission,
): boolean {
  return state.memberships.some(
    (m) =>
      m.studentId === studentId &&
      m.organizationId === organizationId &&
      m.status === 'active' &&
      m.permissions.includes(permission),
  )
}

export const canAccessOrgBoard = (s: PersistedAppState, studentId: string, orgId: string) =>
  hasOrgPermission(s, studentId, orgId, 'org.access-board')

export const canReviewApplications = (s: PersistedAppState, studentId: string, orgId: string) =>
  hasOrgPermission(s, studentId, orgId, 'org.review-applications')

/** Only the owner or an accepted, active project member may open the private workspace. */
export function canAccessProjectWorkspace(
  state: PersistedAppState,
  studentId: string,
  projectId: string,
): boolean {
  const project = state.projects.find((p) => p.id === projectId)
  if (!project) return false
  if (project.ownerId === studentId) return true
  return state.projectMemberships.some(
    (m) => m.projectId === projectId && m.studentId === studentId && m.status === 'active',
  )
}

const OFFICER: OrganizationPermission[] = [
  'org.view-members', 'org.review-applications', 'org.manage-members',
  'org.access-board', 'org.manage-invitations', 'org.read-inquiries', 'org.post-announcements', 'org.manage-events',
]

/**
 * Explicit permission presets applied when a role is assigned. Memberships store the resulting
 * list, and checks always read the stored list, never the role label.
 */
export function permissionsForRole(role: OrganizationRole): OrganizationPermission[] {
  switch (role) {
    case 'president':
    case 'vice-president':
      return OFFICER
    case 'secretary':
      return ['org.view-members', 'org.access-board', 'org.review-applications', 'org.read-inquiries']
    case 'treasurer':
    case 'board-member':
      return ['org.view-members', 'org.access-board']
    default:
      return ['org.view-members']
  }
}

export const activeMembershipIn = (s: PersistedAppState, studentId: string, organizationId: string) =>
  s.memberships.find((m) => m.studentId === studentId && m.organizationId === organizationId && m.status === 'active')
