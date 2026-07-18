import { expect, test } from 'vitest'
import { getStepImage } from './PoseIllustration'

test('resolves the same step inside the selected presenter directory', () => {
  expect(getStepImage('neck-right-tilt', 'female')).toBe('/images/female/neck-right-tilt.webp')
  expect(getStepImage('neck-right-tilt', 'male')).toBe('/images/male/neck-right-tilt.webp')
})

test('does not fall back to another presenter', () => {
  expect(getStepImage('missing-step', 'male')).toBe('/images/male/missing-step.webp')
})
