import API_URL from '../../config/api'

const BASE = `${API_URL}/api/admin/announcements`

// FIX: Check sessionStorage first (active session), then fallback to localStorage
const getToken = () => sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken') || ''

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
})

export const getAnnouncements = async () => {
  const res = await fetch(BASE, { headers: authHeaders() })
  const data = await res.json()
  return data.data || []
}

export const createAnnouncement = async (payload: {
  title?: string
  message: string
  is_active: boolean
}) => {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to create')
  return data.data
}

export const updateAnnouncement = async (
  id: number,
  payload: { title?: string; message: string; is_active: boolean }
) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update')
  return data.data
}

export const toggleAnnouncement = async (id: number, is_active: boolean) => {
  const res = await fetch(`${BASE}/${id}/toggle`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ is_active }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to toggle')
  return data.data
}

export const deleteAnnouncement = async (id: number) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to delete')
  return data
}