import { useCallback, useEffect, useRef, useState, type JSX } from 'react'
import { findPractice } from './data/practiceCatalog'
import { acknowledgeSafety, clearLocalAppData, hasAcknowledgedSafety, loadProgress, recordCompletion } from './lib/progressStore'
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
import { InformationPage } from './pages/InformationPage'
import { SettingsPage } from './pages/SettingsPage'
import { readPresenter, savePresenter } from './lib/presenterStore'
import type { Presenter } from './domain/presenter'
import { getScreenHash, parseScreenHash, type AppScreen } from './lib/navigation'

function isPublicInformationScreen(screen: AppScreen): screen is Extract<AppScreen, { readonly name: 'support' | 'privacy' }> {
  return screen.name === 'support' || screen.name === 'privacy'
}

export default function App(): JSX.Element {
  const [presenter, setPresenter] = useState<Presenter | null>(readPresenter)
  const pendingScreen = useRef<AppScreen | null>(null)
  const [screen, setScreen] = useState<AppScreen>(() => {
    const requestedScreen = parseScreenHash(window.location.hash)
    if (readPresenter() || isPublicInformationScreen(requestedScreen)) return requestedScreen
    pendingScreen.current = requestedScreen
    return { name: 'presenter' }
  })
  const [progress, setProgress] = useState<UserProgress>(loadProgress)
  const [activeSection, setActiveSection] = useState<FooterSection>('home')
  const [safetySeen, setSafetySeen] = useState(hasAcknowledgedSafety)
  const { isOnline, retry } = useNetworkStatus()
  const navigate = useCallback((nextScreen: AppScreen, replace = false): void => {
    const hash = getScreenHash(nextScreen)
    const url = `${window.location.pathname}${window.location.search}${hash}`
    if (replace) window.history.replaceState(null, '', url)
    else if (window.location.hash !== hash) window.history.pushState(null, '', url)
    setScreen(nextScreen)
  }, [])

  useEffect(() => {
    const syncFromHistory = (): void => {
      const requestedScreen = parseScreenHash(window.location.hash)
      if (!presenter && requestedScreen.name !== 'presenter' && !isPublicInformationScreen(requestedScreen)) {
        pendingScreen.current = requestedScreen
        setScreen({ name: 'presenter' })
        return
      }
      setScreen(requestedScreen)
    }
    window.addEventListener('popstate', syncFromHistory)
    window.addEventListener('hashchange', syncFromHistory)
    return () => {
      window.removeEventListener('popstate', syncFromHistory)
      window.removeEventListener('hashchange', syncFromHistory)
    }
  }, [presenter])

  const openPractice = (level: PracticeLevel, practiceId: string): void => navigate({ name: 'practice', level, practiceId })
  const selectedPractice = screen.name === 'practice' ? findPractice(screen.practiceId) : undefined
  const complete = (level: PracticeLevel, practiceId: string): void => { setProgress(recordCompletion(practiceId)); navigate({ name: 'completion', level, practiceId }, true) }
  const acknowledge = (): void => { acknowledgeSafety(); setSafetySeen(true) }
  const selectLevel = (level: PracticeLevel): void => navigate({ name: 'home', level })
  const selectPresenter = (value: Presenter): void => {
    savePresenter(value)
    setPresenter(value)
    navigate(pendingScreen.current ?? { name: 'levels' }, true)
    pendingScreen.current = null
  }
  const openSettings = (): void => navigate({ name: 'settings' })
  const changePresenter = (): void => navigate({ name: 'presenter' })
  const returnFromInformation = (): void => navigate(presenter ? { name: 'settings' } : { name: 'presenter' }, true)
  const clearData = (): void => {
    if (!window.confirm('Удалить весь сохранённый прогресс и настройки с этого устройства?')) return
    clearLocalAppData()
    pendingScreen.current = null
    setPresenter(null)
    setProgress(loadProgress())
    setSafetySeen(false)
    navigate({ name: 'presenter' }, true)
  }
  const selectSection = (section: FooterSection): void => {
    setActiveSection(section)
    if (section === 'home' && screen.name === 'home') navigate({ name: 'levels' })
  }
  return <>
    {!isOnline && <NetworkBanner onRetry={retry} />}
    {screen.name === 'presenter' && <PresenterSelectPage onSelect={selectPresenter} />}
    {screen.name === 'levels' && presenter && <LevelSelectPage presenter={presenter} activeSection={activeSection} onLevelSelect={selectLevel} onSectionChange={selectSection} onOpenSettings={openSettings} />}
    {presenter && screen.name === 'home' && <HomePage presenter={presenter} level={screen.level} progress={progress} onOpen={(practiceId) => openPractice(screen.level, practiceId)} activeSection={activeSection} onSectionChange={selectSection} onOpenSettings={openSettings} />}
    {presenter && selectedPractice && screen.name === 'practice' && <PracticePage presenter={presenter} practice={selectedPractice} onClose={() => navigate({ name: 'home', level: screen.level }, true)} onComplete={() => complete(screen.level, selectedPractice.id)} />}
    {screen.name === 'completion' && <CompletionPage onDone={() => navigate({ name: 'home', level: screen.level }, true)} />}
    {presenter && screen.name === 'settings' && <SettingsPage onBack={() => navigate({ name: 'levels' }, true)} onChangePresenter={changePresenter} onOpenSupport={() => navigate({ name: 'support' })} onOpenPrivacy={() => navigate({ name: 'privacy' })} onClearData={clearData} />}
    {isPublicInformationScreen(screen) && <InformationPage kind={screen.name} onBack={returnFromInformation} />}
    {!safetySeen && !isPublicInformationScreen(screen) && <SafetyNotice onContinue={acknowledge} />}
  </>
}
