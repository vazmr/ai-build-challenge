import { Link, useRouteError } from 'react-router-dom'
import { EmptyState } from '../../components/shared/ui'

export function RouteError() {
  const err = useRouteError()
  const detail = err instanceof Error ? err.message : undefined
  return (
    <div className="mx-auto max-w-lg p-6">
      <EmptyState title="Something went wrong" description={detail ?? 'An unexpected error occurred. Your data is safe.'}
        action={<Link to="/feed" className="text-sm font-semibold text-brand hover:underline">Back to Feed</Link>} />
    </div>
  )
}
