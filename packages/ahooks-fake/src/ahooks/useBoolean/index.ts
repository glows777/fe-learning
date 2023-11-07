import { useMemo, useState } from 'react'

export interface Actions {
  setTrue: () => void
  setFalse: () => void
  set: (value: boolean) => void
  toggle: () => void
}

export const useBoolean = (defaultValue?: boolean): [boolean, Actions] => {
  const [state, set] = useState(!!defaultValue)
  const toggle = () => set((pre) => !pre)
  const setFalse = () => set(false)
  const setTrue = () => set(true)
  const actions = useMemo(
    () => ({
      set,
      toggle,
      setFalse,
      setTrue,
    }),
    []
  )
  return [state, actions]
}
