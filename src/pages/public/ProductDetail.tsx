import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Phone, Check, ChevronRight, Package } from 'lucide-react'
import { getProduct } from '../../services/public/productsService'
import { submitInquiry } from '../../services/public/inquiriesService'
import API_URL from '../../config/api'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<any>(null)
  const [similar, setSimilar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'features' | 'specs'>('features')
  const [activeImage, setActiveImage] = useState<string>('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await getProduct(id!)
        setProduct(data.product)
        setSimilar(data.similar || [])
        setActiveImage(data.product?.image_path || '')
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleWhatsApp = async () => {
    try {
      await submitInquiry({
        name: 'WhatsApp Enquiry',
        phone: 'Via WhatsApp',
        message: `Interested in ${product.name}`,
        prod_id: product.prod_id,
        method: 'WhatsApp',
      })
    } catch (_) {}
    window.open(
      `https://wa.me/919876543210?text=Hi, I'm interested in ${product.name} (ID: ${product.id}). Please share more details.`,
      '_blank'
    )
  }

  const handleCall = async () => {
    try {
      await submitInquiry({
        name: 'Phone Enquiry',
        phone: 'Via Phone Call',
        message: `Called about ${product.name}`,
        prod_id: product.prod_id,
        method: 'Phone',
      })
    } catch (_) {}
    window.location.href = 'tel:+919876543210'
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Package size={28} className="text-gray-400" />
        </div>
        <h2 className="font-bold text-gray-900 text-xl mb-2">Product Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          Back to Products
        </Link>
      </div>
    )
  }

  const allImages = [
    ...(product.image_path ? [product.image_path] : []),
    ...(product.images || []),
  ].filter(Boolean)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Main Product Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Image Gallery */}
            <div className="flex flex-col">
              <div className="bg-linear-to-br from-blue-50 to-indigo-100 h-72 lg:h-96 flex items-center justify-center overflow-hidden">
  {activeImage ? (
    <img
      src={activeImage}
      alt={product.name}
      className="h-full w-full object-cover"
    />
                ) : (
                  <div className="w-32 h-32 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Package size={56} className="text-white" />
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`shrink-0 w-28 h-28 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === img ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {product.type}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

              <p className="text-gray-500 leading-relaxed mb-6">{product.fullDescription}</p>

              <div className="text-xs text-gray-400 mb-6">
                Product ID: <span className="font-mono font-semibold text-gray-600">#{product.id}</span>
              </div>

              {product.catalogue_path && (
  <a href={`${API_URL}/api/download-catalogue?url=${encodeURIComponent(product.catalogue_path)}`} download target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors mb-6">
     Download Brochure
  </a>
)}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  <MessageCircle size={18} />
                  Enquire on WhatsApp
                </button>
                <button
                  onClick={handleCall}
                  className="flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  <Phone size={18} />
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="flex border-b border-gray-100">
            {(['features', 'specs'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'features' ? 'Features' : 'Specifications'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'features' && (
              <ul className="space-y-3">
                {product.features?.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
                {(!product.features || product.features.length === 0) && (
                  <p className="text-gray-400 text-sm">No features listed.</p>
                )}
              </ul>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4">
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <span className="text-sm font-medium text-gray-500">{key}</span>
                      <span className="text-sm font-semibold text-gray-900">{String(value)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No specifications listed.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((p: any) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="bg-linear-to-br from-blue-50 to-indigo-50 h-52 flex items-center justify-center overflow-hidden">
  {p.image_path ? (
    <img src={p.image_path} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Package size={22} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {p.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-3 mb-1 group-hover:text-blue-600 transition-colors text-sm">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500">{p.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail