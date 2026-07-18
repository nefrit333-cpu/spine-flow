import { afterEach, expect, test } from 'vitest'
import { clearPresenter, readPresenter, savePresenter } from './presenterStore'

afterEach(() => localStorage.clear())

test('stores and reads a valid presenter', () => {
  savePresenter('male')
  expect(readPresenter()).toBe('male')
})

test('ignores invalid stored values', () => {
  localStorage.setItem('spine-flow-presenter', 'unknown')
  expect(readPresenter()).toBeNull()
})

test('clears the selected presenter', () => {
  savePresenter('female')
  clearPresenter()
  expect(readPresenter()).toBeNull()
})
