
export class EventEmitter<
    EventType extends ValidTypes = string | symbol
> {
    private map = {} as Record<EventName<EventType>, Array<(...args: any[]) => void>>

    on<K extends EventName<EventType>>(event: K, cb: EventListener2<EventType, K>) {
        if (!this.map[event]) {
            this.map[event] = []
        }
        this.map[event].push(cb as any)
    }

    emit<K extends EventName<EventType>>(event: K, ...messages: EventListenerArgs<EventType, K>) {
        const cbs = this.map[event]
        for (const cb of cbs) {
            cb(...messages)
        }
    }

    off<K extends EventName<EventType>>(event: K, cb: EventListener2<EventType, K>) {
        const cbs = this.map[event]
        if (!cbs) {
            return
        }
        const index = cbs.indexOf(cb as any)
        if (index > -1) {
            cbs.splice(index, 1)
        }
    }

    once<K extends EventName<EventType>>(event: K, cb: EventListener2<EventType, K>) {
        const onceCb = (...args: any[]) => {
            cb(...args as any)
            this.off(event, onceCb as any)
        }
        this.on(event, onceCb as any)
    }
}

type ValidTypes = string | symbol | object
type EventName<T extends ValidTypes> = T extends string | symbol ? T : keyof T

type EventListener2<T extends ValidTypes, K extends EventName<T>> = T extends string | symbol
    ? (...args: any[]) => void
    : (...args: ArgsMapping<Exclude<T, string | symbol>>[Extract<K, keyof T>]) => void

type ArgsMapping<T extends Record<string, any>> = {
    [K in keyof T]: T[K] extends (...args: infer P) => void
        ? P
        : T[K] extends any[]
            ? T[K]
            : any[]
}

type EventListenerArgs<T extends ValidTypes, K extends EventName<T>> = Parameters<EventListener2<T, K>>

type Test = {
    error: (error: Error) => void
    success: (code: string, data: { a: number }) => void
    timeout: (time: number, reason: Error, abc: { a: number, b: string, c?: boolean }, h: { h: boolean }) => void
}

const ee = new EventEmitter<Test>()

ee.on('timeout', (time, reason, abc, h) => {
    console.log(time, reason, abc.a, h.h)
})

ee.emit('timeout', 1000, new Error('123'), { a: 222, b: '123' }, { h: true })

ee.on('success', (code, data) => {
    console.log(code, data.a)
})
ee.on('error', (e) => {
    console.log(e)
})

ee.emit('error', new Error('error'))
ee.emit('success', 'code', { a: 2 })
