import { ArrowUpRight, LockKeyhole } from 'lucide-react'
import type { JSX } from 'react'
import { isSelectableDifficultyCard, type DifficultyCard, type PracticeLevel } from '../domain/level'

interface LevelCardProps {
  readonly card: DifficultyCard
  readonly onSelect: (level: PracticeLevel) => void
}

export function LevelCard({ card, onSelect }: LevelCardProps): JSX.Element {
  const isSelectable = isSelectableDifficultyCard(card)

  const handleSelect = (): void => {
    if (isSelectable) onSelect(card.id)
  }

  return (
    <button
      className={isSelectable ? 'level-card' : 'level-card level-card-locked'}
      type="button"
      disabled={!isSelectable}
      onClick={handleSelect}
    >
      <img src={card.image} alt="" />
      <span className="level-card-overlay">
        <strong>{card.title}</strong>
        <small>{card.subtitle}</small>
        {isSelectable ? <ArrowUpRight aria-hidden="true" size={22} /> : <LockKeyhole aria-hidden="true" size={20} />}
      </span>
    </button>
  )
}
