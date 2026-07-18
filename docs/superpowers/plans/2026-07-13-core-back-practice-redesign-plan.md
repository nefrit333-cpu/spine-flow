# Core And Back Practice Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перестроить практику «12 минут: кор и спина» в разнообразную динамичную последовательность из 13 этапов с двумя согласованными комплектами изображений.

**Architecture:** Существующая модель `Practice` и экран сессии не меняются. Последовательность остаётся декларативной в `practiceCatalog.ts`; имена PNG совпадают с ID этапов, а тест покрытия проверяет наличие файла для каждого персонажа.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Playwright, локальные PNG в `public/images`.

## Global Constraints

- Практика содержит ровно 13 этапов и длится 720 секунд.
- Подготовка и завершение практики длятся по 30 секунд.
- В названиях нет слов «первый подход», «второй подход» и подобных уточнений.
- Персонажи, одежда, коврик, стена и растение соответствуют утверждённым референсам.
- Фигура видна целиком; изображение соответствует активной фазе упражнения.
- Навигация, таймер, прогресс и остальные практики не меняются.
- Коммит и публикация выполняются только по отдельной команде пользователя.

---

### Task 1: Зафиксировать новый контракт практики тестом

**Files:**
- Modify: `web/src/data/practiceCatalog.test.ts`
- Test: `web/src/data/practiceCatalog.test.ts`

**Interfaces:**
- Consumes: `getPracticesByLevel('intermediate'): ReadonlyArray<Practice>`
- Produces: проверяемый порядок ID, названий и длительностей практики `core-back`

- [ ] **Step 1: Заменить общий тест практики точным контрактом**

Добавить ожидаемую последовательность:

```ts
expect(core?.steps.map(({ id, title, durationSeconds }) => ({ id, title, durationSeconds }))).toEqual([
  { id: 'core-preparation', title: 'Подготовка', durationSeconds: 30 },
  { id: 'core-cat-cow', title: 'Кошка-корова', durationSeconds: 90 },
  { id: 'core-dead-bug', title: 'Dead bug', durationSeconds: 60 },
  { id: 'core-bird-dog', title: 'Птица-собака', durationSeconds: 60 },
  { id: 'core-bridge-march', title: 'Мост с шагом', durationSeconds: 60 },
  { id: 'core-heel-taps', title: 'Касания пяток лёжа', durationSeconds: 60 },
  { id: 'core-slow-mountain-climber', title: 'Медленный альпинист', durationSeconds: 60 },
  { id: 'core-bear-shoulder-taps', title: 'Медвежья стойка с касанием плеч', durationSeconds: 60 },
  { id: 'core-forearm-plank', title: 'Планка на предплечьях', durationSeconds: 60 },
  { id: 'core-side-plank-right', title: 'Боковая планка справа', durationSeconds: 30 },
  { id: 'core-side-plank-left', title: 'Боковая планка слева', durationSeconds: 30 },
  { id: 'core-child-pose', title: 'Поза ребёнка', durationSeconds: 90 },
  { id: 'core-rest', title: 'Завершение практики', durationSeconds: 30 },
])
expect(core?.steps.some((step) => /подход/i.test(step.title))).toBe(false)
expect(core?.steps.reduce((sum, step) => sum + step.durationSeconds, 0)).toBe(720)
```

- [ ] **Step 2: Запустить целевой тест и подтвердить ожидаемое падение**

Run: `npm.cmd test -- src/data/practiceCatalog.test.ts`

Expected: FAIL из-за старых парных ID и отсутствующих новых этапов.

---

### Task 2: Обновить последовательность и тексты

**Files:**
- Modify: `web/src/data/practiceCatalog.ts`
- Test: `web/src/data/practiceCatalog.test.ts`

**Interfaces:**
- Consumes: `PracticeStep` с полями `id`, `title`, `instruction`, `durationSeconds`
- Produces: последовательность `core-back`, используемую `PracticePage` и путями `/images/{presenter}/{id}.png`

- [ ] **Step 1: Объединить три парных движения**

Оставить по одному этапу:

```ts
{ id: 'core-dead-bug', title: 'Dead bug', instruction: 'Поочерёдно опускайте противоположные руку и ногу. Сохраняйте поясницу устойчивой, двигайтесь медленно и свободно дышите.', durationSeconds: 60 },
{ id: 'core-bird-dog', title: 'Птица-собака', instruction: 'Поочерёдно вытягивайте противоположные руку и ногу. Не разворачивайте таз и сохраняйте шею продолжением позвоночника.', durationSeconds: 60 },
{ id: 'core-bridge-march', title: 'Мост с шагом', instruction: 'Поднимите таз и поочерёдно отрывайте стопы от коврика. Удерживайте таз на одном уровне и не задерживайте дыхание.', durationSeconds: 60 },
```

Удалить этапы `core-dead-bug-left`, `core-bird-dog-left` и `core-bridge-march-left` из каталога.

- [ ] **Step 2: Добавить три динамических этапа**

