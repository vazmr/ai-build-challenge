import { Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Card, EmptyState, Input, PageHeader, Tags } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { activeOrgMembers, isActiveMember } from '../../services/orgService'

export function OrganizationsPage() {
  const { state, activeStudent } = useAppState()
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const list = state.organizations.filter((o) => !q || `${o.name} ${o.description} ${o.tags.join(' ')}`.toLowerCase().includes(q))
  return (
    <div>
      <PageHeader title="Organizations" description="Fictional demo organizations. None are officially recognized or verified. They are different from informal Community groups." />
      <div className="relative mb-4 max-w-md">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input aria-label="Search organizations" placeholder="Search organizations" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {list.length === 0 ? <EmptyState title="No organizations found" /> : (
        <div className="grid gap-4 md:grid-cols-2">{list.map((o) => (
          <Card key={o.id}>
            <div className="flex flex-wrap gap-1.5"><Badge tone="warning">Demo organization</Badge>{isActiveMember(state, activeStudent.id, o.id) && <Badge tone="success">Member</Badge>}</div>
            <h2 className="mt-2 font-semibold"><Link to={`/organizations/${o.id}`} className="hover:underline">{o.name}</Link></h2>
            <p className="mt-1 text-sm text-muted-foreground">{o.description}</p>
            <div className="mt-2"><Tags tags={o.tags} /></div>
            <p className="mt-2 text-xs text-muted-foreground">{activeOrgMembers(state, o.id).length} members (sample count)</p>
          </Card>
        ))}</div>
      )}
    </div>
  )
}
