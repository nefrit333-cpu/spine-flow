import { BookOpen, ChartNoAxesCombined, Heart, House } from 'lucide-react'
import type { ComponentType, JSX } from 'react'

export type FooterSection = 'home' | 'diary' | 'favorites' | 'progress'

interface FooterNavProps { readonly active: FooterSection; readonly onSelect: (section: FooterSection) => void }

const items: ReadonlyArray<{ readonly id: FooterSection; readonly label: string; readonly Icon: ComponentType<{ readonly size?: number }> }> = [
  { id: 'home', label: 'Главная', Icon: House },
  { id: 'diary', label: 'Дневник', Icon: BookOpen },
  { id: 'favorites', label: 'Избранное', Icon: Heart },
  { id: 'progress', label: 'Прогресс', Icon: ChartNoAxesCombined },
]

export function FooterNav({ active, onSelect }: FooterNavProps): JSX.Element {
  return <nav className="footer-nav" aria-label="Основная навигация">{items.map(({ id, label, Icon }) => <button key={id} className={id === active ? 'footer-item active' : 'footer-item'} aria-current={id === active ? 'page' : undefined} onClick={() => onSelect(id)}><Icon size={23} /><span>{label}</span></button>)}</nav>
}
