export type Presenter = 'female' | 'male'

export function isPresenter(value: unknown): value is Presenter {
  return value === 'female' || value === 'male'
}
