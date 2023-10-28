import { useEffect, useRef } from 'react'

export const useUmountedRef = () => {
    const ref = useRef(false)

    useEffect(() => {
        ref.current = true
        return () => {
            ref.current = false
        }
    }, [])

    return ref
}