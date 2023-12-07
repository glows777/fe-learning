export interface FetchEventSourceInit extends RequestInit {
  onMessage?: () => void
  onError?: (e: any) => any
  onClose?: () => void
  onOpen?: (resp: Response) => void
  headers?: Record<string, string>
  openWhenHidden?: boolean
}
export const EventStreamContentType = 'text/event-stream'
const parse = (onMessage?: () => void) => {}
const DefaultRetryInterval = 1000

export function fetchEventSourceInit(
  input: RequestInfo,
  {
    signal: inputSignal,
    onOpen: inputOpen,
    headers: inputHeaders,
    onError,
    onClose,
    onMessage,
    openWhenHidden,
    ...rest
  }: FetchEventSourceInit
) {
  return new Promise<void>((resolve, reject) => {
    const headers = { ...inputHeaders }
    const controller = new AbortController()

    const dispose = () => {
      controller.abort()
    }
    inputSignal?.addEventListener('abort', () => {
      dispose()
      resolve()
    })
    let retryInterval = DefaultRetryInterval
    let retryTimer = 0
    async function create() {
      try {
        const resp = await fetch(input, {
          ...rest,
          headers,
          signal: controller.signal,
        })
        await inputOpen?.(resp)

        parse(onMessage)

        onClose?.()
        dispose()
        resolve()
      } catch (err) {
        // 如果没有调用方没有主动断开链接
        if (!controller.signal.aborted) {
          try {
            const interval = onError?.(err) ?? retryInterval
            window.clearTimeout(retryTimer)
            retryTimer = window.setTimeout(create, interval)
          } catch (innerError) {
            dispose()
            reject(innerError)
          }
        }
      }
    }
    create()
  })
}
