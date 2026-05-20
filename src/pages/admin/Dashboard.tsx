import { Link } from 'react-router-dom'
import { Plus, MoreHorizontal, Bell, Calendar, Edit, Trash2, Megaphone, Download, HeadphonesIcon } from 'lucide-react'
import { products } from '../../data/products'
import { inquiries } from '../../data/inquiries'
import { reviews } from '../../data/reviews'

const Dashboard = () => {
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  const statusColors: Record<string, string> = {
    New: 'bg-yellow-400 text-white',
    Seen: 'bg-gray-200 text-gray-600',
    Replied: 'bg-green-100 text-green-700',
    Resolved: 'bg-blue-100 text-blue-700',
  }

  const recentInquiries = [
    { product: 'Enterprise Server Rack', method: 'WhatsApp', time: '12:45 PM', status: 'New' },
    { product: 'Optical Fiber Kit v2', method: 'Phone Call', time: '10:30 AM', status: 'Seen' },
    { product: 'Cloud Security Suite', method: 'WhatsApp', time: '09:15 AM', status: 'New' },
  ]

  const recentProducts = [
    { name: 'Dell PowerEdge R740', category: 'Hardware', date: 'Apr 24, 2026' },
    { name: 'Fortinet Security Hub', category: 'Networking', date: 'Apr 22, 2026' },
    { name: 'Pharmacy Billing Software', category: 'Software', date: 'Apr 20, 2026' },
  ]

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">

      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back, Admin</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar size={15} />
            {today}
          </div>
          <div className="relative">
            <Bell size={20} className="text-gray-500" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </div>
        </div>
      </div>

      <div className="p-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Inquiries',
              value: inquiries.length,
              sub: '+12% ↑',
              subColor: 'text-green-500',
              border: 'border-l-4 border-green-400'
            },
            {
              label: 'Active Products',
              value: products.length,
              sub: 'In Stock',
              subColor: 'text-yellow-500',
              border: 'border-l-4 border-yellow-400'
            },
            {
              label: 'Avg. Rating',
              value: avgRating,
              sub: '★',
              subColor: 'text-yellow-400',
              border: 'border-l-4 border-blue-400'
            },
            {
              label: 'Experience',
              value: '10+',
              sub: 'Years',
              subColor: 'text-gray-400',
              border: 'border-l-4 border-gray-300'
            },
          ].map(stat => (
            <div key={stat.label} className={`bg-white rounded-xl p-5 shadow-sm ${stat.border}`}>
              <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                <span className={`text-sm font-semibold mb-0.5 ${stat.subColor}`}>{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Recent Inquiries */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">Recent Inquiries</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={18} />
              </button>
            </div>
            <div>
              <div className="grid grid-cols-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                <span>Product</span>
                <span>Method</span>
                <span>Time</span>
                <span>Status</span>
              </div>
              {recentInquiries.map((inq, i) => (
                <div key={i} className="grid grid-cols-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <span className="text-sm text-gray-800 font-medium">{inq.product}</span>
                  <span className="text-sm text-gray-500">{inq.method}</span>
                  <span className="text-sm text-gray-500">{inq.time}</span>
                  <span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[inq.status]}`}>
                      {inq.status.toUpperCase()}
                    </span>
                  </span>
                </div>
              ))}
              <div className="px-6 py-3">
                <Link
                  to="/admin/inquiries"
                  className="block w-full text-center text-blue-500 text-sm font-semibold py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  View All Inquiries
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-5">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/products"
                className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                <Plus size={17} />
                Add New Product
              </Link>
              <button className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
                <Megaphone size={17} />
                Post Announcement
              </button>
              <button className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
                <Download size={17} />
                Export Reports
              </button>
              <button className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
                <HeadphonesIcon size={17} />
                Support Log
              </button>
            </div>
          </div>
        </div>

        {/* Recently Added Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">Recently Added Products</h2>
            <Link to="/admin/products" className="text-blue-500 text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div>
            <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <span>Preview</span>
              <span className="col-span-2">Product Name</span>
              <span>Category</span>
              <span>Actions</span>
            </div>
            {recentProducts.map((product, i) => (
              <div key={i} className="grid grid-cols-5 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{product.date}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit ${
                  product.category === 'Hardware' ? 'bg-blue-100 text-blue-700' :
                  product.category === 'Software' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {product.category.toUpperCase()}
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
        </div>

      </div>
    </div>
  )
}

export default Dashboard