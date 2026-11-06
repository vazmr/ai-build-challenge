import { RouterProvider } from 'react-router-dom'
import { AppStateProvider } from '../contexts/AppStateContext'
import { router } from './router'

export function App() {
  return (
    <AppStateProvider>
      <RouterProvider router={router} />
    </AppStateProvider>
  )
}
