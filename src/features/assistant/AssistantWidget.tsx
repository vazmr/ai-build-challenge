import { CircleCheck, Info, Send, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Badge } from '../../components/shared/ui'
import { FALLBACK, SCRIPTS } from '../../data/assistantScripts'
import { Link } from 'react-router-dom'
import { CURATED_TAGS } from '../../data/seed'
import { useAppState } from '../../hooks/useAppState'
import { EVENT_CATEGORIES, publishedEvents, participationFor, upcomingEvents } from '../../services/eventsService'
import { PROJECT_CATEGORIES } from '../../services/projectsService'
import { hasOrgPermission } from '../../utils/permissions'
import { formatDay, formatTimeRange } from '../../utils/format'
import { planAction, runAction, type AssistantAction, type RunResult } from './assistantActions'
import { usePresence } from '../../hooks/usePresence'

/** What the model sees for a past turn: the text plus what happened to any action it proposed. */
function historyText(t: Turn): string {
  if (!t.actions?.length) return t.text
  const notes = t.actions.map((a) => `[${a.action.name}: ${a.status === 'done' ? 'user confirmed and it was done' : a.status === 'dismissed' ? 'user declined or it was not possible' : 'waiting for user confirmation'}]`).join(' ')
  return `${t.text === PLACEHOLDER ? '' : t.text} ${notes}`.trim()
}

export const OPEN_ASSISTANT_EVENT = 'open-assistant'

const PLACEHOLDER = 'Here’s what I prepared. Confirm below to go ahead.'

interface ActionItem { action: AssistantAction; status: 'pending' | 'done' | 'dismissed'; result?: Pick<RunResult, 'message' | 'link'> }
interface Turn { id: number; role: 'user' | 'assistant'; text: string; sources: string[]; offline?: boolean; actions?: ActionItem[] }

const SUGGESTIONS = ['I need help with classes', 'RSVP me to the next free event', 'Post that I’m looking for a study group', 'Where can I get tech help?']

/** Used when the live service is unreachable: keyword match against the scripted answers. */
function scripted(prompt: string) {
  const p = prompt.toLowerCase()
  return SCRIPTS.find((s) => s.keywords.some((k) => p.includes(k))) ?? FALLBACK
}

