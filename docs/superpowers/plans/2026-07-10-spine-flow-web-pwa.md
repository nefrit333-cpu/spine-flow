# Spine Flow Web/PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an iPhone-first, Russian-language web app that can be added to the iPhone Home Screen and used online as a standalone-style Spine Flow experience.

**Architecture:** A React single-page application bundles the five-practice catalog and uses `localStorage` for the user’s local progress. A session hook owns timer and navigation state; page components render the home, practice and completion states. Vite builds the static HTTPS-ready files; no backend, service worker or offline cache is added.

**Tech Stack:** React, TypeScript, Vite, Vitest, React Testing Library, Playwright, plain CSS, `lucide-react`.

## Global Constraints

- Target iPhone Safari in portrait orientation; no Android-specific scope in this MVP.
- All visible product copy is Russian.
- The app works only when the site has loaded over an internet connection; do not add a service worker or offline cache.
- Use `localStorage` only for completion count, last practice identifier, last completion date and safety-notice acknowledgement.
- Do not add accounts, backend services, analytics, ads, payments, subscriptions, notifications, video or medical claims.
- Use `manifest.webmanifest`, iPhone icons, standalone display metadata, theme color and safe-area CSS.
- Do not publish, connect Vercel, create external accounts, commit or push without a separate user command.

---

## Planned File Structure

```text
web/
  package.json                         Scripts and frontend dependencies
  vite.config.ts                       Vite and Vitest configuration
  tsconfig.json                        TypeScript configuration
  index.html                           iPhone meta tags and manifest link
  public/
    manifest.webmanifest               Standalone web-app metadata
    icons/icon-180.png                 Apple touch icon
    icons/icon-192.png                 Web-app icon
    icons/icon-512.png                 Web-app icon
  src/
    main.tsx                           React bootstrap
    App.tsx                            App state, safety gate and screen switching
    styles.css                         Global reset, theme and safe-area layout
    data/practiceCatalog.ts            Five embedded practices
    domain/practice.ts                 Practice, PracticeStep and UserProgress types
    lib/progressStore.ts               localStorage persistence boundary
    hooks/useNetworkStatus.ts          Browser online/offline status after load
    hooks/usePracticeSession.ts        Timer, pause and step navigation
    components/SafetyNotice.tsx        One-time wellness warning
    components/NetworkBanner.tsx       Network-loss banner and retry control
    components/PracticeCard.tsx        Home-screen practice card
    components/PoseIllustration.tsx    Reusable line-art visual treatment
    pages/HomePage.tsx                 Today section and practice library
    pages/PracticePage.tsx             Active practice screen
    pages/CompletionPage.tsx           Completion screen
    src/**/*.test.ts                     Unit and component tests alongside sources
  e2e/spine-flow.spec.ts               Playwright primary-path test
```

### Task 1: Establish the React and test foundation

**Files:**
- Create: `web/package.json`
- Create: `web/vite.config.ts`
- Create: `web/tsconfig.json`
- Create: `web/index.html`
- Create: `web/src/main.tsx`
- Create: `web/src/App.tsx`
- Create: `web/src/styles.css`

**Interfaces:**
- Produces: the `npm run dev`, `npm run build`, `npm run test`, and `npm run test:e2e` commands.
- Consumed by: all subsequent tasks.

- [ ] **Step 1: Install the scaffold dependencies**

Run from `web/` after creating the folder:

```powershell
npm.cmd init -y
npm.cmd install react react-dom lucide-react
npm.cmd install -D @types/react @types/react-dom @vitejs/plugin-react typescript vite vitest jsdom @testing-library/jest-dom @testing-library/react @testing-library/user-event @playwright/test
npx.cmd playwright install chromium
```

Expected: `package.json` and `node_modules` exist; the Playwright Chromium browser is installed.

- [ ] **Step 2: Add the package scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 3: Add Vite and Vitest configuration**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/testSetup.ts'
  }
})
```

Create `web/src/testSetup.ts` with:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Add the smallest render test**

Create `web/src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('shows the Spine Flow heading', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Spine Flow' })).toBeInTheDocument()
})
```

- [ ] **Step 5: Implement the minimal app shell**

```tsx
export default function App() {
  return (
    <main>
      <h1>Spine Flow</h1>
    </main>
  )
}
```

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
)
```

