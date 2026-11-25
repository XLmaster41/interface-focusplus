import { useCallback, useEffect, useRef, useState } from 'react'

// Cronômetro baseado em "deadline" (não perde precisão se a aba ficar em segundo plano).
export function useTimer(initialMinutes, { onElapsed, onFinish }) {
  const [remaining, setRemaining] = useState(initialMinutes * 60)
  const [running, setRunning] = useState(false)
  const [status, setStatus] = useState('Pronto para começar')
  const rem = useRef(initialMinutes * 60)
  const duration = useRef(initialMinutes * 60)
  const deadline = useRef(0)
  const interval = useRef(null)
  const cb = useRef({})
  useEffect(() => { cb.current = { onElapsed, onFinish } })

  const set = (v) => { rem.current = v; setRemaining(v) }
  const clear = () => { clearInterval(interval.current); interval.current = null }

  const tick = () => {
    const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))
    const elapsed = Math.max(0, rem.current - left)
    if (elapsed) cb.current.onElapsed?.(elapsed)
    set(left)
    if (!left) {
      clear(); setRunning(false)
      setStatus('Sessão finalizada. Excelente dedicação!')
      cb.current.onFinish?.()
    }
  }

  const start = useCallback(() => {
    if (interval.current) return
    if (rem.current <= 0) set(duration.current)
    deadline.current = Date.now() + rem.current * 1000
    setRunning(true); setStatus('Sessão em andamento')
    interval.current = setInterval(tick, 250)
  }, [])

  const pause = useCallback(() => {
    if (!interval.current) return
    tick()
    if (!interval.current) return // terminou no último tick
    clear(); setRunning(false)
    setStatus('Pausado. Você pode continuar depois.')
  }, [])

  const stop = () => { clear(); setRunning(false) }

  const reset = useCallback(() => { stop(); set(duration.current); setStatus('Pronto para começar') }, [])

  const setMinutes = useCallback((m, msg = 'Duração ajustada') => {
    stop(); duration.current = m * 60; set(m * 60); setStatus(msg)
  }, [])

  useEffect(() => () => clear(), [])

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  return { clock: `${mm}:${ss}`, running, status, start, pause, reset, setMinutes }
}
