import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-auto lg:ml-0">
        <div className="lg:hidden h-14 shrink-0" />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout