import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Phone, Shield, Clock, Users, Package, Star, ChevronRight } from 'lucide-react'
import { getStats } from '../../services/public/statsService'
import { getProducts } from '../../services/public/productsService'

const services = [
  { icon: '🖥️', title: 'ERP & Billing Software', description: 'For retail, FMCG & pharma businesses across Goa.' },
  { icon: '🖨️', title: 'Barcode & Label Printers', description: 'Fast, reliable hardware for high-volume environments.' },
  { icon: '🏪', title: 'POS Systems', description: 'Mobile & desktop point of sale solutions.' },
  { icon: '🛠️', title: 'AMC & Support', description: 'Annual maintenance & 24/7 technical support.' },
]

const testimonials = [
  { name: 'Rahul S.', business: 'Retail Shop, Panaji', review: 'Aaradhya IT completely transformed our billing process. The local support in Goa is outstanding.', rating: 5, initials: 'RS' },
  { name: 'Priya M.', business: 'Pharmacy, Margao', review: 'Best pharmacy billing software in Goa. Handles expiry dates and GST filings perfectly.', rating: 5, initials: 'PM' },
  { name: 'Mohan T.', business: 'Hardware Shop, Ponda', review: 'Exceptional service. They implemented a robust inventory system for my shop.', rating: 5, initials: 'MT' },
]

const StatCard = ({ value, label, suffix = '' }: { value: number, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!value) return
    const delay = setTimeout(() => {
      let start = 0
      const duration = 2000
      const step = value / (duration / 16)
      const timer = setInterval(() => {
        start += step
        if (start >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }, 300)
    return () => clearTimeout(delay)
  }, [value])

  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-white">{count}{suffix}</div>
      <div className="text-sm text-blue-300 mt-1">{label}</div>
    </div>
  )
}

const Home = () => {
  const [stats, setStats] = useState<any>(null)
  const [bestSellers, setBestSellers] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, productsData] = await Promise.all([
          getStats(),
          getProducts()
        ])
        setStats(statsData)
        setBestSellers(productsData?.slice(0, 3) || [])
      } catch (error) {
        console.error('Error fetching home data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="bg-white">

      <section className="relative bg-linear-to-br from-blue-950 via-blue-900 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-600/40 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Trusted IT Partner Since 2014 · Goa
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Powering Retail &amp;{' '}
              <span className="text-blue-300">Pharma Businesses</span>{' '}
              Across Goa
            </h1>
            <p className="text-blue-100 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              Software and hardware solutions built for the way you work.
              From ERP and billing to POS systems and AMC support — we have got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors duration-200">
                Browse Products <ArrowRight size={18} />
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
                <MessageCircle size={18} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div className="relative border-t border-blue-800/60 bg-blue-900/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard value={stats?.businessesServed ?? 0} label="Businesses Served" suffix="+" />
              <StatCard value={stats?.yearsExperience ?? 0} label="Years Experience" suffix="+" />
              <StatCard value={stats?.totalProducts ?? 0} label="Products" suffix="+" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-blue-300 mt-1">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">End-to-end IT solutions designed for retail, pharma and FMCG businesses.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Top Picks</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Best Sellers</h2>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bestSellers.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 h-40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Package size={28} className="text-white" />
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{product.category}</span>
                  <h3 className="font-semibold text-gray-900 mt-3 mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.shortDescription}</p>
                  <div className="flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium">
                    View Details <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Why Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Makes Us Different</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users size={22} />, title: 'Local Expertise', desc: 'Deep understanding of the Goa business landscape.' },
              { icon: <Shield size={22} />, title: 'Secure Assets', desc: 'Enterprise-grade cybersecurity in every solution.' },
              { icon: <Clock size={22} />, title: '24/7 Support', desc: 'On-site and remote assistance across Goa.' },
              { icon: <Star size={22} />, title: 'Custom Build', desc: 'Tailored hardware and software for your workflow.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{t.initials}</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.business}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Transform Your Business?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Talk to our team today and get a free consultation for your IT needs.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
            <a href="tel:+919876543210" className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
              <Phone size={18} />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home