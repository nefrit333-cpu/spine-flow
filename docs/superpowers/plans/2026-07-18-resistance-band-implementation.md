# Resistance Band Practice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a six-minute intermediate practice for shoulders and upper back using a long resistance band attached to a stable support.

**Architecture:** The practice catalog remains the single source of truth for the practice flow. The new `band-shoulders` catalog record supplies seven timed steps, while the existing presenter-aware `getStepImage(stepId, presenter)` resolves a complete local WebP image set. Existing routing, timer, completion and card components are reused.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Playwright, WebP assets, built-in image generation.

## Global Constraints

- Add the practice as the fourth `intermediate` entry without changing existing practices.
- Use seven steps totaling exactly `360` seconds: 30, 60, 60, 60, 60, 60, 30.
- Keep the approved title `6 минут: плечи и спина с жгутом` and subtitle `Контроль плеч и лопаток с лёгким сопротивлением`.
- The five working steps use a long elastic band attached to a stable support in a gym.
- The external rotation step explicitly changes sides after 30 seconds.
- Create seven full-body images for each presenter: 14 files, `720x960` WebP, with mat, gym wall, plant and visible attachment point.
- Keep the established presenter appearance and clothing; no logos, text overlays, medical claims or extra people.

---

### Task 1: Add and verify the presenter-specific resistance-band assets

**Files:**
- Create: `web/public/images/female/band-shoulders-{preparation,row,pulldown,external-rotation,reverse-fly,face-pull,finish}.webp`
- Create: `web/public/images/male/band-shoulders-{preparation,row,pulldown,external-rotation,reverse-fly,face-pull,finish}.webp`
- Modify: `web/src/data/presenterAssetCoverage.test.ts`

**Interfaces:**
- Consumes: `getStepImage(stepId, presenter): string` from `web/src/components/PoseIllustration.tsx`.
- Produces: 14 paths resolved by `/images/{presenter}/band-shoulders-*.webp`.

- [ ] **Step 1: Generate seven female movement frames**

Use `web/public/images/references/presenter-female-approved-source.png` as an identity reference. Generate one full-body vertical `3:4` frame for each ID:

```text
band-shoulders-preparation       checks the intact anchored band with light tension
band-shoulders-row               pulls a waist-height anchored band toward the waist
band-shoulders-pulldown          pulls an overhead anchored band down with straight arms
band-shoulders-external-rotation faces forward beside a waist-height anchor, band crossing the body, elbow at side, forearm rotated outward
band-shoulders-reverse-fly       soft hip hinge, pulls chest-height anchored band apart with arms opening to sides
band-shoulders-face-pull         pulls face-height anchored band toward face with elbows out
band-shoulders-finish            releases tension, arms relaxed, shoulders lowered
```

Use the approved female white top and dark teal leggings. In every prompt require: the entire body, both feet and full muted green mat visible; bright gym, pale warm-gray wall, matte floor, plant, rack/mirror and no text or logo. The attachment point and stretched band must be visible for every working step.

- [ ] **Step 2: Generate seven male movement frames**

Use `web/public/images/references/presenter-male-approved.png` as an identity reference. Repeat the seven IDs and movements from Step 1 with the approved male sage sleeveless shirt and black shorts. Preserve the same gym environment, full-body framing, mat and visible attachment point.

- [ ] **Step 3: Convert the selected outputs to workspace WebP files**

For every selected generated PNG, run this command from the repository root, substituting the input and target path:

```powershell
ffmpeg -y -i "<generated-png>" -vf "scale=720:960:force_original_aspect_ratio=decrease,pad=720:960:(ow-iw)/2:(oh-ih)/2:color=white" -c:v libwebp -q:v 82 "web/public/images/female/band-shoulders-row.webp"
```

Confirm all 14 files exist and are `720x960`:

```powershell
$assets = Get-ChildItem web\public\images\female\band-shoulders-*.webp, web\public\images\male\band-shoulders-*.webp
$assets.Count
$assets | ForEach-Object { "$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 $_.FullName) $($_.Name)" }
```

Expected: `14` files and `720x960` for each one.

- [ ] **Step 4: Add a focused asset coverage test**

Append this test to `web/src/data/presenterAssetCoverage.test.ts`:

