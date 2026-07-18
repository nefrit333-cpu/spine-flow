# Gym Warmup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a third intermediate practice, «15 минут: разминка в спортзале», with fifteen one-minute dynamic bodyweight steps and presenter-specific gym images.

**Architecture:** The existing catalog drives the full practice flow. A `gym-warmup` record supplies copy and timing, while `getStepImage(stepId, presenter)` resolves the related WebP asset. Existing home, timer, routing and completion components require no new API.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Playwright, WebP assets.

## Global Constraints

- The practice is the third intermediate entry; existing practices are not altered.
- It has exactly 15 steps of 60 seconds, totaling 900 seconds.
- It has no «Подготовка» or «Завершение практики» step.
- It uses only dynamic bodyweight movements, without static holds, equipment or medical claims.
- Every step has a female and male WebP image with a full body, fixed appearance and clothing, green mat and bright gym background.

---

### Task 1: Create and verify the gym image set

**Files:**
- Create: `web/public/images/female/gym-warmup-*.webp`
- Create: `web/public/images/male/gym-warmup-*.webp`
- Modify: `web/src/data/presenterAssetCoverage.test.ts`

**Interfaces:**
- Consumes: `getStepImage(stepId, presenter): string` from `web/src/components/PoseIllustration.tsx`.
- Produces: all `/images/{female|male}/gym-warmup-*.webp` paths.

- [ ] **Step 1: Generate and approve fixed reference frames**

Use the approved female and male presenter images as references. For both, use a bright modern gym, pale warm-gray wall, matte rubber floor, softly blurred rack and mirror, muted green mat, no text or logos, and a full 3:4 portrait body. Keep the existing female white top/dark teal leggings and male sage t-shirt/black shorts unchanged.

- [ ] **Step 2: Generate the movement images**

Create one WebP for each presenter and each exact ID below. The image must visibly show the movement and fully include person and mat.

```text
gym-warmup-march               marching in place with alternating arm swing
gym-warmup-neck-turns          controlled head turn, shoulders level
gym-warmup-shoulder-shrugs     shoulders lifted toward ears
gym-warmup-shoulder-circles    large backward shoulder circle
gym-warmup-arm-swings          arms opening and crossing at chest height
gym-warmup-chest-open          straight arms moving behind torso
gym-warmup-arm-circles         straight arms making circles
gym-warmup-torso-turns         torso turning with feet forward
gym-warmup-hip-hinge-reach     hips back, long spine, arms forward
gym-warmup-hip-circles         hands on hips, controlled pelvic circle
gym-warmup-hip-openers         raised knee opening to side
gym-warmup-leg-swings          supported front-to-back leg swing
gym-warmup-side-lunge-warmup   lateral lunge with hips back
gym-warmup-reverse-lunge-reach reverse lunge with overhead reach
gym-warmup-squat-calf-raise    rising from shallow squat onto toes
```

- [ ] **Step 3: Add the failing asset test**

Add this test to `web/src/data/presenterAssetCoverage.test.ts` before adding catalog data:

```ts
test('has gym warmup images for both presenters', () => {
  const ids = ['gym-warmup-march', 'gym-warmup-neck-turns', 'gym-warmup-shoulder-shrugs', 'gym-warmup-shoulder-circles', 'gym-warmup-arm-swings', 'gym-warmup-chest-open', 'gym-warmup-arm-circles', 'gym-warmup-torso-turns', 'gym-warmup-hip-hinge-reach', 'gym-warmup-hip-circles', 'gym-warmup-hip-openers', 'gym-warmup-leg-swings', 'gym-warmup-side-lunge-warmup', 'gym-warmup-reverse-lunge-reach', 'gym-warmup-squat-calf-raise']
  const missing = ids.flatMap((id) => presenters.map((presenter) => `public${getStepImage(id, presenter)}`).filter((path) => !existsSync(resolve(path))))
  expect(missing).toEqual([])
})
```

- [ ] **Step 4: Verify and commit the asset set**

Run: `cd web; npm.cmd test -- presenterAssetCoverage.test.ts`

Expected: PASS. Then commit only the 30 WebP files and the coverage test.

### Task 2: Add the catalog record and enforce its contract

**Files:**
- Modify: `web/src/data/practiceCatalog.ts`
- Modify: `web/src/data/practiceCatalog.test.ts`

**Interfaces:**
- Consumes: `Practice` from `web/src/domain/practice.ts`.
- Produces: `findPractice('gym-warmup')` and three entries from `getPracticesByLevel('intermediate')`.

- [ ] **Step 1: Add a failing contract test**

Add this test to `web/src/data/practiceCatalog.test.ts` and change existing intermediate-count checks from `2` to `3`:

