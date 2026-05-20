import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout