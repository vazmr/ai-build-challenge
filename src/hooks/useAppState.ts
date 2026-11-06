import { useContext } from 'react'
import { AppStateContext, type AppStateContextValue } from '../contexts/AppStateContext'

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>')
  return ctx
}
