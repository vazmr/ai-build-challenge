import { ArrowLeft, Pin } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar, Badge, Button, Card, EmptyState, Faces, Field, Input, Tabs, Tags, Textarea } from '../../components/shared/ui'
import { formatDay } from '../../utils/format'
import { CoverArt } from '../../components/shared/CoverArt'
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
  const members = activeOrgMembers(state, org.id)
  const memberNames = members.map((m) => state.students.find((s) => s.id === m.studentId)?.displayName).filter((n): n is string => !!n)
  const nextEvent = [...events].filter((e) => new Date(e.startAt) >= new Date()).sort((a, b) => a.startAt.localeCompare(b.startAt))[0]

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/organizations" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden className="size-4" /> Organizations</Link>
      <div className="relative">
        <CoverArt seed={org.id + 'cover'} className="h-28 rounded-t-[var(--radius-card)]" />
        <span className="absolute bottom-0 left-4 translate-y-1/2 rounded-full ring-4 ring-surface"><Avatar name={org.name} size={56} /></span>
      </div>
      <Card className="-mt-1 rounded-t-none pt-10">
        <div className="flex flex-wrap gap-1.5">{member && <Badge tone="success">You’re a member</Badge>}</div>
        <h1 className="mt-2 text-2xl font-bold">{org.name}</h1>
        <div className="mt-2"><Tags tags={org.tags} /></div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Faces names={memberNames} total={members.length} label={`${members.length} ${members.length === 1 ? 'member' : 'members'} (sample count)`} />
          {nextEvent && <p className="text-sm">Next: <Link to={`/events/${nextEvent.id}`} className="font-semibold hover:underline">{nextEvent.title}</Link> <span className="text-muted-foreground">· {formatDay(nextEvent.startAt)}</span></p>}
        </div>

        {invitation && (
          <div className="mt-4 rounded-lg bg-brand-soft p-3 text-sm">
            <p className="font-medium">You’ve been invited to join {org.name}.</p>
            <div className="mt-2 flex gap-2"><Button variant="primary" onClick={() => update((s) => respondToInvitation(s, me, invitation.id, true))}>Accept</Button><Button onClick={() => update((s) => respondToInvitation(s, me, invitation.id, false))}>Decline</Button></div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {member
            ? <Link to={`/organizations/${org.id}/workspace`} className="inline-flex min-h-10 items-center rounded-lg bg-brand px-3.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">Open workspace</Link>
            : application?.status === 'pending'
              ? <Badge tone="warning">Application pending</Badge>
              : <Button variant="primary" onClick={() => setPanel(panel === 'join' ? null : 'join')}>Request to Join</Button>}
          <Button onClick={() => setPanel(panel === 'ask' ? null : 'ask')} aria-expanded={panel === 'ask'}>Ask a question</Button>
          <Button aria-pressed={following} onClick={() => update((s) => toggleFollow(s, me, 'organization', org.id))}>{following ? 'Following' : 'Follow'}</Button>
        </div>
        <p className="mt-2 max-w-prose text-xs text-muted-foreground">
          Following puts their posts in your feed. Joining makes you a member once officers review your request.{' '}
          <button type="button" aria-pressed={interested} onClick={() => update((s) => toggleInterested(s, me, org.id))} className="font-semibold text-brand hover:underline">
            {interested ? 'Interested ✓ (undo)' : 'I’m just interested'}
          </button>
        </p>
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
      {tab === 'events' && (events.length === 0 ? <EmptyState title="No events yet" description="This organization hasn’t posted events." /> : <div className="grid gap-4 md:grid-cols-2">{events.map((e) => <EventCard key={e.id} event={e} />)}</div>)}
      {tab === 'about' && <Card className="space-y-1 text-sm"><p>{org.description}</p><p className="text-muted-foreground">Recognition status is decided by the university, never by this app.</p></Card>}
    </div>
  )
}
