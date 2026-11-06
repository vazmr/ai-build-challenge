import { ArrowDown, ArrowUp, Ban, MessageCircle, Pin, UserCheck, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AccessDenied, ActionMenu, ActionMenuItem, Avatar, Badge, Button, Card, EmptyState, Field, Input, Select, Tabs, Tags, Textarea } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { isBlocked, toggleBlock } from '../../services/blockService'
import { ensureDirect } from '../../services/messagingService'
import {
  addBlogPost, addToCollection, blogPostsFor, canViewSection, collaborationProjectsFor, collectionsFor, createCollection, createPortfolioItem,
  deletePortfolioItem, moveSection, orderedSections, portfolioFor, profileMetrics, PROFILE_SECTIONS, publishDraft, removeFromCollection,
  setSectionVisibility, setTheme, togglePinPost, type ProfileSection,
} from '../../services/profileService'
import { isFollowing, toggleFollow } from '../../services/socialService'
import type { Visibility } from '../../types'
import { gradientFor, paletteFor } from '../../utils/art'
import { dayKey, formatDay } from '../../utils/format'
import { parseList } from '../../utils/parseList'
import { CommentThread } from '../feed/CommentThread'

const VIS_LABEL: Record<Visibility, string> = { public: 'Public', 'temple-only': 'Temple-only', private: 'Private' }
const PORTFOLIO_CATEGORIES = ['Photography', 'Graphic Design', 'Music/Audio', 'Film/Video', 'Writing', 'Apps & Websites', 'Research', 'Entrepreneurship']
const THEMES = [0, 1, 2, 3, 4, 5, 6, 7]
const VIS_OPTIONS = (Object.keys(VIS_LABEL) as Visibility[]).map((v) => <option key={v} value={v}>{VIS_LABEL[v]}</option>)

function BlogSection({ ownerId }: { ownerId: string }) {
  const { state, activeStudent, update } = useAppState()
  const me = activeStudent.id
  const own = me === ownerId
  const [form, setForm] = useState({ title: '', body: '', tags: '', visibility: 'public' as Visibility, draft: false })
  const [month, setMonth] = useState('')
  const [openComments, setOpenComments] = useState<string | null>(null)
  const posts = blogPostsFor(state, me, ownerId)
  const months = [...new Set(posts.map((p) => p.createdAt.slice(0, 7)))].sort().reverse()
  const shown = month ? posts.filter((p) => p.createdAt.startsWith(month)) : posts

  return (
    <div className="space-y-4">
      {own && (
        <Card>
          <h2 className="mb-3 font-semibold">New blog post</h2>
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); update((s) => addBlogPost(s, me, { ...form, tags: parseList(form.tags) })); setForm({ title: '', body: '', tags: '', visibility: 'public', draft: false }) }}>
            <Field label="Title (optional)"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Post"><Textarea required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Tags" hint="Comma-separated"><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></Field>
              <Field label="Visibility"><Select value={form.visibility} disabled={form.draft} onChange={(e) => setForm({ ...form, visibility: e.target.value as Visibility })}>{VIS_OPTIONS}</Select></Field>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.draft} onChange={(e) => setForm({ ...form, draft: e.target.checked })} /> Save as private draft</label>
            <Button type="submit" variant="primary" disabled={!form.body.trim()}>{form.draft ? 'Save draft' : 'Publish post'}</Button>
          </form>
        </Card>
      )}
      {months.length > 1 && (
        <div className="flex items-center gap-2 text-sm"><label htmlFor="arch" className="font-medium">Archive</label>
          <Select id="arch" className="w-auto" value={month} onChange={(e) => setMonth(e.target.value)}><option value="">All posts</option>{months.map((m) => <option key={m} value={m}>{m}</option>)}</Select></div>
      )}
      {shown.length === 0 ? <EmptyState title="No posts yet" /> : shown.map((p) => (
        <Card key={p.id}>
          <div className="flex flex-wrap items-center gap-1.5">
            {p.pinned && <Badge tone="brand"><Pin aria-hidden className="mr-1 size-3" />Pinned</Badge>}
            {p.isDraft && <Badge tone="warning">Draft</Badge>}
            {!p.isDraft && p.visibility !== 'public' && <Badge>{VIS_LABEL[p.visibility]}</Badge>}
            <span className="text-xs text-muted-foreground">{dayKey(p.createdAt)}</span>
          </div>
          {p.title && <h3 className="mt-1 font-semibold">{p.title}</h3>}
          {p.body && <p className="mt-1 whitespace-pre-line text-sm">{p.body}</p>}
          <div className="mt-2"><Tags tags={p.tags} /></div>
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-2">
            {!p.isDraft && <Button variant="ghost" aria-expanded={openComments === p.id} onClick={() => setOpenComments(openComments === p.id ? null : p.id)}><MessageCircle aria-hidden className="size-4" /> Comments</Button>}
            {own && !p.isDraft && <Button variant="ghost" onClick={() => update((s) => togglePinPost(s, me, p.id))}><Pin aria-hidden className="size-4" /> {p.pinned ? 'Unpin' : 'Pin'}</Button>}
            {own && p.isDraft && <Button variant="primary" onClick={() => update((s) => publishDraft(s, me, p.id, 'public'))}>Publish draft</Button>}
          </div>
          {openComments === p.id && <CommentThread postId={p.id} />}
        </Card>
      ))}
    </div>
  )
}

