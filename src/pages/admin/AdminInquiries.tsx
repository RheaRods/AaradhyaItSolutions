import { useState, useEffect } from 'react'
import { MessageSquare, Search, Filter } from 'lucide-react'
import { getInquiries } from '../../services/admin/inquiriesService'

const tabs = ['All', 'New', 'Seen', 'Replied', 'Resolved']

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Seen: 'bg-yellow-100 text-yellow-700',
  Replied: 'bg-green-100 text-green-700',
  Resolved: 'bg-gray-100 text-gray-600',
}

const methodColors: Record<string, string> = {
  WhatsApp: 'bg-green-100 text-green-700',
  Phone: 'bg-blue-100 text-blue-700',
  Website: 'bg-purple-100 text-purple-700',
}

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await getInquiries()
        setInquiries(data || [])
      } catch (error) {
        console.error('Error fetching inquiries:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchInquiries()
  }, [])

  const filtered = inquiries.filter(i => {
    const matchTab = activeTab === 'All' || i.status === activeTab
    const matchSearch = i.product.toLowerCase().includes(search.toLowerCase()) ||
      i.message.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const selectedInquiry = inquiries.find(i => i.id === selected)

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiry Logs</h1>
          <p className="text-gray-500 text-sm mt-1">All customer inquiries in one place.</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter size={15} />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search inquiries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelected(null) }}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {tab}
            {tab === 'All' ? (
              <span className="ml-1.5 text-xs opacity-70">({inquiries.length})</span>
            ) : (
              <span className="ml-1.5 text-xs opacity-70">
                ({inquiries.filter(i => i.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Inquiry List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <MessageSquare size={28} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No inquiries found.</p>
            </div>
          ) : (
            filtered.map(inquiry => (
              <div
                key={inquiry.id}
                onClick={() => setSelected(inquiry.id === selected ? null : inquiry.id)}
                className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selected === inquiry.id ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{inquiry.product}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{inquiry.id} · {inquiry.time}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${methodColors[inquiry.method] || 'bg-gray-100'}`}>
                      {inquiry.method}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[inquiry.status] || 'bg-gray-100'}`}>
                      {inquiry.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{inquiry.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="hidden lg:block">
          {selectedInquiry ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-1">{selectedInquiry.product}</h3>
              <p className="text-xs text-gray-400 mb-5">{selectedInquiry.id} · {selectedInquiry.time}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[selectedInquiry.status] || 'bg-gray-100'}`}>
                    {selectedInquiry.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Method</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${methodColors[selectedInquiry.method] || 'bg-gray-100'}`}>
                    {selectedInquiry.method}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedInquiry.message}</p>
              </div>

             <div className="space-y-2">
                <a
                  href={`https://wa.me/919876543210?text=Hi, regarding your inquiry about ${encodeURIComponent(selectedInquiry.product)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Reply on WhatsApp
                </a>
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Call Customer
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center sticky top-6">
              <MessageSquare size={28} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Select an inquiry to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminInquiries