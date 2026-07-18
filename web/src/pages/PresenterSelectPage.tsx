import type { JSX } from 'react'
import type { Presenter } from '../domain/presenter'
import { PresenterCard } from '../components/PresenterCard'

interface PresenterSelectPageProps { readonly onSelect: (presenter: Presenter) => void }

export function PresenterSelectPage({ onSelect }: PresenterSelectPageProps): JSX.Element {
  return <main className="app-shell presenter-select-page">
    <header className="presenter-header"><h1>Spine Flow</h1><p>Выберите тренера</p></header>
    <section className="presenter-list" aria-label="Выбор тренера">
      <PresenterCard presenter="female" title="Девушка" image="/images/level-beginner.webp" onSelect={onSelect} />
      <PresenterCard presenter="male" title="Парень" image="/images/presenter-male.webp" onSelect={onSelect} />
    </section>
  </main>
}
