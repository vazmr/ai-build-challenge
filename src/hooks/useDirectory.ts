import { useAppState } from './useAppState'

/** Look up display names for students and organizations. */
export function useDirectory() {
  const { state } = useAppState()
  return {
    studentName: (id: string) => state.students.find((s) => s.id === id)?.displayName ?? 'Unknown student',
    orgName: (id?: string) => (id ? state.organizations.find((o) => o.id === id)?.name : undefined),
  }
}
