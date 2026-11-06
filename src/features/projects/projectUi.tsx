import { useState } from 'react'
import { CoverArt } from '../../components/shared/CoverArt'
import type { Project } from '../../types'

/** Human deadline: "Closes in 12 days", "Closes tomorrow", "Closed". Undefined when no deadline. */
export function deadlineInfo(deadline: string | undefined, now = new Date()): { label: string; urgent: boolean } | undefined {
  if (!deadline) return undefined
  const end = new Date(`${deadline}T23:59:59`)
  const days = Math.ceil((end.getTime() - now.getTime()) / 86_400_000)
  if (days < 0) return { label: 'Closed', urgent: false }
  if (days === 0) return { label: 'Closes today', urgent: true }
  if (days === 1) return { label: 'Closes tomorrow', urgent: true }
  return { label: `Closes in ${days} days`, urgent: days <= 14 }
}

export function formatDate(deadline: string): string {
  return new Date(`${deadline}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Project cover: photo when available, otherwise generated art (new projects have no photo yet). Children render on top of a legibility scrim. */
export function ProjectCover({ project, className, children }: { project: Project; className: string; children?: React.ReactNode }) {
  const [failed, setFailed] = useState(false)
  const photo = project.coverUrl && !failed
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!photo && <CoverArt seed={project.id + project.category} className="absolute inset-0" />}
      {photo && <img src={project.coverUrl} alt="" loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30" />
      {children}
    </div>
  )
}
