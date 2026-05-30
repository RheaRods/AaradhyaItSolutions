import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Phone, Star, Users, Clock, Shield, Award } from 'lucide-react'
import { getStats } from '../../services/public/statsService'

// Animated counter hook
const useCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started || target === 0) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return { count, ref }
}

// Stat card with animated counter
const StatCard = ({ value, label, icon, suffix = '' }: { value: number, label: string, icon: React.ReactNode, suffix?: string }) => {
  const { count, ref } = useCounter(value)
  return (
    <div ref={ref} className="text-center">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{count}{suffix}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}

const team = [
  { name: 'Rajesh Naik', role: 'Founder & CEO', initials: 'RN', desc: 'Over 15 years in enterprise IT solutions across Goa and Maharashtra.' },
  { name: 'Sneha Dessai', role: 'Head of Operations', initials: 'SD', desc: 'Expert in retail ERP deployments and client onboarding.' },
  { name: 'Arun Prabhu', role: 'Lead Technical Engineer', initials: 'AP', desc: 'Hardware specialist with deep expertise in POS and networking.' },
]

const testimonials = [
  { name: 'Rahul S.', business: 'Retail Shop, Panaji', review: 'Aaradhya IT completely transformed our billing process. The local support in Goa is outstanding.', rating: 5, initials: 'RS' },
  { name: 'Priya M.', business: 'Pharmacy, Margao', review: 'Best pharmacy billing software in Goa. Handles expiry dates and GST filings perfectly.', rating: 5, initials: 'PM' },
  { name: 'Suresh K.', business: 'FMCG Distributor, Vasco', review: 'Good software overall. The technical team helped us migrate all our old data efficiently.', rating: 4, initials: 'SK' },
  { name: 'Anita D.', business: 'Retail Shop, Mapusa', review: 'Very professional team. They provided onsite training for all my staff.', rating: 5, initials: 'AD' },
]

const About = () => {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-linear-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-3">About Us</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Goa's Most Trusted <span className="text-blue-300">IT Solutions</span> Partner
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Since 2014, Aaradhya IT Solutions has been empowering retail, pharma, and FMCG businesses
              across Goa with cutting-edge software and hardware solutions — backed by local expertise and
              round-the-clock support.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats ? (
              <>
                <StatCard value={stats.businessesServed} label="Businesses Served" icon={<Users size={20} />} suffix="+" />
                <StatCard value={stats.yearsExperience} label="Years Experience" icon={<Clock size={20} />} suffix="+" />
                <StatCard value={stats.totalProducts} label="Products" icon={<Award size={20} />} suffix="+" />
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Shield size={20} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
                  <div className="text-sm text-gray-500">Customer Support</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3"><Users size={20} /></div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                  <div className="text-sm text-gray-500">Businesses Served</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3"><Clock size={20} /></div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">10+</div>
                  <div className="text-sm text-gray-500">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3"><Award size={20} /></div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
                  <div className="text-sm text-gray-500">Products</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3"><Shield size={20} /></div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
                  <div className="text-sm text-gray-500">Customer Support</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for Goa's Businesses
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Aaradhya IT Solutions was founded in 2014 with a simple mission — to bring world-class
                  IT infrastructure to the small and medium businesses of Goa that were being left behind
                  by large enterprise vendors.
                </p>
                <p>
                  We started with billing software for local pharmacies and retail shops. Over the years,
                  we've grown into a full-spectrum IT solutions provider — handling everything from ERP
                  deployments and POS systems to hardware supply, networking, and annual maintenance contracts.
                </p>
                <p>
                  Today, we serve over 500 businesses across Panaji, Margao, Vasco, Mapusa, Ponda and
                  beyond — and we're just getting started.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Our Mission', desc: 'To make enterprise-grade IT accessible and affordable for every business in Goa.', color: 'bg-blue-600' },
                { title: 'Our Vision', desc: 'To be the most trusted technology partner for every retail and pharma business in India.', color: 'bg-indigo-600' },
                { title: 'Our Values', desc: 'Integrity, innovation, and genuine care for every client we serve.', color: 'bg-blue-700' },
                { title: 'Our Promise', desc: '24/7 support, onsite assistance, and solutions tailored to your business.', color: 'bg-blue-500' },
              ].map(item => (
                <div key={item.title} className={`${item.color} text-white rounded-2xl p-6`}>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">The People</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map(member => (
              <div key={member.name} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Clients Say</h2>
            <div className="flex items-center justify-center gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-2 text-gray-600 font-semibold">4.9</span>
              <span className="text-gray-400 text-sm ml-1">· 120+ Google Reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={15} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {t.initials}
                  </div>
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

      {/* CTA */}
      <section className="bg-blue-600 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Let's Work Together
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Get in touch with our team today for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Phone size={18} />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default About