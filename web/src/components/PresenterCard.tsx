import { ArrowUpRight } from 'lucide-react'
import type { JSX } from 'react'
import type { Presenter } from '../domain/presenter'

interface PresenterCardProps {
  readonly presenter: Presenter
  readonly title: string
  readonly image: string
  readonly onSelect: (presenter: Presenter) => void
}

export function PresenterCard({ presenter, title, image, onSelect }: PresenterCardProps): JSX.Element {
  return <button className="presenter-card" type="button" onClick={() => onSelect(presenter)}>
    <img src={image} alt="" />
    <span className="presenter-card-overlay"><strong>{title}</strong><ArrowUpRight aria-hidden="true" size={24} /></span>
  </button>
}