```ts
test('has resistance-band images for both presenters', () => {
  const ids = [
    'band-shoulders-preparation', 'band-shoulders-row', 'band-shoulders-pulldown',
    'band-shoulders-external-rotation', 'band-shoulders-reverse-fly',
    'band-shoulders-face-pull', 'band-shoulders-finish',
  ]
  const missing = ids.flatMap((id) => presenters
    .map((presenter) => `public${getStepImage(id, presenter)}`)
    .filter((path) => !existsSync(resolve(path))))

  expect(missing).toEqual([])
})
```

- [ ] **Step 5: Run the focused asset test**

Run:

```powershell
cd web
npm.cmd test -- presenterAssetCoverage.test.ts
```

Expected: PASS, including the new resistance-band test.

### Task 2: Add the six-minute catalog record and contract tests

**Files:**
- Modify: `web/src/data/practiceCatalog.ts`
- Modify: `web/src/data/practiceCatalog.test.ts`

**Interfaces:**
- Consumes: `Practice` from `web/src/domain/practice.ts`.
- Produces: `findPractice('band-shoulders')` and four results from `getPracticesByLevel('intermediate')`.

- [ ] **Step 1: Add failing catalog expectations**

In `web/src/data/practiceCatalog.test.ts`, change both existing intermediate-count assertions from `3` to `4`. Add this test:

```ts
test('contains the approved six-minute resistance-band practice', () => {
  const practice = practices.find((item) => item.id === 'band-shoulders')

  expect(practice).toMatchObject({
    level: 'intermediate',
    title: '6 минут: плечи и спина с жгутом',
    subtitle: 'Контроль плеч и лопаток с лёгким сопротивлением',
    accent: 'blue',
  })
  expect(practice?.steps.map(({ id, title, durationSeconds }) => ({ id, title, durationSeconds }))).toEqual([
    { id: 'band-shoulders-preparation', title: 'Подготовка', durationSeconds: 30 },
    { id: 'band-shoulders-row', title: 'Тяга к поясу', durationSeconds: 60 },
    { id: 'band-shoulders-pulldown', title: 'Тяга прямыми руками сверху', durationSeconds: 60 },
    { id: 'band-shoulders-external-rotation', title: 'Внешняя ротация плеча', durationSeconds: 60 },
    { id: 'band-shoulders-reverse-fly', title: 'Разведение рук в наклоне', durationSeconds: 60 },
    { id: 'band-shoulders-face-pull', title: 'Тяга к лицу', durationSeconds: 60 },
    { id: 'band-shoulders-finish', title: 'Завершение практики', durationSeconds: 30 },
  ])
  expect(practice?.steps.reduce((sum, step) => sum + step.durationSeconds, 0)).toBe(360)
  expect(practice?.steps.find((step) => step.id === 'band-shoulders-external-rotation')?.instruction).toContain('30 секунд')
})
```

- [ ] **Step 2: Run the catalog test to verify it fails**

Run:

```powershell
cd web
npm.cmd test -- practiceCatalog.test.ts
```

Expected: FAIL because `band-shoulders` does not yet exist.

- [ ] **Step 3: Append the minimal catalog record**

Append this record after `gym-warmup` in `web/src/data/practiceCatalog.ts`:

