# Spine Flow Covers, Core Practice and Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить цветные обложки практик, вторую среднюю практику «12 минут: кор и спина», полное отображение фигуры и мягкую смену изображений без пустого кадра.

**Architecture:** `Practice` хранит обязательную обложку, а каталог остаётся единственным источником состава и длительности практик. `PoseIllustration` отвечает только за соответствие шага изображению, новый `CrossfadePoseIllustration` управляет предзагрузкой и сменой слоёв. Домашний экран использует обложки напрямую, поэтому миниатюры больше не зависят от fallback-позы.

**Tech Stack:** React 19, TypeScript 7, Vite 8, CSS, Vitest, Testing Library, Playwright.

## Global Constraints

- Интерфейс рассчитан на iPhone от 320px; основная визуальная проверка выполняется при 375px.
- Девушка, мат и опорная стена должны помещаться целиком; `object-fit: contain` обязателен на экране упражнения.
- Crossfade длится около 180ms и меняет только `opacity`; размеры визуального блока не меняются.
- При `prefers-reduced-motion: reduce` смена изображения выполняется без анимации.
- Новая библиотека анимаций не добавляется.
- Все изображения локальные; приложение по-прежнему требует интернет для загрузки сайта.
- Текущие таймер, пауза, завершение, прогресс, footer и safety notice не меняют поведение.

---

### Task 1: Обложки как часть модели практики

**Files:**
- Modify: `web/src/domain/practice.ts`
- Modify: `web/src/data/practiceCatalog.ts`
- Modify: `web/src/data/practiceCatalog.test.ts`

**Interfaces:**
- Produces: `Practice.coverImage: string` для всех записей каталога.
- Produces: практика `id: 'core-back'`, `level: 'intermediate'`, 9 шагов, 720 секунд.

- [ ] **Step 1: Write the failing catalog tests**

Добавить проверки:

```ts
it('assigns a local cover to every practice', () => {
  expect(practices.every((practice) => practice.coverImage.startsWith('/images/'))).toBe(true)
})

it('contains two intermediate practices including the 12 minute core practice', () => {
  const intermediate = getPracticesByLevel('intermediate')
  const core = intermediate.find((practice) => practice.id === 'core-back')
  expect(intermediate).toHaveLength(2)
  expect(core?.steps).toHaveLength(9)
  expect(core?.steps.reduce((sum, step) => sum + step.durationSeconds, 0)).toBe(720)
})
```

- [ ] **Step 2: Verify the tests fail**

Run: `cd web && npm.cmd test -- src/data/practiceCatalog.test.ts`

Expected: FAIL because `coverImage` and `core-back` do not exist.

- [ ] **Step 3: Extend the model and catalog**

Add to `Practice`:

```ts
readonly coverImage: string
```

Assign the seven approved covers and add `core-back` with these exact steps:

```ts
[
  ['core-preparation', 'Подготовка', 30],
  ['core-cat-cow', 'Кошка-корова', 90],
  ['core-dead-bug', 'Dead bug', 120],
  ['core-bird-dog', 'Птица-собака', 120],
  ['core-bridge-march', 'Ягодичный мост с шагами', 120],
  ['core-side-plank-right', 'Боковая планка справа с колен', 60],
  ['core-side-plank-left', 'Боковая планка слева с колен', 60],
  ['core-child-pose', 'Поза ребёнка', 90],
  ['core-rest', 'Отдых', 30],
]
```

Каждая инструкция описывает технику, дыхание и допустимое ощущение без медицинских обещаний.

- [ ] **Step 4: Verify catalog tests pass**

Run: `cd web && npm.cmd test -- src/data/practiceCatalog.test.ts`

Expected: PASS.

### Task 2: Цветные обложки на домашнем экране

**Files:**
- Modify: `web/src/pages/HomePage.tsx`
- Modify: `web/src/components/PracticeCard.tsx`
- Modify: `web/src/styles.css`
- Modify: `web/src/App.test.tsx`

**Interfaces:**
- Consumes: `Practice.coverImage`.
- Produces: featured `img.featured-cover` и thumbnail `img.practice-cover`.

- [ ] **Step 1: Write failing rendering tests**

Проверить, что featured и строка библиотеки получают `src` из соответствующей практики, а средний уровень показывает «Сегодня», «Все практики» и `12 минут: кор и спина`.

```ts
expect(screen.getByRole('img', { name: /обложка практики/i })).toHaveAttribute('src', recommended.coverImage)
expect(screen.getByText('12 минут: кор и спина')).toBeInTheDocument()
```

- [ ] **Step 2: Verify tests fail**

Run: `cd web && npm.cmd test -- src/App.test.tsx`

Expected: FAIL because generic `PoseIllustration` is still used.

- [ ] **Step 3: Render practice-specific covers**

Replace generic illustrations with semantic images:

```tsx
<img className="featured-cover" src={recommendedPractice.coverImage} alt={`Обложка практики «${recommendedPractice.title}»`} />
```

