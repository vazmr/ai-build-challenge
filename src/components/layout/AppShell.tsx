import { Outlet } from 'react-router-dom'
import { PrimaryNav } from '../navigation/PrimaryNav'
import { AppHeader } from './AppHeader'

export function AppShell() {
  return (
    <div className="flex min-h-full flex-col">
      <AppHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <PrimaryNav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-5 md:px-8 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
