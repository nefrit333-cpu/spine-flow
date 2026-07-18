import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'
import { useEffect, type JSX } from 'react'
import type { Practice } from '../domain/practice'
import { usePracticeSession } from '../hooks/usePracticeSession'
import { CrossfadePoseIllustration } from '../components/CrossfadePoseIllustration'
import type { Presenter } from '../domain/presenter'

interface PracticePageProps { readonly presenter: Presenter; readonly practice: Practice; readonly onClose: () => void; readonly onComplete: () => void }

function formatTime(seconds: number): string { return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` }

export function PracticePage({ presenter, practice, onClose, onComplete }: PracticePageProps): JSX.Element {
  const session = usePracticeSession(practice)
  const step = practice.steps[session.currentStepIndex]
  useEffect(() => { if (session.isComplete) onComplete() }, [onComplete, session.isComplete])
  return <main className="practice-page app-shell">
    <header className="practice-topbar"><button className="icon-button" aria-label="Закрыть практику" onClick={onClose}><X size={23} /></button><span>Шаг {session.currentStepIndex + 1} из {practice.steps.length}</span></header>
    <div className="practice-visual"><CrossfadePoseIllustration presenter={presenter} stepId={step.id} /></div>
    <section className="practice-content"><span className="step-label">{practice.title}</span><h2>{step.title}</h2><p>{step.instruction}</p>{session.remainingSeconds === 0 ? <p className="exercise-complete">Упражнение выполнено, можете продолжить</p> : <time className="timer">{formatTime(session.remainingSeconds)}</time>}</section>
    <nav className="practice-controls" aria-label="Управление практикой"><button className="icon-button control-button" aria-label="Предыдущий шаг" disabled={session.currentStepIndex === 0} onClick={session.goBack}><ChevronLeft size={25} /></button><button className="pause-button" aria-label={session.isPaused ? 'Продолжить практику' : 'Поставить на паузу'} onClick={session.isPaused ? session.resume : session.pause}>{session.isPaused ? <Play size={23} fill="currentColor" /> : <Pause size={23} fill="currentColor" />}</button><button className="icon-button control-button" aria-label="Следующий шаг" onClick={session.goNext}><ChevronRight size={25} /></button></nav>
  </main>
}
