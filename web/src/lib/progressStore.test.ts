import { afterEach, expect, test } from 'vitest'
import { loadProgress, recordCompletion } from './progressStore'

afterEach(() => window.localStorage.clear())

test('records completion and exposes it through the progress store', () => {
  recordCompletion('neck')
  expect(loadProgress()).toMatchObject({ completedCount: 1, lastPracticeId: 'neck' })
})
