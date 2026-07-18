# Spine Flow Difficulty Levels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить iPhone-first экран выбора сложности, сохранить библиотеку начинающего уровня и реализовать одну 15-минутную практику среднего уровня.

**Architecture:** Каталог практик получает тип уровня и селекторы каталога. `App` различает экран выбора уровня, библиотеку выбранного уровня, практику и завершение. Отдельные компоненты отвечают за карточки уровней и экран выбора; `PoseIllustration` выбирает точное растровое изображение по идентификатору этапа.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, Playwright, Lucide React.

## Global Constraints

- Интерфейс и контент остаются русскоязычными и рассчитанными на портретный iPhone шириной от 375 px.
- Нет аккаунтов, backend, уведомлений, видео, офлайн-кеша или медицинских обещаний.
- «Продвинутый» виден, но заблокирован и не открывает практику.
- Средняя практика содержит ровно девять этапов и длится 900 секунд; подготовка и отдых длятся по 30 секунд.
- Изображения показывают молодых спортивных девушек и соответствуют уровню или конкретному движению.
- Ручные коммиты и публикация выполняются только после отдельного разрешения владельца.

---

## File Structure

- Create: `web/src/domain/level.ts` — типы уровней и данные для карточек.
- Create: `web/src/components/LevelCard.tsx` — доступная или заблокированная карточка уровня.
- Create: `web/src/pages/LevelSelectPage.tsx` — стартовый экран выбора сложности и нижняя навигация.
- Modify: `web/src/domain/practice.ts` — добавить уровень практики.
- Modify: `web/src/data/practiceCatalog.ts` — пометить каталог начинающего уровня, добавить среднюю практику и селекторы.
- Modify: `web/src/components/PoseIllustration.tsx` — сопоставить идентификаторы средней практики с изображениями.
- Modify: `web/src/pages/HomePage.tsx` — отобразить каталог только выбранного уровня.
- Modify: `web/src/App.tsx` — добавить переходы между выбором уровня, библиотекой и практикой.
- Modify: `web/src/styles.css` — добавить устойчивую мобильную раскладку карточек и состояния доступности.
- Modify: `web/src/App.test.tsx`, `web/src/data/practiceCatalog.test.ts`, `web/e2e/spine-flow.spec.ts` — покрыть новые сценарии.
- Create: `web/public/images/level-beginner.png`, `level-intermediate.png`, `level-advanced.png` и девять изображений этапов средней практики.

### Task 1: Данные уровней и средняя практика

**Files:**
- Create: `web/src/domain/level.ts`
- Modify: `web/src/domain/practice.ts`
- Modify: `web/src/data/practiceCatalog.ts`
- Test: `web/src/data/practiceCatalog.test.ts`

**Interfaces:**
- Produces `PracticeLevel = 'beginner' | 'intermediate'`.
- Produces `getPracticesByLevel(level: PracticeLevel): ReadonlyArray<Practice>` and `getRecommendedPractice(level: PracticeLevel): Practice`.
- Extends `Practice` with `level: PracticeLevel`.

- [ ] **Step 1: Write the failing catalogue tests.**

```ts
import { expect, test } from 'vitest'
import { getDurationMinutes, getPracticesByLevel, practices } from './practiceCatalog'

test('keeps the five approved beginner practices', () => {
  expect(getPracticesByLevel('beginner').map((practice) => practice.id))
    .toEqual(['neck', 'shoulders', 'lower-back', 'desk-reset', 'evening-back'])
})

test('contains the complete fifteen-minute intermediate practice', () => {
  const [practice] = getPracticesByLevel('intermediate')
  expect(practice.id).toBe('strength-mobility')
  expect(practice.steps).toHaveLength(9)
  expect(practice.steps[0].durationSeconds).toBe(30)
  expect(practice.steps.at(-1)?.durationSeconds).toBe(30)
  expect(getDurationMinutes(practice)).toBe(15)
  expect(practice.steps.map((step) => step.id)).toEqual([
    'intermediate-preparation', 'cat-cow', 'air-squat', 'reverse-lunge',
    'wall-pushup', 'bird-dog', 'glute-bridge', 'shoulder-tap-plank', 'intermediate-rest',
  ])
})

test('keeps every practice assigned to an available level', () => {
  expect(practices.every((practice) => practice.level === 'beginner' || practice.level === 'intermediate')).toBe(true)
})
```

- [ ] **Step 2: Run the focused test and verify it fails.**

Run: `npm.cmd run test -- src/data/practiceCatalog.test.ts` from `web`.

Expected: FAIL because `getPracticesByLevel` does not exist and `Practice` has no `level` property.

