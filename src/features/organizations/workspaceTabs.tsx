import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, Field, Input, PersonLink, Select, Textarea } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { collabsFor, inviteOrg, respondCollab, revokeCollab, shareFile } from '../../services/collabService'
import { createOrgEvent, EVENT_CATEGORIES } from '../../services/eventsService'
import { createCustomChannel, customChannelsFor, ensureCollabChat, ensureDirect, orgChannel } from '../../services/messagingService'
import {
  activeOrgMembers, changeRole, deactivateMember, decideApplication, inviteStudent, isActiveMember, postAnnouncement,
  replyToInquiry, revokeInvitation, setInquiryStatus, transferPresidency,
} from '../../services/orgService'
import type { OrganizationRole } from '../../types'
import { timeAgo } from '../../utils/format'
import { hasOrgPermission } from '../../utils/permissions'
import { ChatPanel } from '../messaging/ChatPanel'

const ROLES: OrganizationRole[] = ['vice-president', 'treasurer', 'secretary', 'board-member', 'moderator', 'member']
const roleLabel = (r: string) => r.replace('-', ' ')

export function ApplicationsTab({ orgId }: { orgId: string }) {
  const { state, activeStudent, update } = useAppState()
  const { studentName } = useDirectory()
  const [filter, setFilter] = useState<'pending' | 'all'>('pending')
  const apps = state.orgApplications.filter((a) => a.organizationId === orgId && (filter === 'all' || a.status === 'pending'))
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm"><label htmlFor="appf" className="font-medium">Show</label>
        <Select id="appf" className="w-auto" value={filter} onChange={(e) => setFilter(e.target.value as 'pending' | 'all')}><option value="pending">Pending</option><option value="all">All</option></Select></div>
      {apps.length === 0 ? <EmptyState title="No applications" description="New requests to join will appear here." /> : (
        <ul className="space-y-3">{apps.map((a) => (
          <li key={a.id}><Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <PersonLink id={a.studentId} name={studentName(a.studentId)} />
              {a.status === 'pending' ? (
                <div className="flex gap-2">
                  <Button variant="primary" onClick={() => update((s) => decideApplication(s, activeStudent.id, a.id, true))}><Check aria-hidden className="size-4" /> Approve</Button>
                  <Button onClick={() => update((s) => decideApplication(s, activeStudent.id, a.id, false))}><X aria-hidden className="size-4" /> Decline</Button>
                </div>
              ) : <Badge tone={a.status === 'approved' ? 'success' : 'neutral'}>{a.status}</Badge>}
            </div>
            {a.message && <p className="mt-2 text-sm text-muted-foreground">“{a.message}”</p>}
          </Card></li>
        ))}</ul>
      )}
    </div>
  )
}

