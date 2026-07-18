import { useEffect, useState, type JSX } from 'react'
import { PoseIllustration } from './PoseIllustration'
import type { Presenter } from '../domain/presenter'

interface CrossfadePoseIllustrationProps { readonly presenter: Presenter; readonly stepId: string }

export function CrossfadePoseIllustration({ presenter, stepId }: CrossfadePoseIllustrationProps): JSX.Element {
  const [visibleStepId, setVisibleStepId] = useState(stepId)
  const [pendingStepId, setPendingStepId] = useState<string | null>(null)

  useEffect(() => {
    if (stepId !== visibleStepId) setPendingStepId(stepId)
  }, [stepId, visibleStepId])

  const revealPending = (): void => {
    if (!pendingStepId || pendingStepId !== stepId) return
    setVisibleStepId(pendingStepId)
    setPendingStepId(null)
  }

  const discardPending = (): void => {
    if (pendingStepId === stepId) setPendingStepId(null)
  }

  return <>
    <PoseIllustration presenter={presenter} stepId={visibleStepId} className="pose-layer pose-layer-active" />
    {pendingStepId && <PoseIllustration presenter={presenter} stepId={pendingStepId} className="pose-layer" onLoad={revealPending} onError={discardPending} />}
  </>
}
