import type { Practice } from '../domain/practice'
import type { PracticeLevel } from '../domain/level'

export const practices: ReadonlyArray<Practice> = [
  {
    id: 'neck', level: 'beginner', title: '5 минут для шеи', subtitle: 'Мягкая пауза после работы', coverImage: '/images/neck-right-tilt-color.webp', accent: 'sage',
    steps: [
      { id: 'neck-preparation', title: 'Подготовка', instruction: 'Встаньте устойчиво, положите ладони на нижние рёбра и сделайте несколько медленных вдохов. Почувствуйте, как рёбра мягко расширяются, а плечи остаются расслабленными.', durationSeconds: 30 },
      { id: 'neck-right-tilt', title: 'Наклон вправо', instruction: 'Мягко наклоните голову к правому плечу. Остановитесь там, где ощущается лёгкое вытяжение с левой стороны шеи, без боли и усилия.', durationSeconds: 60 },
      { id: 'neck-left-tilt', title: 'Наклон влево', instruction: 'Мягко наклоните голову к левому плечу. Сохраняйте плечи опущенными и почувствуйте спокойное вытяжение с правой стороны шеи.', durationSeconds: 60 },
      { id: 'neck-turns', title: 'Повороты', instruction: 'Поверните голову вправо и влево в комфортной амплитуде. Двигайтесь медленно и замечайте, как шея постепенно расслабляется.', durationSeconds: 60 },
      { id: 'neck-lengthen', title: 'Вытяжение макушки', instruction: 'Потянитесь макушкой вверх, не поднимая плечи. Почувствуйте длинную, устойчивую линию от шеи к позвоночнику и сделайте несколько ровных вдохов.', durationSeconds: 60 },
      { id: 'neck-rest', title: 'Завершение практики', instruction: 'Вернитесь в нейтральное положение. Почувствуйте, как плечи становятся тяжелее, а шея остаётся свободной и мягкой.', durationSeconds: 30 },
    ],
  },
  {
    id: 'shoulders', level: 'beginner', title: '7 минут для плеч', subtitle: 'Спокойная разгрузка верхней части тела', coverImage: '/images/shoulders-circles-color.webp', accent: 'sage',
    steps: [
      { id: 'shoulders-preparation', title: 'Подготовка', instruction: 'Встаньте устойчиво, положите ладони на нижние рёбра и сделайте несколько медленных вдохов. Не поднимайте плечи и почувствуйте спокойную опору под стопами.', durationSeconds: 30 },
      { id: 'shoulders-lift', title: 'Подъём плеч', instruction: 'На вдохе поднимите плечи, на выдохе мягко опустите.', durationSeconds: 60 },
      { id: 'shoulders-circles', title: 'Круги плечами', instruction: 'Сделайте медленные круги плечами назад.', durationSeconds: 60 },
      { id: 'shoulders-open-chest', title: 'Раскрытие груди', instruction: 'Уведите руки назад настолько, насколько комфортно.', durationSeconds: 60 },
      { id: 'shoulders-cross-right', title: 'Растяжка правого плеча', instruction: 'Мягко направьте правую руку поперёк груди, не давите на локоть.', durationSeconds: 60 },
      { id: 'shoulders-cross-left', title: 'Растяжка левого плеча', instruction: 'Мягко направьте левую руку поперёк груди, сохраняя плечо опущенным.', durationSeconds: 60 },
      { id: 'shoulders-blades', title: 'Сведение лопаток', instruction: 'Плавно направляйте лопатки друг к другу и отпускайте без прогиба в пояснице.', durationSeconds: 60 },
      { id: 'shoulders-finish', title: 'Завершение практики', instruction: 'Опустите руки, расслабьте плечи и восстановите спокойное дыхание.', durationSeconds: 30 },
    ],
  },
  {
    id: 'lower-back', level: 'beginner', title: '10 минут для поясницы', subtitle: 'Мягкое движение после долгого сидения', coverImage: '/images/lower-back-pelvis-color.webp', accent: 'coral',
    steps: [
      { id: 'lower-back-preparation', title: 'Подготовка', instruction: 'Встаньте устойчиво, положите ладони на нижние рёбра и спокойно подышите. Расслабьте живот и не прогибайте поясницу.', durationSeconds: 30 },
      { id: 'lower-back-pelvis', title: 'Наклоны таза', instruction: 'Мягко меняйте положение таза, не задерживая дыхание.', durationSeconds: 90 },
      { id: 'lower-back-knee-rolls', title: 'Колени из стороны в сторону', instruction: 'Плавно опускайте согнутые колени вправо и влево в комфортной амплитуде.', durationSeconds: 90 },
      { id: 'lower-back-bridge', title: 'Ягодичный мост', instruction: 'Поднимайте таз до комфортной высоты, сохраняя опору в стопах.', durationSeconds: 90 },
      { id: 'lower-back-child', title: 'Поза ребёнка', instruction: 'Опустите таз к пяткам и мягко вытяните спину.', durationSeconds: 90 },
      { id: 'lower-back-cat-cow', title: 'Кошка-корова', instruction: 'Плавно округляйте и удлиняйте позвоночник вместе с дыханием.', durationSeconds: 60 },
      { id: 'lower-back-knee-chest', title: 'Колено к груди', instruction: 'Поочерёдно подтягивайте колено к груди до мягкого вытяжения.', durationSeconds: 60 },
      { id: 'lower-back-bird-dog', title: 'Птица-собака', instruction: 'Вытягивайте противоположные руку и ногу, удерживая таз ровным.', durationSeconds: 60 },
      { id: 'lower-back-finish', title: 'Завершение практики', instruction: 'Вернитесь в удобное положение и сделайте несколько ровных вдохов.', durationSeconds: 30 },
    ],
  },
  {
    id: 'desk-reset', level: 'beginner', title: '12 минут после дня за столом', subtitle: 'Неспешное переключение после работы', coverImage: '/images/desk-reset-side-stretch-color.webp', accent: 'blue',
    steps: [
      { id: 'desk-reset-preparation', title: 'Подготовка', instruction: 'Встаньте устойчиво, положите ладони на нижние рёбра и спокойно подышите. Расслабьте челюсть, шею и плечи.', durationSeconds: 30 },
      { id: 'desk-reset-side-stretch', title: 'Боковое вытяжение', instruction: 'Потянитесь рукой вверх и слегка в сторону, затем поменяйте сторону.', durationSeconds: 90 },
      { id: 'desk-reset-torso-turn', title: 'Поворот корпуса', instruction: 'Сделайте плавный поворот вправо и влево без рывков.', durationSeconds: 90 },
      { id: 'desk-reset-hip-right', title: 'Сгибатель бедра справа', instruction: 'Сделайте небольшой выпад и мягко направьте таз вперёд.', durationSeconds: 90 },
      { id: 'desk-reset-hip-left', title: 'Сгибатель бедра слева', instruction: 'Поменяйте сторону и сохраняйте корпус вертикальным.', durationSeconds: 90 },
      { id: 'desk-reset-forward-fold', title: 'Наклон вперёд сидя', instruction: 'Удлиняйте спину и наклоняйтесь только до комфортного вытяжения.', durationSeconds: 90 },
      { id: 'desk-reset-seated-cat-cow', title: 'Кошка-корова сидя', instruction: 'Плавно округляйте и раскрывайте грудной отдел вместе с дыханием.', durationSeconds: 90 },
      { id: 'desk-reset-shoulder-circles', title: 'Круги плечами', instruction: 'Медленно направляйте плечи вверх, назад и вниз.', durationSeconds: 60 },
      { id: 'desk-reset-open-chest', title: 'Раскрытие груди', instruction: 'Мягко отведите руки назад и сохраните свободное дыхание.', durationSeconds: 60 },
      { id: 'desk-reset-finish', title: 'Завершение практики', instruction: 'Вернитесь в нейтральную стойку и расслабьте плечи.', durationSeconds: 30 },
    ],
  },
  {
    id: 'evening-back', level: 'beginner', title: '15 минут вечернего расслабления спины', subtitle: 'Спокойное завершение дня', coverImage: '/images/evening-back-rest-color.webp', accent: 'lilac',
    steps: [
      { id: 'evening-back-preparation', title: 'Подготовка', instruction: 'Встаньте устойчиво, положите ладони на нижние рёбра и сделайте несколько медленных вдохов. Настройтесь на спокойный темп практики.', durationSeconds: 30 },
      { id: 'evening-back-breath', title: 'Дыхание лёжа', instruction: 'Наблюдайте за мягким движением живота на вдохе и выдохе.', durationSeconds: 90 },
      { id: 'evening-back-knee-rolls', title: 'Колени из стороны в сторону', instruction: 'Плавно перемещайте согнутые колени в комфортной амплитуде.', durationSeconds: 90 },
      { id: 'evening-back-knee-right', title: 'Правое колено к груди', instruction: 'Подтяните правое колено до мягкого вытяжения поясницы.', durationSeconds: 90 },
      { id: 'evening-back-knee-left', title: 'Левое колено к груди', instruction: 'Поменяйте сторону, не поднимая плечи.', durationSeconds: 90 },
      { id: 'evening-back-figure-right', title: 'Фигура четыре справа', instruction: 'Лягте на спину и положите правую лодыжку на левое бедро чуть выше колена. Обхватите левое бедро руками и мягко подтяните его к груди, оставляя правое колено направленным в сторону.', durationSeconds: 90 },
      { id: 'evening-back-figure-left', title: 'Фигура четыре слева', instruction: 'Поменяйте сторону и избегайте давления на колено.', durationSeconds: 90 },
      { id: 'evening-back-twist-right', title: 'Скручивание вправо', instruction: 'Опустите согнутые колени вправо, сохраняя плечи расслабленными.', durationSeconds: 90 },
      { id: 'evening-back-twist-left', title: 'Скручивание влево', instruction: 'Поменяйте сторону и не двигайтесь через боль.', durationSeconds: 90 },
      { id: 'evening-back-child', title: 'Поза ребёнка', instruction: 'Мягко вытяните спину и направьте дыхание в рёбра.', durationSeconds: 90 },
      { id: 'evening-back-rest', title: 'Спокойный отдых', instruction: 'Полежите спокойно, наблюдая за дыханием.', durationSeconds: 30 },
      { id: 'evening-back-finish', title: 'Завершение практики', instruction: 'Мягко вернитесь в комфортное положение.', durationSeconds: 30 },
    ],
  },
  {
    id: 'strength-mobility',
    level: 'intermediate',
    title: '15 минут: сила и подвижность',
    subtitle: 'Функциональная практика для уверенного темпа',
    coverImage: '/images/reverse-lunge.webp',
    accent: 'blue',
    steps: [
      { id: 'intermediate-preparation', title: 'Подготовка', instruction: 'Встаньте ровно, положите ладони на нижние рёбра и спокойно подышите. Почувствуйте устойчивую опору под стопами; если есть боль или недомогание, остановитесь.', durationSeconds: 30 },
      { id: 'cat-cow', title: 'Кошка-корова', instruction: 'Встаньте на четвереньки и плавно чередуйте прогиб и округление спины вместе с дыханием.', durationSeconds: 60 },
      { id: 'air-squat', title: 'Приседания', instruction: 'Отведите таз назад, сохраняйте контроль коленей и поднимайтесь плавно.', durationSeconds: 60 },
      { id: 'calf-raises', title: 'Подъёмы на носки', instruction: 'Поднимите обе пятки и мягко опустите их на коврик. Держите корпус ровно, двигайтесь без раскачивания и сохраняйте спокойное дыхание.', durationSeconds: 30 },
      { id: 'reverse-lunge', title: 'Обратные выпады', instruction: 'Поочерёдно шагайте назад правой и левой ногой, держите корпус устойчивым и сохраняйте колено по линии стопы.', durationSeconds: 60 },
      { id: 'side-lunge', title: 'Боковые выпады', instruction: 'Поочерёдно шагайте в сторону правой и левой ногой, сгибайте опорное колено и контролируйте положение опорной стопы.', durationSeconds: 60 },
      { id: 'wall-pushup', title: 'Отжимания от стены', instruction: 'Сохраняйте длинную линию корпуса, плавно сгибайте локти и выдыхайте при возвращении.', durationSeconds: 60 },
      { id: 'knee-pushup', title: 'Отжимания с колен', instruction: 'Поставьте ладони чуть шире плеч и опустите колени на коврик. Сохраняйте прямую линию от макушки до колен, сгибайте локти плавно.', durationSeconds: 60 },
      { id: 'bird-dog', title: 'Птица-собака', instruction: 'Поочерёдно вытягивайте правую руку и левую ногу, затем левую руку и правую ногу, удерживая таз ровным.', durationSeconds: 60 },
      { id: 'bridge-march', title: 'Мост с шагом', instruction: 'Поднимите таз и поочерёдно отрывайте от коврика правую и левую стопу, сохраняя таз на одном уровне.', durationSeconds: 60 },
      { id: 'superman', title: 'Супермен', instruction: 'Лягте на живот и вытяните руки вперёд. Мягко приподнимайте руки и ноги, оставляя шею продолжением позвоночника и не запрокидывая голову.', durationSeconds: 60 },
      { id: 'shoulder-tap-plank', title: 'Планка с касанием плеч', instruction: 'Из высокой планки поочерёдно касайтесь правой ладонью левого плеча и левой ладонью правого плеча, удерживая таз ровным.', durationSeconds: 60 },
      { id: 'forearm-plank', title: 'Планка на предплечьях', instruction: 'Поставьте локти под плечами и вытяните тело в одну линию. Подтяните живот, не проваливайте поясницу и дышите ровно.', durationSeconds: 60 },
      { id: 'bear-hover', title: 'Медвежья стойка', instruction: 'Встаньте на четвереньки и приподнимите колени на несколько сантиметров над ковриком. Сохраняйте спину ровной и распределяйте вес между ладонями и стопами.', durationSeconds: 60 },
      { id: 'intermediate-child-pose', title: 'Поза ребёнка', instruction: 'Опустите таз к пяткам и вытяните руки вперёд. Дышите мягко и спокойно, позволяя спине расслабиться.', durationSeconds: 60 },
      { id: 'intermediate-rest', title: 'Завершение практики', instruction: 'Устройтесь на спине, расслабьте руки и ноги и спокойно дышите.', durationSeconds: 60 },
    ],
  },
  {
    id: 'core-back',
    level: 'intermediate',
    title: '13 минут: кор и спина',
    subtitle: 'Стабильность корпуса и мягкая сила спины',
    coverImage: '/images/core-dead-bug.webp',
    accent: 'coral',
    steps: [
      { id: 'core-preparation', title: 'Подготовка', instruction: 'Встаньте устойчиво, положите ладони на нижние рёбра и сделайте несколько спокойных вдохов. Слегка подтяните живот и сохраняйте естественное положение поясницы.', durationSeconds: 30 },
      { id: 'core-cat-cow', title: 'Кошка-корова', instruction: 'Встаньте на четвереньки. На вдохе мягко удлиняйте позвоночник, на выдохе округляйте спину. Двигайтесь плавно и ощущайте подвижность без резкого давления.', durationSeconds: 90 },
      { id: 'core-dead-bug', title: 'Dead bug', instruction: 'Поочерёдно опускайте противоположные руку и ногу. Сохраняйте поясницу устойчивой, двигайтесь медленно и свободно дышите.', durationSeconds: 60 },
      { id: 'core-bird-dog', title: 'Птица-собака', instruction: 'Поочерёдно вытягивайте противоположные руку и ногу. Не разворачивайте таз и сохраняйте шею продолжением позвоночника.', durationSeconds: 60 },
      { id: 'core-bridge-march', title: 'Мост с шагом', instruction: 'Поднимите таз и поочерёдно отрывайте стопы от коврика. Удерживайте таз на одном уровне и не задерживайте дыхание.', durationSeconds: 60 },
      { id: 'core-heel-taps', title: 'Касания пяток лёжа', instruction: 'Лягте на спину, согните колени и слегка приподнимите плечи. Поочерёдно тянитесь ладонью к пятке, сохраняя поясницу устойчивой.', durationSeconds: 60 },
      { id: 'core-slow-mountain-climber', title: 'Медленный альпинист', instruction: 'Из высокой планки поочерёдно подтягивайте колено к корпусу. Двигайтесь без рывков, удерживайте таз устойчивым и не округляйте плечи.', durationSeconds: 60 },
      { id: 'core-bear-shoulder-taps', title: 'Медвежья стойка с касанием плеч', instruction: 'Приподнимите колени над ковриком и поочерёдно касайтесь ладонью противоположного плеча. Сохраняйте спину ровной и уменьшите амплитуду, если таз раскачивается.', durationSeconds: 60 },
      { id: 'core-forearm-plank', title: 'Планка на предплечьях', instruction: 'Поставьте локти под плечами и вытяните тело в одну линию. Подтяните живот, не проваливайте поясницу и сохраняйте ровное дыхание.', durationSeconds: 60 },
      { id: 'core-side-plank', title: 'Боковая планка', instruction: 'Опирайтесь на правое предплечье и согнутые колени, поднимите таз и удерживайте ровную боковую линию корпуса. Через 1 минуту плавно смените сторону и выполните вторую минуту с опорой на левое предплечье.', durationSeconds: 120 },
      { id: 'core-child-pose', title: 'Поза ребёнка', instruction: 'Опустите таз к пяткам и вытяните руки вперёд. Позвольте спине стать длиннее, а дыханию — мягким и спокойным.', durationSeconds: 90 },
      { id: 'core-rest', title: 'Завершение практики', instruction: 'Устройтесь удобно на спине, расслабьте руки и ноги.', durationSeconds: 30 },
    ],
  },
]

export const recommendedPractice = practices[0]

export function findPractice(id: string): Practice | undefined {
  return practices.find((practice) => practice.id === id)
}

export function getPracticesByLevel(level: PracticeLevel): ReadonlyArray<Practice> {
  return practices.filter((practice) => practice.level === level)
}

export function getRecommendedPractice(level: PracticeLevel): Practice {
  return getPracticesByLevel(level)[0]
}

export function getDurationMinutes(practice: Practice): number {
  return Math.round(practice.steps.reduce((total, step) => total + step.durationSeconds, 0) / 60)
}