- [ ] **Step 6: Verify the foundation**

Run:

```powershell
npm.cmd run test
npm.cmd run build
```

Expected: Vitest reports one passing test and Vite produces `web/dist/`.

### Task 2: Define the practice catalog and local progress boundary

**Files:**
- Create: `web/src/domain/practice.ts`
- Create: `web/src/data/practiceCatalog.ts`
- Create: `web/src/data/practiceCatalog.test.ts`
- Create: `web/src/lib/progressStore.ts`
- Create: `web/src/lib/progressStore.test.ts`

**Interfaces:**
- Produces: `Practice`, `PracticeStep`, `UserProgress`, `practices`, `recommendedPractice`, `loadProgress()` and `recordCompletion()`.
- Consumed by: `HomePage`, `PracticePage`, `CompletionPage` and `App`.

- [ ] **Step 1: Write the catalog and persistence tests**

```ts
import { practices } from './practiceCatalog'

test('contains the five approved practices', () => {
  expect(practices.map((practice) => practice.id)).toEqual([
    'neck', 'shoulders', 'lower-back', 'desk-reset', 'evening-back'
  ])
})

test('every practice has a positive total duration', () => {
  practices.forEach((practice) => {
    expect(practice.steps.length).toBeGreaterThan(0)
    expect(practice.steps.reduce((sum, step) => sum + step.durationSeconds, 0)).toBeGreaterThan(0)
  })
})
```

```ts
import { loadProgress, recordCompletion } from './progressStore'

test('records the latest completion locally', () => {
  recordCompletion('neck', new Date('2026-07-10T10:00:00.000Z'))
  expect(loadProgress()).toEqual({
    completedCount: 1,
    lastPracticeId: 'neck',
    lastCompletedAt: '2026-07-10T10:00:00.000Z'
  })
})
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm.cmd run test`

Expected: module-resolution failures for `practiceCatalog` and `progressStore`.

- [ ] **Step 3: Implement domain types and the catalog**

```ts
export type PracticeStep = {
  id: string
  title: string
  instruction: string
  durationSeconds: number
}

export type Practice = {
  id: string
  title: string
  subtitle: string
  steps: PracticeStep[]
}

export type UserProgress = {
  completedCount: number
  lastPracticeId: string | null
  lastCompletedAt: string | null
}
```

Populate `practices` with the five approved IDs and Russian titles from the design specification. Each step must contain a title, a neutral wellness instruction and a positive duration. Set `recommendedPractice` to `practices[0]`. Keep all copy free of medical treatment or pain-relief claims.

- [ ] **Step 4: Implement safe local storage**

```ts
const progressKey = 'spine-flow.progress'

const emptyProgress: UserProgress = {
  completedCount: 0,
  lastPracticeId: null,
  lastCompletedAt: null
}

const safetyNoticeKey = 'spine-flow.safety-notice'

function isUserProgress(value: unknown): value is UserProgress {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.completedCount === 'number'
    && (typeof candidate.lastPracticeId === 'string' || candidate.lastPracticeId === null)
    && (typeof candidate.lastCompletedAt === 'string' || candidate.lastCompletedAt === null)
}

export function loadProgress(): UserProgress {
  try {
    const raw = window.localStorage.getItem(progressKey)
    if (raw === null) return emptyProgress
    const parsed: unknown = JSON.parse(raw)
    return isUserProgress(parsed) ? parsed : emptyProgress
  } catch {
    return emptyProgress
  }
}

export function recordCompletion(practiceId: string, completedAt = new Date()): UserProgress {
  const previous = loadProgress()
  const next: UserProgress = {
    completedCount: previous.completedCount + 1,
    lastPracticeId: practiceId,
    lastCompletedAt: completedAt.toISOString()
  }
  try {
    window.localStorage.setItem(progressKey, JSON.stringify(next))
  } catch {
    return next
  }
  return next
}

export function hasAcknowledgedSafetyNotice(): boolean {
  try {
    return window.localStorage.getItem(safetyNoticeKey) === 'true'
  } catch {
    return false
  }
}

export function acknowledgeSafetyNotice(): void {
  try {
    window.localStorage.setItem(safetyNoticeKey, 'true')
  } catch {
    return
  }
}
```