- [ ] **Step 3: Add the level contracts and catalogue implementation.**

```ts
// web/src/domain/level.ts
export type PracticeLevel = 'beginner' | 'intermediate'

export interface DifficultyCard {
  readonly id: PracticeLevel | 'advanced'
  readonly title: string
  readonly subtitle: string
  readonly image: string
  readonly available: boolean
}

export const difficultyCards: ReadonlyArray<DifficultyCard> = [
  { id: 'beginner', title: 'Начинающий', subtitle: 'Мягкое начало · 5–15 минут', image: '/images/level-beginner.png', available: true },
  { id: 'intermediate', title: 'Средний', subtitle: 'Сила и подвижность · 15 минут', image: '/images/level-intermediate.png', available: true },
  { id: 'advanced', title: 'Продвинутый', subtitle: 'Скоро', image: '/images/level-advanced.png', available: false },
]
```

```ts
// additions to web/src/data/practiceCatalog.ts
export function getPracticesByLevel(level: PracticeLevel): ReadonlyArray<Practice> {
  return practices.filter((practice) => practice.level === level)
}

export function getRecommendedPractice(level: PracticeLevel): Practice {
  return getPracticesByLevel(level)[0]
}
```

Add `level: 'beginner'` to all five existing objects. Add this sixth object to `practices`:

```ts
{
  id: 'strength-mobility',
  level: 'intermediate',
  title: '15 минут: сила и подвижность',
  subtitle: 'Функциональная практика для уверенного темпа',
  accent: 'blue',
  steps: [
    { id: 'intermediate-preparation', title: 'Подготовка', instruction: 'Встаньте ровно, поставьте стопы на ширину таза и спокойно подышите. Почувствуйте устойчивую опору под стопами; если есть боль или недомогание, остановитесь.', durationSeconds: 30 },
    { id: 'cat-cow', title: 'Кошка-корова', instruction: 'Встаньте на четвереньки. На вдохе мягко удлиняйте позвоночник, на выдохе округляйте спину. Двигайтесь плавно в комфортной амплитуде.', durationSeconds: 120 },
    { id: 'air-squat', title: 'Приседания', instruction: 'Отведите таз назад и опускайтесь настолько, насколько сохраняется контроль. Колени направляйте по линии стоп, на подъёме сделайте спокойный выдох.', durationSeconds: 120 },
    { id: 'reverse-lunge', title: 'Обратные выпады', instruction: 'Сделайте небольшой шаг назад и мягко согните обе ноги, затем вернитесь в стойку. Чередуйте стороны и держите корпус устойчивым.', durationSeconds: 120 },
    { id: 'wall-pushup', title: 'Отжимания от стены', instruction: 'Упритесь ладонями в стену, согните руки и плавно оттолкнитесь. Сохраняйте длинную линию корпуса и выдыхайте при возвращении.', durationSeconds: 120 },
    { id: 'bird-dog', title: 'Птица-собака', instruction: 'Из положения на четвереньках вытягивайте противоположные руку и ногу. Не спешите и удерживайте таз ровным, затем меняйте сторону.', durationSeconds: 120 },
    { id: 'glute-bridge', title: 'Ягодичный мост', instruction: 'Лёжа на спине, поставьте стопы на пол и поднимайте таз до комфортной высоты. Почувствуйте опору в стопах и выдыхайте в верхней точке.', durationSeconds: 120 },
    { id: 'shoulder-tap-plank', title: 'Планка с касанием плеч', instruction: 'В высокой планке поочерёдно касайтесь ладонью противоположного плеча. Держите корпус неподвижным; при потере устойчивости опустите колени на пол.', durationSeconds: 120 },
    { id: 'intermediate-rest', title: 'Отдых', instruction: 'Вернитесь в удобную стойку, расслабьте руки и сделайте несколько спокойных вдохов. Почувствуйте ровное дыхание и устойчивость.', durationSeconds: 30 },
  ],
}
```

- [ ] **Step 4: Run the focused test and verify it passes.**

Run: `npm.cmd run test -- src/data/practiceCatalog.test.ts` from `web`.

Expected: PASS, three tests green.

### Task 2: Изображения для карточек и этапов

**Files:**
- Create: `web/public/images/level-beginner.png`
- Create: `web/public/images/level-intermediate.png`
- Create: `web/public/images/level-advanced.png`
- Create: `web/public/images/intermediate-preparation.png`, `cat-cow.png`, `air-squat.png`, `reverse-lunge.png`, `wall-pushup.png`, `bird-dog.png`, `glute-bridge.png`, `shoulder-tap-plank.png`, `intermediate-rest.png`
- Modify: `web/src/components/PoseIllustration.tsx`

