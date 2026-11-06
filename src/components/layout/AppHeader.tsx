import { Bell, CalendarCheck, Megaphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppState } from '../../hooks/useAppState'
import { unreadCount } from '../../services/notificationsService'
import { AccountSwitcher } from '../navigation/AccountSwitcher'
import { MoreMenu } from '../navigation/MoreMenu'

const iconLink = 'flex size-10 items-center justify-center rounded-lg hover:bg-surface-muted'

export function AppHeader() {
  const { state, activeStudent } = useAppState()
  const unread = unreadCount(state, activeStudent.id)
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface">
      <div className="flex h-14 items-center gap-2 px-3 md:px-5">
        <Link to="/feed" className="mr-auto whitespace-nowrap text-base font-bold text-brand">
          <span className="sm:hidden">Student Hub</span>
          <span className="hidden sm:inline">Temple Student Hub</span>
        </Link>
        <AccountSwitcher />
        <Link to="/calendar" aria-label="My Campus Calendar" title="My Campus Calendar" className={iconLink}>
          <CalendarCheck aria-hidden className="size-5" />
        </Link>
        <Link to="/announcements" aria-label="Announcements" title="Announcements" className={iconLink}>
          <Megaphone aria-hidden className="size-5" />
        </Link>
        <Link to="/notifications" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} title="Notifications" className={`${iconLink} relative`}>
          <Bell aria-hidden className="size-5" />
          {unread > 0 && <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground">{unread}</span>}
        </Link>
        <MoreMenu />
      </div>
      <p className="bg-brand-soft px-3 py-1 text-center text-xs text-foreground">
        Prototype with fictional demo data — not an official Temple University product.
      </p>
    </header>
  )
}
