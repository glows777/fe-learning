import { describe, expect, it, jest } from '@jest/globals'
import { EventEmitter } from '../eventmitter'

describe('EventEmitter', () => {
  it('should register and emit events', () => {
    const emitter = new EventEmitter<'foo' | 'bar'>()

    const fooCb = jest.fn()
    const barCb = jest.fn()

    emitter.on('foo', fooCb)
    emitter.on('bar', barCb)

    emitter.emit('foo', 'hello')
    emitter.emit('bar', 'world')

    expect(fooCb).toHaveBeenCalledWith('hello')
    expect(barCb).toHaveBeenCalledWith('world')
  })

  it('should unregister events', () => {
    const emitter = new EventEmitter<'foo' | 'bar'>()

    const fooCb = jest.fn()
    const barCb = jest.fn()

    emitter.on('foo', fooCb)
    emitter.on('bar', barCb)

    emitter.off('foo', fooCb)

    emitter.emit('foo', 'hello')
    emitter.emit('bar', 'world')

    expect(fooCb).not.toHaveBeenCalled()
    expect(barCb).toHaveBeenCalledWith('world')
  })

  it('should register and emit events only once', () => {
    const emitter = new EventEmitter<'foo' | 'bar'>()

    const fooCb = jest.fn()
    const barCb = jest.fn()

    emitter.once('foo', fooCb)
    emitter.once('bar', barCb)

    emitter.emit('foo', 'hello')
    emitter.emit('foo', 'world')
    emitter.emit('bar', 'hello')
    emitter.emit('bar', 'world')

    expect(fooCb).toHaveBeenCalledWith('hello')
    expect(barCb).toHaveBeenCalledWith('hello')
    expect(fooCb).toHaveBeenCalledTimes(1)
    expect(barCb).toHaveBeenCalledTimes(1)
  })
})