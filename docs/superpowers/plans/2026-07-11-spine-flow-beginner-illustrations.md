# Spine Flow Beginner Illustrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Показать отдельную цветную иллюстрацию, точно соответствующую каждому этапу пяти практик начинающего уровня.

**Architecture:** Каталог получает уникальные ID шагов для начинающих практик. `PoseIllustration` сопоставляет каждый ID с локальным PNG; данные и компонент остаются единственными источниками истины для экранов упражнений. E2E проходит все шаги и проверяет фактический `src` изображения.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Playwright, imagegen.

## Global Constraints

- Для каждого этапа начинающего уровня используется отдельная локальная PNG-иллюстрация молодой совершеннолетней спортивной девушки.
- Кадры вертикальные 3:4, без текста, логотипов, медицинских символов и неуместного инвентаря.
- Средняя практика, её девять ID и текущие изображения не меняются.
- Никаких backend, аккаунтов, уведомлений, нового уровня сложности или медицинских обещаний.
- Коммиты, push и deploy не выполняются без отдельного разрешения владельца.

---

## File Structure

- Modify: `web/src/data/practiceCatalog.ts` — уникальные ID шагов начинающего уровня.
- Modify: `web/src/data/practiceCatalog.test.ts` — инвариант уникальности ID и неизменные длительности практик.
- Create: 19 PNG в `web/public/images` — один файл на каждый ID начинающего уровня.
- Modify: `web/src/components/PoseIllustration.tsx` — явная таблица сопоставления начинающих и средних шагов.
- Modify: `web/e2e/spine-flow.spec.ts` — прохождение и проверка `src` всех изображений начинающих практик.

### Task 1: Уникальные ID этапов начинающего уровня

**Files:**
- Modify: `web/src/data/practiceCatalog.ts`
- Modify: `web/src/data/practiceCatalog.test.ts`

**Interfaces:**
- Produces globally unique `PracticeStep.id` values for all practices.
- Preserves `getPracticesByLevel`, `findPractice`, timings, copy and intermediate IDs.

- [ ] **Step 1: Add a failing uniqueness test.**

```ts
test('uses a unique step ID for every catalog illustration', () => {
  const stepIds = practices.flatMap((practice) => practice.steps.map((step) => step.id))
  expect(new Set(stepIds).size).toBe(stepIds.length)
})
```

- [ ] **Step 2: Verify RED.**

Run from `web`:

```powershell
npm.cmd run test -- src/data/practiceCatalog.test.ts
```

Expected: FAIL because current shared IDs `start`, `rest`, `turn` and `breath` repeat across practices.

- [ ] **Step 3: Rename only beginner IDs in the catalogue.**

Use these exact mappings, leaving instruction text and duration unchanged:

```text
neck: breath -> neck-preparation, right -> neck-right-tilt, left -> neck-left-tilt,
turn -> neck-turns, lengthen -> neck-lengthen, rest -> neck-rest
shoulders: start -> shoulders-preparation, lift -> shoulders-lift,
circles -> shoulders-circles, open -> shoulders-open-chest
lower-back: start -> lower-back-preparation, pelvis -> lower-back-pelvis,
rest -> lower-back-rest
desk-reset: start -> desk-reset-preparation, side -> desk-reset-side-stretch,
turn -> desk-reset-torso-turn
evening-back: breath -> evening-back-breath, rest -> evening-back-rest,
finish -> evening-back-finish
```

- [ ] **Step 4: Verify GREEN.**

Run the focused test, then:

```powershell
npm.cmd run test
npm.cmd run build
```

Expected: all unit tests pass and TypeScript emits no errors.

### Task 2: Цветные изображения начинающего уровня

**Files:**
- Create: `web/public/images/neck-preparation-color.png`, `neck-right-tilt-color.png`, `neck-left-tilt-color.png`, `neck-turns-color.png`, `neck-lengthen-color.png`, `neck-rest-color.png`
- Create: `web/public/images/shoulders-preparation-color.png`, `shoulders-lift-color.png`, `shoulders-circles-color.png`, `shoulders-open-chest-color.png`
- Create: `web/public/images/lower-back-preparation-color.png`, `lower-back-pelvis-color.png`, `lower-back-rest-color.png`
- Create: `web/public/images/desk-reset-preparation-color.png`, `desk-reset-side-stretch-color.png`, `desk-reset-torso-turn-color.png`
- Create: `web/public/images/evening-back-breath-color.png`, `evening-back-rest-color.png`, `evening-back-finish-color.png`

