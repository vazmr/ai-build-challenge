import { Bell, CalendarCheck, Megaphone, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppState } from '../../hooks/useAppState'
import { unreadCount } from '../../services/notificationsService'
import { AccountSwitcher } from '../navigation/AccountSwitcher'
import { MoreMenu } from '../navigation/MoreMenu'

const iconLink = 'flex size-11 items-center justify-center rounded-full hover:bg-surface-muted'

export function AppHeader() {
  const { state, activeStudent } = useAppState()
  const unread = unreadCount(state, activeStudent.id)
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface">
      <div className="flex h-14 items-center gap-1 px-3 sm:gap-2 md:px-5">
        <Link to="/feed" className="mr-auto flex items-center gap-2 whitespace-nowrap text-base font-bold text-black">
          <img src="/temple-logo.png" alt="Temple University" width={32} height={32} className="size-8 rounded-md" />
          <span>Student Hub</span>
        </Link>
        <Link to="/messages" aria-label="Messages" title="Messages" className={iconLink}>
          <MessageSquare aria-hidden className="size-5" />
        </Link>
        <Link to="/calendar" aria-label="My Campus Calendar" title="My Campus Calendar" className={`${iconLink} hidden sm:flex`}>
          <CalendarCheck aria-hidden className="size-5" />
        </Link>
        <Link to="/announcements" aria-label="Announcements" title="Announcements" className={`${iconLink} hidden sm:flex`}>
          <Megaphone aria-hidden className="size-5" />
        </Link>
        <Link to="/notifications" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} title="Notifications" className={`${iconLink} relative`}>
          <Bell aria-hidden className="size-5" />
          {unread > 0 && <span className="absolute right-0.5 top-0.5 flex size-[18px] items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground">{unread}</span>}
        </Link>
        <MoreMenu />
        <div className="ml-1 hidden md:ml-3 md:block"><AccountSwitcher /></div>
      </div>
    </header>
  )
}
