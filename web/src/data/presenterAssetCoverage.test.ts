// @vitest-environment node
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'
import { getStepImage } from '../components/PoseIllustration'
import { practices } from './practiceCatalog'
import type { Presenter } from '../domain/presenter'

const presenters: ReadonlyArray<Presenter> = ['female', 'male']

test('has a presenter-specific PNG for every resolved practice illustration', () => {
  const missing = practices.flatMap((practice) => practice.steps.flatMap((step) =>
    presenters
      .map((presenter) => `public${getStepImage(step.id, presenter)}`)
      .filter((path) => !existsSync(resolve(path))),
  ))

  expect(missing).toEqual([])
})

test('has gym warmup images for both presenters', () => {
  const ids = [
    'gym-warmup-march', 'gym-warmup-neck-turns', 'gym-warmup-shoulder-shrugs',
    'gym-warmup-shoulder-circles', 'gym-warmup-arm-swings', 'gym-warmup-chest-open',
    'gym-warmup-arm-circles', 'gym-warmup-torso-turns', 'gym-warmup-hip-hinge-reach',
    'gym-warmup-hip-circles', 'gym-warmup-hip-openers', 'gym-warmup-leg-swings',
    'gym-warmup-side-lunge-warmup', 'gym-warmup-reverse-lunge-reach', 'gym-warmup-squat-calf-raise',
  ]
  const missing = ids.flatMap((id) => presenters
    .map((presenter) => `public${getStepImage(id, presenter)}`)
    .filter((path) => !existsSync(resolve(path))))

  expect(missing).toEqual([])
})

test('has resistance-band images for both presenters', () => {
  const ids = [
    'band-shoulders-preparation', 'band-shoulders-row', 'band-shoulders-pulldown',
    'band-shoulders-external-rotation', 'band-shoulders-reverse-fly',
    'band-shoulders-face-pull', 'band-shoulders-finish',
  ]
  const missing = ids.flatMap((id) => presenters
    .map((presenter) => `public${getStepImage(id, presenter)}`)
    .filter((path) => !existsSync(resolve(path))))

  expect(missing).toEqual([])
})
