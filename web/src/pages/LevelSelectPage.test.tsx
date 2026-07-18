import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { LevelCard } from '../components/LevelCard'
import { difficultyCards } from '../domain/level'
import { LevelSelectPage } from './LevelSelectPage'

describe('LevelSelectPage', () => {
  test('shows all difficulty choices and disables advanced', () => {
    render(
      <LevelSelectPage
        presenter="male"
        activeSection="home"
        onLevelSelect={vi.fn()}
        onSectionChange={vi.fn()}
        onChangePresenter={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Выберите уровень' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Начинающий/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /Средний/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /Продвинутый.*Скоро/ })).toBeDisabled()
  })

  test('does not call the level callback for advanced even if availability is accidentally true', () => {
    const onSelect = vi.fn()
    const advancedCard = difficultyCards.find((card) => card.id === 'advanced')

    if (!advancedCard) throw new Error('Advanced card is missing')

    const { container } = render(<LevelCard card={{ ...advancedCard, available: true }} onSelect={onSelect} />)

    const button = within(container).getByRole('button', { name: /Продвинутый.*Скоро/ })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
