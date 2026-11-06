import { Pin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card, EmptyState, PageHeader } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { timeAgo } from '../../utils/format'

export function AnnouncementsPage() {
  const { state } = useAppState()
  const { orgName } = useDirectory()
  const list = [...state.announcements].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt))
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Announcements" description="Public announcements from the (fictional) demo campus and organizations." />
      {list.length === 0 ? <EmptyState title="No announcements" /> : (
        <ul className="space-y-3">{list.map((a) => (
          <li key={a.id}><Card>
            <div className="flex flex-wrap items-center gap-1.5">{a.pinned && <Badge tone="brand"><Pin aria-hidden className="mr-1 size-3" />Pinned</Badge>}<Badge>{orgName(a.organizationId) ?? 'Demo campus'}</Badge></div>
            <h2 className="mt-2 font-semibold">{a.title}</h2><p className="text-sm">{a.body}</p>
            <p className="mt-2 text-xs text-muted-foreground">{timeAgo(a.createdAt)}{a.organizationId && <> · <Link className="text-brand hover:underline" to={`/organizations/${a.organizationId}`}>View organization</Link></>}</p>
          </Card></li>
        ))}</ul>
      )}
    </div>
  )
}