/** Floating assistant available on every page. Answers are generated server-side and grounded in the Resources directory. */
export function AssistantWidget() {
  const { state, activeStudent, update } = useAppState()
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLLIElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panel = usePresence(open, 220)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus() } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [turns, busy])

  /** Compact snapshot sent with each question: just enough for the model to answer and pick valid ids. */
  const buildContext = () => {
    const me = activeStudent.id
    const now = new Date()
    return {
      today: `${now.toISOString().slice(0, 10)} (${now.toLocaleDateString('en-US', { weekday: 'long' })})`,
      user: activeStudent.displayName,
      organizations: state.organizations.filter((o) => hasOrgPermission(state, me, o.id, 'org.manage-events')).map((o) => ({ id: o.id, name: o.name })),
      events: upcomingEvents(publishedEvents(state), now).sort((a, b) => a.startAt.localeCompare(b.startAt)).slice(0, 14).map((e) => ({
        id: e.id, title: e.title, when: `${formatDay(e.startAt)} ${formatTimeRange(e.startAt, e.endAt)}`, status: participationFor(state, me, e.id)?.state,
      })),
      projects: state.projects.filter((p) => p.isPublished && p.status === 'recruiting' && p.ownerId !== me).slice(0, 10).map((p) => ({ id: p.id, title: p.title, kind: p.kind, roles: p.roles?.map((r) => r.title).join(', ') })),
      resources: state.resources.map((r) => ({ id: r.id, title: r.title, category: r.category, source: r.sourceType, desc: r.description })),
      categories: { event: EVENT_CATEGORIES, project: PROJECT_CATEGORIES, tags: CURATED_TAGS },
    }
  }

  const setAction = (turnId: number, actionId: string, patch: Partial<ActionItem>) =>
    setTurns((ts) => ts.map((t) => (t.id === turnId ? { ...t, actions: t.actions?.map((a) => (a.action.id === actionId ? { ...a, ...patch } : a)) } : t)))

  const confirmAction = (turnId: number, item: ActionItem) => {
    const me = activeStudent.id
    // Re-validate against the latest state, then run through the app's own services.
    const plan = planAction(item.action, state, me)
    if (!plan.ok) { setAction(turnId, item.action.id, { status: 'dismissed', result: { message: plan.reason } }); return }
    const out = runAction(item.action, state, me)
    update(() => out.state)
    setAction(turnId, item.action.id, { status: 'done', result: { message: out.message, link: out.link } })
  }

  const ask = async (prompt: string) => {
    const q = prompt.trim()
    if (!q || busy) return
    const history = [...turns, { id: turns.length, role: 'user' as const, text: q, sources: [] }]
    setTurns(history)
    setDraft('')
    setBusy(true)
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: history.map((t) => ({ role: t.role, content: historyText(t) })),
          context: buildContext(),
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { answer: string; sourceIds: string[]; actions?: AssistantAction[] }
      const items: ActionItem[] = (data.actions ?? []).map((action) => ({ action, status: 'pending' as const }))
      setTurns((t) => [...t, { id: t.length, role: 'assistant', text: data.actions?.length && !data.answer ? PLACEHOLDER : data.answer, sources: data.sourceIds, actions: items }])
    } catch {
      const s = scripted(q)
      setTurns((t) => [...t, { id: t.length, role: 'assistant', text: s.response, sources: s.sourceResourceIds, offline: true }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {(
        <button
          ref={buttonRef}
          tabIndex={open ? -1 : 0}
          aria-hidden={open}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open AI Campus Assistant"
          data-tour="assistant"
          aria-haspopup="dialog"
          className={`group fixed bottom-20 right-4 z-40 flex size-14 origin-bottom-right items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg transition-[transform,opacity,background-color] duration-300 ease-[var(--ease-out)] hover:scale-105 hover:bg-brand-hover active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 md:bottom-6 md:right-6 md:h-14 md:w-auto md:gap-2 md:px-5 ${open ? 'pointer-events-none scale-50 opacity-0' : 'motion-fade'}`}
        >
          <Sparkles aria-hidden className="size-6 transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-12" />
          <span className="hidden text-sm font-semibold md:inline">Ask the assistant</span>
        </button>
      )}

      {panel.mounted && (
        <section
          data-state={panel.state}
          role="dialog"
          aria-label="AI Campus Assistant"
          className="motion-panel fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col rounded-t-2xl border border-border bg-surface shadow-2xl md:inset-x-auto md:bottom-6 md:right-6 md:h-[600px] md:max-h-[calc(100dvh-5rem)] md:w-[400px] md:rounded-2xl"
        >
          <header className="flex items-center gap-3 border-b border-border px-4 py-3">
            <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-foreground"><Sparkles className="size-5" /></span>
            <div className="min-w-0 flex-1"><h2 className="text-sm font-bold">AI Campus Assistant</h2><p className="text-xs text-muted-foreground">Finds resources and next steps</p></div>
            <button type="button" aria-label="Close assistant" onClick={() => { setOpen(false); buttonRef.current?.focus() }} className="flex size-11 items-center justify-center rounded-lg hover:bg-surface-muted"><X aria-hidden className="size-5" /></button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {turns.length === 0 && (
              <div>
                <p className="text-sm">Hi! Ask me where to find help, people or opportunities on campus.</p>
                <p className="mt-3 flex items-start gap-2 rounded-lg bg-brand-soft p-3 text-xs"><Info aria-hidden className="mt-0.5 size-3.5 shrink-0" /> I answer from the Resources directory and don’t guess at policies, hours or contacts. I can also RSVP you to events, share a post, create a project or ask to join one. I always ask you to confirm first, and I can’t see private messages or files.</p>
                <div className="motion-stagger mt-3 flex flex-wrap gap-2">{SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => void ask(s)} className="min-h-10 rounded-full border border-border px-3 text-sm hover:bg-surface-muted">{s}</button>)}</div>
              </div>
            )}
            <ul className="space-y-3" aria-live="polite">
              {turns.map((t) => (
                <li key={t.id} className={t.role === 'user' ? 'flex justify-end' : ''}>
                  {t.role === 'user' ? (
                    <p className="motion-msg-right max-w-[85%] rounded-2xl rounded-br-md bg-brand px-3 py-2 text-sm text-brand-foreground">{t.text}</p>
                  ) : (
                    <div className="motion-msg-left max-w-[92%] rounded-2xl rounded-bl-md bg-surface-muted px-3 py-2.5 text-sm">
                      <p className="whitespace-pre-line">{t.text}</p>
                      {t.offline && <p className="mt-2 text-xs text-muted-foreground">Live assistant unavailable, showing a saved answer.</p>}
                      {t.actions?.map((it) => {
                        const plan = planAction(it.action, state, activeStudent.id)
                        return (
                          <div key={it.action.id} className="motion-rise mt-2.5 rounded-xl border border-border bg-surface p-3">
                            {it.status === 'done' ? (
                              <p className="flex items-start gap-2 text-sm"><CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-success" /><span><span className="font-semibold">{it.result?.message}</span>{it.result?.link && <> <Link to={it.result.link.to} onClick={() => setOpen(false)} className="font-semibold text-brand underline">{it.result.link.label}</Link></>}</span></p>
                            ) : it.status === 'dismissed' ? (
                              <p className="text-xs text-muted-foreground">{it.result?.message ?? 'Skipped.'}</p>
                            ) : !plan.ok ? (
                              <p className="text-sm">{plan.reason}</p>
                            ) : (
                              <>
                                <p className="text-sm font-semibold">{plan.title}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">{plan.detail}</p>
                                <div className="mt-2.5 flex gap-2">
                                  <button type="button" onClick={() => confirmAction(t.id, it)} className="min-h-10 rounded-lg bg-brand px-3.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">{plan.confirm}</button>
                                  <button type="button" onClick={() => setAction(t.id, it.action.id, { status: 'dismissed' })} className="min-h-10 rounded-lg border border-border px-3 text-sm font-semibold hover:bg-surface-muted">Not now</button>
                                </div>
                              </>
                            )}
                          </div>
                        )
                      })}
                      {t.sources.length > 0 && (
                        <ul className="mt-2 space-y-1 border-t border-border pt-2">
                          {t.sources.map((id) => {
                            const r = state.resources.find((x) => x.id === id)
                            return r && (
                              <li key={id} className="text-xs"><span className="font-semibold">{r.title}</span>{' '}
                                <Badge tone={r.sourceType === 'official' ? 'success' : r.sourceType === 'student-submitted' ? 'info' : 'warning'}>{r.sourceType === 'official' ? 'Official' : r.sourceType === 'student-submitted' ? 'Student-submitted, not official' : 'Not yet verified'}</Badge>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
              {busy && <li className="motion-msg-left flex w-fit items-center gap-1 rounded-2xl bg-surface-muted px-3.5 py-3" role="status"><span className="sr-only">Thinking…</span>{[0, 1, 2].map((i) => <span key={i} aria-hidden className="motion-dot size-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 150}ms` }} />)}</li>}
              <li ref={endRef} aria-hidden />
            </ul>
          </div>

          <form className="flex gap-2 border-t border-border p-3" onSubmit={(e) => { e.preventDefault(); void ask(draft) }}>
            <input ref={inputRef} aria-label="Ask the assistant" value={draft} maxLength={600} onChange={(e) => setDraft(e.target.value)} placeholder="Ask or tell me what to do…" className="min-h-11 min-w-0 flex-1 rounded-lg border border-border px-3 text-sm" />
            <button type="submit" disabled={!draft.trim() || busy} aria-label="Send" className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground hover:bg-brand-hover disabled:opacity-50"><Send aria-hidden className="size-4" /></button>
          </form>
        </section>
      )}
    </>
  )
}