Implement `loadProgress` with `try/catch`, validate the three stored fields, and return `emptyProgress` when Safari storage is unavailable or invalid. `recordCompletion` must increment only after a valid prior load.

- [ ] **Step 5: Run the focused tests**

Run: `npm.cmd run test -- --run src/data/practiceCatalog.test.ts src/lib/progressStore.test.ts`

Expected: all catalog and persistence tests pass.

### Task 3: Implement the session timer and network-status hooks

**Files:**
- Create: `web/src/hooks/usePracticeSession.ts`
- Create: `web/src/hooks/usePracticeSession.test.tsx`
- Create: `web/src/hooks/useNetworkStatus.ts`
- Create: `web/src/hooks/useNetworkStatus.test.tsx`

**Interfaces:**
- Consumes: `Practice` from Task 2 and browser `online`/`offline` events.
- Produces: `usePracticeSession(practice)` and `useNetworkStatus()`.

- [ ] **Step 1: Write timer behaviour tests**

```tsx
import { act, renderHook } from '@testing-library/react'
import { usePracticeSession } from './usePracticeSession'

test('pauses without changing the remaining duration', () => {
  const { result } = renderHook(() => usePracticeSession({
    id: 'test', title: 'Тест', subtitle: '', steps: [
      { id: 'one', title: 'Шаг', instruction: 'Дышите спокойно.', durationSeconds: 60 }
    ]
  }))

  act(() => result.current.pause())
  const paused = result.current.remainingSeconds
  act(() => result.current.tick(Date.now() + 10_000))

  expect(result.current.remainingSeconds).toBe(paused)
})
```

- [ ] **Step 2: Implement the hook contract**

```ts
import { useRef, useState } from 'react'
import type { Practice, PracticeStep } from '../domain/practice'

export type PracticeSession = {
  currentStepIndex: number
  currentStep: PracticeStep
  remainingSeconds: number
  isPaused: boolean
  isComplete: boolean
  tick: (now: number) => void
  pause: () => void
  resume: () => void
  goBack: () => void
  goNext: () => void
}

export function usePracticeSession(practice: Practice): PracticeSession {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(practice.steps[0].durationSeconds)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const stepStartedAtRef = useRef(Date.now())

  const resetStep = (index: number) => {
    stepStartedAtRef.current = Date.now()
    setCurrentStepIndex(index)
    setRemainingSeconds(practice.steps[index].durationSeconds)
    setIsPaused(false)
  }

  const tick = (now: number) => {
    if (isPaused || isComplete) return
    const remaining = Math.max(0, practice.steps[currentStepIndex].durationSeconds - Math.floor((now - stepStartedAtRef.current) / 1000))
    setRemainingSeconds(remaining)
    if (remaining === 0) {
      if (currentStepIndex === practice.steps.length - 1) setIsComplete(true)
      else resetStep(currentStepIndex + 1)
    }
  }

  const goBack = () => { if (currentStepIndex > 0) resetStep(currentStepIndex - 1) }
  const goNext = () => {
    if (currentStepIndex === practice.steps.length - 1) setIsComplete(true)
    else resetStep(currentStepIndex + 1)
  }

  return {
    currentStepIndex,
    currentStep: practice.steps[currentStepIndex],
    remainingSeconds,
    isPaused,
    isComplete,
    tick,
    pause: () => setIsPaused(true),
    resume: () => { stepStartedAtRef.current = Date.now() - (practice.steps[currentStepIndex].durationSeconds - remainingSeconds) * 1000; setIsPaused(false) },
    goBack,
    goNext
  }
}
```