function CollectionsSection({ ownerId }: { ownerId: string }) {
  const { state, activeStudent, update } = useAppState()
  const me = activeStudent.id
  const own = me === ownerId
  const [form, setForm] = useState({ title: '', description: '', visibility: 'public' as Visibility })
  const [adding, setAdding] = useState<Record<string, string>>({})
  const list = collectionsFor(state, me, ownerId)
  const pickable = state.posts.filter((p) => p.visibility === 'public' && !p.isDraft)
  return (
    <div className="space-y-4">
      {own && (
        <Card>
          <h2 className="mb-3 font-semibold">New collection</h2>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); update((s) => createCollection(s, me, form.title, form.description, form.visibility)); setForm({ title: '', description: '', visibility: 'public' }) }}>
            <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Visibility"><Select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as Visibility })}>{VIS_OPTIONS}</Select></Field>
            <div className="sm:col-span-2"><Field label="Description (optional)"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field></div>
            <div className="sm:col-span-2"><Button type="submit" variant="primary" disabled={!form.title.trim()}>Create collection</Button></div>
          </form>
        </Card>
      )}
      {list.length === 0 ? <EmptyState title="No collections yet" /> : (
        <div className="grid gap-4 sm:grid-cols-2">{list.map((c) => (
          <Card key={c.id}>
            <div className="mb-2 h-16 rounded-lg" style={{ backgroundImage: gradientFor(c.id, 120) }} aria-hidden />
            <h3 className="font-semibold">{c.title}</h3>{c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{c.itemIds.length} item{c.itemIds.length === 1 ? '' : 's'}{c.visibility !== 'public' ? ` · ${VIS_LABEL[c.visibility]}` : ''}</p>
            <ul className="mt-2 space-y-0.5 text-sm">{c.itemIds.map((id) => state.posts.find((p) => p.id === id)).filter((p) => p !== undefined).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2"><span className="truncate">{p.title ?? p.body?.slice(0, 40)}</span>{own && <button type="button" className="text-xs underline" aria-label={`Remove ${p.title ?? 'item'} from ${c.title}`} onClick={() => update((s) => removeFromCollection(s, me, c.id, p.id))}>Remove</button>}</li>
            ))}</ul>
            {own && (
              <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); update((s) => addToCollection(s, me, c.id, adding[c.id] ?? '')); setAdding({ ...adding, [c.id]: '' }) }}>
                <Select aria-label={`Add a post to ${c.title}`} value={adding[c.id] ?? ''} onChange={(e) => setAdding({ ...adding, [c.id]: e.target.value })}><option value="">Add a public post…</option>{pickable.filter((p) => !c.itemIds.includes(p.id)).map((p) => <option key={p.id} value={p.id}>{(p.title ?? p.body ?? p.id).slice(0, 50)}</option>)}</Select>
                <Button type="submit" disabled={!adding[c.id]}>Add</Button>
              </form>
            )}
          </Card>
        ))}</div>
      )}
    </div>
  )
}

