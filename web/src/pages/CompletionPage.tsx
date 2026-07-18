import { Check } from 'lucide-react'
import type { JSX } from 'react'

interface CompletionPageProps { readonly onDone: () => void }

export function CompletionPage({ onDone }: CompletionPageProps): JSX.Element {
  return <main className="completion-page app-shell"><div className="completion-mark"><Check size={34} /></div><p className="notice-mark">Spine Flow</p><h1>Практика завершена</h1><p>Спасибо, что нашли время для себя.</p><button className="button button-primary" onClick={onDone}>Готово</button></main>
}
