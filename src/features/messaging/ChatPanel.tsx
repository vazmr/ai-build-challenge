import { useState } from 'react'
import { AccessDenied, Button, Card } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { canAccessConversation, messagesIn, sendMessage } from '../../services/messagingService'
import { timeAgo } from '../../utils/format'

/** Simulated chat. Messages are local to this browser; nothing is real-time. */
export function ChatPanel({ conversationId, title }: { conversationId: string; title?: string }) {
  const { state, activeStudent, update } = useAppState()
  const { studentName } = useDirectory()
  const [draft, setDraft] = useState('')
  const conv = state.conversations.find((c) => c.id === conversationId)
  if (!conv || !canAccessConversation(state, activeStudent.id, conv)) return <AccessDenied title="This conversation is private" />
  const msgs = messagesIn(state, conversationId)

  return (
    <Card>
      {title && <h2 className="mb-3 font-semibold">{title}</h2>}
      <ul className="mb-3 max-h-80 space-y-3 overflow-y-auto" aria-live="polite">
        {msgs.length === 0 && <li className="text-sm text-muted-foreground">No messages yet. Say hello.</li>}
        {msgs.map((m) => (
          <li key={m.id} className={`flex flex-col text-sm ${m.senderId === activeStudent.id ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-muted-foreground">{studentName(m.senderId)} · {timeAgo(m.createdAt)}</span>
            <span className={`mt-0.5 max-w-[85%] rounded-2xl px-3 py-2 ${m.senderId === activeStudent.id ? 'bg-brand text-brand-foreground' : 'bg-surface-muted'}`}>{m.body}</span>
          </li>
        ))}
      </ul>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); update((s) => sendMessage(s, activeStudent.id, conversationId, draft)); setDraft('') }}>
        <input aria-label="Message" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" className="min-h-10 flex-1 rounded-lg border border-border px-3 text-sm" />
        <Button type="submit" variant="primary" disabled={!draft.trim()}>Send</Button>
      </form>
    </Card>
  )
}
