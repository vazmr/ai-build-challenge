import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, EmptyState, PersonLink, Textarea } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { blockedIdsFor, toggleBlock } from '../../services/blockService'
import { addReply, relationFor } from '../../services/communityService'
import { timeAgo } from '../../utils/format'

export function ThreadPage() {
  const { communityId = '', threadId = '' } = useParams()
  const { state, activeStudent, update } = useAppState()
  const { studentName } = useDirectory()
  const [body, setBody] = useState('')
  const thread = state.threads.find((t) => t.id === threadId && t.communityId === communityId)
  const community = state.communities.find((c) => c.id === communityId)
  if (!thread || !community) return <EmptyState title="Discussion not found" action={<Link to="/community" className="text-sm font-semibold text-brand">Back to Community</Link>} />
  const blocked = blockedIdsFor(state, activeStudent.id)
  const replies = state.threadReplies.filter((r) => r.threadId === thread.id && !blocked.has(r.authorId)).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  const canReply = relationFor(state, activeStudent.id, community.id).member

  return (
    <div className="mx-auto max-w-3xl">
      <Link to={`/community/${community.id}`} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden className="size-4" /> {community.name}</Link>
      <Card>
        <h1 className="text-xl font-bold">{thread.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground"><PersonLink id={thread.authorId} name={studentName(thread.authorId)} /> · {timeAgo(thread.createdAt)}</p>
        <p className="mt-3 whitespace-pre-line text-sm">{thread.body}</p>
        {thread.linkUrl && <a href={thread.linkUrl} target="_blank" rel="noreferrer noopener" className="mt-2 block truncate text-sm text-info hover:underline">{thread.linkUrl}</a>}
      </Card>

      <h2 className="mb-3 mt-6 text-lg font-semibold">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</h2>
      {replies.length === 0 ? <p className="mb-4 text-sm text-muted-foreground">No replies yet.</p> : (
        <ul className="mb-5 space-y-3">{replies.map((r) => (
          <li key={r.id}><Card><p className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"><span><PersonLink id={r.authorId} name={studentName(r.authorId)} /> · {timeAgo(r.createdAt)}</span>{r.authorId !== activeStudent.id && <button type="button" className="underline hover:text-foreground" onClick={() => { if (window.confirm(`Block ${studentName(r.authorId)}? You won’t see their posts, comments or replies. You can undo this in Settings.`)) update((s) => toggleBlock(s, activeStudent.id, r.authorId)) }}>Block</button>}</p><p className="mt-2 text-sm">{r.body}</p></Card></li>
        ))}</ul>
      )}

      {canReply ? (
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); update((s) => addReply(s, activeStudent.id, thread.id, body)); setBody('') }}>
          <Textarea aria-label="Your reply" placeholder="Write a reply…" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button type="submit" variant="primary" disabled={!body.trim()}>Reply</Button>
        </form>
      ) : <p className="rounded-lg bg-surface-muted p-3 text-sm">Join <Link className="font-semibold text-brand hover:underline" to={`/community/${community.id}`}>{community.name}</Link> to reply.</p>}
    </div>
  )
}
