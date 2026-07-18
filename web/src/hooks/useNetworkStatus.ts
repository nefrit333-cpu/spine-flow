import { useEffect, useState } from 'react'

export function useNetworkStatus(): { readonly isOnline: boolean; readonly retry: () => void } {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const online = (): void => setIsOnline(true)
    const offline = (): void => setIsOnline(false)
    window.addEventListener('online', online)
    window.addEventListener('offline', offline)
    return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline) }
  }, [])
  return { isOnline, retry: () => window.location.reload() }
}
