import type { JSX } from 'react'
import type { Presenter } from '../domain/presenter'

interface PoseIllustrationProps { readonly presenter?: Presenter; readonly compact?: boolean; readonly stepId?: string; readonly className?: string; readonly onLoad?: () => void; readonly onError?: () => void }

const stepImage: Readonly<Record<string, string>> = {
  'neck-preparation': '/images/neck-preparation-color.webp',
  'neck-right-tilt': '/images/neck-right-tilt-color.webp',
  'neck-left-tilt': '/images/neck-left-tilt-color.webp',
  'neck-turns': '/images/neck-turns-color.webp',
  'neck-lengthen': '/images/neck-lengthen-color.webp',
  'neck-rest': '/images/neck-rest-color.webp',
  'shoulders-preparation': '/images/shoulders-preparation-color.webp',
  'shoulders-lift': '/images/shoulders-lift-color.webp',
  'shoulders-circles': '/images/shoulders-circles-color.webp',
  'shoulders-open-chest': '/images/shoulders-open-chest-color.webp',
  'lower-back-preparation': '/images/lower-back-preparation-color.webp',
  'lower-back-pelvis': '/images/lower-back-pelvis-color.webp',
  'lower-back-rest': '/images/lower-back-rest-color.webp',
  'desk-reset-preparation': '/images/desk-reset-preparation-color.webp',
  'desk-reset-side-stretch': '/images/desk-reset-side-stretch-color.webp',
  'desk-reset-torso-turn': '/images/desk-reset-torso-turn-color.webp',
  'evening-back-breath': '/images/evening-back-breath-color.webp',
  'evening-back-rest': '/images/evening-back-rest-color.webp',
  'evening-back-finish': '/images/evening-back-finish-color.webp',
  'intermediate-preparation': '/images/intermediate-preparation.webp',
  'cat-cow': '/images/cat-cow.webp',
  'air-squat': '/images/air-squat.webp',
  'reverse-lunge': '/images/reverse-lunge.webp',
  'wall-pushup': '/images/wall-pushup.webp',
  'bird-dog': '/images/bird-dog.webp',
  'glute-bridge': '/images/glute-bridge.webp',
  'shoulder-tap-plank': '/images/shoulder-tap-plank.webp',
  'intermediate-rest': '/images/intermediate-rest.webp',
  'core-preparation': '/images/core-preparation.webp',
  'core-cat-cow': '/images/core-cat-cow.webp',
  'core-dead-bug': '/images/core-dead-bug.webp',
  'core-bird-dog': '/images/core-bird-dog.webp',
  'core-bridge-march': '/images/core-bridge-march.webp',
  'core-side-plank-right': '/images/core-side-plank-right.webp',
  'core-side-plank-left': '/images/core-side-plank-left.webp',
  'core-child-pose': '/images/core-child-pose.webp',
  'core-rest': '/images/core-rest.webp',
}

export function getStepImage(stepId: string, presenter: Presenter): string {
  const imageStepId = stepId === 'core-side-plank' ? 'core-side-plank-right' : stepId
  return `/images/${presenter}/${imageStepId}.webp`
}

export function PoseIllustration({ presenter = 'female', compact = false, stepId, className = '', onLoad, onError }: PoseIllustrationProps): JSX.Element {
  const resolvedStepId = stepId ?? 'neck-preparation'
  const image = getStepImage(resolvedStepId, presenter)
  const mirrored = stepId === 'left' || stepId === 'turn'
  return <img className={`${compact ? 'pose-image pose-image-compact' : 'pose-image'}${mirrored ? ' pose-image-mirrored' : ''} ${className}`.trim()} src={image} alt="Молодая спортсменка выполняет упражнение" onLoad={onLoad} onError={onError} />
}
