import type { PersistedAppState, Project, ProjectKind, ProjectTask } from '../types'
import { newId, nowIso } from '../utils/id'
import { notify } from './notificationsService'

export const PROJECT_CATEGORIES = [
  'Media & Production', 'Design & Creative', 'Technology',
  'Business & Entrepreneurship', 'Music', 'Academic & Research',
]

export const activeMembers = (s: PersistedAppState, projectId: string) =>
  s.projectMemberships.filter((m) => m.projectId === projectId && m.status === 'active')

export const isOwner = (s: PersistedAppState, studentId: string, projectId: string) =>
  s.projects.find((p) => p.id === projectId)?.ownerId === studentId

export const requestFor = (s: PersistedAppState, studentId: string, projectId: string) =>
  [...s.projectJoinRequests].reverse().find((r) => r.projectId === projectId && r.studentId === studentId)

export const discoverableProjects = (s: PersistedAppState, kind: ProjectKind | 'help') =>
  s.projects.filter((p) => (kind === 'help' ? p.kind !== 'collaborators' : p.kind === kind) && p.isPublished && p.status === 'recruiting')

export const myProjects = (s: PersistedAppState, studentId: string) =>
  s.projects.filter((p) => p.ownerId === studentId || activeMembers(s, p.id).some((m) => m.studentId === studentId))

export interface NewProjectInput {
  title: string; description: string; category: string; kind: ProjectKind; skillsNeeded: string[]; deadline?: string
}

/** New projects always start private; publishing is a separate, explicit owner action. */
export function createProject(s: PersistedAppState, ownerId: string, input: NewProjectInput): { state: PersistedAppState; id: string } {
  const id = newId('proj')
  const now = nowIso()
  const project: Project = {
    id, ownerId, kind: input.kind, title: input.title.trim(), description: input.description.trim(),
    category: input.category, skillsNeeded: input.skillsNeeded, status: 'private', isPublished: false,
    deadline: input.deadline || undefined, createdAt: now, updatedAt: now,
  }
  return {
    id,
    state: {
      ...s,
      projects: [...s.projects, project],
      projectMemberships: [...s.projectMemberships, { id: newId('pm'), projectId: id, studentId: ownerId, role: 'Owner', status: 'active' }],
    },
  }
}

const patchProject = (s: PersistedAppState, id: string, patch: Partial<Project>): PersistedAppState =>
  ({ ...s, projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: nowIso() } : p)) })

export function setPublished(s: PersistedAppState, ownerId: string, projectId: string, published: boolean): PersistedAppState {
  if (!isOwner(s, ownerId, projectId)) return s
  return patchProject(s, projectId, { isPublished: published, status: published ? 'recruiting' : 'private' })
}

export function archiveProject(s: PersistedAppState, ownerId: string, projectId: string): PersistedAppState {
  if (!isOwner(s, ownerId, projectId)) return s
  return patchProject(s, projectId, { isPublished: false, status: 'archived' })
}

export function requestToJoin(s: PersistedAppState, studentId: string, projectId: string, message: string): PersistedAppState {
  const project = s.projects.find((p) => p.id === projectId)
  if (!project || !project.isPublished || project.status !== 'recruiting') return s
  if (project.ownerId === studentId || activeMembers(s, projectId).some((m) => m.studentId === studentId)) return s
  if (requestFor(s, studentId, projectId)?.status === 'pending') return s
  const next = {
    ...s,
    projectJoinRequests: [...s.projectJoinRequests, { id: newId('pjr'), projectId, studentId, message: message.trim() || undefined, status: 'pending' as const, createdAt: nowIso() }],
  }
  const who = s.students.find((x) => x.id === studentId)?.displayName ?? 'A student'
  return notify(next, project.ownerId, 'New join request', `${who} asked to join ${project.title}.`, `/projects/${projectId}`)
}

export function withdrawRequest(s: PersistedAppState, studentId: string, projectId: string): PersistedAppState {
  return {
    ...s,
    projectJoinRequests: s.projectJoinRequests.map((r) =>
      r.projectId === projectId && r.studentId === studentId && r.status === 'pending' ? { ...r, status: 'withdrawn' as const } : r),
  }
}

