import { useState } from 'react'

// todo 先完成一些 简单的 hook，后面再来看这个

export const useRequest = <Params extends [], Data>(
  fn: Service<Params, Data>,
  options: Options<Params>
): ReturnResult<Data, Params> => {
  const [loading, setLoading] = useState(false)

  const run = async (...args: Params) => {
    try {
      setLoading(false)
      const data = await fn(...args)
      setLoading(true)
      return data
    } catch (e) {
      options.onError?.(e as Error, ...args)
    }
  }

  const runAsync = (...args: Params): Promise<Data> => {
    return new Promise((resolve, reject) => {
      setLoading(true)
      fn(...args)
        .then(resolve)
        .catch(reject)
        .finally(() => setLoading(false))
    })
  }

  return {
    loading,
    run,
    runAsync,
  }
}

type Service<Params extends [], Data> = (...args: Params) => Promise<Data>

type Options<Params extends []> = {
  manual?: boolean
  onError?: (e: Error, ...params: Params) => void
}

type ReturnResult<Data, Params extends []> = {
  loading: boolean
  data?: Data
  error?: Error
  run: (...args: Params) => Promise<Data | undefined>
  runAsync: (...args: Params) => Promise<Data | undefined>
}
