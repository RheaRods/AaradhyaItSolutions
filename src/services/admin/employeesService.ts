import API_URL from '../../config/api'

const API_BASE = `${API_URL}/api/admin/employees`
const getToken = () => sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken') || ''
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
})

export const getAllEmployeesAdmin = async () => {
  const res = await fetch(API_BASE, { headers: authHeaders() })
  if (!res.ok) throw new Error('Failed to fetch employees')
  return res.json()
}

export const createEmployeeAdmin = async (data: any) => {
  const res = await fetch(API_BASE, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) })
  if (!res.ok) throw new Error('Failed to create employee')
  return res.json()
}

export const updateEmployeeAdmin = async (id: number, data: any) => {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) })
  if (!res.ok) throw new Error('Failed to update employee')
  return res.json()
}

export const deleteEmployeeAdmin = async (id: number) => {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: authHeaders() })
  if (!res.ok) throw new Error('Failed to delete employee')
  return res.json()
}