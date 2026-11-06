import { useState } from 'react'
import { Avatar, Button } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { addComment, visibleComments } from '../../services/feedService'
import { timeAgo } from '../../utils/format'

/** Comments for a post. Comments from people the viewer blocked are hidden. */
export function CommentThread({ postId }: { postId: string }) {
  const { state, activeStudent, update } = useAppState()
  const { studentName } = useDirectory()
  const [draft, setDraft] = useState('')
  const comments = visibleComments(state, activeStudent.id, postId)
  return (
    <div className="mt-3 space-y-3 border-t border-border pt-3">
      {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet. Start the conversation.</p>}
      {comments.map((c) => (
        <div key={c.id} className="flex gap-2 text-sm">
          <Avatar name={studentName(c.authorId)} size={28} />
          <div><span className="font-semibold">{studentName(c.authorId)}</span> <span className="text-xs text-muted-foreground">{timeAgo(c.createdAt)}</span><p>{c.body}</p></div>
        </div>
      ))}
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); update((s) => addComment(s, activeStudent.id, postId, draft)); setDraft('') }}>
        <input aria-label="Write a comment" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a comment…" className="min-h-10 flex-1 rounded-lg border border-border px-3 text-sm" />
        <Button type="submit" variant="primary" disabled={!draft.trim()}>Post</Button>
      </form>
    </div>
  )
}
