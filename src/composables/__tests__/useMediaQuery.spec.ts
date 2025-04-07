import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { MockInstance } from 'vitest'

const mountedCallbacks: Array<() => void> = []
const unmountedCallbacks: Array<() => void> = []

// mock vue to simulate the lifecycle hooks
vi.mock('vue', () => ({
  ref: (initialValue: unknown) => ({
    value: initialValue,
  }),
  onMounted: (fn: () => void) => {
    mountedCallbacks.push(fn)
    // run the callback immediately to simulate onMounted
    fn()
  },
  onUnmounted: (fn: () => void) => {
    unmountedCallbacks.push(fn)
  },
}))

import { useMediaQuery } from '../useMediaQuery'

describe('useMediaQuery', () => {
  let matchMediaMock: Partial<MediaQueryList>
  let addEventListenerSpy: MockInstance
  let removeEventListenerSpy: MockInstance

  beforeEach(() => {
    mountedCallbacks.length = 0
    unmountedCallbacks.length = 0

    matchMediaMock = {
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    } as MediaQueryList

    addEventListenerSpy = vi.spyOn(matchMediaMock, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(matchMediaMock, 'removeEventListener')

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation(() => matchMediaMock),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with matches = false', () => {
    const { matches } = useMediaQuery('(min-width: 768px)')
    expect(matches.value).toBe(false)
  })

  it('should call window.matchMedia with the provided query', () => {
    const query = '(min-width: 768px)'
    useMediaQuery(query)
    expect(window.matchMedia).toHaveBeenCalledWith(query)
  })

  it('should add event listener on mount', () => {
    useMediaQuery('(min-width: 768px)')
    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should remove event listener on unmount', () => {
    useMediaQuery('(min-width: 768px)')

    expect(unmountedCallbacks.length).toBe(1)

    unmountedCallbacks[0]()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should update matches when media query changes', () => {
    const { matches } = useMediaQuery('(min-width: 768px)')

    expect(matches.value).toBe(false)

    const mutableMock = { ...matchMediaMock, matches: true } as MediaQueryList

    const updateMatchesHandler = addEventListenerSpy.mock.calls[0][1]
    updateMatchesHandler(mutableMock)

    expect(matches.value).toBe(true)

    const mutableMock2 = { ...matchMediaMock, matches: false } as MediaQueryList
    updateMatchesHandler(mutableMock2)

    expect(matches.value).toBe(false)
  })
})