**Interfaces:**
- Consumes the exact step IDs added in Task 1.
- Produces a deterministic image source for every intermediate step.

- [ ] **Step 1: Generate the three 4:5 card images.**

Use the `imagegen` skill and create one image per prompt. Keep the same light sage, editorial wellness art direction, no text or logos:

```text
1. Young athletic adult woman in a relaxed standing neck stretch, modest contemporary fitness outfit, full body, calm premium wellness editorial illustration, pale sage studio background, vertical 4:5 composition, subject centered, no text, no logo.
2. Young athletic adult woman in a controlled reverse lunge, modest contemporary fitness outfit, full body, premium wellness editorial illustration, pale muted blue studio background, vertical 4:5 composition, subject centered, no text, no logo.
3. Young athletic adult woman holding an advanced yoga balance pose, modest contemporary fitness outfit, full body, premium wellness editorial illustration, muted charcoal-green studio background, vertical 4:5 composition, subject centered, no text, no logo.
```

- [ ] **Step 2: Generate nine 3:4 exercise images.**

Use the `imagegen` skill and create one image per pose. Keep the person fully visible, centred and anatomically clear; use no text, no logo, no equipment except a plain wall for wall push-ups.

```text
Young athletic adult woman, [POSE], modest contemporary fitness outfit, full body, premium wellness editorial illustration, pale sage studio background, vertical 3:4 composition, subject centered, no text, no logo.
```

Replace `[POSE]` respectively with: `standing calmly with hands relaxed at sides`; `on hands and knees showing the cow phase of cat-cow`; `performing a controlled bodyweight squat`; `performing a reverse lunge`; `performing a wall push-up against a plain wall`; `on hands and knees extending opposite arm and leg in bird-dog`; `lying on her back at the top of a glute bridge`; `in a high plank tapping the opposite shoulder`; `standing calmly with hands relaxed at sides after exercise`.

- [ ] **Step 3: Copy each generated result into the exact public asset path.**

Map the first three images to `level-beginner.png`, `level-intermediate.png`, `level-advanced.png`; map the remaining images in pose order to the nine intermediate file paths listed above. Do not reference files outside `web/public/images`.

- [ ] **Step 4: Update pose lookup.**

```ts
const stepImage: Readonly<Record<string, string>> = {
  breath: '/images/neck-preparation.png',
  right: '/images/neck-tilt.png',
  left: '/images/neck-tilt.png',
  turn: '/images/neck-turn.png',
  lengthen: '/images/neck-stretch.png',
  rest: '/images/neck-preparation.png',
  'intermediate-preparation': '/images/intermediate-preparation.png',
  'cat-cow': '/images/cat-cow.png',
  'air-squat': '/images/air-squat.png',
  'reverse-lunge': '/images/reverse-lunge.png',
  'wall-pushup': '/images/wall-pushup.png',
  'bird-dog': '/images/bird-dog.png',
  'glute-bridge': '/images/glute-bridge.png',
  'shoulder-tap-plank': '/images/shoulder-tap-plank.png',
  'intermediate-rest': '/images/intermediate-rest.png',
}
```

### Task 3: Экран выбора и доступная карточка уровня

**Files:**
- Create: `web/src/components/LevelCard.tsx`
- Create: `web/src/pages/LevelSelectPage.tsx`
- Modify: `web/src/styles.css`
- Create: `web/src/pages/LevelSelectPage.test.tsx`

**Interfaces:**
- Consumes `DifficultyCard` and `FooterSection`.
- Produces `LevelSelectPage({ activeSection, onLevelSelect, onSectionChange })`.
- `onLevelSelect` only accepts `PracticeLevel`; advanced cannot call it.

- [ ] **Step 1: Write the failing screen test.**

```tsx
test('shows all difficulty choices and disables advanced', () => {
  render(<LevelSelectPage activeSection="home" onLevelSelect={() => undefined} onSectionChange={() => undefined} />)
  expect(screen.getByRole('heading', { name: 'Выберите уровень' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Начинающий/ })).toBeEnabled()
  expect(screen.getByRole('button', { name: /Средний/ })).toBeEnabled()
  expect(screen.getByRole('button', { name: /Продвинутый.*Скоро/ })).toBeDisabled()
})
```

- [ ] **Step 2: Run the focused test and verify it fails.**

Run: `npm.cmd run test -- src/pages/LevelSelectPage.test.tsx` from `web`.

Expected: FAIL because the level heading and buttons do not exist.

- [ ] **Step 3: Implement `LevelCard` and `LevelSelectPage`.**

