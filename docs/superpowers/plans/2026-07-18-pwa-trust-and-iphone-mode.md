# PWA Trust and iPhone Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить в Spine Flow цельные PWA-настройки, страницы поддержки и конфиденциальности, а также безопасное локальное удаление данных.

**Architecture:** Hash-навигация остаётся единственным источником экранного состояния. Новые статические страницы не требуют выбранного персонажа, а настройки доступны только после его выбора. Данные остаются локальными: один модуль очищает `localStorage`, а App обновляет React-state и возвращает пользователя к выбору персонажа.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Playwright, Lucide.

## Global Constraints

- Spine Flow остаётся только iPhone-ориентированным PWA: без Capacitor, нативных контейнеров и App Store.
- Не добавлять сервер, аккаунты, аналитику, рекламу, платежи или трекеры.
- Контакт поддержки: `nefrit333@gmail.com`.
- Не блокировать масштабирование текста и системные жесты доступности.
- Публикацию на Vercel и Git-коммит выполнять только по отдельной команде пользователя.

---

## File Structure

- Modify: `web/src/lib/navigation.ts` — маршруты `settings`, `support`, `privacy` и их валидация.
- Modify: `web/src/lib/navigation.test.ts` — тесты сериализации и прямых legal URL.
- Modify: `web/src/lib/progressStore.ts` — единая функция очистки прогресса и согласия.
- Modify: `web/src/lib/progressStore.test.ts` — проверка локального удаления данных.
- Create: `web/src/pages/SettingsPage.tsx` — iPhone-экран настроек с действиями пользователя.
- Create: `web/src/pages/InformationPage.tsx` — общий экран поддержки и конфиденциальности.
- Modify: `web/src/App.tsx` — маршрутизация, доступ к публичным страницам без персонажа и сброс React-state.
- Modify: `web/src/styles.css` — стили новых экранов и безопасная PWA-полировка касаний.
- Modify: `web/src/App.test.tsx` — интеграционные тесты настроек и очистки.
- Modify: `web/e2e/spine-flow.spec.ts` — iPhone-сценарии, прямые URL, возврат историей и `mailto`.
- Modify: `web/index.html` — только если проверка выявит отсутствующий Apple PWA meta-tag; не менять viewport zoom-правила.

### Task 1: Маршруты и локальное удаление данных

**Files:**
- Modify: `web/src/lib/navigation.ts`
- Modify: `web/src/lib/navigation.test.ts`
- Modify: `web/src/lib/progressStore.ts`
- Modify: `web/src/lib/progressStore.test.ts`

**Interfaces:**
- Produces: `AppScreen` variants `{ name: 'settings' }`, `{ name: 'support' }`, `{ name: 'privacy' }`.
- Produces: `clearLocalAppData(): void`, удаляющую выбранного персонажа, `spine-flow.progress` и `spine-flow.safety`.

- [ ] **Step 1: Написать падающие тесты маршрутов и удаления данных**

```ts
expect(parseScreenHash('#/support')).toEqual({ name: 'support' })
expect(parseScreenHash('#/privacy')).toEqual({ name: 'privacy' })
expect(getScreenHash({ name: 'settings' })).toBe('#/settings')

recordCompletion('neck')
acknowledgeSafety()
savePresenter('female')
clearLocalAppData()
expect(loadProgress()).toEqual({ completedCount: 0, lastPracticeId: null, lastCompletedAt: null })
expect(hasAcknowledgedSafety()).toBe(false)
expect(readPresenter()).toBeNull()
```

- [ ] **Step 2: Запустить тесты и подтвердить падение**

Run: `npm.cmd test -- src/lib/navigation.test.ts src/lib/progressStore.test.ts`

Expected: FAIL, потому что маршруты и `clearLocalAppData` ещё отсутствуют.

- [ ] **Step 3: Реализовать маршруты и очистку**

```ts
export type AppScreen =
  | { readonly name: 'presenter' }
  | { readonly name: 'levels' }
  | { readonly name: 'settings' }
  | { readonly name: 'support' }
  | { readonly name: 'privacy' }
  | { readonly name: 'home'; readonly level: PracticeLevel }
  | { readonly name: 'practice'; readonly level: PracticeLevel; readonly practiceId: string }
  | { readonly name: 'completion'; readonly level: PracticeLevel; readonly practiceId: string }

export function clearLocalAppData(): void {
  try {
    window.localStorage.removeItem(progressKey)
    window.localStorage.removeItem(safetyKey)
    clearPresenter()
  } catch {
    return
  }
}
```

Use the actual presenter key from `presenterStore.ts`; export a clearing helper there if needed instead of duplicating a private key string.

- [ ] **Step 4: Запустить узкие тесты**

Run: `npm.cmd test -- src/lib/navigation.test.ts src/lib/progressStore.test.ts src/lib/presenterStore.test.ts`

Expected: PASS.

### Task 2: Настройки, поддержка и конфиденциальность

**Files:**
- Create: `web/src/pages/SettingsPage.tsx`
- Create: `web/src/pages/InformationPage.tsx`
- Modify: `web/src/App.tsx`
- Modify: `web/src/App.test.tsx`

**Interfaces:**
- `SettingsPage` props: `onChangePresenter`, `onOpenSupport`, `onOpenPrivacy`, `onClearData`, `onBack`.
- `InformationPage` props: `kind: 'support' | 'privacy'`, `onBack`.

- [ ] **Step 1: Написать интеграционные тесты App**

