import React from 'react'

type FallbackElement = React.ReactElement<
  unknown,
  React.FC | typeof React.Component | string
> | null
export declare function FallbackRender(props: FallbackProps): FallbackElement

export interface FallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export interface ErrorBoundaryProps {
  onError?: (error: Error, errorInfo?: string | null) => void
  fallback?: FallbackElement
  FallbackComponent?: React.ComponentType<FallbackProps>
  fallbackRender?: typeof FallbackRender
  onReset?: () => void
  resetKeys?: Array<unknown>
  onResetKeysChange?: (
    prevResetKey: Array<unknown> | undefined,
    resetKeys: Array<unknown> | undefined,
  ) => void
}

interface ErrorBoundaryState {
  error: Error | null
}

const initialState: ErrorBoundaryState = {
  error: null,
}

const changedArray = (a: Array<unknown> = [], b: Array<unknown> = []) => {
  return a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  state = initialState

  // * 是否已经由于 error 而引发的 render/update
  updatedWithError = false

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  reset() {
    this.setState(initialState)
  }

  resetErrorBoundary = () => {
    if (this.props.onReset) {
      this.props.onReset()
    }
    this.reset()
  }

  componentDidUpdate(prevProps: Readonly<React.PropsWithChildren<ErrorBoundaryProps>>): void {
      const { resetKeys, onResetKeysChange} = this.props
      const { error } = this.state

      // * 存在错误，且是第一次由于 error 而引发的 render/update，那么设置 flag=true，不会重置
      if (error !== null && !this.updatedWithError) {
        this.updatedWithError = true
        return
      }

      // * 已经存在错误，并且是普通的组件 render，则检查 resetKeys 是否有改动，改了就重置
      if (error !== null && changedArray(prevProps.resetKeys, resetKeys)) {
        if (onResetKeysChange) {
          onResetKeysChange(prevProps.resetKeys, resetKeys)
        }

        this.reset()
      }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (this.props.onError) {
      console.log('hello')
      this.props.onError(error, errorInfo.componentStack)
    }
  }

  render(): React.ReactNode {
    const { fallback, fallbackRender, FallbackComponent } = this.props
    const { error } = this.state

    if (error !== null) {
      const fallbackProps: FallbackProps = {
        error,
        resetErrorBoundary: this.resetErrorBoundary,
      }
      if (React.isValidElement(fallback)) {
        return fallback
      }
      if (typeof fallbackRender === 'function') {
        return fallbackRender(fallbackProps)
      }
      if (FallbackComponent) {
        return <FallbackComponent {...fallbackProps} />
      }
      throw new Error('error boundary needs a fallback')
    }

    return this.props.children
  }
}

export default ErrorBoundary
