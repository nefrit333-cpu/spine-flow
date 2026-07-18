import { ChevronRight, Clock3 } from 'lucide-react'
import type { JSX } from 'react'
import type { Practice } from '../domain/practice'
import { getDurationMinutes } from '../data/practiceCatalog'
import type { Presenter } from '../domain/presenter'

interface PracticeCardProps { readonly presenter: Presenter; readonly practice: Practice; readonly isLast: boolean; readonly onOpen: () => void }

export function PracticeCard({ presenter, practice, isLast, onOpen }: PracticeCardProps): JSX.Element {
  const minutes = getDurationMinutes(practice)
  return <button className={`practice-row practice-row-${practice.accent}`} onClick={onOpen}>
    <span className="practice-thumb" aria-hidden="true"><img className="practice-cover" src={`/images/${presenter}/${practice.steps[1].id}.webp`} alt="" /></span>
    <span className="practice-copy"><strong>{practice.title}</strong>{isLast && <small>Последняя практика</small>}</span>
    <span className="practice-time"><Clock3 size={18} /> {minutes} мин</span>
    <ChevronRight className="practice-arrow" size={24} aria-hidden="true" />
  </button>
}
