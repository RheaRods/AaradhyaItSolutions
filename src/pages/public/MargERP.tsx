// frontend/src/pages/public/MargErp.tsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Package, X, ShieldCheck, CheckCircle } from 'lucide-react'
import { getProducts } from '../../services/public/productsService'

const MargErp = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const fetchMargProducts = async () => {
      try {
        setLoading(true)
        // 1. Fetch all products matching current search filter
        const allProducts = await getProducts(debouncedSearch, 'All')

        // 2. Filter products dynamically where name, category, or description relates to Marg / ERP
        const margProducts = (allProducts || []).filter((product: any) => {
          const name = product.name?.toLowerCase() || ''
          const category = product.category?.toLowerCase() || ''
          const description = (product.shortDescription || product.short_desc || '').toLowerCase()

          // Check if any field contains "marg" or "erp"
          return (
            name.includes('marg') ||
            name.includes('erp') ||
            category.includes('marg') ||
            category.includes('erp') ||
            description.includes('marg')
          )
        })

        setProducts(margProducts)
      } catch (error) {
        console.error('Error fetching Marg ERP products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMargProducts()
  }, [debouncedSearch])

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-4">
              <ShieldCheck size={14} /> Authorised Partner
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Marg ERP & Accounting Software Solutions
            </h1>
            <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-6">
              Empower your business with India's leading inventory and GST billing software. Customized solutions for Pharma, FMCG, Retail, and Wholesale distribution.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-blue-200">
              <span className="flex items-center gap-1">
                <CheckCircle size={16} className="text-green-400" /> 100% GST Compliant
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle size={16} className="text-green-400" /> Automated Inventory
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle size={16} className="text-green-400" /> Dedicated Local Support
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar matching Products.tsx */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Marg & ERP products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Showing <span className="font-semibold text-gray-900">{products.length}</span> products
        </p>

        {/* Product Cards Grid matching Products.tsx */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.prod_id || product.id}
                to={`/products/${product.prod_id || product.id}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 h-52 flex items-center justify-center overflow-hidden">
                  {product.image_path ? (
                    <img
                      src={product.image_path}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Package size={28} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {product.category || 'Billing'}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {product.type || 'Software'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {product.shortDescription || product.short_desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">#{product.prod_id || product.id}</span>
                    <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                      View Details <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Marg / ERP products found</h3>
            <p className="text-sm text-gray-500">Try a different search query.</p>
            <button
              onClick={() => setSearch('')}
              className="mt-4 text-blue-600 text-sm font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MargErp