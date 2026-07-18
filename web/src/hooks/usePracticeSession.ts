import { useEffect, useRef, useState } from 'react'
import type { Practice } from '../domain/practice'

export interface PracticeSession {
  readonly currentStepIndex: number
  readonly remainingSeconds: number
  readonly isPaused: boolean
  readonly isComplete: boolean
  readonly pause: () => void
  readonly resume: () => void
  readonly goBack: () => void
  readonly goNext: () => void
}

export function usePracticeSession(practice: Practice): PracticeSession {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(practice.steps[0].durationSeconds)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const startedAt = useRef(Date.now())

  useEffect(() => {
    if (isPaused || isComplete) return
    const timer = window.setInterval(() => {
      const duration = practice.steps[currentStepIndex].durationSeconds
      const remaining = Math.max(0, duration - Math.floor((Date.now() - startedAt.current) / 1000))
      setRemainingSeconds(remaining)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [currentStepIndex, isComplete, isPaused, practice.steps])

  const resetStep = (index: number): void => {
    startedAt.current = Date.now()
    setCurrentStepIndex(index)
    setRemainingSeconds(practice.steps[index].durationSeconds)
    setIsPaused(false)
  }

  const goNext = (): void => {
    if (currentStepIndex === practice.steps.length - 1) { setIsComplete(true); return }
    resetStep(currentStepIndex + 1)
  }

  return {
    currentStepIndex,
    remainingSeconds,
    isPaused,
    isComplete,
    pause: () => setIsPaused(true),
    resume: () => { startedAt.current = Date.now() - (practice.steps[currentStepIndex].durationSeconds - remainingSeconds) * 1000; setIsPaused(false) },
    goBack: () => { if (currentStepIndex > 0) resetStep(currentStepIndex - 1) },
    goNext,
  }
}
