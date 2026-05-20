import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, Package, MessageSquare, Star,
  Settings, LogOut, Menu, X
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Products', path: '/admin/products', icon: <Package size={18} /> },
  { label: 'Inquiries', path: '/admin/inquiries', icon: <MessageSquare size={18} /> },
  { label: 'Reviews', path: '/admin/reviews', icon: <Star size={18} /> },
  { label: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
]

// 1. SidebarContent moved outside to remove the re-creation bug
interface SidebarContentProps {
  isActive: (path: string) => boolean
  setMobileOpen: (open: boolean) => void
  navigate: (path: string) => void
}

const SidebarContent = ({ isActive, setMobileOpen, navigate }: SidebarContentProps) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="px-6 py-5">
      <p className="font-extrabold text-white text-lg leading-tight">AARADHYA IT</p>
      <p className="text-blue-200 text-xs mt-0.5">Admin Panel</p>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-2 space-y-1">
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive(item.path)
              ? 'bg-white text-blue-700'
              : 'text-blue-100 hover:bg-blue-700 hover:text-white'
          }`}
        >
          <span>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>

    {/* Bottom user + logout */}
    <div className="px-4 py-5 border-t border-blue-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center shrink-0">
          <span className="text-gray-600 text-xs font-bold">A</span>
        </div>
        <div>
          <p className="text-white text-sm font-semibold">Admin</p>
          <p className="text-blue-300 text-xs">Super Admin</p>
        </div>
      </div>
      <button
        onClick={() => navigate('/admin/login')}
        className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors w-full"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  </div>
)

const AdminSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-blue-600 min-h-screen shrink-0">
        <SidebarContent isActive={isActive} setMobileOpen={setMobileOpen} navigate={navigate} />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-blue-600 px-4 py-3 flex items-center justify-between">
        <p className="font-extrabold text-white text-base">AARADHYA IT</p>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-1">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-blue-600 pt-14">
            <SidebarContent isActive={isActive} setMobileOpen={setMobileOpen} navigate={navigate} />
          </aside>
        </div>
      )}

      {/* Mobile spacer */}
      <div className="lg:hidden h-12 shrink-0" />
    </>
  )
}

export default AdminSidebar