export function MembersTab({ orgId }: { orgId: string }) {
  const { state, activeStudent, update } = useAppState()
  const navigate = useNavigate()
  const { studentName } = useDirectory()
  const [query, setQuery] = useState('')
  const me = activeStudent.id
  const canManage = hasOrgPermission(state, me, orgId, 'org.manage-members')
  const iAmPresident = state.memberships.some((m) => m.organizationId === orgId && m.studentId === me && m.status === 'active' && m.role === 'president')
  const q = query.trim().toLowerCase()
  const members = activeOrgMembers(state, orgId).filter((m) => !q || studentName(m.studentId).toLowerCase().includes(q) || m.role.includes(q))
  return (
    <div>
      <Input aria-label="Filter members" placeholder="Filter by name or role" className="mb-3 max-w-xs" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul className="space-y-2">{members.map((m) => (
        <li key={m.id}><Card className="flex flex-wrap items-center justify-between gap-2 py-3">
          <span><PersonLink id={m.studentId} name={studentName(m.studentId)} /> <Badge tone={m.role === 'member' ? 'neutral' : 'brand'}>{roleLabel(m.role)}</Badge></span>
          {m.studentId !== me && <Button variant="ghost" onClick={() => { const { state: next, id } = ensureDirect(state, me, m.studentId); update(() => next); navigate(`/messages/${id}`) }}>Message</Button>}
          {canManage && m.role !== 'president' && m.studentId !== me && (
            <span className="flex flex-wrap items-center gap-2">
              <Select aria-label={`Role for ${studentName(m.studentId)}`} className="w-auto" value={m.role} onChange={(e) => update((s) => changeRole(s, me, m.id, e.target.value as OrganizationRole))}>
                {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
              </Select>
              {iAmPresident && <Button onClick={() => { if (window.confirm(`Transfer presidency to ${studentName(m.studentId)}? You will become vice president.`)) update((s) => transferPresidency(s, me, orgId, m.studentId)) }}>Make president</Button>}
              <Button variant="ghost" onClick={() => { if (window.confirm(`Deactivate ${studentName(m.studentId)}?`)) update((s) => deactivateMember(s, me, m.id)) }}>Deactivate</Button>
            </span>
          )}
        </Card></li>
      ))}</ul>
      {!canManage && <p className="mt-3 text-xs text-muted-foreground">You can view members. Role changes need member-management permission in this organization.</p>}
    </div>
  )
}

export function BoardTab({ orgId }: { orgId: string }) {
  const { state } = useAppState()
  const ch = orgChannel(state, orgId, 'organization-board')
  return ch ? <ChatPanel conversationId={ch.id} title="Board Chat (board only)" /> : <EmptyState title="No board channel" />
}

export function ChannelsTab({ orgId }: { orgId: string }) {
  const { state, activeStudent, update } = useAppState()
  const [form, setForm] = useState({ title: '', body: '', pinned: false })
  const ch = orgChannel(state, orgId, 'organization-members')
  const canPost = hasOrgPermission(state, activeStudent.id, orgId, 'org.post-announcements')
  const anns = state.announcements.filter((a) => a.organizationId === orgId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return (
    <div className="space-y-5">
      <section>
        <h2 className="mb-2 font-semibold">Announcements</h2>
        {canPost && (
          <Card className="mb-3">
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); update((s) => postAnnouncement(s, activeStudent.id, orgId, form.title, form.body, form.pinned)); setForm({ title: '', body: '', pinned: false }) }}>
              <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Message"><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} /> Pin to organization page</label>
              <Button type="submit" variant="primary" disabled={!form.title.trim()}>Post announcement</Button>
            </form>
          </Card>
        )}
        {anns.length === 0 ? <p className="text-sm text-muted-foreground">No announcements yet.</p> : <ul className="space-y-2">{anns.map((a) => <li key={a.id}><Card><p className="font-semibold">{a.title} {a.pinned && <Badge tone="brand">Pinned</Badge>}</p><p className="text-sm">{a.body}</p><p className="mt-1 text-xs text-muted-foreground">{timeAgo(a.createdAt)}</p></Card></li>)}</ul>}
      </section>
      {ch && <section><ChatPanel conversationId={ch.id} title="Member Chat" /></section>}
      <CustomChannels orgId={orgId} />
    </div>
  )
}

export function InvitationsTab({ orgId }: { orgId: string }) {
  const { state, activeStudent, update } = useAppState()
  const { studentName } = useDirectory()
  const [target, setTarget] = useState('')
  const invitable = state.students.filter((s) => !isActiveMember(state, s.id, orgId) && !state.orgInvitations.some((i) => i.organizationId === orgId && i.studentId === s.id && i.status === 'pending'))
  const invs = state.orgInvitations.filter((i) => i.organizationId === orgId)
  return (
    <div>
      <form className="mb-4 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); update((s) => inviteStudent(s, activeStudent.id, orgId, target)); setTarget('') }}>
        <Select aria-label="Student to invite" className="w-auto min-w-48" value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="">Choose a student…</option>{invitable.map((s) => <option key={s.id} value={s.id}>{s.displayName}</option>)}
        </Select>
        <Button type="submit" variant="primary" disabled={!target}>Send invitation</Button>
      </form>
      {invs.length === 0 ? <EmptyState title="No invitations yet" /> : (
        <ul className="space-y-2">{invs.map((i) => (
          <li key={i.id}><Card className="flex flex-wrap items-center justify-between gap-2 py-3">
            <span>{studentName(i.studentId)} <span className="text-xs text-muted-foreground">invited by {studentName(i.invitedById)}</span></span>
            {i.status === 'pending' ? <span className="flex items-center gap-2"><Badge tone="warning">pending</Badge><Button onClick={() => update((s) => revokeInvitation(s, activeStudent.id, i.id))}>Revoke</Button></span> : <Badge>{i.status}</Badge>}
          </Card></li>
        ))}</ul>
      )}
    </div>
  )
}

const INQ_STATUS = ['new', 'assigned', 'replied', 'closed'] as const

