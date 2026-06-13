import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Package, MessageSquare,
  Settings, LogOut, Menu, X, Megaphone
} from 'lucide-react'
import { logout } from '../../services/admin/authService'
import API_URL from '../../config/api'

const navItems = [
  { label: 'Dashboard',      path: '/admin',               icon: <LayoutDashboard size={18} /> },
  { label: 'Products',       path: '/admin/products',      icon: <Package size={18} /> },
  { label: 'Inquiries',      path: '/admin/inquiries',     icon: <MessageSquare size={18} /> },
  { label: 'Announcements',  path: '/admin/announcements', icon: <Megaphone size={18} /> },
  { label: 'Settings',       path: '/admin/settings',      icon: <Settings size={18} /> },
]

interface SidebarContentProps {
  isActive: (path: string) => boolean
  setMobileOpen: (open: boolean) => void
  navigate: (path: string) => void
  adminName: string
  adminAvatar: string
}

const SidebarContent = ({ isActive, setMobileOpen, navigate, adminName, adminAvatar }: SidebarContentProps) => (
  <div className="flex flex-col h-full">
    <div className="px-6 py-5">
      <p className="font-extrabold text-white text-lg leading-tight">AARADHYA IT</p>
      <p className="text-blue-200 text-xs mt-0.5">Admin Panel</p>
    </div>

    <nav className="flex-1 px-3 py-2 space-y-1">
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive(item.path)
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-blue-100 hover:bg-blue-700 hover:text-white'
          }`}
        >
          <span>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>

    <div className="px-4 py-5 border-t border-blue-700">
      {/* 
        CHANGED: Wrapped the profile section in a Link to make it clickable 
        Added hover effects (-mx-2 p-2 rounded-xl hover:bg-blue-700) for visual feedback
      */}
      <Link 
        to="/admin/settings"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-3 mb-4 p-2 -mx-2 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer group"
        title="Go to Profile Settings"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-gray-300 ring-2 ring-transparent group-hover:ring-blue-300 transition-all">
          {adminAvatar ? (
            <img src={adminAvatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-600 text-xs font-bold">
              {adminName?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{adminName || 'Admin'}</p>
          <p className="text-blue-300 text-xs truncate">Super Admin</p>
        </div>
      </Link>
      
      <button
        onClick={() => { logout(); navigate('/admin/login') }}
        className="flex items-center gap-2 text-blue-200 hover:text-white hover:bg-blue-700 text-sm transition-colors w-full p-2 -mx-2 rounded-xl"
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
  
  // Initialize with local storage to avoid flashing empty state, but we will immediately verify with DB
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || 'Admin')
  const [adminAvatar, setAdminAvatar] = useState(localStorage.getItem('adminAvatar') || '')

  // FETCH TRUE PROFILE FROM DATABASE ON LOAD
  useEffect(() => {
    const fetchAdminProfileFromDB = async () => {
      const token = sessionStorage.getItem('adminToken');
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/admin/settings/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          const dbName = data.fullName || 'Admin';
          const dbAvatar = data.avatarPath || '';

          // Update the UI with true database values
          setAdminName(dbName);
          setAdminAvatar(dbAvatar);
          
          // Sync localStorage so other pages (like Dashboard) can use it instantly
          localStorage.setItem('adminName', dbName);
          localStorage.setItem('adminAvatar', dbAvatar);
          
          // Fire storage event to notify other components (like Dashboard) to update
          window.dispatchEvent(new Event('storage'));
        }
      } catch (err) {
        console.error("Failed to fetch admin profile from Database", err);
      }
    };

    fetchAdminProfileFromDB();
  }, []);

  // Sync name and avatar when they change in settings
  useEffect(() => {
    const syncData = () => {
      setAdminName(localStorage.getItem('adminName') || 'Admin')
      setAdminAvatar(localStorage.getItem('adminAvatar') || '')
    }
    window.addEventListener('storage', syncData)
    // Also check on focus (when returning from settings page)
    window.addEventListener('focus', syncData)
    return () => {
      window.removeEventListener('storage', syncData)
      window.removeEventListener('focus', syncData)
    }
  }, [])

  // Update when location changes (navigating between pages)
  useEffect(() => {
    setAdminName(localStorage.getItem('adminName') || 'Admin')
    setAdminAvatar(localStorage.getItem('adminAvatar') || '')
  }, [location])

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <aside className="hidden lg:flex flex-col w-56 bg-blue-600 min-h-screen shrink-0">
        <SidebarContent isActive={isActive} setMobileOpen={setMobileOpen} navigate={navigate} adminName={adminName} adminAvatar={adminAvatar} />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-blue-600 px-4 py-3 flex items-center justify-between">
        <p className="font-extrabold text-white text-base">AARADHYA IT</p>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-1">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-blue-600 pt-14">
            <SidebarContent isActive={isActive} setMobileOpen={setMobileOpen} navigate={navigate} adminName={adminName} adminAvatar={adminAvatar} />
          </aside>
        </div>
      )}

      <div className="lg:hidden h-16 shrink-0" />
    </>
  )
}

export default AdminSidebar