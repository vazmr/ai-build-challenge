import { ArrowLeft, Lock } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AccessDenied, Badge, Button, Card, EmptyState, PageHeader, Select, Textarea } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { advanceStage, canAccessFounding, inviteFounder, respondFounder, setNotes, startFounding, toggleChecklist, workspaceFor } from '../../services/foundingService'

/** Formation pathway: public interest community -> private founding workspace -> recognition preparation. */
export function FoundingPage() {
  const { communityId = '' } = useParams()
  const { state, activeStudent, update } = useAppState()
  const { studentName } = useDirectory()
  const [invitee, setInvitee] = useState('')
  const me = activeStudent.id
  const community = state.communities.find((c) => c.id === communityId)
  if (!community) return <EmptyState title="Group not found" action={<Link to="/community" className="text-sm font-semibold text-brand hover:underline">Back to Community</Link>} />

  const ws = workspaceFor(state, communityId)
  const isFounder = state.communityMemberships.some((m) => m.communityId === communityId && m.studentId === me && m.role === 'founder')
  const back = <Link to={`/community/${communityId}`} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden className="size-4" /> {community.name}</Link>

  const myInvite = ws?.founders.find((f) => f.studentId === me && f.status === 'invited')
  if (ws && myInvite) {
    return (
      <div className="mx-auto max-w-2xl">{back}<Card>
        <h1 className="text-xl font-bold">You’re invited to a founding workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">{studentName(ws.ownerId)} invited you to help found a possible organization from “{community.name}”. Nothing is shared until you accept.</p>
        <div className="mt-4 flex gap-2"><Button variant="primary" onClick={() => update((s) => respondFounder(s, me, ws.id, true))}>Accept</Button><Button onClick={() => update((s) => respondFounder(s, me, ws.id, false))}>Decline</Button></div>
      </Card></div>
    )
  }

  if (!ws) {
    return (
      <div className="mx-auto max-w-2xl">{back}
        <PageHeader title="Formation pathway" description="Turn an interest community into a possible organization. This is a private planning space only." />
        <ol className="mb-5 list-decimal space-y-1 pl-5 text-sm"><li>Public interest community (where you are now)</li><li>Private founding workspace (invite-only)</li><li>Prepare for official recognition (decided by the university)</li></ol>
        {isFounder ? <Button variant="primary" onClick={() => update((s) => startFounding(s, me, communityId))}>Start a private founding workspace</Button> : <AccessDenied title="Only this group’s founders can start a founding workspace" description="Following or joining a group doesn’t make you a founder." />}
      </div>
    )
  }

  if (!canAccessFounding(ws, me)) return <div className="mx-auto max-w-2xl">{back}<AccessDenied title="Founding workspace is private" description="Only the founders who have accepted can open it." /></div>

  const candidates = state.students.filter((s) => s.id !== ws.ownerId && !ws.founders.some((f) => f.studentId === s.id && f.status !== 'declined'))
  const owner = ws.ownerId === me

  return (
    <div className="mx-auto max-w-3xl">{back}
      <h1 className="text-2xl font-bold">Founding workspace <Badge tone="info">{ws.stage === 'founding' ? 'Founding' : 'Recognition prep'}</Badge></h1>
      <p className="mb-5 mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Lock aria-hidden className="size-4" /> Private to founders for “{community.name}”. Followers of the public group can’t see this.</p>

      <Card className="mb-4">
        <h2 className="mb-2 font-semibold">Founders</h2>
        <ul className="space-y-1 text-sm">
          <li>{studentName(ws.ownerId)} <span className="text-muted-foreground">· owner</span></li>
          {ws.founders.map((f) => <li key={f.studentId}>{studentName(f.studentId)} <Badge tone={f.status === 'accepted' ? 'success' : f.status === 'invited' ? 'warning' : 'neutral'}>{f.status}</Badge></li>)}
        </ul>
        {owner && (
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); update((s) => inviteFounder(s, me, ws.id, invitee)); setInvitee('') }}>
            <Select aria-label="Invite a founder" value={invitee} onChange={(e) => setInvitee(e.target.value)}><option value="">Invite a student…</option>{candidates.map((s) => <option key={s.id} value={s.id}>{s.displayName}</option>)}</Select>
            <Button type="submit" variant="primary" disabled={!invitee}>Invite</Button>
          </form>
        )}
      </Card>

      <Card className="mb-4">
        <h2 className="mb-2 font-semibold">Checklist</h2>
        <ul className="space-y-1">{ws.checklist.map((c) => <li key={c.id}><label className="flex min-h-9 items-center gap-2 text-sm"><input type="checkbox" checked={c.done} onChange={() => update((s) => toggleChecklist(s, me, ws.id, c.id))} /> <span className={c.done ? 'line-through text-muted-foreground' : ''}>{c.label}</span></label></li>)}</ul>
      </Card>

      <Card className="mb-4">
        <h2 className="mb-2 font-semibold">Private notes</h2>
        <Textarea aria-label="Founding notes" value={ws.notes} onChange={(e) => update((s) => setNotes(s, me, ws.id, e.target.value))} placeholder="Drafts, roles, ideas…" />
      </Card>

      <Card>
        <h2 className="mb-1 font-semibold">Official recognition</h2>
        <p className="text-sm text-muted-foreground">Recognition is decided by the university, not by this app. Nothing here approves or registers an organization. Confirm the current official steps with Temple sources before relying on any checklist.</p>
        {owner && ws.stage === 'founding' && <Button className="mt-3" onClick={() => update((s) => advanceStage(s, me, ws.id))}>Move to recognition prep</Button>}
      </Card>
    </div>
  )
}
