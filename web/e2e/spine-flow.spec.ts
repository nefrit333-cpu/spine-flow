import { expect, test, type Locator, type Page } from '@playwright/test'

async function acknowledgeSafety(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Продолжить' }).click()
}

async function selectPresenter(page: Page, name: 'Девушка' | 'Парень'): Promise<void> {
  await page.getByRole('button', { name: new RegExp(name) }).click()
}

const coreBackPresenters = [
  { id: 'female', name: 'Девушка' },
  { id: 'male', name: 'Парень' },
] as const

const coreBackImages = [
  { advance: 5, fileName: 'core-heel-taps.webp' },
  { advance: 1, fileName: 'core-slow-mountain-climber.webp' },
  { advance: 1, fileName: 'core-bear-shoulder-taps.webp' },
] as const

const strengthMobilityImages = [
  { advance: 5, fileName: 'side-lunge.webp' },
  { advance: 4, fileName: 'bridge-march.webp' },
  { advance: 2, fileName: 'shoulder-tap-plank.webp' },
  { advance: 3, fileName: 'intermediate-child-pose.webp' },
] as const

async function expectImageLoaded(image: Locator): Promise<void> {
  await expect.poll(async () => image.evaluate((element: HTMLImageElement) => (
    element.complete && element.naturalWidth > 0
  ))).toBe(true)
}

async function expectInViewport(page: Page, locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded()
  await expect(locator).toBeVisible()

  const viewport = page.viewportSize()
  if (!viewport) throw new Error('A viewport is required for mobile layout checks')

  const box = await locator.boundingBox()
  if (!box) throw new Error('Expected visible element to have a bounding box')

  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.y).toBeGreaterThanOrEqual(0)
  // Browser layout can place a fully visible edge at a fractional CSS pixel.
  const viewportEpsilon = 1
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + viewportEpsilon)
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + viewportEpsilon)
}

async function prepareCoreBackScreenshot(page: Page, closeButton: Locator, step: Locator): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForFunction(() => document.fonts.status === 'loaded' && Array.from(document.images).every((image) => image.complete))
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))

  const viewport = page.viewportSize()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await expect(closeButton).toBeVisible()
  await expect(step).toBeVisible()

  for (const locator of [closeButton, step]) {
    const box = await locator.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.y).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width)
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height)
  }
}

