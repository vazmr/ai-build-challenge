import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AccessDenied, Badge, EmptyState, Tabs } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import type { OrganizationPermission } from '../../types'
import { activeMembershipIn, hasOrgPermission } from '../../utils/permissions'
import { ApplicationsTab, BoardTab, ChannelsTab, CollaborationTab, EventsTab, InquiriesTab, InvitationsTab, MembersTab } from './workspaceTabs'

type Tab = 'events' | 'channels' | 'members' | 'applications' | 'board' | 'invitations' | 'inquiries' | 'collaboration'

// null = any active member. Otherwise an explicit organization-scoped permission is required.
const TABS: { id: Tab; label: string; needs: OrganizationPermission | null }[] = [
  { id: 'channels', label: 'Announcements & Chat', needs: null },
  { id: 'members', label: 'Members', needs: 'org.view-members' },
  { id: 'applications', label: 'Applications', needs: 'org.review-applications' },
  { id: 'board', label: 'Board', needs: 'org.access-board' },
  { id: 'invitations', label: 'Invitations', needs: 'org.manage-invitations' },
  { id: 'inquiries', label: 'Student Inquiries', needs: 'org.read-inquiries' },
  { id: 'collaboration', label: 'Collaboration', needs: 'org.manage-invitations' },
  { id: 'events', label: 'Events', needs: 'org.manage-events' },
]

export function WorkspacePage() {
  const { organizationId = '' } = useParams()
  const { state, activeStudent } = useAppState()
  const [tab, setTab] = useState<Tab>('channels')
  const org = state.organizations.find((o) => o.id === organizationId)
  if (!org) return <EmptyState title="Organization not found" action={<Link to="/organizations" className="text-sm font-semibold text-brand hover:underline">Browse organizations</Link>} />

  const membership = activeMembershipIn(state, activeStudent.id, org.id)
  const back = <Link to={`/organizations/${org.id}`} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden className="size-4" /> {org.name}</Link>
  if (!membership) {
    return <div className="mx-auto max-w-2xl">{back}<AccessDenied title="Members only" description={`The ${org.name} workspace is only available to its members. Visit the organization page to request to join.`} /></div>
  }

  const visible = TABS.filter((t) => t.needs === null || hasOrgPermission(state, activeStudent.id, org.id, t.needs))
  const current = visible.some((t) => t.id === tab) ? tab : 'channels'

  return (
    <div className="mx-auto max-w-4xl">
      {back}
      <h1 className="text-2xl font-bold">{org.name} workspace</h1>
      <p className="mb-4 mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        Acting as {activeStudent.displayName} <Badge tone="brand">{membership.role.replace('-', ' ')}</Badge> in this organization only. Roles in other organizations don’t apply here.
      </p>
      <Tabs<Tab> label="Workspace sections" tabs={visible} value={current} onChange={setTab} />
      {current === 'channels' && <ChannelsTab orgId={org.id} />}
      {current === 'members' && <MembersTab orgId={org.id} />}
      {current === 'applications' && <ApplicationsTab orgId={org.id} />}
      {current === 'board' && <BoardTab orgId={org.id} />}
      {current === 'invitations' && <InvitationsTab orgId={org.id} />}
      {current === 'inquiries' && <InquiriesTab orgId={org.id} />}
      {current === 'collaboration' && <CollaborationTab orgId={org.id} />}
      {current === 'events' && <EventsTab orgId={org.id} />}
    </div>
  )
}
