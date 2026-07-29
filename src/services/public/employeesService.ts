import API_URL from '../../config/api'

export const getEmployees = async () => {
  const res = await fetch(`${API_URL}/api/public/employees`)
  if (!res.ok) throw new Error('Failed to fetch employees')
  return res.json()
}