test('selects and remembers the female presenter', async ({ page }) => {
  await page.goto('/')
  await acknowledgeSafety(page)
  await expect(page.getByRole('button', { name: /Девушка/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Парень/ })).toBeVisible()
  await selectPresenter(page, 'Девушка')
  await expect(page.getByRole('heading', { name: 'Выберите уровень' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Выберите уровень' })).toBeVisible()
})

test('opens a practice from a deep link and returns through browser history', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('spine-flow-presenter', 'female')
    localStorage.setItem('spine-flow.safety', 'true')
  })

  await page.goto('/#/practice/beginner/neck')
  await expect(page.locator('.practice-page')).toBeVisible()
  await expect(page).toHaveURL(/#\/practice\/beginner\/neck$/)

  await page.goto('/#/home/beginner')
  await page.locator('.featured-practice .button').click()
  await expect(page).toHaveURL(/#\/practice\/beginner\/neck$/)
  await page.goBack()
  await expect(page).toHaveURL(/#\/home\/beginner$/)
  await expect(page.locator('.featured-practice')).toBeVisible()
})

test('continues a deep link after first-time presenter selection', async ({ page }) => {
  await page.goto('/#/practice/beginner/neck')
  await acknowledgeSafety(page)
  await selectPresenter(page, 'Девушка')

  await expect(page).toHaveURL(/#\/practice\/beginner\/neck$/)
  await expect(page.locator('.practice-page')).toBeVisible()
})

test('opens public information from iPhone settings and returns through history', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await acknowledgeSafety(page)
  await selectPresenter(page, 'Девушка')
  await page.getByRole('button', { name: 'Настройки' }).click()
  await expect(page).toHaveURL(/#\/settings$/)
  await page.getByRole('button', { name: 'Поддержка' }).click()
  await expect(page).toHaveURL(/#\/support$/)
  await expect(page.getByRole('link', { name: 'Написать в поддержку' })).toHaveAttribute('href', 'mailto:nefrit333@gmail.com')
  await page.goBack()
  await expect(page).toHaveURL(/#\/settings$/)
  await page.getByRole('button', { name: 'Конфиденциальность' }).click()
  await expect(page).toHaveURL(/#\/privacy$/)
  await expect(page.getByText('В приложении нет аналитики, рекламы, трекеров, платежей и передачи персональных данных третьим лицам.')).toBeVisible()
  await page.screenshot({ path: 'output/playwright/spine-flow-privacy-375.png', fullPage: true })
})

test('keeps the privacy heading inside a compact iPhone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/#/privacy')

  const heading = page.getByRole('heading', { name: 'Конфиденциальность' })
  await expect(heading).toBeVisible()
  await expect.poll(() => heading.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)
})

test('uses female images throughout a practice', async ({ page }) => {
  await page.goto('/')
  await acknowledgeSafety(page)
  await selectPresenter(page, 'Девушка')
  await page.getByRole('button', { name: /Начинающий/ }).click()
  await page.getByRole('button', { name: 'Начать' }).click()
  await expect(page.locator('.practice-visual img')).toHaveAttribute('src', '/images/female/neck-preparation.webp')
  await page.getByRole('button', { name: 'Следующий шаг' }).click()
  await expect(page.locator('.practice-visual img').last()).toHaveAttribute('src', '/images/female/neck-right-tilt.webp')
})

test('shows the revised male neck poses without clipping', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await acknowledgeSafety(page)
  await selectPresenter(page, 'Парень')
  await page.getByRole('button', { name: /Начинающий/ }).click()
  await page.getByRole('button', { name: 'Начать' }).click()

  const closeButton = page.getByRole('button', { name: 'Закрыть практику' })
  await expect.poll(async () => (await closeButton.boundingBox())?.y ?? 0).toBeGreaterThanOrEqual(56)

  for (let step = 0; step < 3; step += 1) {
    await page.getByRole('button', { name: 'Следующий шаг' }).click()
  }
  await expect(page.locator('.practice-visual img').last()).toHaveAttribute('src', '/images/male/neck-turns.webp')
  await page.screenshot({ path: 'output/playwright/spine-flow-male-neck-turns-375.png', fullPage: true })

  await page.getByRole('button', { name: 'Следующий шаг' }).click()
  await expect(page.locator('.practice-visual img').last()).toHaveAttribute('src', '/images/male/neck-lengthen.webp')
  await page.getByRole('button', { name: 'Следующий шаг' }).click()
  await expect(page.locator('.practice-visual img').last()).toHaveAttribute('src', '/images/male/neck-rest.webp')
  await page.screenshot({ path: 'output/playwright/spine-flow-male-neck-rest-375.png', fullPage: true })
})

test('uses male images and changes presenter from settings', async ({ page }) => {
  await page.goto('/')
  await acknowledgeSafety(page)
  await selectPresenter(page, 'Парень')
  await expect(page.locator('.level-card img')).toHaveCount(3)
  for (const image of await page.locator('.level-card img').all()) {
    await expect(image).toHaveAttribute('src', /^\/images\/male\//)
  }
  await page.screenshot({ path: 'output/playwright/spine-flow-male-levels-375.png', fullPage: true })
  await page.getByRole('button', { name: /Средний/ }).click()
  await expect(page.locator('.featured-cover')).toHaveAttribute('src', '/images/male/intermediate-preparation.webp')
  const titleBox = await page.locator('.featured-copy h3').boundingBox()
  const imageBox = await page.locator('.featured-cover').boundingBox()
  expect(titleBox).not.toBeNull()
  expect(imageBox).not.toBeNull()
  expect(titleBox!.x + titleBox!.width).toBeLessThanOrEqual(imageBox!.x)
  await page.screenshot({ path: 'output/playwright/spine-flow-male-intermediate-home-375.png', fullPage: true })
  await page.getByRole('button', { name: 'Начать' }).click()
  await expect(page.locator('.practice-visual img')).toHaveAttribute('src', '/images/male/intermediate-preparation.webp')
  await page.setViewportSize({ width: 375, height: 812 })
  await page.screenshot({ path: 'output/playwright/spine-flow-male-practice-375.png', fullPage: true })
  await page.getByRole('button', { name: 'Закрыть практику' }).click()
  await page.getByRole('button', { name: 'Настройки' }).click()
  await page.getByRole('button', { name: 'Сменить персонажа' }).click()
  await expect(page.getByRole('button', { name: /Девушка/ })).toBeVisible()
})

test('renders presenter cards at compact iPhone dimensions', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/')
  await acknowledgeSafety(page)
  await expect(page.getByRole('button', { name: /Девушка/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Парень/ })).toBeVisible()
  await page.screenshot({ path: 'output/playwright/spine-flow-presenters-320.png', fullPage: true })
  await page.setViewportSize({ width: 375, height: 812 })
  await page.screenshot({ path: 'output/playwright/spine-flow-presenters-375.png', fullPage: true })
})

for (const { id: presenter, name } of coreBackPresenters) {
  test(`opens the 13-minute core and back practice with ${presenter} images`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await acknowledgeSafety(page)
    await selectPresenter(page, name)
    await page.getByRole('button', { name: /Средний/ }).click()
    await page.getByRole('button', { name: '13 минут: кор и спина' }).click()

    const visual = page.locator('.practice-visual img').last()
    await expect(page.getByText('Шаг 1 из 12', { exact: true })).toBeVisible()
    await expect(page.getByText('13 минут: кор и спина', { exact: true })).toBeVisible()
    await expect(visual).toHaveAttribute('src', `/images/${presenter}/core-preparation.webp`)
    await expectImageLoaded(visual)
    await expect(page.locator('.timer')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Следующий шаг' })).toBeVisible()
    await prepareCoreBackScreenshot(
      page,
      page.getByRole('button', { name: 'Закрыть практику' }),
      page.getByText('Шаг 1 из 12', { exact: true }),
    )
    await page.screenshot({ path: `output/playwright/spine-flow-core-back-${presenter}-375.png`, fullPage: false, scale: 'css' })

    for (const locator of [visual, page.locator('.practice-content p').first(), page.locator('.timer'), page.locator('.practice-controls')]) {
      await expectInViewport(page, locator)
    }

    for (const { advance, fileName } of coreBackImages) {
      for (let index = 0; index < advance; index += 1) {
        await page.getByRole('button', { name: 'Следующий шаг' }).click()
      }
      await expect(visual).toHaveAttribute('src', `/images/${presenter}/${fileName}`)
      await expectImageLoaded(visual)
    }

    for (let step = 8; step <= 12; step += 1) {
      await page.getByRole('button', { name: 'Следующий шаг' }).click()
    }
    await expect(page.getByText('Практика завершена', { exact: true })).toBeVisible()
  })
}

for (const { id: presenter, name } of coreBackPresenters) {
  test(`opens the 15-minute strength and mobility practice with ${presenter} images`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await acknowledgeSafety(page)
    await selectPresenter(page, name)
    await page.getByRole('button', { name: /Средний/ }).click()
    await expect(page.getByRole('heading', { name: '15 минут: сила и подвижность' })).toBeVisible()
    await page.getByRole('button', { name: 'Начать' }).click()

    const visual = page.locator('.practice-visual img').last()
    await expect(page.getByText('Шаг 1 из 16', { exact: true })).toBeVisible()
    await expect(page.getByText('15 минут: сила и подвижность', { exact: true })).toBeVisible()
    await expect(visual).toHaveAttribute('src', `/images/${presenter}/intermediate-preparation.webp`)
    await expectImageLoaded(visual)
    await expect(page.locator('.timer')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Следующий шаг' })).toBeVisible()
    await prepareCoreBackScreenshot(
      page,
      page.getByRole('button', { name: 'Закрыть практику' }),
      page.getByText('Шаг 1 из 16', { exact: true }),
    )
    await page.screenshot({ path: `output/playwright/spine-flow-strength-mobility-${presenter}-375.png`, fullPage: false, scale: 'css' })

    for (const locator of [visual, page.locator('.practice-content p').first(), page.locator('.timer'), page.locator('.practice-controls')]) {
      await expectInViewport(page, locator)
    }

    for (const { advance, fileName } of strengthMobilityImages) {
      for (let index = 0; index < advance; index += 1) {
        await page.getByRole('button', { name: 'Следующий шаг' }).click()
      }
      await expect(visual).toHaveAttribute('src', `/images/${presenter}/${fileName}`)
      await expectImageLoaded(visual)
    }

    await page.getByRole('button', { name: 'Следующий шаг' }).click()
    await expect(visual).toHaveAttribute('src', `/images/${presenter}/intermediate-rest.webp`)
    await expectImageLoaded(visual)

    await page.getByRole('button', { name: 'Следующий шаг' }).click()
    await expect(page.getByText('Практика завершена', { exact: true })).toBeVisible()
  })
}

for (const { id: presenter, name } of coreBackPresenters) {
  test(`opens the gym warmup with ${presenter} images`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await acknowledgeSafety(page)
    await selectPresenter(page, name)
    await page.getByRole('button', { name: /Средний/ }).click()
    await page.getByRole('button', { name: '15 минут: разминка в спортзале' }).click()

    const visual = page.locator('.practice-visual img').last()
    await expect(page.getByText('Шаг 1 из 15', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Ходьба на месте с махами рук' })).toBeVisible()
    await expect(visual).toHaveAttribute('src', `/images/${presenter}/gym-warmup-march.webp`)
    await expectImageLoaded(visual)
    await expectInViewport(page, visual)

    await page.getByRole('button', { name: 'Следующий шаг' }).click()
    await expect(page.getByRole('heading', { name: 'Повороты головы' })).toBeVisible()
    await expect(visual).toHaveAttribute('src', `/images/${presenter}/gym-warmup-neck-turns.webp`)
    await expectImageLoaded(visual)
    await page.screenshot({ path: `output/playwright/spine-flow-gym-warmup-${presenter}-375.png`, fullPage: false, scale: 'css' })
  })
}
