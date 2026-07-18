import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test } from 'vitest'
import App from './App'

afterEach(() => { cleanup(); localStorage.clear() })

test('shows presenter selection initially', () => {
  render(<App />)
  expect(screen.getByRole('button', { name: /Девушка/ })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Парень/ })).toBeInTheDocument()
})

test('stores the presenter and opens level selection', async () => {
  render(<App />)
  await userEvent.click(screen.getByRole('button', { name: /Девушка/ }))
  expect(screen.getByRole('heading', { name: 'Выберите уровень' })).toBeInTheDocument()
  expect(localStorage.getItem('spine-flow-presenter')).toBe('female')
})
