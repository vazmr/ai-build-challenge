import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppState } from '../../hooks/useAppState'
import { PRIMARY_NAV, SETTINGS_NAV, secondaryGroups, type NavItem } from './navItems'

const sideLink = ({ isActive }: { isActive: boolean }) =>
  [
    'flex min-h-11 items-center justify-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors lg:justify-start',
    isActive ? 'bg-brand-soft text-brand' : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
  ].join(' ')

function SideItem({ item, emphasis }: { item: NavItem; emphasis?: boolean }) {
  const Icon = item.icon
  return (
    <li>
      <NavLink to={item.to} title={item.label} data-tour={`nav-${item.to.slice(1)}`} className={sideLink}>
        <Icon aria-hidden className={`shrink-0 ${emphasis ? 'size-6' : 'size-5'}`} />
        <span className="sr-only lg:not-sr-only">{item.label}</span>
      </NavLink>
    </li>
  )
}

/**
 * Mobile: bottom bar with the five product destinations.
 * md (tablet): compact icon rail. lg+: full sidebar with Explore / You groups and Settings.
 */
export function PrimaryNav() {
  const { activeStudent } = useAppState()
  const groups = secondaryGroups(activeStudent.id)

  return (
    <>
      <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="mx-auto flex max-w-xl items-stretch justify-around">
          {PRIMARY_NAV.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                data-tour={`nav-${to.slice(1)}`}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-end gap-0.5 px-2 pb-1.5 text-xs font-medium transition-colors ${isActive ? 'text-brand' : 'text-muted-foreground hover:text-foreground'}`
                }
              >
                <Icon aria-hidden className={to === '/feed' ? 'size-7' : 'size-5'} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav
        aria-label="Main"
        className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-16 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface p-2 md:flex lg:w-60 lg:p-3"
      >
        <ul className="space-y-1">
          {PRIMARY_NAV.map((item) => <SideItem key={item.to} item={item} emphasis={item.to === '/feed'} />)}
        </ul>
        {groups.map((g) => (
          <Fragment key={g.id}>
            <div className="mx-2 mt-4 border-t border-border pt-3 lg:mt-5">
              <p className="hidden px-1 pb-1 text-xs font-semibold text-muted-foreground lg:block">{g.label}</p>
            </div>
            <ul className="space-y-1">{g.items.map((item) => <SideItem key={item.to} item={item} />)}</ul>
          </Fragment>
        ))}
        <ul className="mt-auto space-y-1 border-t border-border pt-3"><SideItem item={SETTINGS_NAV} /></ul>
      </nav>
    </>
  )
}
