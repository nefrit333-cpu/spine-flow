# iPhone Practice Safe Area Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Убрать пересечение статусной строки iPhone с шапкой установленного PWA на экране практики.

**Architecture:** `.practice-page` получает CSS-переменную безопасного верхнего отступа. Она объединяет `env(safe-area-inset-top)` и минимум `84px`, поэтому шапка остаётся ниже системной строки, даже когда Safari возвращает небольшой inset. Playwright фиксирует контракт на трёх iPhone-ширинах.

**Tech Stack:** React 19, TypeScript, Vite, CSS, Playwright, Vitest.

## Global Constraints

- Менять только `web/src/styles.css` и `web/e2e/spine-flow.spec.ts`.
- Не менять практики, изображения, маршрутизацию, таймер, PWA-манифест и localStorage.
- Использовать `env(safe-area-inset-top)` вместе с минимальным верхним отступом `84px`.
- Проверить ширины 375, 390 и 430 px.

---

### Task 1: Зафиксировать контракт верхней safe area

**Files:**
- Modify: `web/e2e/spine-flow.spec.ts`

**Interfaces:**
- Consumes: маршрут `/#/practice/intermediate/gym-warmup`, `aria-label` `Закрыть практику` и текст `Шаг 1 из 15`.
- Produces: e2e-контракт, требующий верхний отступ экрана практики не меньше `84px` и видимость шапки на iPhone-ширинах.

- [ ] **Step 1: Добавить падающий тест**

Добавить в `web/e2e/spine-flow.spec.ts`:

```ts
for (const width of [375, 390, 430]) {
  test(`keeps the practice header below the iPhone status area at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.addInitScript(() => {
      localStorage.setItem('spine-flow-presenter', 'female')
      localStorage.setItem('spine-flow.safety', 'true')
    })
    await page.goto('/#/practice/intermediate/gym-warmup')

    const practicePage = page.locator('.practice-page')
    const closeButton = page.getByRole('button', { name: 'Закрыть практику' })
    const stepLabel = page.getByText('Шаг 1 из 15', { exact: true })

    await expect(practicePage).toBeVisible()
    await expect.poll(() => practicePage.evaluate((element) => (
      Number.parseFloat(getComputedStyle(element).paddingTop)
    ))).toBeGreaterThanOrEqual(84)
    await expectInViewport(page, closeButton)
    await expectInViewport(page, stepLabel)

    for (const locator of [closeButton, stepLabel]) {
      const box = await locator.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.y).toBeGreaterThanOrEqual(84)
    }
  })
}
```

- [ ] **Step 2: Запустить тест и подтвердить исходную проблему**

Run: `cd web; npx.cmd playwright test spine-flow.spec.ts --grep "keeps the practice header below"`

Expected: FAIL, текущий `padding-top` `.practice-page` равен `56px`.

### Task 2: Ввести минимальный отступ шапки практики

**Files:**
- Modify: `web/src/styles.css:14`
- Test: `web/e2e/spine-flow.spec.ts`

**Interfaces:**
- Consumes: текущий класс `.practice-page` на корневом элементе экрана практики.
- Produces: CSS-переменную `--practice-safe-top` и шапку, визуально изолированную от системной строки.

- [ ] **Step 1: Заменить правило верхнего отступа**

Заменить начало существующего правила `.practice-page` на:

```css
.practice-page {
  --practice-safe-top: max(84px, calc(env(safe-area-inset-top) + 20px));
  display: flex;
  flex-direction: column;
  padding-top: var(--practice-safe-top);
}
```

Остальную часть правила `.practice-page` не менять.

- [ ] **Step 2: Запустить новый e2e-тест**

Run: `cd web; npx.cmd playwright test spine-flow.spec.ts --grep "keeps the practice header below"`

Expected: PASS, 3 passed.

- [ ] **Step 3: Проверить полный набор тестов и production-сборку**

Run: `cd web; npm.cmd test; npm.cmd run build; npm.cmd run test:e2e`

Expected: все команды завершаются с кодом `0`.

- [ ] **Step 4: Проверить изменения перед коммитом**

Run: `git diff --check; git status --short`

Expected: изменены только `web/src/styles.css`, `web/e2e/spine-flow.spec.ts` и этот план.

- [ ] **Step 5: Запросить проверку на реальном iPhone**

Публиковать только после отдельного разрешения пользователя. На установленном PWA пользователь открывает любую практику и проверяет: крестик и `Шаг X из Y` не пересекаются со статусной строкой, изображение и нижние кнопки полностью видимы.

## Self-Review

- Spec coverage: Task 1 проверяет три ширины и видимость шапки; Task 2 вводит минимальный отступ, использует системный inset и сохраняет остальной интерфейс без изменений.
- Placeholder scan: незаполненных пунктов, `TODO` и неопределённых действий нет.
- Type consistency: тест использует существующие `Page`, `Locator`, `expect` и helper `expectInViewport`; новые типы и публичные интерфейсы не создаются.
