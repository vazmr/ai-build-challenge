import { ArrowLeft, Pin } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, Field, Input, Tabs, Tags, Textarea } from '../../components/shared/ui'
import { gradientFor } from '../../utils/art'
import { useAppState } from '../../hooks/useAppState'
import { activeOrgMembers, applicationFor, applyToOrg, askQuestion, isActiveMember, isInterested, respondToInvitation, toggleInterested } from '../../services/orgService'
import { isFollowing, toggleFollow } from '../../services/socialService'
import { EventCard } from '../events/EventCard'

type Tab = 'overview' | 'events' | 'about'

export function OrganizationPage() {
  const { organizationId = '' } = useParams()
  const { state, activeStudent, update } = useAppState()
  const [tab, setTab] = useState<Tab>('overview')
  const [panel, setPanel] = useState<'join' | 'ask' | null>(null)
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const me = activeStudent.id

  const org = state.organizations.find((o) => o.id === organizationId)
  if (!org) return <EmptyState title="Organization not found" action={<Link to="/organizations" className="text-sm font-semibold text-brand">Browse organizations</Link>} />

  const member = isActiveMember(state, me, org.id)
  const following = isFollowing(state, me, 'organization', org.id)
  const interested = isInterested(state, me, org.id)
  const application = applicationFor(state, me, org.id)
  const invitation = state.orgInvitations.find((i) => i.organizationId === org.id && i.studentId === me && i.status === 'pending')
  const pinned = state.announcements.find((a) => a.organizationId === org.id && a.pinned)
  const events = state.events.filter((e) => e.hostOrganizationId === org.id && e.status === 'published')

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/organizations" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden className="size-4" /> Organizations</Link>
      <div className="h-28 rounded-t-[var(--radius-card)]" style={{ backgroundImage: gradientFor(org.id + 'cover', 100) }} aria-hidden />
      <Card className="-mt-1 rounded-t-none">
        <div className="flex flex-wrap gap-1.5"><Badge tone="warning">Demo organization</Badge>{member && <Badge tone="success">You’re a member</Badge>}</div>
        <h1 className="mt-2 text-2xl font-bold">{org.name}</h1>
        <p className="text-xs text-muted-foreground">Fictional. Not officially recognized or verified by Temple. {activeOrgMembers(state, org.id).length} members (sample count).</p>
        <div className="mt-2"><Tags tags={org.tags} /></div>

        {invitation && (
          <div className="mt-4 rounded-lg bg-brand-soft p-3 text-sm">
            <p className="font-medium">You’ve been invited to join {org.name}.</p>
            <div className="mt-2 flex gap-2"><Button variant="primary" onClick={() => update((s) => respondToInvitation(s, me, invitation.id, true))}>Accept</Button><Button onClick={() => update((s) => respondToInvitation(s, me, invitation.id, false))}>Decline</Button></div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button aria-pressed={following} onClick={() => update((s) => toggleFollow(s, me, 'organization', org.id))}>{following ? 'Following' : 'Follow'}</Button>
          <Button aria-pressed={interested} onClick={() => update((s) => toggleInterested(s, me, org.id))}>{interested ? 'Interested ✓' : 'I’m Interested'}</Button>
          <Button onClick={() => setPanel(panel === 'ask' ? null : 'ask')}>Ask a Question</Button>
          {!member && (application?.status === 'pending'
            ? <Badge tone="warning">Application pending</Badge>
            : <Button variant="primary" onClick={() => setPanel(panel === 'join' ? null : 'join')}>Request to Join</Button>)}
          {member && <Link to={`/organizations/${org.id}/workspace`} className="inline-flex min-h-10 items-center rounded-lg bg-brand px-3.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">Open workspace</Link>}
        </div>
        {application?.status === 'declined' && !member && <p className="mt-2 text-xs text-muted-foreground">Your last application was declined. You can apply again.</p>}

        {panel === 'join' && (
          <form className="mt-4 space-y-3 border-t border-border pt-4" onSubmit={(e) => { e.preventDefault(); update((s) => applyToOrg(s, me, org.id, message)); setMessage(''); setPanel(null) }}>
            <Field label="Why would you like to join?"><Textarea value={message} onChange={(e) => setMessage(e.target.value)} /></Field>
            <Button type="submit" variant="primary">Send application</Button>
            <p className="text-xs text-muted-foreground">Officers with permission review applications. Following or commenting never makes you a member.</p>
          </form>
        )}
        {panel === 'ask' && (
          <form className="mt-4 space-y-3 border-t border-border pt-4" onSubmit={(e) => { e.preventDefault(); update((s) => askQuestion(s, me, org.id, subject, message)); setMessage(''); setSubject(''); setPanel(null) }}>
            <Field label="Subject"><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
            <Field label="Question"><Textarea value={message} onChange={(e) => setMessage(e.target.value)} /></Field>
            <Button type="submit" variant="primary" disabled={!subject.trim() || !message.trim()}>Send question</Button>
            <p className="text-xs text-muted-foreground">Your question goes to the organization’s private inbox, visible only to authorized officers.</p>
          </form>
        )}
      </Card>

      {pinned && <Card className="mt-4 border-brand/30 bg-brand-soft"><p className="flex items-center gap-1.5 text-xs font-semibold text-brand"><Pin aria-hidden className="size-3.5" /> Pinned announcement</p><h2 className="mt-1 font-semibold">{pinned.title}</h2><p className="text-sm">{pinned.body}</p></Card>}

      <div className="mt-5"><Tabs<Tab> label="Organization sections" value={tab} onChange={setTab} tabs={[{ id: 'overview', label: 'Overview' }, { id: 'events', label: 'Events' }, { id: 'about', label: 'About' }]} /></div>
      {tab === 'overview' && <Card><p className="text-sm">{org.description}</p></Card>}
      {tab === 'events' && (events.length === 0 ? <EmptyState title="No events yet" description="This organization hasn’t posted sample events." /> : <div className="grid gap-4 md:grid-cols-2">{events.map((e) => <EventCard key={e.id} event={e} />)}</div>)}
      {tab === 'about' && <Card className="space-y-1 text-sm"><p>This is a fictional demo organization used to test the prototype.</p><p className="text-muted-foreground">Real recognition status is decided by the university, never by this app.</p></Card>}
    </div>
  )
}
