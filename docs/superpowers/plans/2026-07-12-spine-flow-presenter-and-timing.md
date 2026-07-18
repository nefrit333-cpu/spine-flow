# Spine Flow Presenter and Timing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить выбор мужской/женской модели и привести все практики к этапам 30–90 секунд без изменения заявленной общей длительности.

**Architecture:** `Presenter` становится отдельным доменным значением и сохраняется локально. Каталог хранит семантические ID шагов и парные обложки, а резолвер изображений выбирает файл по `presenter`. Инварианты каталога тестируются программно для каждой практики.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, Playwright, локальные PNG.

## Global Constraints

- Подготовка и «Завершение практики» всегда по 30 секунд.
- Простые этапы не превышают 60 секунд; сложные не превышают 90 секунд.
- Сумма этапов точно совпадает с минутами в названии.
- Для каждого шага и обложки существуют `female` и `male` варианты.
- Полная фигура видна при 320px и 375px; crossfade и reduced-motion сохраняются.
- Никакого deploy без нового явного разрешения.

---

### Task 1: Presenter domain and persistence

**Files:**
- Create: `web/src/domain/presenter.ts`
- Create: `web/src/lib/presenterStore.ts`
- Create: `web/src/lib/presenterStore.test.ts`
- Modify: `web/src/App.tsx`

- [ ] Написать падающие тесты для `readPresenter`, `savePresenter`, `clearPresenter`.
- [ ] Запустить `npm.cmd test -- src/lib/presenterStore.test.ts` и подтвердить FAIL.
- [ ] Реализовать `Presenter = 'female' | 'male'` и storage key `spine-flow-presenter`.
- [ ] Передавать выбранную модель через состояние `App` во все визуальные экраны.
- [ ] Повторно запустить тест и получить PASS.

### Task 2: Presenter selection screen

**Files:**
- Create: `web/src/pages/PresenterSelectPage.tsx`
- Create: `web/src/components/PresenterCard.tsx`
- Create: `web/src/pages/PresenterSelectPage.test.tsx`
- Modify: `web/src/styles.css`
- Modify: `web/src/App.tsx`

- [ ] Написать тест: первый запуск показывает две кнопки, выбор сохраняется и открывает уровни.
- [ ] Подтвердить красную фазу теста.
- [ ] Реализовать две полноразмерные карточки с фиксированным 4:5, доступными названиями и состояниями focus/active.
- [ ] Связать кнопку настроек с возвратом к выбору модели без очистки прогресса.
- [ ] Получить зелёные component tests.

### Task 3: Catalog normalization

**Files:**
- Modify: `web/src/domain/practice.ts`
- Modify: `web/src/data/practiceCatalog.ts`
- Modify: `web/src/data/practiceCatalog.test.ts`

- [ ] Добавить тесты-инварианты: первый/последний шаг, лимиты 60/90, сумма длительности из названия, уникальные ID.
- [ ] Подтвердить FAIL на текущем каталоге.
- [ ] Добавить `intensity: 'simple' | 'complex'` и `coverImages: Record<Presenter, string>`.
- [ ] Нормализовать все семь практик, сохраняя 5/7/10/12/15/15/12 минут.
- [ ] Получить PASS всех тестов каталога.

### Task 4: Paired image resolver and assets

**Files:**
- Modify: `web/src/components/PoseIllustration.tsx`
- Modify: `web/src/components/CrossfadePoseIllustration.tsx`
- Modify: `web/src/pages/PracticePage.tsx`
- Modify: `web/src/pages/HomePage.tsx`
- Modify: `web/src/components/PracticeCard.tsx`
- Create: `web/public/images/female/*.png`
- Create: `web/public/images/male/*.png`

- [ ] Написать падающий тест резолвера для обеих моделей и неизвестного ID.
- [ ] Перенести/переиспользовать качественные женские изображения в `female`, создать недостающие женские позы.
- [ ] Сгенерировать мужской вариант каждой позы с идентичной композицией и полной фигурой.
- [ ] Проверить каждый PNG визуально до подключения; изображения с обрезкой или неверной позой перегенерировать.
- [ ] Передать `presenter` через home/card/practice и сохранить crossfade без fallback другого пола.
- [ ] Получить PASS component tests.

### Task 5: End-to-end verification

**Files:**
- Modify: `web/e2e/spine-flow.spec.ts`
- Modify: `.agent-work/tasks/todo.md`

- [ ] E2E: выбрать девушку, проверить обложки и шаги; повторить критический маршрут для парня.
- [ ] E2E: пройти все семь практик и сверить названия, таймеры и `src`.
- [ ] Запустить `npm.cmd test`, `npm.cmd run build`, `npm.cmd run test:e2e`, `git diff --check`.
- [ ] Сделать снимки 320x568 и 375x812 обоих вариантов; проверить отсутствие обрезки и наложений.
- [ ] Зафиксировать результаты и остаточный риск физической проверки на iPhone; не публиковать без разрешения.
