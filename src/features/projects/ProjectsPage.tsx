import { ArrowRight, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProjectCover, deadlineInfo } from './projectUi'
import { Avatar, Button, Card, EmptyState, Field, Input, PageHeader, Select, Tabs, Textarea } from '../../components/shared/ui'
import { parseList } from '../../utils/parseList'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { PROJECT_CATEGORIES, activeMembers, createProject, discoverableProjects, myProjects } from '../../services/projectsService'
import type { Project, ProjectKind } from '../../types'

type Tab = 'help' | 'collaborators' | 'mine'

function ProjectCard({ project, showStatus, featured }: { project: Project; showStatus?: boolean; featured?: boolean }) {
  const { state } = useAppState()
  const { studentName } = useDirectory()
  const team = activeMembers(state, project.id)
  const dl = deadlineInfo(project.deadline)
  const roles = project.roles?.map((r) => r.title) ?? project.skillsNeeded
  const offering = project.kind === 'offer-help'
  const lead = project.kind === 'need-help' ? 'Needs' : offering ? 'Offers' : 'Looking for'
  return (
    <article className={`group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-[box-shadow,transform] duration-200 ease-out focus-within:ring-2 focus-within:ring-brand hover:-translate-y-0.5 hover:shadow-md ${featured ? 'md:col-span-2 md:grid md:grid-cols-[1.1fr_1fr]' : ''}`}>
      <ProjectCover project={project} className={featured ? 'h-52 md:h-full md:min-h-72' : 'h-44'}>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground">{project.category}</span>
          {showStatus && <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">{project.status === 'private' ? 'Private' : project.status}</span>}
        </div>
        {dl && <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${dl.urgent ? 'bg-brand text-white' : 'bg-white/95 text-foreground'}`}>{dl.label}</span>}
        {!featured && <h3 className="absolute inset-x-4 bottom-3 text-lg font-bold leading-snug text-white [text-wrap:balance]">{project.title}</h3>}
      </ProjectCover>
      <div className="flex flex-col p-4 md:p-5">
        {featured && <h3 className="text-2xl font-bold leading-tight [text-wrap:balance]">{project.title}</h3>}
        <p className={`${featured ? 'mt-2 text-base' : 'text-sm'} text-foreground [text-wrap:pretty]`}>{project.pitch ?? project.description}</p>
        {roles.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-muted-foreground">{lead}</p>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">{roles.map((r) => <li key={r} className="rounded-full border border-brand/30 bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">{r}</li>)}</ul>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex -space-x-2">{[project.ownerId, ...team.map((m) => m.studentId).filter((id) => id !== project.ownerId)].slice(0, 3).map((id) => <span key={id} className="rounded-full ring-2 ring-surface"><Avatar name={studentName(id)} size={30} /></span>)}</span>
            <span className="min-w-0 text-xs leading-tight text-muted-foreground"><span className="block truncate font-semibold text-foreground">Led by {studentName(project.ownerId)}</span>{team.length > 1 ? `${team.length} on the team` : 'Just getting started'}</span>
          </div>
          <Link to={`/projects/${project.id}`} className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg bg-brand px-3.5 text-sm font-semibold text-white hover:bg-brand-hover after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2">
            {offering ? 'See how they can help' : 'See the roles'} <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

const TAB_COPY: Record<Exclude<Tab, 'mine'>, { title: string; blurb: string }> = {
  collaborators: { title: 'Teams with open roles', blurb: 'Projects that need people to join the crew. Each role says what you would actually do.' },
  help: { title: 'A hand, given or asked for', blurb: 'Quick, one-off favours: students asking for feedback or testers, and students offering their skills for free.' },
}

function Section({ title, blurb, children }: { title: string; blurb?: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold">{title}</h2>
      {blurb && <p className="mb-3 mt-0.5 max-w-prose text-sm text-muted-foreground">{blurb}</p>}
      {children}
    </section>
  )
}

/** My Projects, grouped by what you do in each: lead, take part, or have finished. */
function MineSections({ list, me }: { list: Project[]; me: string }) {
  if (list.length === 0) {
    return <EmptyState title="You have no projects yet" description="Start a private project of your own, or ask to join one from Find Collaborators." />
  }
  const finished = list.filter((p) => p.status === 'completed' || p.status === 'archived')
  const open = list.filter((p) => !finished.includes(p))
  const leading = open.filter((p) => p.ownerId === me)
  const joined = open.filter((p) => p.ownerId !== me)
  const groups = [
    { title: 'Projects you lead', blurb: 'You decide who joins and when to publish.', items: leading },
    { title: 'Projects you’re part of', blurb: 'Your role and tasks live inside each project.', items: joined },
    { title: 'Finished', blurb: 'Credit stays on your profile.', items: finished },
  ].filter((g) => g.items.length > 0)
  return <>{groups.map((g) => (
    <Section key={g.title} title={g.title} blurb={g.blurb}>
      <div className="motion-stagger grid gap-5 md:grid-cols-2">{g.items.map((p) => <ProjectCard key={p.id} project={p} showStatus />)}</div>
    </Section>
  ))}</>
}

export function ProjectsPage() {
  const { state, activeStudent, update } = useAppState()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('collaborators')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: PROJECT_CATEGORIES[0], kind: 'collaborators' as ProjectKind, skills: '', deadline: '' })

  const list = tab === 'mine' ? myProjects(state, activeStudent.id) : discoverableProjects(state, tab === 'help' ? 'help' : 'collaborators')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const { state: next, id } = createProject(state, activeStudent.id, { ...form, skillsNeeded: parseList(form.skills) })
    update(() => next)
    navigate(`/projects/${id}`)
  }

  return (
    <div>
      <PageHeader title="Projects" description="Real things students are making right now, and the roles still open. Find one that excites you and ask to join. Peer collaboration, not a freelance marketplace."
        actions={<Button variant="primary" onClick={() => setCreating((c) => !c)} aria-expanded={creating}><Plus aria-hidden className="size-4" /> New project</Button>} />

      {creating && (
        <Card className="mb-5">
          <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2"><Field label="Title"><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Description"><Textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field></div>
            <Field label="Category"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{PROJECT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <Field label="Type"><Select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as ProjectKind })}><option value="collaborators">Looking for collaborators</option><option value="need-help">I need help</option><option value="offer-help">I can help</option></Select></Field>
            <Field label={form.kind === 'offer-help' ? 'Skills you can offer' : 'Skills or roles needed'} hint="Comma-separated"><Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></Field>
            <Field label="Deadline (optional)"><Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></Field>
            <div className="flex gap-2 md:col-span-2"><Button type="submit" variant="primary" disabled={!form.title.trim() || !form.description.trim()}>Create private project</Button><Button onClick={() => setCreating(false)}>Cancel</Button></div>
            <p className="text-xs text-muted-foreground md:col-span-2">Your project starts private with a workspace only you can see. Publish it later to invite requests. No rates or payments; give credit to everyone who contributes.</p>
          </form>
        </Card>
      )}

      <Tabs<Tab> label="Project views" value={tab} onChange={setTab} tabs={[{ id: 'collaborators', label: 'Find Collaborators' }, { id: 'help', label: 'Find Help' }, { id: 'mine', label: 'My Projects' }]} />
      {tab === 'mine' ? <MineSections list={list} me={activeStudent.id} /> : (
        <Section title={TAB_COPY[tab].title} blurb={TAB_COPY[tab].blurb}>
          {list.length === 0
            ? <EmptyState title="Nothing posted yet" description="Check back soon, or post your own." />
            : <div className="motion-stagger grid gap-5 md:grid-cols-2">{list.map((p, i) => <ProjectCard key={p.id} project={p} featured={i === 0 && list.length > 2} />)}</div>}
        </Section>
      )}
    </div>
  )
}
