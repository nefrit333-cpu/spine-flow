import type { UserProgress } from '../domain/practice'

const progressKey = 'spine-flow.progress'
const safetyKey = 'spine-flow.safety'
const emptyProgress: UserProgress = { completedCount: 0, lastPracticeId: null, lastCompletedAt: null }

function isProgress(value: unknown): value is UserProgress {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return typeof record.completedCount === 'number'
    && (typeof record.lastPracticeId === 'string' || record.lastPracticeId === null)
    && (typeof record.lastCompletedAt === 'string' || record.lastCompletedAt === null)
}

export function loadProgress(): UserProgress {
  try {
    const raw = window.localStorage.getItem(progressKey)
    if (!raw) return emptyProgress
    const parsed: unknown = JSON.parse(raw)
    return isProgress(parsed) ? parsed : emptyProgress
  } catch {
    return emptyProgress
  }
}

export function recordCompletion(practiceId: string): UserProgress {
  const current = loadProgress()
  const next: UserProgress = { completedCount: current.completedCount + 1, lastPracticeId: practiceId, lastCompletedAt: new Date().toISOString() }
  try { window.localStorage.setItem(progressKey, JSON.stringify(next)) } catch { return next }
  return next
}

export function hasAcknowledgedSafety(): boolean {
  try { return window.localStorage.getItem(safetyKey) === 'true' } catch { return false }
}

export function acknowledgeSafety(): void {
  try { window.localStorage.setItem(safetyKey, 'true') } catch { return }
}