```tsx
render(<App />)
await userEvent.click(screen.getByRole('button', { name: /Девушка/ }))
await userEvent.click(screen.getByRole('button', { name: 'Настройки' }))
await userEvent.click(screen.getByRole('link', { name: 'Поддержка' }))
expect(screen.getByRole('link', { name: 'Написать в поддержку' })).toHaveAttribute('href', 'mailto:nefrit333@gmail.com')

window.location.hash = '#/privacy'
window.dispatchEvent(new HashChangeEvent('hashchange'))
expect(screen.getByRole('heading', { name: 'Конфиденциальность' })).toBeInTheDocument()
```

- [ ] **Step 2: Запустить тест и подтвердить падение**

Run: `npm.cmd test -- src/App.test.tsx`

Expected: FAIL, потому что новых экранов и ссылок ещё нет.

- [ ] **Step 3: Реализовать компактные экраны**

```tsx
export function SettingsPage({ onChangePresenter, onOpenSupport, onOpenPrivacy, onClearData, onBack }: SettingsPageProps): JSX.Element {
  return <main className="app-shell settings-page">
    <header className="topbar"><button className="icon-button" aria-label="Назад" onClick={onBack}><ChevronLeft /></button><h1>Настройки</h1></header>
    <section className="settings-list">
      <button type="button" className="settings-row" onClick={onChangePresenter}>Сменить персонажа<ChevronRight /></button>
      <button type="button" className="settings-row" onClick={onOpenSupport}>Поддержка<ChevronRight /></button>
      <button type="button" className="settings-row" onClick={onOpenPrivacy}>Конфиденциальность<ChevronRight /></button>
      <button type="button" className="settings-row settings-row-danger" onClick={onClearData}>Удалить данные с устройства</button>
    </section>
  </main>
}
```

`InformationPage` uses the same `app-shell`, semantic heading, a back button, and fixed Russian copy. Support renders one `mailto:nefrit333@gmail.com` link. Privacy explicitly lists local-only presenter, safety acknowledgement, and progress; it states that there are no accounts, analytics, ads, trackers, payments, or server transfer. Do not claim legal certification or medical advice.

In `App.tsx`, allow `support` and `privacy` without a presenter. Settings requires a presenter. On deletion call `clearLocalAppData()`, set `presenter` to `null`, reset progress to the empty value, set safety visibility to false, and replace history with `#/presenter`. Ask for confirmation with `window.confirm('Удалить весь сохранённый прогресс и настройки с этого устройства?')` before clearing.

- [ ] **Step 4: Запустить интеграционные тесты**

Run: `npm.cmd test -- src/App.test.tsx`

Expected: PASS.

### Task 3: iPhone PWA-полировка и визуальная проверка

**Files:**
- Modify: `web/src/styles.css`
- Modify: `web/e2e/spine-flow.spec.ts`
- Modify: `web/index.html` only if a required Apple PWA meta-tag is absent.

**Interfaces:**
- Settings rows retain at least 46px touch targets and visible keyboard focus.
- Text remains zoomable; no `user-scalable=no` or `maximum-scale` viewport values.

- [ ] **Step 1: Добавить e2e-сценарии**

```ts
test('opens support and privacy from iPhone settings', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await acknowledgeSafety(page)
  await selectPresenter(page, 'Девушка')
  await page.getByRole('button', { name: 'Настройки' }).click()
  await page.getByRole('button', { name: 'Поддержка' }).click()
  await expect(page).toHaveURL(/#\/support$/)
  await expect(page.getByRole('link', { name: 'Написать в поддержку' })).toHaveAttribute('href', 'mailto:nefrit333@gmail.com')
  await page.goBack()
  await expect(page).toHaveURL(/#\/settings$/)
})
```

- [ ] **Step 2: Запустить e2e-сценарий и подтвердить падение**

Run: `npm.cmd run test:e2e -- --grep "opens support and privacy"`

Expected: FAIL, потому что страницы и навигация ещё не реализованы.

- [ ] **Step 3: Добавить стили без нарушения доступности**

```css
button, a { -webkit-tap-highlight-color: transparent; }
.settings-list { border-top: 1px solid #e1e8e2; }
.settings-row { display: flex; min-height: 58px; width: 100%; align-items: center; justify-content: space-between; border: 0; border-bottom: 1px solid #e1e8e2; background: transparent; color: #183b2b; text-align: left; }
.settings-row-danger { color: #9a3827; }
.information-copy { max-width: 40ch; color: #42584b; font-size: 1.05rem; line-height: 1.62; }
```

Keep the existing 8px corner radius, safe-area padding, focus outline, reduced-motion rule, and responsive 320px layout. Do not add decorative cards, gradients, or forced fullscreen APIs.

- [ ] **Step 4: Выполнить полный набор проверок**

Run: `npm.cmd test; npm.cmd run build; npm.cmd run test:e2e`

Expected: all unit tests, TypeScript production build, and Playwright tests pass. Inspect Playwright screenshots at `375x812` for clipping, overlap, touch target size, and footer collision.

## Self-Review

- Spec coverage: Task 1 covers routes and local data; Task 2 covers settings, support, privacy, contact and reset; Task 3 covers iPhone PWA polish and all required checks.
- Placeholder scan: no TODO/TBD or deferred implementation steps.
- Type consistency: `AppScreen` owns all routes; `SettingsPage` emits typed callbacks; `InformationPage` accepts only `support` or `privacy`.

## Execution Handoff

Plan complete. Execute inline in this session using `executing-plans`, with a checkpoint after Task 2 before visual verification.
