import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Package, X } from 'lucide-react'
import { getProducts } from '../../services/public/productsService'
import axios from 'axios'
import API_URL from '../../config/api'

const Products = () => {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    axios
      .get(`${API_URL}/api/public/products/categories`)
      .then(res => {
        const cats = res.data.data || []
        setCategories(['All', ...cats.map((c: any) => c.name).filter(Boolean)])
      })
      .catch(() => setCategories(['All']))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getProducts(debouncedSearch, activeCategory)
        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [debouncedSearch, activeCategory])

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">Our Catalogue</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base font-medium">
            Hardware and software solutions designed for modern business operations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs sm:text-sm text-gray-500 mb-6 font-medium">
          Showing <span className="font-bold text-gray-900">{products.length}</span> products
          {activeCategory !== 'All' && (
            <span> in <span className="font-bold text-blue-600">{activeCategory}</span></span>
          )}
        </p>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => {
              const productId = product.id || product.prod_id
              return (
                <Link
                  key={productId}
                  to={`/products/${productId}`}
                  className="group bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Filled Image Container */}
                    <div className="bg-gradient-to-br from-blue-50/50 via-slate-50 to-indigo-50/50 h-52 w-full flex items-center justify-center overflow-hidden relative">
                      {product.image_path ? (
                        <img
                          src={product.image_path}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Package size={30} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {product.category && (
                          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
                            {product.category}
                          </span>
                        )}
                        {product.type && (
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-full">
                            {product.type}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors text-base line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium line-clamp-2">
                        {product.shortDescription || product.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 pb-5 pt-0 flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-gray-400">#{productId}</span>
                    <div className="flex items-center gap-1 text-blue-600 text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                      View Details <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="w-16 h-16 bg-slate-100 border border-slate-200/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">No products found</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Try adjusting your search terms or category filter.</p>
            <button
              onClick={() => {
                setSearch('')
                setActiveCategory('All')
              }}
              className="mt-5 text-blue-600 text-xs sm:text-sm font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products