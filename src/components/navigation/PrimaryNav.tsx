import { NavLink } from 'react-router-dom'
import { PRIMARY_NAV } from './navItems'

/** Bottom bar on mobile, persistent sidebar from md up. */
export function PrimaryNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface md:static md:inset-auto md:w-56 md:shrink-0 md:border-t-0 md:border-r"
    >
      <ul className="mx-auto flex max-w-xl items-stretch justify-around md:max-w-none md:flex-col md:gap-1 md:p-3">
        {PRIMARY_NAV.map(({ to, label, icon: Icon }) => {
          const isFeed = to === '/feed'
          return (
            <li key={to} className="flex-1 md:flex-none">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    'flex min-h-14 flex-col items-center justify-center gap-0.5 px-2 text-xs font-medium transition-colors',
                    'md:min-h-11 md:flex-row md:justify-start md:gap-3 md:rounded-lg md:px-3 md:text-sm',
                    isActive
                      ? 'text-brand md:bg-brand-soft'
                      : 'text-muted-foreground hover:text-foreground md:hover:bg-surface-muted',
                    isFeed ? 'font-semibold' : '',
                  ].join(' ')
                }
              >
                <Icon aria-hidden className={isFeed ? 'size-7 md:size-5' : 'size-5'} />
                <span>{label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
