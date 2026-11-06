import { Briefcase, GraduationCap, HeartHandshake, Music2, Palette, PartyPopper, Pizza, Sparkles, Trophy } from 'lucide-react'

/** Category icon. Written as an explicit switch so every icon is a static component. */
export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  switch (category) {
    case 'Music & Entertainment': return <Music2 aria-hidden className={className} />
    case 'Arts & Culture': return <Palette aria-hidden className={className} />
    case 'Social': return <PartyPopper aria-hidden className={className} />
    case 'Academic': return <GraduationCap aria-hidden className={className} />
    case 'Professional': return <Briefcase aria-hidden className={className} />
    case 'Sports & Recreation': return <Trophy aria-hidden className={className} />
    case 'Community Service': return <HeartHandshake aria-hidden className={className} />
    case 'Food & Freebies': return <Pizza aria-hidden className={className} />
    default: return <Sparkles aria-hidden className={className} />
  }
}
