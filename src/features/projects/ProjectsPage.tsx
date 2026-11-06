import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gradientFor } from '../../utils/art'
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, Tabs, Tags, Textarea } from '../../components/shared/ui'
import { parseList } from '../../utils/parseList'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { PROJECT_CATEGORIES, createProject, discoverableProjects, myProjects } from '../../services/projectsService'
import type { Project, ProjectKind } from '../../types'

type Tab = 'help' | 'collaborators' | 'mine'

function ProjectCard({ project, showStatus }: { project: Project; showStatus?: boolean }) {
  const { studentName } = useDirectory()
  return (
    <Card className="overflow-hidden !p-0">
      <div className="h-2" style={{ backgroundImage: gradientFor(project.category) }} aria-hidden />
      <div className="p-4">
      <div className="flex flex-wrap gap-1.5">
        <Badge tone="brand">{project.category}</Badge>
        {project.kind === 'need-help' && <Badge>Needs help</Badge>}
        {project.kind === 'offer-help' && <Badge tone="success">Offering help</Badge>}
        {showStatus && <Badge tone={project.status === 'private' ? 'neutral' : 'info'}>{project.status === 'private' ? 'Private' : project.status}</Badge>}
      </div>
      <h2 className="mt-2 font-semibold"><Link to={`/projects/${project.id}`} className="hover:underline">{project.title}</Link></h2>
      <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
      {project.skillsNeeded.length > 0 && <div className="mt-2"><p className="mb-1 text-xs font-medium">{project.kind === 'offer-help' ? 'Skills offered' : 'Skills needed'}</p><Tags tags={project.skillsNeeded} /></div>}
      <p className="mt-2 text-xs text-muted-foreground">By {studentName(project.ownerId)}{project.deadline ? ` · Deadline ${project.deadline}` : ''}</p>
      </div>
    </Card>
  )
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
      <PageHeader title="Projects" description="Peer collaboration, not a freelance marketplace. New projects start private; you choose when to publish."
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
      {list.length === 0 ? (
        <EmptyState title={tab === 'mine' ? 'You have no projects yet' : 'Nothing posted yet'} description={tab === 'mine' ? 'Create a private project to get started.' : 'Check back soon, or post your own.'} />
      ) : <div className="grid gap-4 md:grid-cols-2">{list.map((p) => <ProjectCard key={p.id} project={p} showStatus={tab === 'mine'} />)}</div>}
    </div>
  )
}
