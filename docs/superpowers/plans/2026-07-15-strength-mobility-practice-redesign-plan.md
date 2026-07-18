# Strength And Mobility Practice Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Переработать «15 минут: сила и подвижность» в равномерную функциональную практику из 16 этапов без повторов подходов.

**Architecture:** Модель `Practice` и экран сессии не меняются. Последовательность остаётся в `practiceCatalog.ts`; каждый ID имеет PNG для двух presenter и покрывается E2E.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Playwright и локальные PNG.

## Global Constraints

- Практика: 16 этапов, 900 секунд.
- Подготовка: 30 секунд; подъёмы на носки: 30 секунд; завершение: 60 секунд.
- Без слов «первый подход», «второй подход» и аналогов.
- Обратные/боковые выпады, «Птица-собака» и мост с шагом чередуют стороны внутри одного этапа.
- Нет прыжков, оборудования и изменений остальных практик.
- Изображения сохраняют утверждённых персонажей, одежду, коврик, стену, растение и полную фигуру.
- Не делать commit или deploy без отдельной команды пользователя.

---

### Task 1: Закрепить контракт практики тестом

**Files:**
- Modify: `web/src/data/practiceCatalog.test.ts`

**Interfaces:**
- Consumes: `getPracticesByLevel('intermediate')`
- Produces: точный контракт `strength-mobility`.

- [ ] **Step 1: Написать падающий контрактный тест**

Проверить 16 этапов в порядке: `intermediate-preparation`, `cat-cow`, `air-squat`, `calf-raises`, `reverse-lunge`, `side-lunge`, `wall-pushup`, `knee-pushup`, `bird-dog`, `bridge-march`, `superman`, `shoulder-tap-plank`, `forearm-plank`, `bear-hover`, `intermediate-child-pose`, `intermediate-rest`.

Проверить названия: «Подготовка», «Кошка-корова», «Приседания», «Подъёмы на носки», «Обратные выпады», «Боковые выпады», «Отжимания от стены», «Отжимания с колен», «Птица-собака», «Мост с шагом», «Супермен», «Планка с касанием плеч», «Планка на предплечьях», «Медвежья стойка», «Поза ребёнка», «Завершение практики».

Проверить длительности: 30, 60, 60, 30, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60. Отдельно проверить отсутствие `/подход/i` и сумму 900 секунд.

- [ ] **Step 2: Подтвердить падение до реализации**

Run: `npm.cmd test -- src/data/practiceCatalog.test.ts`

Expected: FAIL, пока остаются повторы и прежние длительности.

---

### Task 2: Обновить каталог и инструкции

**Files:**
- Modify: `web/src/data/practiceCatalog.ts`
- Test: `web/src/data/practiceCatalog.test.ts`

**Interfaces:**
- Consumes: `PracticeStep { id, title, instruction, durationSeconds }`
- Produces: `strength-mobility.steps` и пути `/images/{presenter}/{id}.png`.

- [ ] **Step 1: Удалить повторные этапы**

Удалить `cat-cow-second`, `reverse-lunge-left`, `bird-dog-left` и `glute-bridge`. Убрать «подход» из `cat-cow`, `air-squat`, `wall-pushup`. Установить `calf-raises` в 30 секунд, `intermediate-rest` в 60 секунд.

- [ ] **Step 2: Добавить новые этапы**

Добавить `side-lunge`, `bridge-march`, `shoulder-tap-plank`, `intermediate-child-pose` по 60 секунд. Инструкции: боковой выпад с контролем опорной стопы; мост с поочерёдным подъёмом стоп; высокая планка с касанием противоположного плеча; поза ребёнка с мягким дыханием. В инструкциях `reverse-lunge` и `bird-dog` явно указать чередование сторон.

- [ ] **Step 3: Проверить контракт**

Run: `npm.cmd test -- src/data/practiceCatalog.test.ts`

Expected: PASS, 16 уникальных ID и 900 секунд.

---

### Task 3: Создать и принять изображения

**Files:**
- Create: `web/public/images/{female,male}/side-lunge.png`
- Create: `web/public/images/{female,male}/bridge-march.png`
- Create: `web/public/images/{female,male}/shoulder-tap-plank.png`
- Create: `web/public/images/{female,male}/intermediate-child-pose.png`
- Modify: `web/public/images/{female,male}/intermediate-rest.png`
- Create: `web/output/visual/strength-mobility-{female,male}-contact.jpg`

**Interfaces:**
- Consumes: `public/images/references/presenter-female-approved.png`, `presenter-male-approved.png`
- Produces: PNG для новых ID и спокойное изображение завершения.

- [ ] **Step 1: Сгенерировать женский комплект**

Создать боковой выпад, мост с шагом, планку с касанием плеч, позу ребёнка и расслабленное завершение. В каждом кадре: фотореалистичная утверждённая девушка, полная фигура, коврик, зелёная стена и растение.

- [ ] **Step 2: Сгенерировать мужской комплект**

Повторить пять сцен с утверждённым мужчиной, серо-зелёной майкой и чёрными шортами.

- [ ] **Step 3: Проверить контакт-листы**

Перегенерировать изображение с обрезанной фигурой, неправильной позой, иной внешностью/одеждой, анатомическим артефактом или пустым интерьером.

- [ ] **Step 4: Проверить покрытие ассетов**

Run: `npm.cmd test -- src/data/presenterAssetCoverage.test.ts`

Expected: PASS для `female` и `male`.

---

### Task 4: Добавить E2E-маршрут и финально проверить

**Files:**
- Modify: `web/e2e/spine-flow.spec.ts`
- Create: `web/output/playwright/spine-flow-strength-mobility-female-375.png`
- Create: `web/output/playwright/spine-flow-strength-mobility-male-375.png`

**Interfaces:**
- Consumes: выбор presenter, среднего уровня и карточки практики.
- Produces: E2E-доказательство 16 этапов, новых PNG, мобильной компоновки и завершения.

- [ ] **Step 1: Добавить маршрут для обоих presenter**

Через интерфейс проверить `Шаг 1 из 16`, загруженное изображение подготовки, затем `side-lunge.png`, `bridge-march.png`, `shoulder-tap-plank.png`, `intermediate-child-pose.png` и `Практика завершена`.

- [ ] **Step 2: Проверить мобильную компоновку**

На 375×812 через `scrollIntoViewIfNeeded()` и bounding boxes проверить верхнюю панель, иллюстрацию, инструкцию, таймер и controls. Перед снимком выполнить `window.scrollTo(0, 0)` и дождаться загрузки изображений.

- [ ] **Step 3: Запустить финальные проверки**

Run: `npm.cmd test`; `npm.cmd run build`; `npm.cmd run test:e2e`; `git diff --check`.

Expected: unit-тесты, production-сборка и Playwright проходят; `git diff --check` не выводит ошибок.

- [ ] **Step 4: Обновить checklist**

Отметить реализацию завершённой в `.agent-work/tasks/todo.md`, записать фактические результаты и отсутствие публикации на Vercel.
