import { afterEach, expect, test } from 'vitest'
import { acknowledgeSafety, clearLocalAppData, hasAcknowledgedSafety, loadProgress, recordCompletion } from './progressStore'
import { readPresenter, savePresenter } from './presenterStore'

afterEach(() => window.localStorage.clear())

test('records completion and exposes it through the progress store', () => {
  recordCompletion('neck')
  expect(loadProgress()).toMatchObject({ completedCount: 1, lastPracticeId: 'neck' })
})

test('clears all data stored by the app on this device', () => {
  savePresenter('female')
  acknowledgeSafety()
  recordCompletion('neck')

  clearLocalAppData()

  expect(readPresenter()).toBeNull()
  expect(hasAcknowledgedSafety()).toBe(false)
  expect(loadProgress()).toEqual({ completedCount: 0, lastPracticeId: null, lastCompletedAt: null })
})
