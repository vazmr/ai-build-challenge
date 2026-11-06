import type { PersistedAppState } from '../types'
import { newId, nowIso } from '../utils/id'

export function notify(s: PersistedAppState, studentId: string, title: string, body: string, link?: string): PersistedAppState {
  return { ...s, notifications: [...s.notifications, { id: newId('not'), studentId, title, body, link, read: false, createdAt: nowIso() }] }
}

export const notificationsFor = (s: PersistedAppState, studentId: string) =>
  s.notifications.filter((n) => n.studentId === studentId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

export const unreadCount = (s: PersistedAppState, studentId: string) =>
  s.notifications.filter((n) => n.studentId === studentId && !n.read).length

export const markRead = (s: PersistedAppState, id: string): PersistedAppState =>
  ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })

export const markAllRead = (s: PersistedAppState, studentId: string): PersistedAppState =>
  ({ ...s, notifications: s.notifications.map((n) => (n.studentId === studentId ? { ...n, read: true } : n)) })
