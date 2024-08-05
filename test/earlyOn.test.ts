import { Emitter } from '../src'

it('prepends a listener for the event', () => {
  const emitter = new Emitter<{ hello: never }>()
  const listenerOne = vi.fn()
  const listenerTwo = vi.fn()

  emitter.on('hello', listenerOne)
  emitter.earlyOn('hello', listenerTwo)

  expect(emitter.emit('hello')).toBe(true)
  expect(listenerTwo).toHaveBeenCalledOnce()
  expect(listenerOne).toHaveBeenCalledOnce()
  expect(listenerTwo.mock.invocationCallOrder[0]).toBeLessThan(
    listenerOne.mock.invocationCallOrder[0]
  )
})

it('prepends the only event listener', () => {
  const emitter = new Emitter<{ hello: never }>()
  const listener = vi.fn()
  emitter.earlyOn('hello', listener)

  expect(emitter.emit('hello')).toBe(true)
  expect(listener).toHaveBeenCalledOnce()
})

it('prepends a listener for async emit', async () => {
  const emitter = new Emitter<{ hello: never }>()
  const listenerOne = vi.fn(() => 1)
  const listenerTwo = vi.fn(() => 2)

  emitter.on('hello', listenerOne)
  emitter.earlyOn('hello', listenerTwo)

  const result = await emitter.emitAsPromise('hello')

  expect(result).toEqual([2, 1])
  expect(listenerTwo).toHaveBeenCalledOnce()
  expect(listenerOne).toHaveBeenCalledOnce()
  expect(listenerTwo.mock.invocationCallOrder[0]).toBeLessThan(
    listenerOne.mock.invocationCallOrder[0]
  )
})

it('prepend a listener for generator emit', () => {
  const emitter = new Emitter<{ hello: never }>()
  const listenerOne = vi.fn(() => 1)
  const listenerTwo = vi.fn(() => 2)

  emitter.on('hello', listenerOne)
  emitter.earlyOn('hello', listenerTwo)

  const generator = emitter.emitAsGenerator('hello')

  expect(generator.next()).toEqual({ value: 2, done: false })
  expect(generator.next()).toEqual({ value: 1, done: false })
  expect(generator.next()).toEqual({ value: undefined, done: true })
})
