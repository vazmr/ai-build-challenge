import { useEffect, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AVATARS } from '../../data/seed/avatars'
import { gradientFor } from '../../utils/art'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-brand-foreground hover:bg-brand-hover',
  secondary: 'border border-border bg-surface text-foreground hover:bg-surface-muted',
  ghost: 'text-foreground hover:bg-surface-muted',
  danger: 'bg-danger text-white hover:opacity-90',
}

export function Button({ variant = 'secondary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold transition-[transform,background-color,color,opacity] duration-150 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    />
  )
}

export function Card({ children, className = '', id, state }: { children: ReactNode; className?: string; id?: string; state?: string }) {
  return <div id={id} data-state={state} className={`rounded-[var(--radius-card)] border border-border bg-surface p-4 ${className}`}>{children}</div>
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'info' }) {
  const tones = {
    neutral: 'bg-surface-muted text-muted-foreground',
    brand: 'bg-brand-soft text-brand',
    success: 'bg-green-50 text-success',
    warning: 'bg-amber-50 text-warning',
    info: 'bg-blue-50 text-info',
  }
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>
}

export function Tags({ tags }: { tags: string[] }) {
  if (!tags.length) return null
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <li key={t} className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted-foreground">#{t}</li>
      ))}
    </ul>
  )
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  const src = AVATARS[name]
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.42, backgroundImage: gradientFor(name) }}
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white"
    >
      {src && !failed ? (
        <img src={src} alt="" width={size} height={size} onError={() => setFailed(true)} className="size-full object-cover" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </span>
  )
}

export function PersonLink({ id, name }: { id: string; name: string }) {
  return (
    <Link to={`/profile/${id}`} className="inline-flex items-center gap-2 font-medium hover:underline">
      <Avatar name={name} size={28} /> {name}
    </Link>
  )
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-surface p-8 text-center">
      <p className="font-semibold">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-prose text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}

export function AccessDenied({ title = 'You don’t have access to this', description }: { title?: string; description?: string }) {
  return <EmptyState title={title} description={description ?? 'Private content is only visible to people who have been given access.'} />
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="mt-1 max-w-prose text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { id: T; label: string }[]; value: T; onChange: (id: T) => void; label: string }) {
  const listRef = useRef<HTMLDivElement>(null)
  const [moreRight, setMoreRight] = useState(false)
  const measure = () => {
    const el = listRef.current
    if (el) setMoreRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }
  useEffect(() => {
    measure()
    listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ inline: 'nearest', block: 'nearest' })
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [value, tabs.length])
  return (
    <div className="relative mb-5 border-b border-border">
      <div ref={listRef} onScroll={measure} role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={value === t.id}
            onClick={() => onChange(t.id)}
            className={`min-h-11 shrink-0 border-b-2 px-3.5 text-sm font-medium ${value === t.id ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {moreRight && <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />}
    </div>
  )
}

const fieldBase = 'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={`${fieldBase} min-h-10 ${p.className ?? ''}`} />
export const Textarea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={`${fieldBase} min-h-24 ${p.className ?? ''}`} />
export const Select = (p: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={`${fieldBase} min-h-10 ${p.className ?? ''}`} />

/** Overlapping avatar row for "who's here" signals. Names are shown to assistive tech via the label. */
export function Faces({ names, total, label }: { names: string[]; total: number; label: string }) {
  if (total === 0) return null
  const shown = names.slice(0, 4)
  return (
    <div className="flex items-center" role="group" aria-label={label}>
      <span className="flex -space-x-2">
        {shown.map((n) => <span key={n} className="rounded-full ring-2 ring-surface"><Avatar name={n} size={28} /></span>)}
      </span>
      <span className="ml-2 text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

/** Overflow "…" menu built on <details>: keyboard and screen-reader friendly, closes after a choice. */
export function ActionMenu({ label = 'More actions', children }: { label?: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null)
  return (
    <details ref={ref} className="relative">
      <summary aria-label={label} className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-muted [&::-webkit-details-marker]:hidden">
        <MoreHorizontal aria-hidden className="size-5" />
      </summary>
      <div role="menu" onClick={() => ref.current?.removeAttribute('open')} className="absolute right-0 z-10 mt-1 w-52 rounded-xl border border-border bg-surface p-1 shadow-md">
        {children}
      </div>
    </details>
  )
}

export function ActionMenuItem({ tone, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'danger' }) {
  return (
    <button type="button" role="menuitem" {...props}
      className={`flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm hover:bg-surface-muted ${tone === 'danger' ? 'text-danger' : ''} ${className}`} />
  )
}
