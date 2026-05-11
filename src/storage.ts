export interface AppData {
  targetDate: string
  creationDate: string
  flagEmoji: string
  leftEmoji: string
  rightEmoji: string
}

const LOCAL_KEY = 'countdown_data'
const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID as string | undefined
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY as string | undefined

export async function loadData(): Promise<AppData | null> {
  if (BIN_ID && API_KEY) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY },
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.record as AppData
        localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
        return data
      }
    } catch { /* fall through to localStorage */ }
  }
  const raw = localStorage.getItem(LOCAL_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AppData
  } catch {
    return null
  }
}

export async function saveData(data: AppData): Promise<void> {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
  if (BIN_ID && API_KEY) {
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
      },
      body: JSON.stringify(data),
    })
  }
}
