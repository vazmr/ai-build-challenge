import { ArrowLeft, Flag, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, Tags, Textarea } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { createThread, joinCommunity, leaveCommunity, relationFor } from '../../services/communityService'
import { canAccessFounding } from '../../services/foundingService'
import { blockedIdsFor } from '../../services/blockService'
import { isFollowing, toggleFollow } from '../../services/socialService'
import type { ThreadKind } from '../../types'
import { timeAgo } from '../../utils/format'

export function CommunityDetailPage() {
  const { communityId = '' } = useParams()
  const { state, activeStudent, update } = useAppState()
  const { studentName } = useDirectory()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [kind, setKind] = useState<ThreadKind>('discussion')
  const [link, setLink] = useState('')
  const [reported, setReported] = useState(false)
  const me = activeStudent.id
  const community = state.communities.find((c) => c.id === communityId)
  if (!community) return <EmptyState title="Group not found" action={<Link to="/community" className="text-sm font-semibold text-brand">Back to Community</Link>} />

  const rel = relationFor(state, me, community.id)
  const following = isFollowing(state, me, 'community', community.id)
  const founder = state.communityMemberships.some((m) => m.communityId === community.id && m.studentId === me && m.role === 'founder')
  const blocked = blockedIdsFor(state, me)
  const isLeader = state.communityMemberships.some((m) => m.communityId === community.id && m.studentId === me && (m.role === 'founder' || m.role === 'moderator'))
  const allThreads = state.threads.filter((t) => t.communityId === community.id && !blocked.has(t.authorId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const announcements = allThreads.filter((t) => t.kind === 'announcement')
  const threads = allThreads.filter((t) => t.kind !== 'announcement')
  const replyCount = (id: string) => state.threadReplies.filter((r) => r.threadId === id).length

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/community" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden className="size-4" /> Community</Link>
      <PageHeader title={community.name} description={community.description} />
      <div className="-mt-2 mb-4 flex flex-wrap items-center gap-2">
        <Badge>Informal group, not an official Temple organization</Badge>
        {rel.member && <Badge tone="success">Member</Badge>}
        {following && <Badge tone="info">Following</Badge>}
        {rel.participated && <Badge tone="brand">Participated</Badge>}
        <Tags tags={community.tags} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button aria-pressed={following} onClick={() => update((s) => toggleFollow(s, me, 'community', community.id))}>{following ? 'Following' : 'Follow'}</Button>
        {rel.member ? (
          !founder && <Button onClick={() => { if (window.confirm('Leave this group?')) update((s) => leaveCommunity(s, me, community.id)) }}>Leave group</Button>
        ) : (
          <Button variant="primary" onClick={() => update((s) => joinCommunity(s, me, community.id))}>Join group</Button>
        )}
        {(founder || state.foundingWorkspaces.some((w) => w.communityId === community.id && canAccessFounding(w, me)) || state.foundingWorkspaces.some((w) => w.communityId === community.id && w.founders.some((f) => f.studentId === me && f.status === 'invited'))) && (
          <Link to={`/community/${community.id}/founding`} className="inline-flex min-h-10 items-center rounded-lg border border-border bg-surface px-3.5 text-sm font-semibold hover:bg-surface-muted">Founding workspace</Link>
        )}
        <Button variant="ghost" onClick={() => setReported(true)} disabled={reported}><Flag aria-hidden className="size-4" /> {reported ? 'Reported' : 'Report group'}</Button>
      </div>
      <p className="-mt-3 mb-5 text-xs text-muted-foreground">Following lets you see public updates. Joining lets you post and reply. Neither makes you a member of an official organization.</p>

      {rel.member ? (
        <Card className="mb-6">
          <h2 className="mb-3 font-semibold">Start a discussion</h2>
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); update((s) => createThread(s, me, community.id, title, body, kind, link)); setTitle(''); setBody(''); setLink(''); setKind('discussion') }}>
            <Field label="Type"><Select value={kind} onChange={(e) => setKind(e.target.value as ThreadKind)}>
              <option value="discussion">Discussion</option><option value="question">Question</option><option value="collab-request">Collaboration request</option><option value="resource">Share a resource or media link</option>{isLeader && <option value="announcement">Group announcement (public)</option>}
            </Select></Field>
            <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
            {kind === 'resource' && <Field label="Link"><Input type="url" placeholder="https://" value={link} onChange={(e) => setLink(e.target.value)} /></Field>}
            <Field label="Message"><Textarea value={body} onChange={(e) => setBody(e.target.value)} /></Field>
            <Button type="submit" variant="primary" disabled={!title.trim()}>Post discussion</Button>
          </form>
        </Card>
      ) : <p className="mb-6 rounded-lg bg-surface-muted p-3 text-sm">Join this group to start discussions and reply. You can read public discussions without joining.</p>}

      {announcements.length > 0 && (
        <section className="mb-6"><h2 className="mb-2 text-lg font-semibold">Group announcements</h2>
          <ul className="space-y-2">{announcements.map((t) => <li key={t.id}><Card className="border-brand/30 bg-brand-soft"><Link to={`/community/${community.id}/threads/${t.id}`} className="font-semibold hover:underline">{t.title}</Link><p className="text-sm">{t.body}</p></Card></li>)}</ul>
        </section>
      )}
      <h2 className="mb-3 text-lg font-semibold">Discussions</h2>
      {threads.length === 0 ? <EmptyState title="No discussions yet" description="Be the first to start one." /> : (
        <ul className="space-y-3">
          {threads.map((t) => (
            <li key={t.id}>
              <Card>
                {t.kind && t.kind !== 'discussion' && <Badge tone="info">{t.kind === 'collab-request' ? 'Collaboration request' : t.kind}</Badge>} <Link to={`/community/${community.id}/threads/${t.id}`} className="font-semibold hover:underline">{t.title}</Link>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.body}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MessageSquare aria-hidden className="size-3.5" /> {replyCount(t.id)} {replyCount(t.id) === 1 ? "reply" : "replies"} · {studentName(t.authorId)} · {timeAgo(t.createdAt)}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
