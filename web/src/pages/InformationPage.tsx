import { ChevronLeft, Mail } from 'lucide-react'
import type { JSX } from 'react'

type InformationKind = 'support' | 'privacy'

interface InformationPageProps {
  readonly kind: InformationKind
  readonly onBack: () => void
}

const supportEmail = 'nefrit333@gmail.com'

export function InformationPage({ kind, onBack }: InformationPageProps): JSX.Element {
  const isSupport = kind === 'support'
  const title = isSupport ? 'Поддержка' : 'Конфиденциальность'

  return <main className="app-shell information-page">
    <header className="page-topbar">
      <button className="icon-button" type="button" aria-label="Назад" onClick={onBack}><ChevronLeft size={23} /></button>
      <h1>{title}</h1>
      <span className="page-topbar-spacer" aria-hidden="true" />
    </header>
    {isSupport ? <section className="information-copy">
      <p>Напишите, если нужен ответ по работе приложения или вы нашли ошибку. В письме укажите модель iPhone и коротко опишите ситуацию.</p>
      <a className="button button-primary information-contact" href={`mailto:${supportEmail}`}><Mail size={19} />Написать в поддержку</a>
    </section> : <section className="information-copy">
      <p>Spine Flow не создаёт аккаунты и не передаёт данные на собственный сервер.</p>
      <p>На устройстве сохраняются только выбранный персонаж, согласие с предупреждением и прогресс практик. Эти данные нужны для работы интерфейса и доступны только в браузере на этом устройстве.</p>
      <p>В приложении нет аналитики, рекламы, трекеров, платежей и передачи персональных данных третьим лицам.</p>
      <p>Удалить сохранённые данные можно в настройках приложения.</p>
    </section>}
  </main>
}
