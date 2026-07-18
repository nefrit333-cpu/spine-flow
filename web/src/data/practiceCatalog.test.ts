import { expect, test } from 'vitest'
import { getDurationMinutes, getPracticesByLevel, practices } from './practiceCatalog'

test('keeps the five approved beginner practices', () => {
  expect(getPracticesByLevel('beginner').map((practice) => practice.id)).toEqual([
    'neck', 'shoulders', 'lower-back', 'desk-reset', 'evening-back',
  ])
  expect(getPracticesByLevel('beginner').map(getDurationMinutes)).toEqual([5, 7, 10, 12, 15])
})

test('uses a unique step ID for every catalog illustration', () => {
  const stepIds = practices.flatMap((practice) => practice.steps.map((step) => step.id))
  expect(new Set(stepIds).size).toBe(stepIds.length)
})

test('assigns a local cover to every practice', () => {
  expect(practices.every((practice) => practice.coverImage.startsWith('/images/'))).toBe(true)
})

test('contains the exact thirteen-minute core practice contract', () => {
  const intermediate = getPracticesByLevel('intermediate')
  const core = intermediate.find((practice) => practice.id === 'core-back')

  expect(intermediate).toHaveLength(4)
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
    { id: 'core-side-plank', title: 'Боковая планка', durationSeconds: 120 },
    { id: 'core-child-pose', title: 'Поза ребёнка', durationSeconds: 90 },
    { id: 'core-rest', title: 'Завершение практики', durationSeconds: 30 },
  ])
  expect(core?.steps.some((step) => /подход/i.test(step.title))).toBe(false)
  expect(core?.title).toBe('13 минут: кор и спина')
  expect(core?.steps.find((step) => step.id === 'core-side-plank')?.instruction).toContain('Через 1 минуту')
  expect(core?.steps.reduce((sum, step) => sum + step.durationSeconds, 0)).toBe(780)
})

test('contains the complete fifteen-minute intermediate practice', () => {
  const intermediatePractices = getPracticesByLevel('intermediate')
  const [practice] = intermediatePractices

  expect(getPracticesByLevel('intermediate')).toHaveLength(4)
  expect(practice.id).toBe('strength-mobility')
  expect(practice.level).toBe('intermediate')
  expect(practice.title).toBe('15 минут: сила и подвижность')
  expect(practice.subtitle).toBe('Функциональная практика для уверенного темпа')
  expect(practice.accent).toBe('blue')
  expect(practice.steps.map(({ id, title, durationSeconds }) => ({ id, title, durationSeconds }))).toEqual([
    { id: 'intermediate-preparation', title: 'Подготовка', durationSeconds: 30 },
    { id: 'cat-cow', title: 'Кошка-корова', durationSeconds: 60 },
    { id: 'air-squat', title: 'Приседания', durationSeconds: 60 },
    { id: 'calf-raises', title: 'Подъёмы на носки', durationSeconds: 30 },
    { id: 'reverse-lunge', title: 'Обратные выпады', durationSeconds: 60 },
    { id: 'side-lunge', title: 'Боковые выпады', durationSeconds: 60 },
    { id: 'wall-pushup', title: 'Отжимания от стены', durationSeconds: 60 },
    { id: 'knee-pushup', title: 'Отжимания с колен', durationSeconds: 60 },
    { id: 'bird-dog', title: 'Птица-собака', durationSeconds: 60 },
    { id: 'bridge-march', title: 'Мост с шагом', durationSeconds: 60 },
    { id: 'superman', title: 'Супермен', durationSeconds: 60 },
    { id: 'shoulder-tap-plank', title: 'Планка с касанием плеч', durationSeconds: 60 },
    { id: 'forearm-plank', title: 'Планка на предплечьях', durationSeconds: 60 },
    { id: 'bear-hover', title: 'Медвежья стойка', durationSeconds: 60 },
    { id: 'intermediate-child-pose', title: 'Поза ребёнка', durationSeconds: 60 },
    { id: 'intermediate-rest', title: 'Завершение практики', durationSeconds: 60 },
  ])
  expect(practice.steps).toHaveLength(16)
  expect(getDurationMinutes(practice)).toBe(15)
  expect(practice.steps.every((step) => !/подход/i.test(`${step.title} ${step.instruction}`))).toBe(true)
  expect(practice.steps.reduce((sum, step) => sum + step.durationSeconds, 0)).toBe(900)
  expect(practice.steps.map((step) => step.id)).not.toEqual(expect.arrayContaining([
    'cat-cow-second', 'reverse-lunge-left', 'bird-dog-left', 'glute-bridge',
  ]))
})

test('keeps every practice assigned to an available level', () => {
  expect(practices.every((practice) => practice.level === 'beginner' || practice.level === 'intermediate')).toBe(true)
})

test('starts and finishes established practices with the expected boundary steps', () => {
  for (const practice of practices.filter((item) => item.id !== 'gym-warmup')) {
    expect(practice.steps[0]).toMatchObject({ title: 'Подготовка', durationSeconds: 30 })
    expect(practice.steps.at(-1)).toMatchObject({ title: 'Завершение практики' })
  }
})

test('contains the approved fifteen-minute gym warmup without boundary steps', () => {
  const practice = practices.find((item) => item.id === 'gym-warmup')

  expect(practice).toMatchObject({
    level: 'intermediate',
    title: '15 минут: разминка в спортзале',
    subtitle: 'Динамическая подготовка перед тренировкой',
    accent: 'sage',
  })
  expect(practice?.steps).toHaveLength(15)
  expect(practice?.steps.every((step) => step.durationSeconds === 60)).toBe(true)
  expect(practice?.steps.reduce((sum, step) => sum + step.durationSeconds, 0)).toBe(900)
  expect(practice?.steps.map((step) => step.title)).not.toEqual(expect.arrayContaining(['Подготовка', 'Завершение практики']))
})

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

test('keeps the approved two-minute side plank as the only extended exercise', () => {
  const extendedSteps = practices.flatMap((practice) => practice.steps
    .filter((step) => step.durationSeconds > 90)
    .map((step) => ({ practiceId: practice.id, stepId: step.id, durationSeconds: step.durationSeconds })))

  expect(extendedSteps).toEqual([
    { practiceId: 'core-back', stepId: 'core-side-plank', durationSeconds: 120 },
  ])
})

test('matches every practice duration to the minutes in its title', () => {
  for (const practice of practices) {
    const expectedMinutes = Number.parseInt(practice.title, 10)
    expect(getDurationMinutes(practice)).toBe(expectedMinutes)
  }
})
