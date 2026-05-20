import { useState } from 'react'
import { Star, Search } from 'lucide-react'
import { reviews } from '../../data/reviews'

const AdminReviews = () => {
  const [search, setSearch] = useState('')
  const [filterRating, setFilterRating] = useState(0)

  const filtered = reviews.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.review.toLowerCase().includes(search.toLowerCase()) ||
      r.business.toLowerCase().includes(search.toLowerCase())
    const matchRating = filterRating === 0 || r.rating === filterRating
    return matchSearch && matchRating
  })

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Google Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Customer reviews synced from Google.</p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm mb-1">Overall Rating</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{avgRating}</span>
              <span className="text-blue-200 text-sm mb-2">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(Number(avgRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-blue-400'}
                />
              ))}
              <span className="text-blue-200 text-sm ml-2">{reviews.length} reviews</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => r.rating === star).length
                const pct = Math.round((count / reviews.length) * 100)
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-blue-200 w-4">{star}</span>
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <div className="w-24 h-1.5 bg-blue-500 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-blue-200">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          {[0, 5, 4, 3].map(star => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                filterRating === star
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              {star === 0 ? 'All' : (
                <>
                  {star} <Star size={12} className="fill-current" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {review.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.business} · {review.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">"{review.review}"</p>
            <p className="text-xs text-gray-400">{review.date}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Star size={28} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No reviews found.</p>
        </div>
      )}
    </div>
  )
}

export default AdminReviews