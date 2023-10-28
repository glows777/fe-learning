import { useEffect } from 'react'

import isDev from '@/utils/is-dev'
import { isFunction } from '@/utils'

type UseMountFn = () => void

export const useMount = (fn: UseMountFn) => {

    if (isDev) {
        if (!isFunction(fn)) {
            console.error(`useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`)
        }
    }
    useEffect(() => {
        fn?.()
    }, [])
}