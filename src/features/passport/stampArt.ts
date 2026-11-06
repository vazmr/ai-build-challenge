import {
  CalendarCheck, Compass, Flag, Hand, Handshake, MessageCircle, Megaphone, PartyPopper, Rocket, Ticket, UserRound, Users,
  type LucideIcon,
} from 'lucide-react'
import type { ChapterId } from '../../services/passportService'

/** Visual identity of each stop: icon, the short word printed on the stamp, and which shape it uses. */
export const STAMP_ART: Record<string, { icon: LucideIcon; mark: string; shape: 'round' | 'rect' | 'oval' }> = {
  profile: { icon: UserRound, mark: 'MY PROFILE', shape: 'round' },
  follow: { icon: Compass, mark: 'CURIOUS', shape: 'rect' },
  hello: { icon: MessageCircle, mark: 'HELLO', shape: 'oval' },
  rsvp: { icon: Ticket, mark: 'ADMIT ONE', shape: 'rect' },
  together: { icon: PartyPopper, mark: 'TOGETHER', shape: 'round' },
  regular: { icon: CalendarCheck, mark: 'REGULAR', shape: 'oval' },
  group: { icon: Users, mark: 'GROUP', shape: 'round' },
  org: { icon: Flag, mark: 'MEMBER', shape: 'oval' },
  voice: { icon: Megaphone, mark: 'VOICE', shape: 'rect' },
  hand: { icon: Hand, mark: 'HAND UP', shape: 'oval' },
  team: { icon: Handshake, mark: 'TEAMMATE', shape: 'round' },
  ship: { icon: Rocket, mark: 'SHIPPED', shape: 'rect' },
}

/** One ink per chapter. All sit well above 4.5:1 on the cream paper. */
export const CHAPTER_INK: Record<ChapterId, string> = {
  arrive: '#a71930',
  'show-up': '#1f4f8a',
  belong: '#1d6b43',
  build: '#7a4a00',
}
