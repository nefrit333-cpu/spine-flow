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
