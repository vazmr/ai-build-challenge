import type { OrgCollaboration, PersistedAppState } from '../types'
import { newId, nowIso } from '../utils/id'
import { hasOrgPermission } from '../utils/permissions'

const log = (c: OrgCollaboration, organizationId: string, text: string): OrgCollaboration =>
  ({ ...c, activity: [...c.activity, { id: newId('act'), organizationId, text, at: nowIso() }] })

export const collabsFor = (s: PersistedAppState, organizationId: string) =>
  s.orgCollaborations.filter((c) => c.organizationIds.includes(organizationId))

const orgName = (s: PersistedAppState, id: string) => s.organizations.find((o) => o.id === id)?.name ?? 'organization'

/** Only officers with invitation permission can act for their organization. */
export function inviteOrg(s: PersistedAppState, actorId: string, fromOrgId: string, toOrgId: string, projectTitle: string): PersistedAppState {
  if (fromOrgId === toOrgId || !projectTitle.trim() || !hasOrgPermission(s, actorId, fromOrgId, 'org.manage-invitations')) return s
  if (s.orgCollaborations.some((c) => c.organizationIds.includes(fromOrgId) && c.organizationIds.includes(toOrgId) && (c.status === 'pending' || c.status === 'active'))) return s
  const c: OrgCollaboration = { id: newId('collab'), organizationIds: [fromOrgId, toOrgId], status: 'pending', projectTitle: projectTitle.trim(), files: [], activity: [], createdAt: nowIso() }
  return { ...s, orgCollaborations: [...s.orgCollaborations, log(c, fromOrgId, `Invited ${orgName(s, toOrgId)} to collaborate`)] }
}

export function respondCollab(s: PersistedAppState, actorId: string, collabId: string, accept: boolean): PersistedAppState {
  const c = s.orgCollaborations.find((x) => x.id === collabId)
  if (!c || c.status !== 'pending' || !hasOrgPermission(s, actorId, c.organizationIds[1], 'org.manage-invitations')) return s
  const updated = log({ ...c, status: accept ? 'active' : 'declined' }, c.organizationIds[1], accept ? 'Accepted the collaboration' : 'Declined the collaboration')
  return { ...s, orgCollaborations: s.orgCollaborations.map((x) => (x.id === collabId ? updated : x)) }
}

/** Either side can revoke; shared files stop being accessible once revoked. */
export function revokeCollab(s: PersistedAppState, actorId: string, organizationId: string, collabId: string): PersistedAppState {
  const c = s.orgCollaborations.find((x) => x.id === collabId)
  if (!c || c.status !== 'active' || !c.organizationIds.includes(organizationId) || !hasOrgPermission(s, actorId, organizationId, 'org.manage-invitations')) return s
  const updated = log({ ...c, status: 'revoked' }, organizationId, 'Revoked shared access')
  return { ...s, orgCollaborations: s.orgCollaborations.map((x) => (x.id === collabId ? updated : x)) }
}

/** File metadata only; the prototype hosts no real files. */
export function shareFile(s: PersistedAppState, actorId: string, organizationId: string, collabId: string, name: string, permission: 'view' | 'edit'): PersistedAppState {
  const c = s.orgCollaborations.find((x) => x.id === collabId)
  if (!c || c.status !== 'active' || !name.trim() || !c.organizationIds.includes(organizationId) || !hasOrgPermission(s, actorId, organizationId, 'org.manage-invitations')) return s
  const updated = log({ ...c, files: [...c.files, { id: newId('file'), name: name.trim(), sharedByOrgId: organizationId, permission }] }, organizationId, `Shared "${name.trim()}" (${permission})`)
  return { ...s, orgCollaborations: s.orgCollaborations.map((x) => (x.id === collabId ? updated : x)) }
}
