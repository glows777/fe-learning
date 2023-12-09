import React from 'react'
import ErrorBoundary, { ErrorBoundaryProps } from './boundary'

function WithErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: ErrorBoundaryProps
) {
  const Wrapped: React.ComponentType<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  // * DevTools 显示的组件名
  const name = Component.displayName || Component.name || 'Unknown'
  Wrapped.displayName = `withErrorBoundary(${name})`

  return Wrapped
}

export default WithErrorBoundary