```tsx
// web/src/components/LevelCard.tsx
import { ArrowUpRight, LockKeyhole } from 'lucide-react'
import type { JSX } from 'react'
import type { DifficultyCard, PracticeLevel } from '../domain/level'

interface LevelCardProps {
  readonly card: DifficultyCard
  readonly onSelect: (level: PracticeLevel) => void
}

export function LevelCard({ card, onSelect }: LevelCardProps): JSX.Element {
  const selectable = card.id !== 'advanced'
  const handleSelect = (): void => { if (card.id !== 'advanced') onSelect(card.id) }
  return <button className={selectable ? 'level-card' : 'level-card level-card-locked'} disabled={!card.available}
    onClick={handleSelect}>
    <img src={card.image} alt="" />
    <span className="level-card-overlay"><strong>{card.title}</strong><small>{card.subtitle}</small>
      {selectable ? <ArrowUpRight aria-hidden="true" size={22} /> : <LockKeyhole aria-hidden="true" size={20} />}
    </span>
  </button>
}
```

```tsx
// web/src/pages/LevelSelectPage.tsx
import { Settings } from 'lucide-react'
import type { JSX } from 'react'
import { FooterNav, type FooterSection } from '../components/FooterNav'
import { LevelCard } from '../components/LevelCard'
import { difficultyCards, type PracticeLevel } from '../domain/level'

interface LevelSelectPageProps {
  readonly activeSection: FooterSection
  readonly onLevelSelect: (level: PracticeLevel) => void
  readonly onSectionChange: (section: FooterSection) => void
}

export function LevelSelectPage({ activeSection, onLevelSelect, onSectionChange }: LevelSelectPageProps): JSX.Element {
  return <main className="app-shell level-select-page">
    <header className="topbar"><h1>Spine Flow</h1><button className="icon-button topbar-button" aria-label="Настройки"><Settings size={23} /></button></header>
    {activeSection === 'home' ? <section className="level-select"><h2>Выберите уровень</h2><div className="level-list">
      {difficultyCards.map((card) => <LevelCard key={card.id} card={card} onSelect={onLevelSelect} />)}
    </div></section> : <section className="section secondary-section"><h2>{activeSection === 'diary' ? 'Дневник' : activeSection === 'favorites' ? 'Избранное' : 'Прогресс'}</h2></section>}
    <FooterNav active={activeSection} onSelect={onSectionChange} />
  </main>
}
```

- [ ] **Step 4: Add the mobile styles.**

```css
.level-select-page .topbar { margin-bottom: 48px; }
.level-select h2 { margin: 0 0 24px; color: #164631; font: 400 clamp(2rem, 10vw, 3.2rem)/.98 Georgia, "Times New Roman", serif; }
.level-list { display: grid; gap: 14px; }
.level-card { position: relative; display: block; width: 100%; aspect-ratio: 1.55 / 1; overflow: hidden; padding: 0; border: 1px solid #d7e0d8; border-radius: 8px; background: #edf4ed; color: #fff; text-align: left; cursor: pointer; }
.level-card img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.level-card-overlay { position: absolute; right: 0; bottom: 0; left: 0; display: grid; grid-template-columns: 1fr auto; gap: 4px 12px; align-items: end; padding: 18px; background: rgb(17 47 33 / .72); }
.level-card-overlay strong { font: 400 1.8rem/1 Georgia, "Times New Roman", serif; }
.level-card-overlay small { grid-column: 1; font-size: .9rem; }
.level-card-overlay svg { grid-row: 1 / span 2; grid-column: 2; }
.level-card:not(:disabled):active { transform: scale(.985); }
.level-card-locked { filter: saturate(.5); cursor: not-allowed; }
.level-card-locked img { opacity: .62; }
```

- [ ] **Step 5: Run the focused test and verify it passes.**

Run: `npm.cmd run test -- src/pages/LevelSelectPage.test.tsx` from `web`.

Expected: PASS, the three choices are visible and only advanced is disabled.

### Task 4: Навигация уровней и библиотека практик

**Files:**
- Modify: `web/src/App.tsx`
- Modify: `web/src/pages/HomePage.tsx`
- Modify: `web/src/App.test.tsx`
- Test: `web/e2e/spine-flow.spec.ts`

**Interfaces:**
- Consumes `LevelSelectPage`, `PracticeLevel`, `getPracticesByLevel` and `getRecommendedPractice`.
- Produces a `Screen` state with `levels` and `home` carrying a selected level.

- [ ] **Step 1: Write failing browser scenarios.**

Also update `web/src/App.test.tsx` so rendering `App` asserts `Выберите уровень` before the safety notice is acknowledged in browser flows.

