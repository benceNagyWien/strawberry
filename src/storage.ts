export interface AppData {
  targetDate: string
  creationDate: string
  flagEmoji: string
  leftEmoji: string
  rightEmoji: string
}

const KEY = 'countdown_data'

function envDefaults(): AppData | null {
  const targetDate = import.meta.env.VITE_DEFAULT_TARGET_DATE
  if (!targetDate) return null
  return {
    targetDate,
    creationDate: import.meta.env.VITE_DEFAULT_CREATION_DATE || new Date().toISOString(),
    flagEmoji: import.meta.env.VITE_DEFAULT_FLAG_EMOJI || '🏳️',
    leftEmoji: import.meta.env.VITE_DEFAULT_LEFT_EMOJI || '👦',
    rightEmoji: import.meta.env.VITE_DEFAULT_RIGHT_EMOJI || '👧',
  }
}

export function loadData(): AppData | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return envDefaults()
  try {
    return JSON.parse(raw) as AppData
  } catch {
    return envDefaults()
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}