```ts
{ id: 'core-heel-taps', title: 'Касания пяток лёжа', instruction: 'Лягте на спину, согните колени и слегка приподнимите плечи. Поочерёдно тянитесь ладонью к пятке, сохраняя поясницу устойчивой.', durationSeconds: 60 },
{ id: 'core-slow-mountain-climber', title: 'Медленный альпинист', instruction: 'Из высокой планки поочерёдно подтягивайте колено к корпусу. Двигайтесь без рывков, удерживайте таз устойчивым и не округляйте плечи.', durationSeconds: 60 },
{ id: 'core-bear-shoulder-taps', title: 'Медвежья стойка с касанием плеч', instruction: 'Приподнимите колени над ковриком и поочерёдно касайтесь ладонью противоположного плеча. Сохраняйте спину ровной и уменьшите амплитуду, если таз раскачивается.', durationSeconds: 60 },
```

- [ ] **Step 3: Упростить названия боковых планок**

Заменить заголовки на `Боковая планка справа` и `Боковая планка слева`, сохранив длительность 30 секунд и упоминание опоры на колени в инструкции.

- [ ] **Step 4: Запустить целевые unit-тесты**

Run: `npm.cmd test -- src/data/practiceCatalog.test.ts`

Expected: PASS для порядка, длительности и названий; тест покрытия изображений пока FAIL до Task 3.

---

### Task 3: Подготовить два полных комплекта изображений

**Files:**
- Create: `web/public/images/female/core-dead-bug.png`
- Create: `web/public/images/male/core-dead-bug.png`
- Create: `web/public/images/female/core-bird-dog.png`
- Create: `web/public/images/male/core-bird-dog.png`
- Create: `web/public/images/female/core-bridge-march.png`
- Create: `web/public/images/male/core-bridge-march.png`
- Create: `web/public/images/female/core-heel-taps.png`
- Create: `web/public/images/male/core-heel-taps.png`
- Create: `web/public/images/female/core-slow-mountain-climber.png`
- Create: `web/public/images/male/core-slow-mountain-climber.png`
- Create: `web/public/images/female/core-bear-shoulder-taps.png`
- Create: `web/public/images/male/core-bear-shoulder-taps.png`

**Interfaces:**
- Consumes: утверждённые референсы `web/public/images/references/presenter-female-approved.png` и `presenter-male-approved.png`
- Produces: PNG по контракту `/images/{presenter}/{step.id}.png`

- [ ] **Step 1: Сгенерировать шесть сцен для девушки**

Для каждой сцены использовать женский референс, фотореалистичную внешность и ту же одежду. Формат 3:4, персонаж целиком, коврик, светлая зелёная стена и растение. Объединённые движения показывать как последовательную композицию без дублирования лица или лишних конечностей.

- [ ] **Step 2: Сгенерировать шесть сцен для парня**

Повторить те же позы с мужским референсом, сохранив утверждённые лицо, серо-зелёную майку и чёрные шорты.

- [ ] **Step 3: Провести визуальную проверку контакт-листа**

Проверить: корректность упражнения, стороны, полную фигуру, отсутствие анатомических артефактов, единые лицо/одежду и заполненный интерьер. Неподходящие кадры перегенерировать до копирования в `public/images`.

- [ ] **Step 4: Запустить тест покрытия ассетов**

Run: `npm.cmd test -- src/data/presenterAssetCoverage.test.ts`

Expected: PASS, отсутствующих путей нет для `female` и `male`.

---

### Task 4: Проверить пользовательский сценарий и мобильное отображение

**Files:**
- Modify: `web/e2e/spine-flow.spec.ts`
- Create: `web/output/playwright/spine-flow-core-back-female-375.png`
- Create: `web/output/playwright/spine-flow-core-back-male-375.png`

**Interfaces:**
- Consumes: существующий выбор персонажа, уровня и практики
- Produces: браузерное доказательство новых этапов и корректных путей изображений

- [ ] **Step 1: Добавить E2E-проверку практики**

Сценарий выбирает персонажа, средний уровень и карточку `12 минут: кор и спина`, затем проверяет `Шаг 1 из 13`. Переходами «Следующий шаг» он доходит до новых этапов и проверяет пути:

```ts
await expect(page.locator('.practice-visual img').last()).toHaveAttribute(
  'src',
  `/images/${presenter}/core-heel-taps.png`,
)
```

Аналогично проверить `core-slow-mountain-climber.png` и `core-bear-shoulder-taps.png` для обоих персонажей.

- [ ] **Step 2: Снять экраны 375×812**

На кадрах должны быть видны название упражнения, полная фигура, инструкция, таймер и элементы управления без наложений.

- [ ] **Step 3: Выполнить финальный набор проверок**

Run:

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
git diff --check
```

Expected: 8 unit-файлов PASS, production-сборка завершается без TypeScript/Vite ошибок, все Playwright-сценарии PASS, `git diff --check` не выводит ошибок.

- [ ] **Step 4: Обновить рабочий checklist**

Отметить реализацию завершённой в `.agent-work/tasks/todo.md`, записать фактические числа тестов и явно указать, что Vercel не обновлялся.
