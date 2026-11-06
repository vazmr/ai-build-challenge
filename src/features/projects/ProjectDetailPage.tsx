import { ArrowLeft, CalendarDays, Check, Clock, Lock, Sparkles, Users, X } from 'lucide-react'
import { useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { AccessDenied, Badge, Button, Card, EmptyState, PersonLink, Select, Tags, Textarea, Input } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import {
  activeMembers, addMilestone, addProjectFile, addTask, archiveProject, completeProject, decideRequest, deleteMilestone, deleteProjectFile, deleteTask,
  removeMember, requestFor, requestToJoin, setContribution, setPublished, setTaskStatus, toggleMilestone, withdrawRequest,
} from '../../services/projectsService'
import type { ProjectTask } from '../../types'
import { ensureProjectConversation, projectConversation } from '../../services/messagingService'
import { isSaved, toggleSaved } from '../../services/socialService'
import { canAccessProjectWorkspace } from '../../utils/permissions'
import { ChatPanel } from '../messaging/ChatPanel'
import { ProjectCover, deadlineInfo, formatDate } from './projectUi'

const STATUS_LABEL: Record<ProjectTask['status'], string> = { todo: 'To do', 'in-progress': 'In progress', done: 'Done' }

export function ProjectDetailPage() {
  const { projectId = '' } = useParams()
  const { state, activeStudent, update } = useAppState()
  const { studentName } = useDirectory()
  const [message, setMessage] = useState('')
  const [role, setRole] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [assignee, setAssignee] = useState('')
  const [ms, setMs] = useState({ title: '', due: '' })
  const [fileName, setFileName] = useState('')
  const me = activeStudent.id

  const project = state.projects.find((p) => p.id === projectId)
  if (!project) return <EmptyState title="Project not found" action={<Link to="/projects" className="text-sm font-semibold text-brand">Back to Projects</Link>} />

  const hasAccess = canAccessProjectWorkspace(state, me, project.id)
  const owner = project.ownerId === me
  const members = activeMembers(state, project.id)
  const request = requestFor(state, me, project.id)
  const back = <Link to="/projects" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden className="size-4" /> Projects</Link>

  // Access state: private content is never shown to non-members. An unpublished project is invisible to them.
  if (!hasAccess && !project.isPublished) {
    return <div className="mx-auto max-w-2xl">{back}<AccessDenied title="This project is private" description="Only the owner and accepted collaborators can open it." /></div>
  }

  const pending = state.projectJoinRequests.filter((r) => r.projectId === project.id && r.status === 'pending')
  const tasks = state.tasks.filter((t) => t.projectId === project.id)
  const milestones = state.milestones.filter((m) => m.projectId === project.id).sort((a, b) => (a.dueAt ?? '9').localeCompare(b.dueAt ?? '9'))
  const files = state.projectFiles.filter((f) => f.projectId === project.id)
  const saved = isSaved(state, me, 'project', project.id)
  const chat = projectConversation(state, project.id)

  const dl = deadlineInfo(project.deadline)
  const roles = project.roles ?? []
  const ownerProfile = state.students.find((st) => st.id === project.ownerId)
  const offering = project.kind === 'offer-help'
  const canJoin = project.status === 'recruiting'

  const ownerTools = owner && project.status !== 'archived' && (
    <div className="mt-4 flex flex-wrap gap-2 rounded-xl border border-border bg-surface p-3">
      <p className="w-full text-xs font-semibold text-muted-foreground">Owner tools</p>
      {project.isPublished
        ? <Button onClick={() => update((s) => setPublished(s, me, project.id, false))}>Unpublish (make private)</Button>
        : <Button variant="primary" onClick={() => update((s) => setPublished(s, me, project.id, true))}>Publish opportunity</Button>}
      {project.status !== 'completed' && <Button onClick={() => { if (window.confirm('Mark this project as completed? It will close to new requests; the team keeps access.')) update((s) => completeProject(s, me, project.id)) }}>Mark completed</Button>}
      <Button variant="danger" onClick={() => { if (window.confirm('Archive this project? It will be closed to new requests.')) update((s) => archiveProject(s, me, project.id)) }}>Archive</Button>
    </div>
  )

  return (
    <div className="mx-auto max-w-5xl">
      {back}
      <ProjectCover project={project} className="rounded-2xl">
        <div className="relative flex min-h-64 flex-col justify-end p-5 text-white md:min-h-80 md:p-8">
          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground">{project.category}</span>
            <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold">{project.status === 'private' ? 'Private' : project.status === 'recruiting' ? 'Open to new people' : project.status}</span>
            {project.kind === 'need-help' && <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold">Needs help</span>}
            {offering && <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold">Offering help</span>}
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight [text-wrap:balance] md:text-4xl">{project.title}</h1>
          {project.pitch && <p className="mt-2 max-w-2xl text-base text-white/90 [text-wrap:pretty] md:text-lg">{project.pitch}</p>}
        </div>
      </ProjectCover>

      <div className={`mt-6 grid gap-8 ${hasAccess ? '' : 'lg:grid-cols-[minmax(0,1fr)_340px]'}`}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-border pb-5">
            <PersonLink id={project.ownerId} name={studentName(project.ownerId)} />
            <span className="text-sm text-muted-foreground">{ownerProfile?.major ? `${ownerProfile.major} · ` : ''}project lead</span>
            <span className="ml-auto flex items-center gap-2">
              {!hasAccess && request?.status !== 'pending' && canJoin && <a href="#join" className="inline-flex min-h-10 items-center rounded-lg bg-brand px-3.5 text-sm font-semibold text-white hover:bg-brand-hover lg:hidden">{offering ? 'Ask for help' : 'Join this project'}</a>}
              <Button aria-pressed={saved} onClick={() => update((s) => toggleSaved(s, me, 'project', project.id))}>{saved ? <BookmarkCheck aria-hidden className="size-4 text-brand" /> : <Bookmark aria-hidden className="size-4" />} {saved ? 'Saved' : 'Save for later'}</Button>
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-4 border-b border-border py-5 sm:grid-cols-3">
            {project.commitment && <div><dt className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Clock aria-hidden className="size-3.5" /> Time</dt><dd className="mt-1 text-sm font-semibold">{project.commitment}</dd></div>}
            {project.deadline && <div><dt className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><CalendarDays aria-hidden className="size-3.5" /> Deadline</dt><dd className="mt-1 text-sm font-semibold">{formatDate(project.deadline)}{dl && <span className={`ml-1.5 font-normal ${dl.urgent ? 'text-brand' : 'text-muted-foreground'}`}>({dl.label.toLowerCase()})</span>}</dd></div>}
            <div><dt className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Users aria-hidden className="size-3.5" /> Team</dt><dd className="mt-1 text-sm font-semibold">{members.length > 1 ? `${members.length} people on board` : 'Just getting started'}</dd></div>
          </dl>

          <section className="py-6" aria-labelledby="idea-h">
            <h2 id="idea-h" className="text-lg font-bold">The idea</h2>
            <p className="mt-2 max-w-prose text-base leading-relaxed text-foreground">{project.description}</p>
          </section>

          {roles.length > 0 && (
            <section className="border-t border-border py-6" aria-labelledby="roles-h">
              <h2 id="roles-h" className="text-lg font-bold">{offering ? 'How they can help' : project.kind === 'need-help' ? 'Where help is needed' : 'Where you could fit in'}</h2>
              <ul className="mt-3 divide-y divide-border">{roles.map((r) => (
                <li key={r.title} className="flex gap-3 py-3.5">
                  <span aria-hidden className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><Sparkles className="size-4" /></span>
                  <div><p className="font-semibold">{r.title}</p><p className="mt-0.5 max-w-prose text-sm text-muted-foreground">{r.description}</p></div>
                </li>))}
              </ul>
            </section>
          )}
          {roles.length === 0 && project.skillsNeeded.length > 0 && <section className="border-t border-border py-6"><h2 className="text-lg font-bold">Skills that would help</h2><div className="mt-3"><Tags tags={project.skillsNeeded} /></div></section>}

          {(project.perks?.length ?? 0) > 0 && (
            <section className="border-t border-border py-6" aria-labelledby="perks-h">
              <h2 id="perks-h" className="text-lg font-bold">What you take away</h2>
              <ul className="mt-3 space-y-2">{project.perks!.map((p) => <li key={p} className="flex items-start gap-2.5 text-sm"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" /><span>{p}</span></li>)}</ul>
              <p className="mt-3 text-xs text-muted-foreground">Everyone who contributes is credited. No rates or payments.</p>
            </section>
          )}
          {ownerTools}
        </div>

        {!hasAccess && (
          <aside id="join" className="scroll-mt-20 lg:sticky lg:top-20 lg:self-start" aria-label="Join this project">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h2 className="text-lg font-bold">{offering ? 'Want this person’s help?' : 'Want to be part of this?'}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{offering ? 'Tell them what you’re working on.' : 'Tell the team a bit about you. You don’t need to be an expert, you need to care about the result.'}</p>
              {request?.status === 'pending' ? (
                <div className="mt-4 space-y-3"><Badge tone="warning">Request pending</Badge><p className="text-sm text-muted-foreground">{studentName(project.ownerId)} will review it and reply here.</p><Button onClick={() => update((s) => withdrawRequest(s, me, project.id))}>Withdraw request</Button></div>
              ) : (
                <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); update((s) => requestToJoin(s, me, project.id, role ? `[${role}] ${message}`.trim() : message)); setMessage(''); setRole('') }}>
                  {request?.status === 'declined' && <p className="text-sm text-muted-foreground">Your last request wasn’t accepted. You can send a new one.</p>}
                  {roles.length > 0 && (
                    <fieldset>
                      <legend className="mb-1.5 text-sm font-semibold">{offering ? 'What do you need?' : 'Which role excites you?'}</legend>
                      <div className="flex flex-wrap gap-1.5">{roles.map((r) => (
                        <button key={r.title} type="button" aria-pressed={role === r.title} onClick={() => setRole(role === r.title ? '' : r.title)}
                          className={`min-h-10 rounded-full border px-3 text-sm font-semibold ${role === r.title ? 'border-brand bg-brand text-white' : 'border-border hover:bg-surface-muted'}`}>{r.title}</button>))}
                      </div>
                    </fieldset>
                  )}
                  <Textarea aria-label="Message to the project lead" rows={4} placeholder={offering ? 'What are you working on?' : 'What would you bring, or want to learn? A sentence is enough.'} value={message} onChange={(e) => setMessage(e.target.value)} />
                  <Button type="submit" variant="primary" className="w-full" disabled={!canJoin}>{offering ? 'Ask for help' : 'Request to join'}</Button>
                  {!canJoin && <p className="text-xs text-muted-foreground">This project isn’t taking new requests right now.</p>}
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" /> {studentName(project.ownerId)} reviews every request. The team workspace stays private until you’re accepted.</p>
                </form>
              )}
            </div>
          </aside>
        )}
      </div>

      {hasAccess && (
        <div className="mt-2 border-t border-border pt-4">
          <h2 className="text-lg font-bold">Team workspace</h2>
          {owner && pending.length > 0 && (
            <Card className="mt-5">
              <h2 className="mb-3 font-semibold">Join requests ({pending.length})</h2>
              <ul className="space-y-3">{pending.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-2">
                  <div><PersonLink id={r.studentId} name={studentName(r.studentId)} />{r.message && <p className="mt-1 text-sm text-muted-foreground">“{r.message}”</p>}</div>
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={() => update((s) => decideRequest(s, me, r.id, true))}><Check aria-hidden className="size-4" /> Accept</Button>
                    <Button onClick={() => update((s) => decideRequest(s, me, r.id, false))}><X aria-hidden className="size-4" /> Decline</Button>
                  </div>
                </li>
              ))}</ul>
            </Card>
          )}

          <Card className="mt-5">
            <h2 className="mb-3 font-semibold">Team</h2>
            <ul className="space-y-2">{members.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span><PersonLink id={m.studentId} name={studentName(m.studentId)} /> <span className="text-muted-foreground">· {m.role}</span>{m.contributionSummary && <span className="text-muted-foreground"> · Credit: {m.contributionSummary}</span>}</span>
                {owner && <Input aria-label={`Contribution credit for ${studentName(m.studentId)}`} placeholder="Credit (e.g. Cover art)" className="max-w-48" defaultValue={m.contributionSummary ?? ''} onBlur={(e) => update((s) => setContribution(s, me, project.id, m.studentId, e.target.value))} />}
                {owner && m.studentId !== me && <Button variant="ghost" onClick={() => { if (window.confirm(`Remove ${studentName(m.studentId)} from this project?`)) update((s) => removeMember(s, me, project.id, m.studentId)) }}>Remove</Button>}
              </li>
            ))}</ul>
          </Card>

          <Card className="mt-5">
            <h2 className="mb-3 font-semibold">Tasks</h2>
            <form className="mb-4 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); update((s) => addTask(s, project.id, taskTitle, assignee)); setTaskTitle('') }}>
              <Input aria-label="New task" placeholder="Add a task…" className="min-w-0 flex-1" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
              <Select aria-label="Assignee" className="w-auto" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                <option value="">Unassigned</option>{members.map((m) => <option key={m.id} value={m.studentId}>{studentName(m.studentId)}</option>)}
              </Select>
              <Button type="submit" variant="primary" disabled={!taskTitle.trim()}>Add</Button>
            </form>
            {tasks.length === 0 ? <p className="text-sm text-muted-foreground">No tasks yet.</p> : (
              <ul className="space-y-2">{tasks.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-2.5 text-sm">
                  <span className={t.status === 'done' ? 'text-muted-foreground line-through' : ''}>{t.title}{t.assigneeId && <span className="text-muted-foreground"> · {studentName(t.assigneeId)}</span>}</span>
                  <span className="flex items-center gap-2">
                    <Select aria-label={`Status of ${t.title}`} className="w-auto" value={t.status} onChange={(e) => update((s) => setTaskStatus(s, t.id, e.target.value as ProjectTask['status']))}>
                      {(Object.keys(STATUS_LABEL) as ProjectTask['status'][]).map((k) => <option key={k} value={k}>{STATUS_LABEL[k]}</option>)}
                    </Select>
                    <Button variant="ghost" aria-label={`Delete task ${t.title}`} onClick={() => update((s) => deleteTask(s, t.id))}><X aria-hidden className="size-4" /></Button>
                  </span>
                </li>
              ))}</ul>
            )}
          </Card>
          <Card className="mt-5">
            <h2 className="mb-3 font-semibold">Milestones & schedule</h2>
            <form className="mb-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); update((s) => addMilestone(s, me, project.id, ms.title, ms.due)); setMs({ title: '', due: '' }) }}>
              <Input aria-label="New milestone" placeholder="Add a milestone…" className="min-w-0 flex-1" value={ms.title} onChange={(e) => setMs({ ...ms, title: e.target.value })} />
              <Input aria-label="Milestone due date" type="date" className="w-auto" value={ms.due} onChange={(e) => setMs({ ...ms, due: e.target.value })} />
              <Button type="submit" variant="primary" disabled={!ms.title.trim()}>Add</Button>
            </form>
            {milestones.length === 0 ? <p className="text-sm text-muted-foreground">No milestones yet.</p> : <ul className="space-y-1.5">{milestones.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-2 text-sm">
                <label className="flex min-h-9 items-center gap-2"><input type="checkbox" checked={m.done} onChange={() => update((s) => toggleMilestone(s, me, m.id))} /><span className={m.done ? 'text-muted-foreground line-through' : ''}>{m.title}</span>{m.dueAt && <span className="text-xs text-muted-foreground">due {m.dueAt}</span>}</label>
                <Button variant="ghost" aria-label={`Delete milestone ${m.title}`} onClick={() => update((s) => deleteMilestone(s, me, m.id))}><X aria-hidden className="size-4" /></Button>
              </li>))}</ul>}
          </Card>

          <Card className="mt-5">
            <h2 className="mb-1 font-semibold">Shared files</h2>
            <p className="mb-3 text-xs text-muted-foreground">Add file names to keep track of what the team shares.</p>
            <form className="mb-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); update((s) => addProjectFile(s, me, project.id, fileName)); setFileName('') }}>
              <Input aria-label="File name" placeholder="e.g. storyboard.pdf" value={fileName} onChange={(e) => setFileName(e.target.value)} />
              <Button type="submit" variant="primary" disabled={!fileName.trim()}>Add</Button>
            </form>
            {files.length === 0 ? <p className="text-sm text-muted-foreground">No files yet.</p> : <ul className="space-y-1 text-sm">{files.map((f) => <li key={f.id} className="flex items-center justify-between gap-2"><span>{f.name} <span className="text-xs text-muted-foreground">· added by {studentName(f.addedById)}</span></span><Button variant="ghost" aria-label={`Remove file ${f.name}`} onClick={() => update((s) => deleteProjectFile(s, me, f.id))}><X aria-hidden className="size-4" /></Button></li>)}</ul>}
          </Card>

          <div className="mt-5">
            {chat ? <ChatPanel conversationId={chat.id} title="Team chat (private)" /> : (
              <Card><h2 className="font-semibold">Team chat (private)</h2><p className="mt-1 text-sm text-muted-foreground">Only accepted team members can read it.</p>
                <Button className="mt-3" onClick={() => update((s) => ensureProjectConversation(s, project.id).state)}>Start team chat</Button></Card>
            )}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Academic projects: collaborate on learning, never to share or complete graded work for someone else.</p>
        </div>
      )}
    </div>
  )
}
