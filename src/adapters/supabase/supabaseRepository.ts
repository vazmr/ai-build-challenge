import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SCHEMA_VERSION } from '../../data/seed'
import type { AppStateRepository } from '../../repositories/appStateRepository'
import type { PersistedAppState } from '../../types'
import { localStorageRepository } from '../local-storage/localStorageRepository'
import { buildObj, buildRow, TABLES, type TableSpec } from './tables'

type Row = Record<string, unknown>
type Obj = Record<string, unknown>

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Só ativa o backend quando as duas variáveis existem; senão o app segue 100% local. */
export const supabaseEnabled = Boolean(url && anonKey)
const client: SupabaseClient | null = supabaseEnabled ? createClient(url!, anonKey!, { auth: { persistSession: false } }) : null

const PAGE = 1000
async function fetchAll(db: SupabaseClient, table: string, orderBy?: string): Promise<Row[]> {
  const rows: Row[] = []
  for (let from = 0; ; from += PAGE) {
    let q = db.from(table).select('*').range(from, from + PAGE - 1)
    if (orderBy) q = q.order(orderBy, { ascending: true })
    const { data, error } = await q
    if (error) throw new Error(`${table}: ${error.message}`)
    rows.push(...(data as Row[]))
    if (!data || data.length < PAGE) return rows
  }
}

const groupBy = (rows: Row[], col: string) => {
  const m = new Map<string, Row[]>()
  for (const r of rows) {
    const k = r[col] as string
    m.set(k, [...(m.get(k) ?? []), r])
  }
  return m
}

/** Baixa todas as tabelas e monta o PersistedAppState. */
async function pull(db: SupabaseClient, activeAccountId: string): Promise<PersistedAppState | null> {
  const loaded = await Promise.all(
    TABLES.map(async (spec) => {
      const rows = await fetchAll(db, spec.table)
      const kids = await Promise.all((spec.children ?? []).map(async (c) => [c, await fetchAll(db, c.table, c.orderBy)] as const))
      const byParent = kids.map(([c, r]) => [c, groupBy(r, c.parentCol)] as const)
      const objs = rows.map((row) => {
        const children: Record<string, Row[]> = {}
        for (const [c, g] of byParent) children[c.table] = g.get(row.id as string) ?? []
        return buildObj(spec, row, children)
      })
      return [spec.key, objs] as const
    }),
  )
  const state = Object.fromEntries(loaded) as unknown as PersistedAppState
  if (!state.students?.length || !state.accounts?.length) return null
  state.schemaVersion = SCHEMA_VERSION
  state.activeAccountId = state.accounts.some((a) => a.id === activeAccountId) ? activeAccountId : state.accounts[0].id
  return state
}

const ser = (v: unknown) => JSON.stringify(v)

/** Calcula e envia só o que mudou entre `prev` e `next`. */
async function push(db: SupabaseClient, prev: PersistedAppState, next: PersistedAppState) {
  const run = async (what: string, p: PromiseLike<{ error: { message: string } | null }>) => {
    const { error } = await p
    if (error) throw new Error(`${what}: ${error.message}`)
  }

  const diffs = TABLES.map((spec: TableSpec) => {
    const before = new Map((prev[spec.key] as unknown as Obj[]).map((o) => [o.id as string, o]))
    const after = new Map((next[spec.key] as unknown as Obj[]).map((o) => [o.id as string, o]))
    const removed = [...before.keys()].filter((id) => !after.has(id))
    const changed = [...after.values()].filter((o) => ser(before.get(o.id as string)) !== ser(o))
    return { spec, removed, changed }
  })

  // Apagar primeiro, em ordem inversa (filhos antes dos pais).
  for (const { spec, removed } of [...diffs].reverse()) {
    if (removed.length) await run(`delete ${spec.table}`, db.from(spec.table).delete().in('id', removed))
  }
  // Gravar em ordem de dependência (pais antes dos filhos).
  for (const { spec, changed } of diffs) {
    if (!changed.length) continue
    await run(`upsert ${spec.table}`, db.from(spec.table).upsert(changed.map((o) => buildRow(spec, o)), { onConflict: 'id' }))
    for (const c of spec.children ?? []) {
      const ids = changed.map((o) => o.id as string)
      await run(`reset ${c.table}`, db.from(c.table).delete().in(c.parentCol, ids))
      const kidRows = changed.flatMap((o) => ((o[c.field] as unknown[] | undefined) ?? []).map((item, i) => ({ ...c.toRow(item, i), [c.parentCol]: o.id })))
      if (kidRows.length) await run(`insert ${c.table}`, db.from(c.table).insert(kidRows))
    }
  }
}

let synced: PersistedAppState | null = null
let queue: Promise<void> = Promise.resolve()
let timer: ReturnType<typeof setTimeout> | undefined
let latest: PersistedAppState | null = null

/** Agrupa mudanças rápidas (ex.: digitação) e grava em série, sem corrida. */
function schedulePush(state: PersistedAppState) {
  if (!client || !synced) return
  latest = state
  clearTimeout(timer)
  timer = setTimeout(() => {
    queue = queue.then(async () => {
      const next = latest
      if (!next || !synced || !client) return
      try {
        await push(client, synced, next)
        synced = next
      } catch (e) {
        console.error('[supabase] falha ao sincronizar; os dados seguem salvos localmente', e)
      }
    })
  }, 350)
}

let hydrating: Promise<PersistedAppState | null> | null = null

export const supabaseRepository: AppStateRepository = {
  load: () => localStorageRepository.load(),
  save(state) {
    localStorageRepository.save(state)
    schedulePush(state)
  },
  reset() {
    const seed = localStorageRepository.reset()
    schedulePush(seed)
    return seed
  },
  hydrate() {
    if (!client) return Promise.resolve(null)
    hydrating ??= pull(client, localStorageRepository.load().activeAccountId)
      .then((s) => { synced = s; return s })
      .catch((e) => { console.error('[supabase] não consegui carregar; usando dados locais', e); return null })
    return hydrating
  },
}