function PortfolioSection({ ownerId }: { ownerId: string }) {
  const { state, activeStudent, update } = useAppState()
  const me = activeStudent.id
  const own = me === ownerId
  const blank = { title: '', description: '', category: PORTFOLIO_CATEGORIES[0], skills: '', credits: '', linkUrl: '', visibility: 'public' as Visibility }
  const [f, setF] = useState(blank)
  const items = portfolioFor(state, me, ownerId)
  return (
    <div className="space-y-4">
      {own && (
        <Card>
          <h2 className="mb-3 font-semibold">Add portfolio work</h2>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); update((s) => createPortfolioItem(s, me, { ...f, skills: parseList(f.skills), credits: f.credits.split(',').map((c) => c.trim()).filter(Boolean) })); setF(blank) }}>
            <Field label="Title"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
            <Field label="Category"><Select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{PORTFOLIO_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <div className="sm:col-span-2"><Field label="Description"><Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field></div>
            <Field label="Skills" hint="Comma-separated"><Input value={f.skills} onChange={(e) => setF({ ...f, skills: e.target.value })} /></Field>
            <Field label="Roles and credits" hint="e.g. Director, Editor (with Alex)"><Input value={f.credits} onChange={(e) => setF({ ...f, credits: e.target.value })} /></Field>
            <Field label="Link (optional)"><Input type="url" placeholder="https://" value={f.linkUrl} onChange={(e) => setF({ ...f, linkUrl: e.target.value })} /></Field>
            <Field label="Visibility"><Select value={f.visibility} onChange={(e) => setF({ ...f, visibility: e.target.value as Visibility })}>{VIS_OPTIONS}</Select></Field>
            <div className="sm:col-span-2"><Button type="submit" variant="primary" disabled={!f.title.trim()}>Add to portfolio</Button></div>
          </form>
        </Card>
      )}
      {items.length === 0 ? <EmptyState title="No portfolio items yet" /> : (
        <div className="grid gap-4 sm:grid-cols-2">{items.map((p) => (
          <Card key={p.id}>
            <div className="mb-2 h-20 rounded-lg" style={{ backgroundImage: gradientFor(p.id + p.category, 60) }} aria-hidden />
            <Badge tone="brand">{p.category}</Badge>{p.visibility !== 'public' && <> <Badge>{VIS_LABEL[p.visibility]}</Badge></>}
            <h3 className="mt-2 font-semibold">{p.title}</h3>{p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
            {p.credits && p.credits.length > 0 && <p className="mt-1 text-xs text-muted-foreground">Credits: {p.credits.join(' · ')}</p>}
            {p.skills && p.skills.length > 0 && <div className="mt-2"><Tags tags={p.skills} /></div>}
            {p.linkUrl && <a href={p.linkUrl} target="_blank" rel="noreferrer noopener" className="mt-2 block truncate text-sm text-info hover:underline">{p.linkUrl}</a>}
            {own && <Button className="mt-2" variant="ghost" onClick={() => { if (window.confirm('Delete this portfolio item?')) update((s) => deletePortfolioItem(s, me, p.id)) }}>Delete</Button>}
          </Card>
        ))}</div>
      )}
    </div>
  )
}