/** Only the owner decides. Accepting creates the active membership that unlocks the workspace. */
export function decideRequest(s: PersistedAppState, ownerId: string, requestId: string, accept: boolean): PersistedAppState {
  const req = s.projectJoinRequests.find((r) => r.id === requestId)
  if (!req || req.status !== 'pending' || !isOwner(s, ownerId, req.projectId)) return s
  const next: PersistedAppState = {
    ...s,
    projectJoinRequests: s.projectJoinRequests.map((r) => (r.id === requestId ? { ...r, status: accept ? 'accepted' : 'declined' } : r)),
  }
  const title = s.projects.find((p) => p.id === req.projectId)?.title ?? 'a project'
  const told = notify(next, req.studentId, accept ? 'Request accepted' : 'Request declined', `Your request to join ${title} was ${accept ? 'accepted' : 'declined'}.`, `/projects/${req.projectId}`)
  if (!accept) return told
  return { ...told, projectMemberships: [...told.projectMemberships.filter((m) => !(m.projectId === req.projectId && m.studentId === req.studentId)), { id: newId('pm'), projectId: req.projectId, studentId: req.studentId, role: 'Collaborator', status: 'active' }] }
}

export function removeMember(s: PersistedAppState, ownerId: string, projectId: string, studentId: string): PersistedAppState {
  if (!isOwner(s, ownerId, projectId) || studentId === ownerId) return s
  return { ...s, projectMemberships: s.projectMemberships.map((m) => (m.projectId === projectId && m.studentId === studentId ? { ...m, status: 'removed' as const } : m)) }
}

export function addTask(s: PersistedAppState, projectId: string, title: string, assigneeId?: string): PersistedAppState {
  if (!title.trim()) return s
  const task: ProjectTask = { id: newId('task'), projectId, title: title.trim(), assigneeId: assigneeId || undefined, status: 'todo' }
  return { ...s, tasks: [...s.tasks, task] }
}

export const setTaskStatus = (s: PersistedAppState, taskId: string, status: ProjectTask['status']): PersistedAppState =>
  ({ ...s, tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)) })

export const deleteTask = (s: PersistedAppState, taskId: string): PersistedAppState =>
  ({ ...s, tasks: s.tasks.filter((t) => t.id !== taskId) })

const isTeam = (s: PersistedAppState, studentId: string, projectId: string) =>
  isOwner(s, studentId, projectId) || activeMembers(s, projectId).some((m) => m.studentId === studentId)

export function completeProject(s: PersistedAppState, ownerId: string, projectId: string): PersistedAppState {
  if (!isOwner(s, ownerId, projectId)) return s
  return patchProject(s, projectId, { status: 'completed', isPublished: false })
}

export function setContribution(s: PersistedAppState, ownerId: string, projectId: string, studentId: string, summary: string): PersistedAppState {
  if (!isOwner(s, ownerId, projectId)) return s
  return { ...s, projectMemberships: s.projectMemberships.map((m) => (m.projectId === projectId && m.studentId === studentId && m.status === 'active' ? { ...m, contributionSummary: summary.trim() || undefined } : m)) }
}

export function addMilestone(s: PersistedAppState, studentId: string, projectId: string, title: string, dueAt: string): PersistedAppState {
  if (!title.trim() || !isTeam(s, studentId, projectId)) return s
  return { ...s, milestones: [...s.milestones, { id: newId('ms'), projectId, title: title.trim(), dueAt: dueAt || undefined, done: false }] }
}

export function toggleMilestone(s: PersistedAppState, studentId: string, milestoneId: string): PersistedAppState {
  const m = s.milestones.find((x) => x.id === milestoneId)
  if (!m || !isTeam(s, studentId, m.projectId)) return s
  return { ...s, milestones: s.milestones.map((x) => (x.id === milestoneId ? { ...x, done: !x.done } : x)) }
}

export function deleteMilestone(s: PersistedAppState, studentId: string, milestoneId: string): PersistedAppState {
  const m = s.milestones.find((x) => x.id === milestoneId)
  if (!m || !isTeam(s, studentId, m.projectId)) return s
  return { ...s, milestones: s.milestones.filter((x) => x.id !== milestoneId) }
}

/** File metadata only. The prototype hosts no real files. */
export function addProjectFile(s: PersistedAppState, studentId: string, projectId: string, name: string): PersistedAppState {
  if (!name.trim() || !isTeam(s, studentId, projectId)) return s
  return { ...s, projectFiles: [...s.projectFiles, { id: newId('pf'), projectId, name: name.trim(), addedById: studentId, createdAt: nowIso() }] }
}

export function deleteProjectFile(s: PersistedAppState, studentId: string, fileId: string): PersistedAppState {
  const f = s.projectFiles.find((x) => x.id === fileId)
  if (!f || !isTeam(s, studentId, f.projectId)) return s
  return { ...s, projectFiles: s.projectFiles.filter((x) => x.id !== fileId) }
}
