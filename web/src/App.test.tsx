import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import App from './App'

afterEach(() => { cleanup(); localStorage.clear(); window.history.replaceState(null, '', '/'); vi.restoreAllMocks() })

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

test('opens support from settings', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: /Девушка/ }))
  await user.click(screen.getByRole('button', { name: 'Настройки' }))
  await user.click(screen.getByRole('button', { name: 'Поддержка' }))

  expect(screen.getByRole('heading', { name: 'Поддержка' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Написать в поддержку' })).toHaveAttribute('href', 'mailto:nefrit333@gmail.com')
})

test('opens privacy from a direct public URL without a presenter', () => {
  window.location.hash = '#/privacy'
  render(<App />)

  expect(screen.getByRole('heading', { name: 'Конфиденциальность' })).toBeInTheDocument()
})

test('clears local data after confirmation', async () => {
  const user = userEvent.setup()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  render(<App />)

  await user.click(screen.getByRole('button', { name: /Девушка/ }))
  await user.click(screen.getByRole('button', { name: 'Настройки' }))
  await user.click(screen.getByRole('button', { name: 'Удалить данные с устройства' }))

  expect(localStorage.getItem('spine-flow-presenter')).toBeNull()
  expect(screen.getByRole('button', { name: /Девушка/ })).toBeInTheDocument()
})
