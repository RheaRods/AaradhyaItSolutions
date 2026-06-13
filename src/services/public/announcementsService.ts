import API_URL from '../../config/api'

export const getActiveAnnouncement = async (): Promise<{
  announcement_id: number
  title: string | null
  message: string
  is_active: boolean
} | null> => {
  try {
    const res = await fetch(`${API_URL}/api/public/announcements/active`)
    const data = await res.json()
    return data.data || null
  } catch {
    return null
  }
}