```ts
test('opens the beginner library and returns to levels through the footer', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Продолжить' }).click()
  await page.getByRole('button', { name: /Начинающий/ }).click()
  await expect(page.getByRole('heading', { name: 'Сегодня' })).toBeVisible()
  await page.getByRole('button', { name: 'Главная' }).click()
  await expect(page.getByRole('heading', { name: 'Выберите уровень' })).toBeVisible()
})

test('opens and completes the intermediate practice', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Продолжить' }).click()
  await page.getByRole('button', { name: /Средний/ }).click()
  await page.getByRole('button', { name: 'Начать' }).click()
  await expect(page.getByText('Шаг 1 из 9')).toBeVisible()
  await expect(page.locator('.practice-visual img')).toHaveAttribute('src', '/images/intermediate-preparation.png')
  await page.getByRole('button', { name: 'Следующий шаг' }).click()
  await expect(page.locator('.practice-visual img')).toHaveAttribute('src', '/images/cat-cow.png')
  for (let index = 0; index < 9; index += 1) await page.getByRole('button', { name: 'Следующий шаг' }).click()
  await expect(page.getByRole('heading', { name: 'Практика завершена' })).toBeVisible()
})
```

- [ ] **Step 2: Run the browser test and verify it fails.**

Run: `npm.cmd run test:e2e -- --grep "beginner library|intermediate practice"` from `web`.

Expected: FAIL because the level buttons and 9-step practice are not yet wired into app navigation.

- [ ] **Step 3: Implement level-aware app state and library view.**

```ts
// Screen replacement in web/src/App.tsx
type Screen =
  | { readonly name: 'levels' }
  | { readonly name: 'home'; readonly level: PracticeLevel }
  | { readonly name: 'practice'; readonly practiceId: string; readonly level: PracticeLevel }
  | { readonly name: 'completion'; readonly practiceId: string; readonly level: PracticeLevel }
```

Initialize `screen` with `{ name: 'levels' }`. Render `LevelSelectPage` for `levels`; `onLevelSelect` sets `{ name: 'home', level }`. Pass `level` to `HomePage`. On practice close and completion done, return to `{ name: 'home', level: screen.level }`. When the footer selects `home` on the level screen, keep it there; on the library screen, change the screen to `{ name: 'levels' }`.

```tsx
// HomePage props and catalogue lookups
interface HomePageProps {
  readonly level: PracticeLevel
  readonly progress: UserProgress
  readonly onOpen: (id: string) => void
  readonly activeSection: FooterSection
  readonly onSectionChange: (section: FooterSection) => void
}

const levelPractices = getPracticesByLevel(level)
const recommendedPractice = getRecommendedPractice(level)
```

Render `levelPractices.slice(1)` in the list, so intermediate has a featured card and no empty duplicate list.

- [ ] **Step 4: Run unit, browser and build checks.**

Run from `web`:

```powershell
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

Expected: every test passes and Vite emits `dist` without TypeScript errors.

### Task 5: Responsive visual verification and documentation status

**Files:**
- Modify: `web/e2e/spine-flow.spec.ts`
- Modify: `.agent-work/tasks/todo.md`

**Interfaces:**
- Consumes the fully integrated app from Tasks 1–4.
- Produces screenshot evidence for the level screen and exercise visual and an updated task checklist.

- [ ] **Step 1: Add compact screenshot coverage.**

```ts
test('renders level cards at compact iPhone dimensions', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Продолжить' }).click()
  await expect(page.getByRole('heading', { name: 'Выберите уровень' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Продвинутый.*Скоро/ })).toBeVisible()
  await page.screenshot({ path: 'output/playwright/levels-375.png', fullPage: true })
})
```

- [ ] **Step 2: Run all checks and inspect target screenshots.**

Run from `web`:

```powershell
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

Inspect `web/output/playwright/levels-375.png` and the intermediate-step screenshot. Confirm the three cards, lower navigation, copy, images and buttons are visible without clipping or overlap.

- [ ] **Step 3: Record completed verification in project memory.**

Change the `Spine Flow: уровни сложности` checklist in `.agent-work/tasks/todo.md` to completed and add the exact test commands/results. Leave physical iPhone standalone verification pending unless it has actually been performed.

## Self-Review

- Spec coverage: Tasks 1–4 cover all functional requirements; Task 2 covers the approved image requirement; Task 5 covers compact iPhone visual proof.
- Scope: no server, account, advanced practice, offline support or deployment task is included.
- Types: `PracticeLevel` is defined once in `domain/level.ts`; catalogue, pages and app navigation consume the same union.
- No placeholders: every planned data value, step ID, duration, asset path, test command and image prompt is explicitly specified.