export function ProfilePage() {
  const { userId = '' } = useParams()
  const { state, activeStudent, update } = useAppState()
  const navigate = useNavigate()
  const [tab, setTab] = useState<ProfileSection>('overview')
  const [customizing, setCustomizing] = useState(false)

  const profile = state.students.find((s) => s.id === userId)
  if (!profile) return <EmptyState title="Profile not found" description="This profile doesn’t exist or isn’t shared with you." action={<span className="flex flex-wrap justify-center gap-x-4 gap-y-2"><Link to="/community" className="text-sm font-semibold text-brand hover:underline">Find people in Community</Link><Link to="/feed" className="text-sm font-semibold text-brand hover:underline">Go to Feed</Link></span>} />

  const me = activeStudent.id
  const own = me === profile.id
  const following = isFollowing(state, me, 'student', profile.id)
  const blocked = isBlocked(state, me, profile.id)
  const metrics = profileMetrics(state, profile.id)
  const sharedInterests = profile.interests.filter((t) => activeStudent.interests.includes(t)).slice(0, 4)
  const can = (section: ProfileSection) => canViewSection(state, me, profile.id, section)
  const orgs = state.memberships.filter((m) => m.studentId === profile.id && m.status === 'active')
  const attended = state.eventParticipations.filter((p) => p.studentId === profile.id && p.state === 'attended').map((p) => state.events.find((e) => e.id === p.eventId)).filter((e) => e !== undefined)
  const themeSeed = profile.theme !== undefined ? `theme-${profile.theme}` : profile.id + 'cover'
  const accent = paletteFor(themeSeed)[0]
  const order = orderedSections(profile.sectionOrder)
  const tabs = [PROFILE_SECTIONS[0], ...order.map((id) => PROFILE_SECTIONS.find((p) => p.id === id)!)]

  const metricList: { label: string; value: number; goTo: ProfileSection }[] = [
    { label: 'Organizations', value: metrics.organizations, goTo: 'overview' },
    { label: 'Projects', value: metrics.projects, goTo: 'collaborations' },
    { label: 'Events attended', value: metrics.eventsAttended, goTo: 'overview' },
    { label: 'Collaborations', value: metrics.collaborations, goTo: 'collaborations' },
  ]
  const locked = <AccessDenied title="This section is private" description={`${profile.displayName} has chosen not to share it.`} />

  if (blocked) {
    return (
      <div className="mx-auto max-w-lg"><EmptyState title={`You blocked ${profile.displayName}`} description="Their profile, posts, comments and replies are hidden from you. Blocking is private."
        action={<Button onClick={() => update((s) => toggleBlock(s, me, profile.id))}>Unblock</Button>} /></div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative h-36 overflow-hidden rounded-t-[var(--radius-card)] sm:h-44" style={{ backgroundImage: gradientFor(themeSeed, 100) }} aria-hidden>
        {profile.coverUrl && <img src={profile.coverUrl} alt="" className="absolute inset-0 size-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />}
        {profile.coverUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />}
      </div>
      <Card className="-mt-1 rounded-t-none !p-5">
        <div className="flex items-end justify-between gap-3">
          <span className="relative z-10 -mt-16 shrink-0 rounded-full sm:-mt-20" style={{ boxShadow: `0 0 0 4px var(--color-surface), 0 0 0 7px ${accent}` }}><Avatar name={profile.displayName} size={104} /></span>
          {!own && (
            <div className="flex flex-wrap justify-end gap-2">
              <Button onClick={() => { const { state: next, id } = ensureDirect(state, me, profile.id); update(() => next); navigate(`/messages/${id}`) }}>Message</Button>
              <Button variant={following ? 'secondary' : 'primary'} aria-pressed={following} onClick={() => update((s) => toggleFollow(s, me, 'student', profile.id))}>
                {following ? <UserCheck aria-hidden className="size-4" /> : <UserPlus aria-hidden className="size-4" />} {following ? 'Following' : 'Follow'}
              </Button>
              <ActionMenu>
                <ActionMenuItem tone="danger" onClick={() => { if (window.confirm(`Block ${profile.displayName}? You won’t see their content. You can undo this in Settings.`)) update((s) => toggleBlock(s, me, profile.id)) }}>
                  <Ban aria-hidden className="size-4" /> Block {profile.displayName}
                </ActionMenuItem>
              </ActionMenu>
            </div>
          )}
          {own && <Button onClick={() => setCustomizing((c) => !c)} aria-expanded={customizing}>Customize profile</Button>}
        </div>
        <div className="mt-3 min-w-0">
          <h1 className="text-2xl font-bold">{profile.displayName}</h1>
          <p className="text-sm text-muted-foreground">{[profile.major, profile.college, profile.classYear && `Class of ${profile.classYear}`].filter(Boolean).join(' · ')}</p>
          {profile.bio && <p className="mt-2 max-w-prose text-sm">{profile.bio}</p>}
          {!own && sharedInterests.length > 0 && (
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-sm"><span className="font-medium">You both like</span>{sharedInterests.map((t) => <span key={t} className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">#{t}</span>)}</p>
          )}
        </div>

        {own && customizing && (
          <div className="mt-4 space-y-4 border-t border-border pt-4">
            <div><p className="mb-2 text-sm font-medium">Theme (cover and accent)</p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Profile theme">{THEMES.map((t) => (
                <button key={t} type="button" role="radio" aria-checked={profile.theme === t} aria-label={`Theme ${t + 1}`} onClick={() => update((s) => setTheme(s, me, t))}
                  className={`size-10 rounded-full border-2 ${profile.theme === t ? 'border-foreground' : 'border-transparent'}`} style={{ backgroundImage: gradientFor(`theme-${t}`) }} />
              ))}</div>
            </div>
            <div><p className="mb-2 text-sm font-medium">Section order</p>
              <ul className="space-y-1">{order.map((id, i) => (
                <li key={id} className="flex items-center gap-2 text-sm"><span className="w-32">{PROFILE_SECTIONS.find((p) => p.id === id)?.label}</span>
                  <Button variant="ghost" aria-label={`Move ${id} up`} disabled={i === 0} onClick={() => update((s) => moveSection(s, me, id, -1))}><ArrowUp aria-hidden className="size-4" /></Button>
                  <Button variant="ghost" aria-label={`Move ${id} down`} disabled={i === order.length - 1} onClick={() => update((s) => moveSection(s, me, id, 1))}><ArrowDown aria-hidden className="size-4" /></Button>
                </li>))}</ul>
            </div>
          </div>
        )}

        {can('overview') ? (
          <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {metricList.map((m) => (
              <button key={m.label} type="button" onClick={() => setTab(m.goTo)} className="rounded-xl border border-border p-3 text-left hover:bg-surface-muted">
                <dd className={`text-2xl font-bold ${m.value === 0 ? 'text-muted-foreground' : ''}`}>{m.value}</dd>
                <dt className="text-xs text-muted-foreground">{m.label}</dt>
              </button>
            ))}
          </dl>
        ) : <p className="mt-4 text-sm text-muted-foreground">Activity metrics are private.</p>}
        {metricList.every((m) => m.value === 0) && (
          <p className="mt-2 text-sm text-muted-foreground">
            {own ? 'You’re just getting started.' : `${profile.displayName} is just getting started.`} These numbers grow with real activity, not likes.{' '}
            {own && <Link to="/community" className="font-semibold text-brand hover:underline">Find a group to join</Link>}
          </p>
        )}
        {!own && <p className="mt-3 text-xs text-muted-foreground">Following is private and one-way. It doesn’t give access to private content.</p>}
      </Card>

      <div className="mt-5"><Tabs tabs={tabs} value={tab} onChange={setTab} label="Profile sections" /></div>

      {own && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <label htmlFor="vis" className="font-medium">Who can see “{PROFILE_SECTIONS.find((s) => s.id === tab)?.label}”:</label>
          <Select id="vis" className="w-auto" value={profile.privacy[tab] ?? 'private'} onChange={(e) => update((s) => setSectionVisibility(s, me, tab, e.target.value as Visibility))}>{VIS_OPTIONS}</Select>
        </div>
      )}

      {!can(tab) ? locked : tab === 'overview' ? (
        <div className="space-y-4">
          <Card><h2 className="mb-2 font-semibold">Organizations</h2>
            {orgs.length === 0 ? <p className="text-sm text-muted-foreground">{own ? 'You haven’t joined an organization yet.' : `${profile.displayName} hasn’t joined an organization yet.`} <Link to="/organizations" className="font-semibold text-brand hover:underline">Browse organizations</Link></p> : (
              <ul className="space-y-1 text-sm">{orgs.map((m) => { const o = state.organizations.find((x) => x.id === m.organizationId); return o && <li key={m.id}><Link className="font-medium hover:underline" to={`/organizations/${o.id}`}>{o.name}</Link> <span className="text-muted-foreground">· {m.role.replace('-', ' ')}</span></li> })}</ul>
            )}
          </Card>
          <Card><h2 className="mb-2 font-semibold">Events attended</h2>
            {attended.length === 0 ? <p className="text-sm text-muted-foreground">No confirmed attendance yet. <Link to="/events" className="font-semibold text-brand hover:underline">See upcoming events</Link></p> : (
              <ul className="space-y-1 text-sm">{attended.map((e) => <li key={e.id}><Link className="font-medium hover:underline" to={`/events/${e.id}`}>{e.title}</Link> <span className="text-muted-foreground">· {formatDay(e.startAt)}</span></li>)}</ul>
            )}
          </Card>
        </div>
      ) : tab === 'blog' ? <BlogSection ownerId={profile.id} />
      : tab === 'collections' ? <CollectionsSection ownerId={profile.id} />
      : tab === 'portfolio' ? <PortfolioSection ownerId={profile.id} />
      : tab === 'collaborations' ? (
        collaborationProjectsFor(state, me, profile.id).length === 0 ? <EmptyState title="No collaborations yet" description="Collaborations come from confirmed work on projects, not from following or connecting." /> : (
          <ul className="space-y-3">{collaborationProjectsFor(state, me, profile.id).map(({ project, membership }) => (
            <li key={project.id}><Card><Link className="font-semibold hover:underline" to={`/projects/${project.id}`}>{project.title}</Link><p className="text-sm text-muted-foreground">Role: {membership.role}{membership.contributionSummary ? ` · Credit: ${membership.contributionSummary}` : ''}</p></Card></li>
          ))}</ul>
        )
      ) : (
        <Card className="space-y-3 text-sm">
          <div><h2 className="mb-1 font-semibold">Interests</h2>{profile.interests.length ? <Tags tags={profile.interests} /> : <p className="text-muted-foreground">None listed.</p>}</div>
          <div><h2 className="mb-1 font-semibold">Skills</h2>{profile.skills.length ? <Tags tags={profile.skills} /> : <p className="text-muted-foreground">None listed.</p>}</div>
        </Card>
      )}
    </div>
  )
}
