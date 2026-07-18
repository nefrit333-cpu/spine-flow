import type { PracticeLevel } from './level'

export interface PracticeStep {
  readonly id: string
  readonly title: string
  readonly instruction: string
  readonly durationSeconds: number
}

export interface Practice {
  readonly id: string
  readonly level: PracticeLevel
  readonly title: string
  readonly subtitle: string
  readonly coverImage: string
  readonly accent: 'sage' | 'coral' | 'blue' | 'lilac'
  readonly steps: ReadonlyArray<PracticeStep>
}

export interface UserProgress {
  readonly completedCount: number
  readonly lastPracticeId: string | null
  readonly lastCompletedAt: string | null
}
