import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus, MoreHorizontal, Bell, Calendar, Edit, Trash2,
  Megaphone, Download, HeadphonesIcon, Loader2, ChevronDown
} from 'lucide-react'
import { getDashboardData } from '../../services/admin/dashboardService'
import { exportInquiriesCSV, exportProductsCSV } from '../../services/admin/reportsService'

const Dashboard = () => {
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [exportOpen, setExportOpen] = useState(false)
  const [exporting, setExporting] = useState<'inquiries' | 'products' | null>(null)
  
  // Add state for adminName so it can update dynamically
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || 'Admin')

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  })

  const statusColors: Record<string, string> = {
    New: 'bg-yellow-400 text-white',
    Seen: 'bg-gray-200 text-gray-600',
    Replied: 'bg-green-100 text-green-700',
    Resolved: 'bg-blue-100 text-blue-700',
  }

  // Listen for the 'storage' event triggered by AdminSidebar (when it fetches from DB) or AdminSettings
  useEffect(() => {
    const syncName = () => {
      setAdminName(localStorage.getItem('adminName') || 'Admin')
    }
    
    window.addEventListener('storage', syncName)
    // Cleanup listener on unmount
    return () => window.removeEventListener('storage', syncName)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardData()
        setData(result)
      } catch (error) {
        console.error('Dashboard error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Close export dropdown when clicking outside
  useEffect(() => {
    if (!exportOpen) return
    const handler = () => setExportOpen(false)
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [exportOpen])

  const handleExport = async (type: 'inquiries' | 'products') => {
    setExporting(type)
    setExportOpen(false)
    try {
      if (type === 'inquiries') await exportInquiriesCSV()
      else await exportProductsCSV()
    } catch (e) {
      console.error('Export failed', e)
    } finally {
      setExporting(null)
    }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">

      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back, {adminName}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-gray-500 text-sm">
            <Calendar size={15} />
            {today}
          </div>
          <div className="relative">
            <Bell size={20} className="text-gray-500" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {data?.stats?.totalInquiries || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { label: 'Total Inquiries', value: data?.stats?.totalInquiries || 0, sub: '+12% ↑', subColor: 'text-green-500', border: 'border-l-4 border-green-400' },
            { label: 'Active Products', value: data?.stats?.totalProducts || 0, sub: 'In Stock', subColor: 'text-yellow-500', border: 'border-l-4 border-yellow-400' },
            { label: 'Avg. Rating', value: data?.stats?.avgRating || '0.0', sub: '★', subColor: 'text-yellow-400', border: 'border-l-4 border-blue-400' },
            { label: 'Experience', value: data?.stats?.experience || '10+', sub: 'Years', subColor: 'text-gray-400', border: 'border-l-4 border-gray-300' },
          ].map(stat => (
            <div key={stat.label} className={`bg-white rounded-xl p-4 shadow-sm ${stat.border}`}>
              <p className="text-xs md:text-sm text-gray-500 mb-2">{stat.label}</p>
              <div className="flex items-end gap-1.5">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</span>
                <span className={`text-xs md:text-sm font-semibold mb-0.5 ${stat.subColor}`}>{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Recent Inquiries */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">Recent Inquiries</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="grid grid-cols-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                <span>Product</span>
                <span>Method</span>
                <span>Time</span>
                <span>Status</span>
              </div>
              {data?.recentInquiries?.map((inq: any, i: number) => (
                <div key={i} className="grid grid-cols-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <span className="text-sm text-gray-800 font-medium truncate pr-2">{inq.product}</span>
                  <span className="text-sm text-gray-500">{inq.method}</span>
                  <span className="text-sm text-gray-500">{inq.time}</span>
                  <span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[inq.status]}`}>
                      {inq.status?.toUpperCase()}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {data?.recentInquiries?.map((inq: any, i: number) => (
                <div key={i} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate flex-1 pr-2">{inq.product}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${statusColors[inq.status]}`}>
                      {inq.status?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{inq.method} · {inq.time}</p>
                </div>
              ))}
            </div>

            <div className="px-4 md:px-6 py-3">
              <Link
                to="/admin/inquiries"
                className="block w-full text-center text-blue-500 text-sm font-semibold py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                View All Inquiries
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-5">Quick Actions</h2>
            <div className="space-y-3">

              {/* Add New Product */}
              <Link
                to="/admin/products"
                className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                <Plus size={17} />
                Add New Product
              </Link>

              {/* Post Announcement */}
              <button
                onClick={() => navigate('/admin/announcements')}
                className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                <Megaphone size={17} />
                Post Announcement
              </button>

              {/* Export Reports — dropdown */}
              <div className="relative" onMouseDown={e => e.stopPropagation()}>
                <button
                  onClick={() => setExportOpen(o => !o)}
                  disabled={exporting !== null}
                  className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm disabled:opacity-60"
                >
                  {exporting ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Download size={17} />
                  )}
                  {exporting ? `Exporting ${exporting}...` : 'Export Reports'}
                  {!exporting && <ChevronDown size={14} className={`ml-auto transition-transform ${exportOpen ? 'rotate-180' : ''}`} />}
                </button>

                {exportOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
                    <button
                      onClick={() => handleExport('inquiries')}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                    >
                      📋 Export Inquiries CSV
                    </button>
                    <button
                      onClick={() => handleExport('products')}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors border-t border-gray-50"
                    >
                      📦 Export Products CSV
                    </button>
                  </div>
                )}
              </div>

              {/* Support Log — placeholder for future */}
              <button
                disabled
                title="Coming soon"
                className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 text-gray-400 font-semibold py-3 rounded-xl text-sm cursor-not-allowed"
              >
                <HeadphonesIcon size={17} />
                Support Log
                <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full ml-1">Soon</span>
              </button>

            </div>
          </div>
        </div>

        {/* Recently Added Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">Recently Added Products</h2>
            <Link to="/admin/products" className="text-blue-500 text-sm font-semibold hover:underline">View All</Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <span>Preview</span>
              <span className="col-span-2">Product Name</span>
              <span>Category</span>
              <span>Actions</span>
            </div>
            {data?.recentProducts?.map((product: any, i: number) => (
              <div key={i} className="grid grid-cols-5 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                  {product.image_path
                    ? <img src={product.image_path} alt={product.name} className="w-full h-full object-cover" />
                    : <span className="text-gray-400 text-xs">No img</span>
                  }
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit ${
                  product.type === 'Hardware' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {product.type?.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <button className="text-green-500 hover:text-green-700 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-50">
            {data?.recentProducts?.map((product: any, i: number) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                  {product.image_path
                    ? <img src={product.image_path} alt={product.name} className="w-full h-full object-cover" />
                    : <span className="text-gray-400 text-xs">No img</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.category}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  product.type === 'Hardware' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {product.type?.toUpperCase()}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="text-green-500 hover:text-green-700 p-1">
                    <Edit size={14} />
                  </button>
                  <button className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard