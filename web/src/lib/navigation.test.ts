import { describe, expect, test } from 'vitest'
import { getScreenHash, parseScreenHash } from './navigation'

describe('navigation', () => {
  test('parses a valid practice deep link', () => {
    expect(parseScreenHash('#/practice/beginner/neck')).toEqual({ name: 'practice', level: 'beginner', practiceId: 'neck' })
  })

  test('rejects an invalid practice or mismatched level', () => {
    expect(parseScreenHash('#/practice/intermediate/neck')).toEqual({ name: 'levels' })
    expect(parseScreenHash('#/practice/beginner/missing')).toEqual({ name: 'levels' })
  })

  test('serializes every routable screen', () => {
    expect(getScreenHash({ name: 'presenter' })).toBe('#/presenter')
    expect(getScreenHash({ name: 'settings' })).toBe('#/settings')
    expect(getScreenHash({ name: 'support' })).toBe('#/support')
    expect(getScreenHash({ name: 'privacy' })).toBe('#/privacy')
    expect(getScreenHash({ name: 'home', level: 'intermediate' })).toBe('#/home/intermediate')
    expect(getScreenHash({ name: 'completion', level: 'beginner', practiceId: 'neck' })).toBe('#/completion/beginner/neck')
  })

  test('parses public information routes', () => {
    expect(parseScreenHash('#/support')).toEqual({ name: 'support' })
    expect(parseScreenHash('#/privacy')).toEqual({ name: 'privacy' })
  })
})
