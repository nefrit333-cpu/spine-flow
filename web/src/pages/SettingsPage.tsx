import { ChevronLeft, ChevronRight, RotateCcw, Trash2 } from 'lucide-react'
import type { JSX } from 'react'

interface SettingsPageProps {
  readonly onBack: () => void
  readonly onChangePresenter: () => void
  readonly onOpenSupport: () => void
  readonly onOpenPrivacy: () => void
  readonly onClearData: () => void
}

export function SettingsPage({ onBack, onChangePresenter, onOpenSupport, onOpenPrivacy, onClearData }: SettingsPageProps): JSX.Element {
  return <main className="app-shell settings-page">
    <header className="page-topbar">
      <button className="icon-button" type="button" aria-label="Назад" onClick={onBack}><ChevronLeft size={23} /></button>
      <h1>Настройки</h1>
      <span className="page-topbar-spacer" aria-hidden="true" />
    </header>
    <section className="settings-list" aria-label="Настройки приложения">
      <button className="settings-row" type="button" onClick={onChangePresenter}><span><RotateCcw size={20} />Сменить персонажа</span><ChevronRight size={20} /></button>
      <button className="settings-row" type="button" onClick={onOpenSupport}><span>Поддержка</span><ChevronRight size={20} /></button>
      <button className="settings-row" type="button" onClick={onOpenPrivacy}><span>Конфиденциальность</span><ChevronRight size={20} /></button>
    </section>
    <section className="settings-danger" aria-label="Данные приложения">
      <p>Прогресс и настройки хранятся только на этом устройстве.</p>
      <button className="settings-row settings-row-danger" type="button" onClick={onClearData}><span><Trash2 size={20} />Удалить данные с устройства</span></button>
    </section>
  </main>
}
