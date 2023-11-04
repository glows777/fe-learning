import { isFunction } from '@/utils'
import { useCallback, useState } from 'react'

type SetState<T extends Record<string, any>> = <K extends keyof T>(patch: 
  Pick<T, K> | ((preState: Readonly<T>) => Pick<T, K> | T | null) | null 
) => void

export const useSetState = <T extends Record<string, any>>(initialData: T): [T, SetState<T>] => {
  const [state, setState] = useState(initialData)

  const mergeSetState = useCallback((patch: any) => {
    setState((preState) => {
      const newState = isFunction(patch) ? patch(preState) : patch
      return newState ? { ...preState, ...newState } : preState
    })
  }, [])
  return [state, mergeSetState]
}
