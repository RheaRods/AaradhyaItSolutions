import { Navigate } from 'react-router-dom'
import { getToken } from '../../services/admin/authService'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getToken()
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }
  return <>{children}</>
}

export default ProtectedRoute