import { findPractice } from '../data/practiceCatalog'
import type { PracticeLevel } from '../domain/level'

export type AppScreen =
  | { readonly name: 'presenter' }
  | { readonly name: 'levels' }
  | { readonly name: 'settings' }
  | { readonly name: 'support' }
  | { readonly name: 'privacy' }
  | { readonly name: 'home'; readonly level: PracticeLevel }
  | { readonly name: 'practice'; readonly level: PracticeLevel; readonly practiceId: string }
  | { readonly name: 'completion'; readonly level: PracticeLevel; readonly practiceId: string }

function isPracticeLevel(value: string | undefined): value is PracticeLevel {
  return value === 'beginner' || value === 'intermediate'
}

function isPracticeScreen(level: PracticeLevel, practiceId: string): boolean {
  return findPractice(practiceId)?.level === level
}

export function parseScreenHash(hash: string): AppScreen {
  const segments = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const [name, level, practiceId] = segments

  if (name === 'presenter' && segments.length === 1) return { name: 'presenter' }
  if (name === 'levels' && segments.length === 1) return { name: 'levels' }
  if (name === 'settings' && segments.length === 1) return { name: 'settings' }
  if (name === 'support' && segments.length === 1) return { name: 'support' }
  if (name === 'privacy' && segments.length === 1) return { name: 'privacy' }
  if (name === 'home' && segments.length === 2 && isPracticeLevel(level)) return { name: 'home', level }

  if (segments.length === 3 && isPracticeLevel(level) && practiceId && isPracticeScreen(level, practiceId)) {
    if (name === 'practice') return { name: 'practice', level, practiceId }
    if (name === 'completion') return { name: 'completion', level, practiceId }
  }

  return { name: 'levels' }
}

export function getScreenHash(screen: AppScreen): string {
  switch (screen.name) {
    case 'presenter': return '#/presenter'
    case 'levels': return '#/levels'
    case 'settings': return '#/settings'
    case 'support': return '#/support'
    case 'privacy': return '#/privacy'
    case 'home': return `#/home/${screen.level}`
    case 'practice': return `#/practice/${screen.level}/${screen.practiceId}`
    case 'completion': return `#/completion/${screen.level}/${screen.practiceId}`
  }
}
