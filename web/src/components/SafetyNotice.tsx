import type { JSX } from 'react'

interface SafetyNoticeProps { readonly onContinue: () => void }

export function SafetyNotice({ onContinue }: SafetyNoticeProps): JSX.Element {
  return <div className="notice-backdrop" role="dialog" aria-modal="true" aria-labelledby="safety-title">
    <section className="notice">
      <p className="notice-mark">Spine Flow</p>
      <h2 id="safety-title">Практика в своём темпе</h2>
      <p>Spine Flow помогает сделать мягкую практику после рабочего дня и не заменяет консультацию специалиста.</p>
      <p>При боли, травме или ухудшении самочувствия прекратите занятие.</p>
      <button className="button button-primary" onClick={onContinue}>Продолжить</button>
    </section>
  </div>
}
