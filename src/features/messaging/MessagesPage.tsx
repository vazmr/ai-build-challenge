import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Avatar, EmptyState, PageHeader } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { directConversationsFor, messagesIn } from '../../services/messagingService'
import { ChatPanel } from './ChatPanel'

export function MessagesPage() {
  const { conversationId } = useParams()
  const { state, activeStudent } = useAppState()
  const { studentName } = useDirectory()
  const convs = directConversationsFor(state, activeStudent.id)
  const other = (participants: string[]) => participants.find((p) => p !== activeStudent.id) ?? ''

  if (conversationId) {
    const conv = state.conversations.find((c) => c.id === conversationId)
    return (
      <div className="mx-auto max-w-2xl">
        <Link to="/messages" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden className="size-4" /> Messages</Link>
        <ChatPanel conversationId={conversationId} title={conv ? `Chat with ${studentName(other(conv.participantIds))}` : undefined} />
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Messages" description="Private one-to-one conversations. Only the two participants can read them." />
      {convs.length === 0 ? <EmptyState title="No conversations yet" description="Open someone’s profile and choose Message to start one." /> : (
        <ul className="space-y-2">{convs.map((c) => {
          const last = messagesIn(state, c.id).at(-1)
          const name = studentName(other(c.participantIds))
          return (
            <li key={c.id}><Link to={`/messages/${c.id}`} className="flex items-center gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-3 hover:bg-surface-muted">
              <Avatar name={name} /><span className="min-w-0"><span className="block font-semibold">{name}</span><span className="block truncate text-sm text-muted-foreground">{last?.body ?? 'No messages yet'}</span></span>
            </Link></li>
          )
        })}</ul>
      )}
    </div>
  )
}
