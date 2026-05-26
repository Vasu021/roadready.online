import { useEffect, useRef } from 'react'

export interface CarControls {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  handbrake: boolean
  reset: boolean
}

const KEY_MAP: Record<string, keyof CarControls> = {
  w: 'forward', ArrowUp: 'forward',
  s: 'backward', ArrowDown: 'backward',
  a: 'left', ArrowLeft: 'left',
  d: 'right', ArrowRight: 'right',
  ' ': 'handbrake',
  r: 'reset', R: 'reset',
}

// Returns a stable ref so key state is readable every frame without triggering re-renders
export function useCarControls() {
  const controls = useRef<CarControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    handbrake: false,
    reset: false,
  })

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const action = KEY_MAP[e.key]
      if (action) {
        controls.current[action] = true
        if (e.key === ' ') e.preventDefault() // prevent page scroll on spacebar
      }
    }
    const onUp = (e: KeyboardEvent) => {
      const action = KEY_MAP[e.key]
      if (action) controls.current[action] = false
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  return controls
}
