import { Play, Settings } from 'lucide-react'
import type { JSX } from 'react'
import { getDurationMinutes, getPracticesByLevel, getRecommendedPractice } from '../data/practiceCatalog'
import type { PracticeLevel } from '../domain/level'
import type { UserProgress } from '../domain/practice'
import { PracticeCard } from '../components/PracticeCard'
import { FooterNav, type FooterSection } from '../components/FooterNav'
import type { Presenter } from '../domain/presenter'

interface HomePageProps { readonly presenter: Presenter; readonly level: PracticeLevel; readonly progress: UserProgress; readonly onOpen: (id: string) => void; readonly activeSection: FooterSection; readonly onSectionChange: (section: FooterSection) => void; readonly onOpenSettings: () => void }

export function HomePage({ presenter, level, progress, onOpen, activeSection, onSectionChange, onOpenSettings }: HomePageProps): JSX.Element {
  const practices = getPracticesByLevel(level)
  const recommendedPractice = getRecommendedPractice(level)
  const featuredStep = level === 'intermediate' ? recommendedPractice.steps[0] : recommendedPractice.steps[1]
  const remainingPractices = practices.filter((practice) => practice.id !== recommendedPractice.id)
  const secondaryContent: Readonly<Record<Exclude<FooterSection, 'home'>, { readonly title: string; readonly text: string }>> = {
    diary: { title: 'Дневник', text: progress.lastCompletedAt ? 'Последняя практика сохранена в вашем дневнике.' : 'После первой практики здесь появится ваша запись.' },
    favorites: { title: 'Избранное', text: 'Сохраняйте практики, к которым хотите вернуться.' },
    progress: { title: 'Прогресс', text: `Завершено практик: ${progress.completedCount}` },
  }
  return <main className="app-shell">
    <header className="topbar"><h1>Spine Flow</h1><button className="icon-button topbar-button" aria-label="Настройки" onClick={onOpenSettings}><Settings size={23} /></button></header>
    {activeSection === 'home' ? <><section className="section"><h2>Сегодня</h2>
      <article className="featured-practice">
        <div className="featured-copy"><h3>{recommendedPractice.title}</h3><p>{recommendedPractice.subtitle}</p><span className="duration"><span aria-hidden="true">◷</span> {getDurationMinutes(recommendedPractice)} мин</span><button className="button button-primary" onClick={() => onOpen(recommendedPractice.id)}><Play size={19} fill="currentColor" />Начать</button></div>
        <img className="featured-cover" src={`/images/${presenter}/${featuredStep.id}.webp`} alt={`${presenter === 'female' ? 'Девушка' : 'Парень'} показывает практику «${recommendedPractice.title}»`} />
      </article>
    </section>
    {(remainingPractices.length > 0 || progress.completedCount > 0) && <section className="section library"><div className="library-heading"><h2>Все практики</h2>{progress.completedCount > 0 && <span>Завершено: {progress.completedCount}</span>}</div>
      {remainingPractices.length > 0 && <div className="practice-list">{remainingPractices.map((practice) => <PracticeCard key={practice.id} presenter={presenter} practice={practice} isLast={practice.id === progress.lastPracticeId} onOpen={() => onOpen(practice.id)} />)}</div>}
    </section>}</> : <section className="section secondary-section"><h2>{secondaryContent[activeSection].title}</h2><p>{secondaryContent[activeSection].text}</p></section>}
    <FooterNav active={activeSection} onSelect={onSectionChange} />
  </main>
}
