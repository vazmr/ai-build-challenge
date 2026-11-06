import { Link, useNavigate } from 'react-router-dom'
import { Button, EmptyState, PageHeader } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { markAllRead, markRead, notificationsFor } from '../../services/notificationsService'
import { timeAgo } from '../../utils/format'

export function NotificationsPage() {
  const { state, activeStudent, update } = useAppState()
  const navigate = useNavigate()
  const list = notificationsFor(state, activeStudent.id)
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Notifications" description="Updates about your requests, invitations and replies."
        actions={<div className="flex gap-2"><Link to="/messages" className="inline-flex min-h-10 items-center rounded-lg border border-border bg-surface px-3.5 text-sm font-semibold hover:bg-surface-muted">Messages</Link><Button disabled={list.every((n) => n.read)} onClick={() => update((s) => markAllRead(s, activeStudent.id))}>Mark all read</Button></div>} />
      {list.length === 0 ? <EmptyState title="You’re all caught up" description="New activity will show up here." /> : (
        <ul className="space-y-2">{list.map((n) => (
          <li key={n.id}>
            <button type="button" onClick={() => { update((s) => markRead(s, n.id)); if (n.link) navigate(n.link) }}
              className={`w-full rounded-[var(--radius-card)] border p-3 text-left hover:bg-surface-muted ${n.read ? 'border-border bg-surface' : 'border-brand/40 bg-brand-soft'}`}>
              <span className="flex items-center gap-2 font-semibold">{!n.read && <span className="size-2 rounded-full bg-brand" aria-label="Unread" />}{n.title}</span>
              <span className="block text-sm">{n.body}</span><span className="block text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
            </button>
          </li>
        ))}</ul>
      )}
    </div>
  )
}
