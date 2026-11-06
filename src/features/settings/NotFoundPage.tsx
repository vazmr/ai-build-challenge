import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/shared/ui'

export function NotFoundPage() {
  return <EmptyState title="Page not found" description="This page doesn’t exist." action={<Link to="/feed" className="text-sm font-semibold text-brand hover:underline">Back to Feed</Link>} />
}
