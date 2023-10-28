import { useRef } from 'react'

export const useLatest = <T>(param: T) => {
    const ref = useRef<T>(param)
    ref.current = param

    return ref
}