```ts
test('contains the approved fifteen-minute gym warmup without boundary steps', () => {
  const practice = practices.find((item) => item.id === 'gym-warmup')
  expect(practice).toMatchObject({ level: 'intermediate', title: '15 минут: разминка в спортзале', subtitle: 'Динамическая подготовка перед тренировкой', accent: 'sage' })
  expect(practice?.steps).toHaveLength(15)
  expect(practice?.steps.every((step) => step.durationSeconds === 60)).toBe(true)
  expect(practice?.steps.reduce((sum, step) => sum + step.durationSeconds, 0)).toBe(900)
  expect(practice?.steps.map((step) => step.title)).not.toEqual(expect.arrayContaining(['Подготовка', 'Завершение практики']))
})
```

Replace the global boundary assertion with:

```ts
for (const practice of practices.filter((item) => item.id !== 'gym-warmup')) {
  expect(practice.steps[0]).toMatchObject({ title: 'Подготовка', durationSeconds: 30 })
  expect(practice.steps.at(-1)).toMatchObject({ title: 'Завершение практики' })
}
```

- [ ] **Step 2: Run the failing test**

Run: `cd web; npm.cmd test -- practiceCatalog.test.ts`

Expected: FAIL because `gym-warmup` does not yet exist.

- [ ] **Step 3: Append the catalog record after `core-back`**

Add a `Practice` record with ID `gym-warmup`, title `15 минут: разминка в спортзале`, subtitle `Динамическая подготовка перед тренировкой`, accent `sage`, cover path `/images/gym-warmup-march.webp`, and the fifteen ordered IDs from Task 1. Every step has `durationSeconds: 60` and this exact title order:

```text
Ходьба на месте с махами рук
Повороты головы
Подъёмы и опускания плеч
Круги плечами
Маятник руками
Раскрытие груди
Круги прямыми руками
Повороты корпуса
Наклон с вытяжением рук
Круги тазом
Раскрытие бедра стоя
Махи ногой вперёд и назад
Боковые выпады
Обратные выпады с подъёмом рук
Приседание с подъёмом на носки
```

Instructions describe posture, control and the 30-second side switch for hip openers and leg swings. They contain no diagnosis, rehabilitation claim or named set.

- [ ] **Step 4: Verify and commit catalog changes**

Run: `cd web; npm.cmd test -- practiceCatalog.test.ts`

Expected: PASS. Commit `web/src/data/practiceCatalog.ts` and `web/src/data/practiceCatalog.test.ts`.

### Task 3: Cover navigation and presenter switching in Playwright

**Files:**
- Modify: `web/e2e/spine-flow.spec.ts`

**Interfaces:**
- Consumes: `#/home/intermediate` and `#/practice/intermediate/gym-warmup`.
- Produces: browser proof that the practice opens with the selected presenter's image.

- [ ] **Step 1: Add the failing female scenario**

```ts
test('opens the gym warmup with presenter-specific images', async ({ page }) => {
  await page.goto('/#/home/intermediate')
  await page.getByRole('button', { name: /15 минут: разминка в спортзале/i }).click()
  await expect(page.getByText('Шаг 1 из 15')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Ходьба на месте с махами рук' })).toBeVisible()
  await expect(page.locator('.practice-visual img')).toHaveAttribute('src', '/images/female/gym-warmup-march.webp')
  await page.getByRole('button', { name: 'Следующий шаг' }).click()
  await expect(page.locator('.practice-visual img')).toHaveAttribute('src', '/images/female/gym-warmup-neck-turns.webp')
})
```

- [ ] **Step 2: Run the new scenario before catalog integration**

Run: `cd web; npx.cmd playwright test spine-flow.spec.ts --grep "gym warmup"`

Expected: FAIL before Task 2, PASS after Tasks 1 and 2.

- [ ] **Step 3: Add a male assertion**

Use the project’s existing presenter-selection helper before opening the route, then assert:

```ts
await expect(page.locator('.practice-visual img')).toHaveAttribute('src', '/images/male/gym-warmup-march.webp')
```

- [ ] **Step 4: Run full validation and capture visual evidence**

Run:

```powershell
cd web
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Expected: all checks pass. Capture 375 px screenshots of the first and a lower-body step for each presenter. Confirm full body, mat and gym background remain visible, text does not overlap the visual block, and the practice top bar respects the iPhone safe area.

- [ ] **Step 5: Request visual approval, then publish**

Show the user the images or a contact sheet and the two mobile screenshots. After explicit approval, commit the Playwright test and any visual correction, push the branch, and run:

```powershell
cd web
npx.cmd vercel --prod -y
```

Expected: Vercel reports a ready production deployment; report `https://spine-flow-yoga.vercel.app` without fetching it from the terminal.