```tsx
<span className="practice-thumb" aria-hidden="true">
  <img className="practice-cover" src={practice.coverImage} alt="" />
</span>
```

Use `object-fit: cover` only for cover crops, preserve the existing 8px card radius and circular thumbnails.

- [ ] **Step 4: Run component tests**

Run: `cd web && npm.cmd test -- src/App.test.tsx src/pages/LevelSelectPage.test.tsx`

Expected: PASS.

### Task 3: Полнофигурные изображения второй средней практики

**Files:**
- Create: `web/public/images/core-preparation.png`
- Create: `web/public/images/core-cat-cow.png`
- Create: `web/public/images/core-dead-bug.png`
- Create: `web/public/images/core-bird-dog.png`
- Create: `web/public/images/core-bridge-march.png`
- Create: `web/public/images/core-side-plank-right.png`
- Create: `web/public/images/core-side-plank-left.png`
- Create: `web/public/images/core-child-pose.png`
- Create: `web/public/images/core-rest.png`
- Modify: `web/src/components/PoseIllustration.tsx`
- Modify: `web/src/styles.css`

**Interfaces:**
- Produces: mapping каждого `core-*` ID на отдельный PNG.

- [ ] **Step 1: Generate the nine assets**

Use the installed `imagegen` skill. Keep one consistent young adult athletic woman, natural sage/coral/blue palette, 3:4 composition, exact exercise pose, full body plus mat/wall inside frame, generous safe margin, no text, watermark, collage, duplicated limb or cropped anatomy.

- [ ] **Step 2: Inspect every generated image before integration**

Open all nine files at original detail. Reject and regenerate any asset where head, hands, feet, mat or required support is cropped, or where pose does not match its step.

- [ ] **Step 3: Add exact mappings**

Extend `stepImage` with all nine `/images/core-*.png` paths. Remove `groundedStepIds` and `pose-image-grounded` if `contain` makes these offsets obsolete.

- [ ] **Step 4: Make exercise framing non-cropping**

Set the exercise-specific rule:

```css
.practice-visual .pose-image {
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}
```

Do not change cover-image cropping rules.

### Task 4: Мягкая смена изображений

**Files:**
- Create: `web/src/components/CrossfadePoseIllustration.tsx`
- Create: `web/src/components/CrossfadePoseIllustration.test.tsx`
- Modify: `web/src/pages/PracticePage.tsx`
- Modify: `web/src/styles.css`

**Interfaces:**
- Consumes: `stepId: string` and the same image resolver as `PoseIllustration`.
- Produces: two stable image layers; previous remains visible until next `onLoad`.

- [ ] **Step 1: Write failing transition tests**

Test that changing `stepId` retains the old visible layer until the new image emits `load`, then activates the new layer; an `error` leaves the previous layer visible.

- [ ] **Step 2: Verify tests fail**

Run: `cd web && npm.cmd test -- src/components/CrossfadePoseIllustration.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement preload and stale-event protection**

Use React state for `visibleStepId` and `pendingStepId`. Render the visible and pending images absolutely; only promote a pending ID when its own `onLoad` fires. Ignore late events whose ID no longer equals the current pending ID. On error, clear only that pending request.

- [ ] **Step 4: Add state-only CSS motion**

```css
.pose-layer { position: absolute; inset: 0; opacity: 0; transition: opacity 180ms cubic-bezier(.22, 1, .36, 1); }
.pose-layer-active { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .pose-layer { transition: none; } }
```

- [ ] **Step 5: Integrate and run tests**

Replace only the exercise-screen illustration in `PracticePage`. Run:

`cd web && npm.cmd test -- src/components/CrossfadePoseIllustration.test.tsx src/App.test.tsx`

Expected: PASS.

### Task 5: Full verification and visual acceptance

**Files:**
- Modify: `web/e2e/app.spec.ts`
- Modify: `.agent-work/tasks/todo.md`

**Interfaces:**
- Verifies: all seven covers, two intermediate practices, 9 core steps, non-cropping and stable transitions.

- [ ] **Step 1: Extend E2E coverage**

Assert the two intermediate cards, open `core-back`, navigate all nine steps, verify each expected `src`, step counter and final completion. Check computed `object-fit` equals `contain` on exercise images.

- [ ] **Step 2: Run automated verification**

Run:

```powershell
cd web
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Expected: all unit tests and E2E tests PASS; TypeScript and Vite build exit 0.

- [ ] **Step 3: Perform browser visual inspection**

At 375x812 inspect beginner and intermediate home screens plus every exercise image. Confirm no body part is cropped, thumbnails are readable, footer does not overlap content, image block does not shift, and rapid next/back navigation never flashes blank.

- [ ] **Step 4: Check reduced motion and narrow iPhone**

At 320px verify text containment and safe areas. Emulate reduced motion and verify image replacement has no transition while navigation remains functional.

- [ ] **Step 5: Update task memory**

Mark implementation, test, build, E2E and visual checks complete in `.agent-work/tasks/todo.md`, recording any genuine residual risk. Do not deploy or commit without a separate user command.
