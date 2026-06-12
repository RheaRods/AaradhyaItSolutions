import API_URL from '../../config/api'

const BASE = `${API_URL}/api/admin/reports`
const getToken = () => localStorage.getItem('adminToken') || ''

const downloadCSV = async (url: string, filename: string) => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!res.ok) throw new Error('Export failed')
  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = filename
  a.click()
  URL.revokeObjectURL(objectUrl)
}

export const exportInquiriesCSV = () =>
  downloadCSV(
    `${BASE}/inquiries`,
    `inquiries_${new Date().toISOString().slice(0, 10)}.csv`
  )

export const exportProductsCSV = () =>
  downloadCSV(
    `${BASE}/products`,
    `products_${new Date().toISOString().slice(0, 10)}.csv`
  )