```ts
{
  id: 'band-shoulders',
  level: 'intermediate',
  title: '6 минут: плечи и спина с жгутом',
  subtitle: 'Контроль плеч и лопаток с лёгким сопротивлением',
  coverImage: '/images/female/band-shoulders-row.webp',
  accent: 'blue',
  steps: [
    { id: 'band-shoulders-preparation', title: 'Подготовка', instruction: 'Проверьте жгут на повреждения и убедитесь, что опора не сдвигается. Возьмите лёгкое натяжение, сделайте несколько спокойных вдохов и остановитесь, если есть боль или головокружение.', durationSeconds: 30 },
    { id: 'band-shoulders-row', title: 'Тяга к поясу', instruction: 'Закрепите жгут на уровне талии. Тяните локти назад к корпусу, мягко сводя лопатки, затем плавно возвращайте руки вперёд. Не поднимайте плечи.', durationSeconds: 60 },
    { id: 'band-shoulders-pulldown', title: 'Тяга прямыми руками сверху', instruction: 'Закрепите жгут выше головы и тяните прямые руки вниз к бёдрам. Сохраняйте длинную шею и устойчивый корпус, возвращайте жгут медленно.', durationSeconds: 60 },
    { id: 'band-shoulders-external-rotation', title: 'Внешняя ротация плеча', instruction: 'Закрепите жгут на уровне талии и встаньте лицом вперёд, чтобы жгут шёл поперёк передней части тела. Держите локоть рядом с корпусом и плавно отводите предплечье наружу. Через 30 секунд смените сторону.', durationSeconds: 60 },
    { id: 'band-shoulders-reverse-fly', title: 'Разведение рук в наклоне', instruction: 'Закрепите жгут перед собой на уровне груди. Мягко наклонитесь с прямой спиной и разведите руки в стороны, затем спокойно верните их вперёд.', durationSeconds: 60 },
    { id: 'band-shoulders-face-pull', title: 'Тяга к лицу', instruction: 'Закрепите жгут на уровне лица. Тяните его к лицу, направляя локти в стороны, и плавно возвращайтесь. Не запрокидывайте голову и не дёргайте жгут.', durationSeconds: 60 },
    { id: 'band-shoulders-finish', title: 'Завершение практики', instruction: 'Снимите натяжение жгута, опустите плечи и спокойно подышите. Оцените самочувствие перед следующей нагрузкой.', durationSeconds: 30 },
  ],
},
```

- [ ] **Step 4: Run the catalog tests to verify they pass**

Run:

```powershell
cd web
npm.cmd test -- practiceCatalog.test.ts presenterAssetCoverage.test.ts
```

Expected: PASS.

### Task 3: Verify navigation, presentation and the complete release candidate

**Files:**
- Modify: `web/e2e/spine-flow.spec.ts`

**Interfaces:**
- Consumes: `#/home/intermediate` and `#/practice/intermediate/band-shoulders`.
- Produces: browser proof of presenter-specific band-practice images and the side-change instruction.

- [ ] **Step 1: Add the failing Playwright coverage for both presenters**

Append this loop to `web/e2e/spine-flow.spec.ts`:

```ts
for (const { id: presenter, name } of coreBackPresenters) {
  test(`opens the resistance-band practice with ${presenter} images`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await acknowledgeSafety(page)
    await selectPresenter(page, name)
    await page.getByRole('button', { name: /Средний/ }).click()
    await page.getByRole('button', { name: '6 минут: плечи и спина с жгутом' }).click()

    const visual = page.locator('.practice-visual img').last()
    await expect(page.getByText('Шаг 1 из 7', { exact: true })).toBeVisible()
    await expect(visual).toHaveAttribute('src', `/images/${presenter}/band-shoulders-preparation.webp`)
    await expectImageLoaded(visual)

    for (let index = 0; index < 3; index += 1) {
      await page.getByRole('button', { name: 'Следующий шаг' }).click()
    }
    await expect(page.getByRole('heading', { name: 'Внешняя ротация плеча' })).toBeVisible()
    await expect(page.locator('.practice-content p')).toContainText('Через 30 секунд смените сторону')
    await expect(visual).toHaveAttribute('src', `/images/${presenter}/band-shoulders-external-rotation.webp`)
    await expectImageLoaded(visual)
    await page.screenshot({ path: `output/playwright/spine-flow-band-shoulders-${presenter}-375.png`, fullPage: false, scale: 'css' })
  })
}
```

- [ ] **Step 2: Run the focused end-to-end test**

Run:

```powershell
cd web
npx.cmd playwright test spine-flow.spec.ts --grep "resistance-band practice"
```

Expected: PASS for female and male.

- [ ] **Step 3: Run the complete verification suite**

Run:

```powershell
cd web
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Expected: all tests pass and the production build completes.

- [ ] **Step 4: Visually inspect the two mobile screenshots**

Inspect `web/output/playwright/spine-flow-band-shoulders-female-375.png` and `web/output/playwright/spine-flow-band-shoulders-male-375.png`. Confirm the attachment point, the band, full person, mat and gym context are visible and text does not overlap the image.

- [ ] **Step 5: Request visual approval and publish only after authorisation**

Show the screenshots to the user. After explicit approval, run `git diff --check`, stage only the practice files and images, commit with a Russian past-tense message, push the branch, and request a separate production-deploy authorisation for Vercel.
