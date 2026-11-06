import { Outlet, useLocation } from 'react-router-dom'
import { PrimaryNav } from '../navigation/PrimaryNav'
import { AssistantWidget } from '../../features/assistant/AssistantWidget'
import { ProductTour } from '../../features/onboarding/ProductTour'
import { AppHeader } from './AppHeader'

export function AppShell() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-full flex-col">
      <a href="#main" className="sr-only z-50 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Skip to content</a>
      <AppHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <PrimaryNav />
        <main id="main" tabIndex={-1} className="outline-none mx-auto min-w-0 w-full max-w-6xl flex-1 px-4 pb-24 pt-5 md:px-8 md:pb-8">
          <div key={pathname} className="motion-page"><Outlet /></div>
        </main>
      </div>
      <AssistantWidget />
      <ProductTour />
    </div>
  )
}
