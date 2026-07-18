import { RefreshCw } from 'lucide-react'
import type { JSX } from 'react'

interface NetworkBannerProps { readonly onRetry: () => void }

export function NetworkBanner({ onRetry }: NetworkBannerProps): JSX.Element {
  return <aside className="network-banner" role="status">
    <span>Нет подключения к интернету</span>
    <button className="icon-button" aria-label="Повторить загрузку" onClick={onRetry}><RefreshCw size={18} /></button>
  </aside>
}