**Interfaces:**
- Produces exactly one readable 3:4 PNG per unique beginner-step ID.
- Each asset is self-contained under `web/public/images`.

- [ ] **Step 1: Generate the neck and shoulder series with imagegen.**

Use a single consistent art direction: `young athletic adult woman, modest contemporary fitness outfit, premium wellness editorial illustration, full body or movement-appropriate composition, vertical 3:4, pale sage studio background, subject centered, no text, no logo`.

Generate and save one file for each exact pose: neutral standing preparation, right neck tilt, left neck tilt, head turn, tall crown-lengthening stance, neutral rest; seated preparation, shoulder lift, backward shoulder circles, and chest opening with arms softly behind the body.

- [ ] **Step 2: Generate the lower-back, desk-reset and evening-back series with imagegen.**

Use the same art direction, with muted coral for lower back, pale blue for desk reset, and soft lilac for evening back. Generate the exact poses from the approved design: lying preparation, pelvic tilt, lying rest; standing preparation, side stretch, torso turn; lying breathing, lying rest, and a comfortable seated finish.

- [ ] **Step 3: Verify every asset is present and decodable.**

Run from `web`:

```powershell
Get-ChildItem public\images\*-color.png | Select-Object Name,Length
```

Expected: 19 files, each with a nonzero length. Inspect a generated contact sheet or each image before accepting the batch; reject any frame whose pose does not match its step.

### Task 3: Сопоставление изображений и сквозная проверка

**Files:**
- Modify: `web/src/components/PoseIllustration.tsx`
- Modify: `web/e2e/spine-flow.spec.ts`

**Interfaces:**
- `PoseIllustration({ stepId })` maps every unique beginner ID to its `*-color.png` path and retains all current intermediate mappings.
- E2E verifies all image paths through the actual user interface.

- [ ] **Step 1: Add mapping coverage to the browser test.**

Create a `beginnerPractices` test table with the following practice selectors and ordered assets:

```ts
const beginnerPractices = [
  { title: '5 минут для шеи', images: ['neck-preparation-color.png', 'neck-right-tilt-color.png', 'neck-left-tilt-color.png', 'neck-turns-color.png', 'neck-lengthen-color.png', 'neck-rest-color.png'] },
  { title: '7 минут для плеч', images: ['shoulders-preparation-color.png', 'shoulders-lift-color.png', 'shoulders-circles-color.png', 'shoulders-open-chest-color.png'] },
  { title: '10 минут для поясницы', images: ['lower-back-preparation-color.png', 'lower-back-pelvis-color.png', 'lower-back-rest-color.png'] },
  { title: '12 минут после дня за столом', images: ['desk-reset-preparation-color.png', 'desk-reset-side-stretch-color.png', 'desk-reset-torso-turn-color.png'] },
  { title: '15 минут вечернего расслабления спины', images: ['evening-back-breath-color.png', 'evening-back-rest-color.png', 'evening-back-finish-color.png'] },
]
```

For each row, choose `Начинающий`, open the practice by its title, assert each `src` in order, click `Следующий шаг` between entries, then close the practice.

- [ ] **Step 2: Verify RED.**

Run from `web`:

```powershell
npm.cmd run test:e2e -- --grep "beginner practice illustrations"
```

Expected: FAIL because the current mapping still points beginner IDs to generic neck images.

- [ ] **Step 3: Add explicit pose mappings.**

Add the 19 explicit `stepImage` entries using the unique IDs and exact `*-color.png` filenames. Preserve the existing intermediate entries and fallback behavior.

- [ ] **Step 4: Verify complete behavior and visual output.**

Run from `web`:

```powershell
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

Then capture 375px screenshots for a neck tilt, a shoulder movement, a lower-back movement, a desk-reset movement and evening rest. Confirm the visible pose matches the instruction and that timer, text and controls do not overlap.

## Self-Review

- Spec coverage: Task 1 implements data identity; Task 2 provides all approved color assets; Task 3 maps and proves every image through the actual practice UI.
- Scope: no user flow, timer, progress, intermediate content, server capability or deployment behavior changes.
- Type consistency: every new step ID appears once in the catalogue and once in the mapping, while test tables use the same filenames.
- Placeholder scan: all asset paths, IDs, poses and commands are explicit.