Use timestamp differences rather than decrementing a counter. `goBack` and `goNext` reset the new step timer; the final `goNext` sets `isComplete` to `true`. In `PracticePage`, use the following visibility listener so the next render recalculates time after Safari returns to the foreground:

```ts
useEffect(() => {
  const updateOnVisibility = () => session.tick(Date.now())
  document.addEventListener('visibilitychange', updateOnVisibility)
  return () => document.removeEventListener('visibilitychange', updateOnVisibility)
}, [session])
```

- [ ] **Step 3: Implement the network hook**

```ts
import { useEffect, useState } from 'react'

export function useNetworkStatus(): { isOnline: boolean; retry: () => void } {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const markOnline = () => setIsOnline(true)
    const markOffline = () => setIsOnline(false)
    window.addEventListener('online', markOnline)
    window.addEventListener('offline', markOffline)
    return () => {
      window.removeEventListener('online', markOnline)
      window.removeEventListener('offline', markOffline)
    }
  }, [])
  const retry = () => window.location.reload()
  return { isOnline, retry }
}
```

- [ ] **Step 4: Verify hook tests**

Run: `npm.cmd run test -- --run src/hooks`

Expected: pause, manual navigation, completion and network-event tests pass.

### Task 4: Build the iPhone-first interface

**Files:**
- Create: `web/src/components/SafetyNotice.tsx`
- Create: `web/src/components/NetworkBanner.tsx`
- Create: `web/src/components/PracticeCard.tsx`
- Create: `web/src/components/PoseIllustration.tsx`
- Create: `web/src/pages/HomePage.tsx`
- Create: `web/src/pages/PracticePage.tsx`
- Create: `web/src/pages/CompletionPage.tsx`
- Modify: `web/src/App.tsx`
- Modify: `web/src/styles.css`
- Create: `web/src/App.test.tsx`

**Interfaces:**
- Consumes: catalog, progress store and hooks from Tasks 2-3.
- Produces: home, practice and completion screens with accessible controls.

- [ ] **Step 1: Define the screen state and app composition**

```ts
type Screen =
  | { name: 'home' }
  | { name: 'practice'; practiceId: string }
  | { name: 'completion'; practiceId: string }
```

`App` loads progress once, owns the active `Screen`, presents `SafetyNotice` until acknowledged, shows `NetworkBanner` after the page has loaded and the browser reports offline, and passes callbacks to each page.

- [ ] **Step 2: Write a user-path component test**

```tsx
test('opens and completes the recommended practice', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: 'Продолжить' }))
  await user.click(screen.getByRole('button', { name: /5 минут для шеи/i }))
  expect(screen.getByRole('heading', { name: 'Подготовка' })).toBeInTheDocument()
})
```

- [ ] **Step 3: Implement the components**

`HomePage` renders the heading “Spine Flow”, the “Сегодня” section and all five practice cards. `PracticePage` renders progress as “Шаг X из Y”, line-art illustration, current instruction, a `mm:ss` timer, previous, pause/resume and next controls. Use `ChevronLeft`, `ChevronRight`, `Pause`, `Play` and `X` from `lucide-react` inside icon buttons with Russian `aria-label` values. `CompletionPage` renders “Практика завершена” and a single “Готово” button.

`PoseIllustration` uses CSS and Lucide icons as a consistent abstract line-art treatment; do not use stock photos or SVG files supplied by third parties. Card corners must be 8px or less; the page itself is not a floating card.

- [ ] **Step 4: Implement the mobile CSS**

Use custom properties for a light neutral canvas, warm green `#39745C`, muted coral `#D97962`, near-black text `#1F2723`, 8px spacing increments, and `env(safe-area-inset-top)`/`env(safe-area-inset-bottom)`. Set a `max-width` of 480px for the app content, preserve a full-width background, and prevent viewport-height jumps with `min-height: 100dvh`.

- [ ] **Step 5: Run UI tests and the production build**

Run:

```powershell
npm.cmd run test
npm.cmd run build
```

Expected: component tests pass and `web/dist/` is generated.

### Task 5: Add iPhone install metadata and network behaviour

