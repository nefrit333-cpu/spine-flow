import { useState, type JSX } from 'react'
import { findPractice } from './data/practiceCatalog'
import { acknowledgeSafety, hasAcknowledgedSafety, loadProgress, recordCompletion } from './lib/progressStore'
import type { PracticeLevel } from './domain/level'
import type { UserProgress } from './domain/practice'
import { SafetyNotice } from './components/SafetyNotice'
import { NetworkBanner } from './components/NetworkBanner'
import type { FooterSection } from './components/FooterNav'
import { useNetworkStatus } from './hooks/useNetworkStatus'
import { CompletionPage } from './pages/CompletionPage'
import { HomePage } from './pages/HomePage'
import { LevelSelectPage } from './pages/LevelSelectPage'
import { PracticePage } from './pages/PracticePage'
import { PresenterSelectPage } from './pages/PresenterSelectPage'
import { readPresenter, savePresenter } from './lib/presenterStore'
import type { Presenter } from './domain/presenter'

type Screen =
  | { readonly name: 'presenter' }
  | { readonly name: 'levels' }
  | { readonly name: 'home'; readonly level: PracticeLevel }
  | { readonly name: 'practice'; readonly level: PracticeLevel; readonly practiceId: string }
  | { readonly name: 'completion'; readonly level: PracticeLevel; readonly practiceId: string }

export default function App(): JSX.Element {
  const [presenter, setPresenter] = useState<Presenter | null>(readPresenter)
  const [screen, setScreen] = useState<Screen>(() => readPresenter() ? { name: 'levels' } : { name: 'presenter' })
  const [progress, setProgress] = useState<UserProgress>(loadProgress)
  const [activeSection, setActiveSection] = useState<FooterSection>('home')
  const [safetySeen, setSafetySeen] = useState(hasAcknowledgedSafety)
  const { isOnline, retry } = useNetworkStatus()
  const openPractice = (level: PracticeLevel, practiceId: string): void => setScreen({ name: 'practice', level, practiceId })
  const selectedPractice = screen.name === 'practice' ? findPractice(screen.practiceId) : undefined
  const complete = (level: PracticeLevel, practiceId: string): void => { setProgress(recordCompletion(practiceId)); setScreen({ name: 'completion', level, practiceId }) }
  const acknowledge = (): void => { acknowledgeSafety(); setSafetySeen(true) }
  const selectLevel = (level: PracticeLevel): void => setScreen({ name: 'home', level })
  const selectPresenter = (value: Presenter): void => { savePresenter(value); setPresenter(value); setScreen({ name: 'levels' }) }
  const changePresenter = (): void => setScreen({ name: 'presenter' })
  const selectSection = (section: FooterSection): void => {
    setActiveSection(section)
    if (section === 'home' && screen.name === 'home') setScreen({ name: 'levels' })
  }
  return <>
    {!isOnline && <NetworkBanner onRetry={retry} />}
    {screen.name === 'presenter' && <PresenterSelectPage onSelect={selectPresenter} />}
    {screen.name === 'levels' && presenter && <LevelSelectPage presenter={presenter} activeSection={activeSection} onLevelSelect={selectLevel} onSectionChange={selectSection} onChangePresenter={changePresenter} />}
    {presenter && screen.name === 'home' && <HomePage presenter={presenter} level={screen.level} progress={progress} onOpen={(practiceId) => openPractice(screen.level, practiceId)} activeSection={activeSection} onSectionChange={selectSection} onChangePresenter={changePresenter} />}
    {presenter && selectedPractice && screen.name === 'practice' && <PracticePage presenter={presenter} practice={selectedPractice} onClose={() => setScreen({ name: 'home', level: screen.level })} onComplete={() => complete(screen.level, selectedPractice.id)} />}
    {screen.name === 'completion' && <CompletionPage onDone={() => setScreen({ name: 'home', level: screen.level })} />}
    {!safetySeen && <SafetyNotice onContinue={acknowledge} />}
  </>
}
