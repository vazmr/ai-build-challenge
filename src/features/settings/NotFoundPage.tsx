import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/shared/ui'

export function NotFoundPage() {
  return <EmptyState title="Page not found" description="The link may be old or mistyped. Try one of these instead." action={<span className="flex flex-wrap justify-center gap-x-4 gap-y-2"><Link to="/feed" className="text-sm font-semibold text-brand hover:underline">Go to Feed</Link><Link to="/events" className="text-sm font-semibold text-brand hover:underline">Browse events</Link><Link to="/community" className="text-sm font-semibold text-brand hover:underline">Find groups</Link></span>} />
}