export function InquiriesTab({ orgId }: { orgId: string }) {
  const { state, activeStudent, update } = useAppState()
  const { studentName } = useDirectory()
  const [replies, setReplies] = useState<Record<string, string>>({})
  const list = state.inquiries.filter((i) => i.organizationId === orgId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  if (list.length === 0) return <EmptyState title="Inbox is empty" description="Questions from students will appear here, visible only to authorized officers." />
  return (
    <ul className="space-y-3">{list.map((i) => (
      <li key={i.id}><Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold">{i.subject}</p>
          <Select aria-label={`Status of ${i.subject}`} className="w-auto" value={i.status} onChange={(e) => update((s) => setInquiryStatus(s, activeStudent.id, i.id, e.target.value as (typeof INQ_STATUS)[number]))}>
            {INQ_STATUS.map((st) => <option key={st} value={st}>{st[0].toUpperCase() + st.slice(1)}</option>)}
          </Select>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">From {studentName(i.studentId)} · {timeAgo(i.createdAt)}{i.assignedToId ? ` · assigned to ${studentName(i.assignedToId)}` : ''}</p>
        <p className="mt-2 text-sm">{i.body}</p>
        {i.replies.map((r) => <p key={r.id} className="mt-2 rounded-lg bg-surface-muted p-2 text-sm"><span className="font-medium">{studentName(r.authorId)}:</span> {r.body}</p>)}
        {i.status !== 'closed' && (
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); update((s) => replyToInquiry(s, activeStudent.id, i.id, replies[i.id] ?? '')); setReplies({ ...replies, [i.id]: '' }) }}>
            <Input aria-label={`Reply to ${i.subject}`} placeholder="Write a reply…" value={replies[i.id] ?? ''} onChange={(e) => setReplies({ ...replies, [i.id]: e.target.value })} />
            <Button type="submit" variant="primary" disabled={!(replies[i.id] ?? '').trim()}>Reply</Button>
          </form>
        )}
      </Card></li>
    ))}</ul>
  )
}

export function CollaborationTab({ orgId }: { orgId: string }) {
  const { state, activeStudent, update } = useAppState()
  const me = activeStudent.id
  const [to, setTo] = useState('')
  const [title, setTitle] = useState('')
  const [fileNames, setFileNames] = useState<Record<string, string>>({})
  const orgName = (id: string) => state.organizations.find((o) => o.id === id)?.name ?? id
  const collabs = collabsFor(state, orgId)
  const others = state.organizations.filter((o) => o.id !== orgId)
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-2 font-semibold">Invite another organization</h2>
        <form className="grid gap-3 sm:grid-cols-[auto_1fr_auto]" onSubmit={(e) => { e.preventDefault(); update((s) => inviteOrg(s, me, orgId, to, title)); setTo(''); setTitle('') }}>
          <Select aria-label="Organization" value={to} onChange={(e) => setTo(e.target.value)}><option value="">Choose…</option>{others.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</Select>
          <Input aria-label="Shared project title" placeholder="Shared project title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button type="submit" variant="primary" disabled={!to || !title.trim()}>Invite</Button>
        </form>
      </Card>
      {collabs.length === 0 ? <EmptyState title="No collaborations yet" /> : collabs.map((c) => {
        const incoming = c.status === 'pending' && c.organizationIds[1] === orgId
        const other = c.organizationIds.find((id) => id !== orgId) ?? ''
        // Each organization sees only its own activity log; the other side keeps a separate one.
        const myLog = c.activity.filter((a) => a.organizationId === orgId)
        return (
          <Card key={c.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><p className="font-semibold">{c.projectTitle}</p><p className="text-sm text-muted-foreground">with {orgName(other)}</p></div>
              <Badge tone={c.status === 'active' ? 'success' : c.status === 'pending' ? 'warning' : 'neutral'}>{c.status}</Badge>
            </div>
            {incoming && <div className="mt-3 flex gap-2"><Button variant="primary" onClick={() => update((s) => respondCollab(s, me, c.id, true))}>Accept</Button><Button onClick={() => update((s) => respondCollab(s, me, c.id, false))}>Decline</Button></div>}
            {c.status === 'active' && (
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-sm font-medium">Shared files</p>
                  {c.files.length === 0 ? <p className="text-sm text-muted-foreground">Nothing shared yet.</p> : <ul className="text-sm">{c.files.map((f) => <li key={f.id}>{f.name} <span className="text-muted-foreground">· {f.permission} · shared by {orgName(f.sharedByOrgId)}</span></li>)}</ul>}
                  <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); update((s) => shareFile(s, me, orgId, c.id, fileNames[c.id] ?? '', 'view')); setFileNames({ ...fileNames, [c.id]: '' }) }}>
                    <Input aria-label="File name to share" placeholder="File name" value={fileNames[c.id] ?? ''} onChange={(e) => setFileNames({ ...fileNames, [c.id]: e.target.value })} />
                    <Button type="submit" disabled={!(fileNames[c.id] ?? '').trim()}>Share (view only)</Button>
                  </form>
                </div>
                <div>{(() => { const id = `conv-collab-${c.id}-${orgId}`; return state.conversations.some((x) => x.id === id) ? <ChatPanel conversationId={id} title={`Internal chat (only ${orgName(orgId)} board)`} /> : <Button onClick={() => update((s) => ensureCollabChat(s, orgId, c.id, `Collab: ${c.projectTitle}`).state)}>Start our internal chat</Button> })()}</div>
                <Button variant="danger" onClick={() => { if (window.confirm('Revoke shared access? Files will stop being shared.')) update((s) => revokeCollab(s, me, orgId, c.id)) }}>Revoke access</Button>
              </div>
            )}
            {myLog.length > 0 && <div className="mt-3 border-t border-border pt-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Our activity log</p><ul className="mt-1 text-sm">{myLog.map((a) => <li key={a.id}>{a.text} <span className="text-xs text-muted-foreground">· {timeAgo(a.at)}</span></li>)}</ul></div>}
          </Card>
        )
      })}
    </div>
  )
}