**Files:**
- Modify: `web/index.html`
- Create: `web/public/manifest.webmanifest`
- Create: `web/public/icons/icon-180.png`
- Create: `web/public/icons/icon-192.png`
- Create: `web/public/icons/icon-512.png`

**Interfaces:**
- Produces: standalone display metadata and correctly sized app icons.
- Consumed by: Safari when the user adds the site to the Home Screen.

- [ ] **Step 1: Add the manifest**

```json
{
  "name": "Spine Flow",
  "short_name": "Spine Flow",
  "lang": "ru",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F7F5F0",
  "theme_color": "#F7F5F0",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 2: Add the Safari metadata to `index.html`**

```html
<meta name="theme-color" content="#F7F5F0" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Spine Flow" />
<link rel="apple-touch-icon" href="/icons/icon-180.png" />
<link rel="manifest" href="/manifest.webmanifest" />
```

- [ ] **Step 3: Create the icon set**

Generate one square raster icon: a warm green line-art figure in a calm seated pose on a light neutral background, without text. Export it as exact 180x180, 192x192 and 512x512 PNG files to the planned paths. Verify each image opens and has the named dimensions.

- [ ] **Step 4: Verify the built metadata**

Run:

```powershell
npm.cmd run build
Get-ChildItem dist\icons\icon-180.png, dist\icons\icon-192.png, dist\icons\icon-512.png
```

Expected: the manifest and all three icons are present in `web/dist/`.

### Task 6: Run browser-level verification and prepare a deployable artifact

**Files:**
- Create: `web/playwright.config.ts`
- Create: `web/e2e/spine-flow.spec.ts`
- Create: `web/README.md`

**Interfaces:**
- Consumes: built UI and accessibility labels from Tasks 1-5.
- Produces: repeatable local browser tests and documented deployment prerequisites.

- [ ] **Step 1: Add the primary browser test**

```ts
import { expect, test } from '@playwright/test'

test('user completes a practice and sees progress on the home screen', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Продолжить' }).click()
  await page.getByRole('button', { name: /5 минут для шеи/i }).click()
  await page.getByRole('button', { name: 'Следующий шаг' }).click()
  await page.getByRole('button', { name: 'Следующий шаг' }).click()
  await page.getByRole('button', { name: 'Следующий шаг' }).click()
  await page.getByRole('button', { name: 'Следующий шаг' }).click()
  await page.getByRole('button', { name: 'Следующий шаг' }).click()
  await page.getByRole('button', { name: 'Готово' }).click()
  await expect(page.getByText('Завершено: 1')).toBeVisible()
})
```

- [ ] **Step 2: Configure Playwright to start Vite**

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://127.0.0.1:4173' },
  webServer: { command: 'npm run dev -- --host 127.0.0.1 --port 4173', port: 4173 }
})
```

- [ ] **Step 3: Run all automated checks**

Run:

```powershell
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

Expected: unit tests, production build and Playwright test all pass.

- [ ] **Step 4: Run visual checks at phone dimensions**

Run the local server and inspect screenshots at 375x667 and 393x852. Confirm that all text fits, controls remain visible above the safe-area inset, no element overlaps and the practice screen is usable without horizontal scrolling.

- [ ] **Step 5: Document the handoff**

Create `web/README.md` with the exact local commands, a description of `web/dist/` as the static deployment artifact, and these deployment prerequisites: an HTTPS host, the owner’s Vercel account, and a manual Safari “На экран «Домой»” check. Do not deploy from this task.

## Plan Self-Review

- Spec coverage: Tasks 1-6 cover the React/Vite SPA, embedded five-practice catalog, local progress, safety notice, timer, online-only network handling, iPhone visual constraints, install metadata, tests and deploy preparation.
- Scope: the plan introduces no backend, service worker, offline cache, analytics, accounts, payments, notifications, App Store work or external deployment.
- Consistency: the storage keys and screen ownership are defined before the components that consume them; manual network testing is limited to loss of connectivity after a successful load.
- Execution constraint: automated checks run on Windows. The final Safari standalone check needs a physical iPhone after the owner explicitly authorizes HTTPS deployment.
