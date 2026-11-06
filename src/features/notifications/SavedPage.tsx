import { Link } from 'react-router-dom'
import { Badge, Card, EmptyState, PageHeader } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { timeAgo } from '../../utils/format'

/** Private to the signed-in student. Lists items saved from the feed, events, projects and resources. */
export function SavedPage() {
  const { state, activeStudent } = useAppState()
  const items = state.savedItems.filter((i) => i.studentId === activeStudent.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const resolved = items.map((i) => {
    if (i.itemType === 'post') { const p = state.posts.find((x) => x.id === i.itemId); return p && { id: i.id, kind: 'Post', title: p.title ?? p.body?.slice(0, 60) ?? 'Post', to: '/feed', at: i.createdAt } }
    if (i.itemType === 'event') { const e = state.events.find((x) => x.id === i.itemId); return e && { id: i.id, kind: 'Event', title: e.title, to: `/events/${e.id}`, at: i.createdAt } }
    if (i.itemType === 'project') { const p = state.projects.find((x) => x.id === i.itemId); return p && (p.isPublished || p.ownerId === activeStudent.id) && { id: i.id, kind: 'Project', title: p.title, to: `/projects/${p.id}`, at: i.createdAt } }
    if (i.itemType === 'resource') { const r = state.resources.find((x) => x.id === i.itemId); return r && { id: i.id, kind: 'Resource', title: r.title, to: '/resources', at: i.createdAt } }
    return undefined
  }).filter((x) => !!x)
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Saved Items" description="Only you can see what you’ve saved." />
      {resolved.length === 0 ? <EmptyState title="Nothing saved yet" description="Save posts, events, projects or resources and they’ll appear here." action={<Link to="/feed" className="text-sm font-semibold text-brand hover:underline">Go to Feed</Link>} /> : (
        <ul className="space-y-2">{resolved.map((r) => <li key={r.id}><Card className="flex items-center justify-between gap-3 py-3"><span><Badge>{r.kind}</Badge> <Link to={r.to} className="font-medium hover:underline">{r.title}</Link></span><span className="text-xs text-muted-foreground">{timeAgo(r.at)}</span></Card></li>)}</ul>
      )}
    </div>
  )
}
