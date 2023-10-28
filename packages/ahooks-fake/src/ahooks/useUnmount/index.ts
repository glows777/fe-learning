import { isFunction } from '@/utils'
import isDev from '@/utils/is-dev'
import { useEffect } from 'react'
import { useLatest } from '../useLatest'

export const useUnmount = (fn: () => void) => {
    if (isDev) {
        if (!isFunction(fn)) {
            console.error(`useUnmount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`)
        }
    }
    // 避免闭包 陷阱
    const fnRef = useLatest(fn)

    useEffect(() => () => fnRef.current?.(), [])
}