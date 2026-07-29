import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, MessageCircle } from 'lucide-react'
import { getCompanyInfo, type CompanyInfo } from '../../services/public/companyInfoService'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const [info, setInfo] = useState<Partial<CompanyInfo>>({
    primaryPhone: '+91 91461 92757',
    whatsapp: '+91 78754 19620',
    logoPath: '',
  })

  useEffect(() => {
    getCompanyInfo().then(setInfo).catch(() => {})
  }, [])

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Marg ERP', path: '/marg-erp' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ]

  const isActive = (path: string) => location.pathname === path
  const phoneDigits = (info.primaryPhone || '').replace(/[^\d]/g, '')
  const whatsappDigits = (info.whatsapp || '').replace(/[^\d]/g, '')

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.03]"
            >
              <img
                src={info.logoPath || "https://larjotmzhxdmqzktyafh.supabase.co/storage/v1/object/public/company-assets/Aaradhya_logo.png"}
                alt="Aaradhya IT"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
              />
              <span className="font-bold text-2xl leading-tight tracking-tight">
                <span className="text-red-600">Aaradhya</span>{' '}
                <span className="text-blue-700">IT Solution</span>
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map(link => {
                const active = isActive(link.path)
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-block text-sm font-bold transition-all duration-200 ease-out transform hover:-translate-y-1 hover:scale-110 active:translate-y-0 active:scale-95 ${
                      active
                        ? 'text-blue-600 -translate-y-0.5 scale-105'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={`tel:+${phoneDigits}`}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2 transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 active:translate-y-0"
              >
                <Phone size={15} className="text-blue-600" />
                <span>{info.primaryPhone || '+91 91461 92757'}</span>
              </a>

              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noreferrer"
                className="relative flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-95"
              >
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-300"></span>
                </span>
                <MessageCircle size={16} className="fill-white/20" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-xl text-gray-600 hover:text-gray-900 transition-all duration-200 active:scale-90"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map(link => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 ${
                    active
                      ? 'text-blue-600 font-bold bg-blue-50/50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-2.5">
              <a
                href={`tel:+${phoneDigits}`}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
              >
                <Phone size={16} className="text-blue-600" />
                <span>{info.primaryPhone || '+91 91461 92757'}</span>
              </a>

              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-xs transition-all transform active:scale-95"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar