export type PracticeLevel = 'beginner' | 'intermediate'

export interface DifficultyCard {
  readonly id: PracticeLevel | 'advanced'
  readonly title: string
  readonly subtitle: string
  readonly image: string
  readonly available: boolean
}

export const difficultyCards: ReadonlyArray<DifficultyCard> = [
  { id: 'beginner', title: 'Начинающий', subtitle: 'Мягкое начало · 5–15 минут', image: '/images/level-beginner.webp', available: true },
  { id: 'intermediate', title: 'Средний', subtitle: 'Сила и подвижность · 15 минут', image: '/images/level-intermediate.webp', available: true },
  { id: 'advanced', title: 'Продвинутый', subtitle: 'Скоро', image: '/images/level-advanced.webp', available: false },
]

export function isSelectableDifficultyCard(card: DifficultyCard): card is DifficultyCard & { readonly id: PracticeLevel; readonly available: true } {
  return card.available && card.id !== 'advanced'
}