function CustomChannels({ orgId }: { orgId: string }) {
  const { state, activeStudent, update } = useAppState()
  const { studentName } = useDirectory()
  const [title, setTitle] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const canCreate = hasOrgPermission(state, activeStudent.id, orgId, 'org.manage-members')
  const channels = customChannelsFor(state, activeStudent.id, orgId)
  const members = activeOrgMembers(state, orgId).filter((m) => m.studentId !== activeStudent.id)
  return (
    <section>
      <h2 className="mb-2 font-semibold">Topic channels</h2>
      {canCreate && (
        <Card className="mb-3">
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); update((s) => createCustomChannel(s, activeStudent.id, orgId, title, picked)); setTitle(''); setPicked([]) }}>
            <Field label="Channel name"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Screening night planning" /></Field>
            <fieldset><legend className="mb-1 text-sm font-medium">Who can access it</legend>
              <div className="flex flex-wrap gap-3">{members.map((m) => <label key={m.id} className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={picked.includes(m.studentId)} onChange={(e) => setPicked(e.target.checked ? [...picked, m.studentId] : picked.filter((x) => x !== m.studentId))} /> {studentName(m.studentId)}</label>)}</div>
            </fieldset>
            <Button type="submit" variant="primary" disabled={!title.trim()}>Create channel</Button>
          </form>
        </Card>
      )}
      {channels.length === 0 ? <p className="text-sm text-muted-foreground">No topic channels you can access yet.</p> : <div className="space-y-4">{channels.map((c) => <ChatPanel key={c.id} conversationId={c.id} title={`# ${c.title}`} />)}</div>}
    </section>
  )
}

export function EventsTab({ orgId }: { orgId: string }) {
  const { state, activeStudent, update } = useAppState()
  const blank = { title: '', description: '', category: EVENT_CATEGORIES[0], date: '', startTime: '18:00', endTime: '20:00', locationName: '', priceLabel: 'Free' }
  const [f, setF] = useState(blank)
  const mine = state.events.filter((e) => e.hostOrganizationId === orgId)
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 font-semibold">Create an event</h2>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); update((s) => createOrgEvent(s, activeStudent.id, orgId, f)); setF(blank) }}>
          <div className="md:col-span-2"><Field label="Title"><Input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field></div>
          <div className="md:col-span-2"><Field label="Description"><Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field></div>
          <Field label="Category"><Select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{EVENT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
          <Field label="Date"><Input type="date" required value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
          <Field label="Start"><Input type="time" required value={f.startTime} onChange={(e) => setF({ ...f, startTime: e.target.value })} /></Field>
          <Field label="End"><Input type="time" required value={f.endTime} onChange={(e) => setF({ ...f, endTime: e.target.value })} /></Field>
          <Field label="Location"><Input value={f.locationName} onChange={(e) => setF({ ...f, locationName: e.target.value })} /></Field>
          <Field label="Price label"><Input value={f.priceLabel} onChange={(e) => setF({ ...f, priceLabel: e.target.value })} /></Field>
          <div className="md:col-span-2"><Button type="submit" variant="primary" disabled={!f.title.trim() || !f.date}>Publish event</Button></div>
          <p className="text-xs text-muted-foreground md:col-span-2">Events you publish appear in Events and on your organization page.</p>
        </form>
      </Card>
      <h2 className="font-semibold">Your organization’s events</h2>
      {mine.length === 0 ? <EmptyState title="No events yet" /> : <ul className="space-y-2 text-sm">{mine.map((e) => <li key={e.id}><Card className="py-3">{e.title} <span className="text-muted-foreground">· {e.startAt.slice(0, 10)} · {e.locationName}</span></Card></li>)}</ul>}
    </div>
  )
}
