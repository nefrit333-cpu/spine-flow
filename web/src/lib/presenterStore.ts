import { isPresenter, type Presenter } from '../domain/presenter'

const PRESENTER_KEY = 'spine-flow-presenter'

export function readPresenter(): Presenter | null {
  const value = localStorage.getItem(PRESENTER_KEY)
  return isPresenter(value) ? value : null
}

export function savePresenter(presenter: Presenter): void {
  localStorage.setItem(PRESENTER_KEY, presenter)
}

export function clearPresenter(): void {
  localStorage.removeItem(PRESENTER_KEY)
}
