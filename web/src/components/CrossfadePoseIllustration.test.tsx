import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { CrossfadePoseIllustration } from './CrossfadePoseIllustration'

afterEach(cleanup)

test('keeps the current pose visible until the next pose loads', () => {
  const { rerender } = render(<CrossfadePoseIllustration presenter="female" stepId="core-preparation" />)
  const first = screen.getByRole('img')
  fireEvent.load(first)

  rerender(<CrossfadePoseIllustration presenter="female" stepId="core-cat-cow" />)
  const images = screen.getAllByRole('img')
  expect(images[0]).toHaveClass('pose-layer-active')
  expect(images[1]).not.toHaveClass('pose-layer-active')

  fireEvent.load(images[1])
  expect(screen.getAllByRole('img').at(-1)).toHaveClass('pose-layer-active')
})

test('retains the current pose when the next image fails', () => {
  const { rerender } = render(<CrossfadePoseIllustration presenter="female" stepId="core-preparation" />)
  fireEvent.load(screen.getByRole('img'))
  rerender(<CrossfadePoseIllustration presenter="female" stepId="core-cat-cow" />)
  fireEvent.error(screen.getAllByRole('img')[1])
  expect(screen.getByRole('img')).toHaveAttribute('src', '/images/female/core-preparation.webp')
})
