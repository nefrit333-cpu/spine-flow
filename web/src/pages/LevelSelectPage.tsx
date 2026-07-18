import { Settings } from 'lucide-react'
import type { JSX } from 'react'
import { FooterNav, type FooterSection } from '../components/FooterNav'
import { LevelCard } from '../components/LevelCard'
import { difficultyCards, type DifficultyCard, type PracticeLevel } from '../domain/level'
import type { Presenter } from '../domain/presenter'

interface LevelSelectPageProps {
  readonly presenter: Presenter
  readonly activeSection: FooterSection
  readonly onLevelSelect: (level: PracticeLevel) => void
  readonly onSectionChange: (section: FooterSection) => void
  readonly onChangePresenter: () => void
}

const secondaryTitles: Readonly<Record<Exclude<FooterSection, 'home'>, string>> = {
  diary: 'Дневник',
  favorites: 'Избранное',
  progress: 'Прогресс',
}

const levelStepImages: Readonly<Record<DifficultyCard['id'], string>> = {
  beginner: 'neck-right-tilt',
  intermediate: 'air-squat',
  advanced: 'core-side-plank-right',
}

export function LevelSelectPage({ presenter, activeSection, onLevelSelect, onSectionChange, onChangePresenter }: LevelSelectPageProps): JSX.Element {
  return (
    <main className="app-shell level-select-page">
      <header className="topbar">
        <h1>Spine Flow</h1>
        <button className="icon-button topbar-button" type="button" aria-label="Настройки" onClick={onChangePresenter}>
          <Settings size={23} />
        </button>
      </header>
      {activeSection === 'home' ? (
        <section className="level-select">
          <h2>Выберите уровень</h2>
          <div className="level-list">
            {difficultyCards.map((card) => <LevelCard key={card.id} card={{ ...card, image: `/images/${presenter}/${levelStepImages[card.id]}.webp` }} onSelect={onLevelSelect} />)}
          </div>
        </section>
      ) : (
        <section className="section secondary-section">
          <h2>{secondaryTitles[activeSection]}</h2>
        </section>
      )}
      <FooterNav active={activeSection} onSelect={onSectionChange} />
    </main>
  )
}
