import { Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Badge, Card, EmptyState, Faces, Input, PageHeader, Tags } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { CoverArt } from '../../components/shared/CoverArt'
import { activeOrgMembers, isActiveMember } from '../../services/orgService'

function OrgFaces({ state, orgId }: { state: ReturnType<typeof useAppState>['state']; orgId: string }) {
  const members = activeOrgMembers(state, orgId)
  const names = members.map((m) => state.students.find((s) => s.id === m.studentId)?.displayName).filter((n): n is string => !!n)
  return <Faces names={names} total={members.length} label={`${members.length} ${members.length === 1 ? 'member' : 'members'}`} />
}

export function OrganizationsPage() {
  const { state, activeStudent } = useAppState()
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const list = state.organizations.filter((o) => !q || `${o.name} ${o.description} ${o.tags.join(' ')}`.toLowerCase().includes(q))
  return (
    <div>
      <PageHeader title="Organizations" description="Student organizations on campus. Different from informal Community groups." />
      <div className="relative mb-4 max-w-md">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input aria-label="Search organizations" placeholder="Search organizations" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {list.length === 0 ? <EmptyState title="No organizations found" /> : (
        <div className="grid gap-4 md:grid-cols-2">{list.map((o) => (
          <Card key={o.id} className="!p-0 overflow-hidden">
            <CoverArt seed={o.id + 'cover'} className="h-14" />
            <div className="p-4 pt-0">
              <span className="-mt-5 inline-block rounded-full ring-4 ring-surface"><Avatar name={o.name} size={40} /></span>
              <div className="mt-2 flex flex-wrap gap-1.5">{isActiveMember(state, activeStudent.id, o.id) && <Badge tone="success">Member</Badge>}</div>
              <h2 className="mt-2 font-semibold"><Link to={`/organizations/${o.id}`} className="hover:underline">{o.name}</Link></h2>
              <p className="mt-1 text-sm text-muted-foreground">{o.description}</p>
              <div className="mt-2"><Tags tags={o.tags} /></div>
              <div className="mt-3"><OrgFaces state={state} orgId={o.id} /></div>
            </div>
          </Card>
        ))}</div>
      )}
    </div>
  )
}
