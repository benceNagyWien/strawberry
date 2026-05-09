export interface AppData {
  targetDate: string
  creationDate: string
  flagEmoji: string
  leftEmoji: string
  rightEmoji: string
}

const KEY = 'countdown_data'

export function loadData(): AppData | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AppData
  } catch {
    return null
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}
